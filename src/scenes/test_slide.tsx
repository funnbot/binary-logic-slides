import { Circle, Layout, Node, Txt, makeScene2D } from '@motion-canvas/2d';
import { ThreadGenerator, Vector2, all, beginSlide, createRef, easeInBack, waitFor, waitUntil } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const circle = createRef<Circle>();

    const container = createRef<Layout>();
    const title = createRef<Txt>();
    const subtitle = createRef<Txt>();

    yield* beginSlide("slide 1");

    view.add(
        <Layout ref={container} layout direction={'column'} alignItems={'center'}>
            <Txt ref={title}
                text={"This Is A Test Slide"}
                fill="#ffffff"
                fontSize={120}
                fontFamily={"sans-serif"}
                layout
                fontWeight={700}>
            </Txt>
            <Txt ref={subtitle}
                text={"Test Subtitle"}
                fill="#ffffff"
                fontSize={65}
                fontFamily={"sans-serif"}
            />
        </Layout>
    );

    title().middle(new Vector2(0, 0));

    yield* beginSlide("slide 2");

    yield* animateClone(view, subtitle(), function* (node) {
        yield* node.topLeft(title().bottomLeft, 0.5)
    });
    container().alignItems('start');

    //yield* title().text("_", 1);
    yield* all(
        container().offset([-1, -1], 0.5),
        container().topLeft(new Vector2(-900, -500), 0.5),
        title().text("This is the second test slide", 0.5),
    );
    yield* title().fontSize(100, 0.5);

    yield* beginSlide("slide 2");
    yield* all(
        title().text("This is the second test slide, part 2", 0.5),
    );

    yield* beginSlide("slide 3");
    yield* title().text("This is the third test slide", 0.5);
    yield* beginSlide("slide 4");
});

function* animateClone<T extends Node>(
    scene: Node,
    node: T,
    callback: (clone: T) => ThreadGenerator
) {
    const clone = node.clone();
    scene.add(clone);
    clone.absolutePosition(node.absolutePosition());
    node.opacity(0);

    yield* callback(clone);

    clone.remove();
    node.opacity(1);
}