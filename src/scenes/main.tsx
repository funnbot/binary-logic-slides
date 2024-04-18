import { Circle, Layout, Line, Rect, makeScene2D } from '@motion-canvas/2d';
import { beginSlide, createRef, range, waitFor, waitUntil } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    yield* beginSlide("blank slide");
    const rects = range(5).map(i => {
        return new Rect({ size: 200, fill: "lightblue", radius: 10 });
    });
    const lines = range(4).map(i => {
        return new Line({
            points: [rects[i].right, rects[i + 1].left],
            stroke: "lightgreen",
            lineWidth: 10,
            endArrow: true,
            startOffset: 10,
            endOffset: 10,
            lineCap: 'round'
        });
    });

    view.add(
        <>
            <Layout layout direction={"row"} gap={100}>
                {rects}
            </Layout>
            {lines}
        </>
    );

    for (const r of rects) {
        yield* beginSlide("ripple");
        yield* r.ripple(1);
    }
}); 