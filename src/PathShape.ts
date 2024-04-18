import {
    BBox,
    createSignal,
    isReactive,
    SerializedVector2,
    SignalValue,
    SimpleSignal,
    threadable,
    TimingFunction,
    tween,
    Vector2,
} from '@motion-canvas/core';

import { CurveProfile, computed, signal, drawLine, drawPivot, Curve, CurveProps, Path, Rect, DesiredLength, Segment } from '@motion-canvas/2d';

import { getPathProfile } from '@motion-canvas/2d/lib/curves/getPathProfile';
import { createCurveProfileLerp } from '@motion-canvas/2d/lib/curves/createCurveProfileLerp';

export interface PathShapeProps extends CurveProps {

}

function addSegmentToProfile(profile: CurveProfile, segment: Segment) {
    profile.segments.push(segment);
    profile.arcLength += segment.arcLength;
}

export class PathBuilder {

}

export abstract class PathShape extends Curve {
    private currentProfile = createSignal<CurveProfile | null>(null);

    public constructor(props: PathShapeProps) {

        super(props);
        this.canHaveSubpath = true;
    }

    protected abstract createPath(r: BBox): string;

    @computed()
    public override profile(): CurveProfile {
        const bbox = this.childrenBBox();
        return this.currentProfile() ?? getPathProfile(this.createPath(bbox));
    }

    protected override desiredSize(): SerializedVector2<DesiredLength> {
        return {
            x: this.width.context.getter(),
            y: this.height.context.getter(),
        };
    }

    protected override childrenBBox() {
        return BBox.fromSizeCentered(this.desiredSize() as Vector2);
        //const points = this.profile().segments.flatMap(segment => segment.points);
        //return BBox.fromPoints(...points);
    }

    protected override lineWidthCoefficient(): number {
        const join = this.lineJoin();

        let coefficient = super.lineWidthCoefficient();

        if (join === 'miter') {
            const { minSin } = this.profile();
            if (minSin > 0) {
                coefficient = Math.max(coefficient, 0.5 / minSin);
            }
        }

        return coefficient;
    }

    protected override processSubpath(
        path: Path2D,
        startPoint: Vector2 | null,
        endPoint: Vector2 | null,
    ): void {
        if (startPoint && endPoint && startPoint.equals(endPoint)) {
            path.closePath();
        }
    }

    public override drawOverlay(
        context: CanvasRenderingContext2D,
        matrix: DOMMatrix,
    ): void {
        const box = this.childrenBBox().transformCorners(matrix);
        const size = this.computedSize();
        const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
        const segments = this.profile().segments;

        context.lineWidth = 1;
        context.strokeStyle = 'white';
        context.fillStyle = 'white';

        context.save();
        context.setTransform(matrix);
        let endPoint: Vector2 | null = null;
        let path = new Path2D();

        for (const segment of segments) {
            if (endPoint && !segment.getPoint(0).position.equals(endPoint)) {
                context.stroke(path);
                path = new Path2D();
                endPoint = null;
            }
            const [, end] = segment.draw(path, 0, 1, endPoint == null);
            endPoint = end.position;
        }
        context.stroke(path);
        context.restore();

        context.beginPath();
        drawPivot(context, offset);
        context.stroke();

        context.beginPath();
        drawLine(context, box);
        context.closePath();
        context.stroke();
    }
}