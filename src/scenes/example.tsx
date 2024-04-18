import { Circle, CubicBezier, Path, Spline, makeScene2D } from '@motion-canvas/2d';
import { BoolMetaField, NumberMetaField, all, createRef, useScene, waitFor, waitUntil } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const myCircle = createRef<Circle>();
    const myPath = createRef<Path>();
    const myShape = createRef<CubicBezier>();

    view.add(
        <Path ref={myPath}
            data="m 95.000002,214.99999 h 35.000018 l 3e-5,-34.99998 c 0,0 -3e-5,-14.00001 -17.50004,-14.00001 -17.499997,0 -17.500008,14.00001 -17.500008,14.00001 z"
            fill="#e13238"
            x={100}
            y={-200} />
    );

    view.add(
        <Circle
            ref={myCircle}
            // try changing these properties:
            x={-300}
            width={140}
            height={140}
            fill={useScene().variables.get("dosa", "red")}
        />,
    );
});


