import { View2D } from "@motion-canvas/2d";

export default class View2DUtils extends View2D {
    public static wrap(view: View2D): View2DUtils {
        Object.assign(view, View2DUtils.prototype);
        return view as View2DUtils;
    }
}