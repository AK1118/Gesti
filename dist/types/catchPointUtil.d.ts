import CheckInside from "./checkInside";
import ImageBox from "./imageBox";
import Rect from "./rect";
import Vector from "./vector";
declare class CatchPointUtil {
    static _checkInside: CheckInside;
    /**
     *
     * @param imageBox
     * @param event
     * @returns
     */
    static catchImageBox(imageBoxList: ImageBox[], position: any): ImageBox;
    static inArea(rect: Rect, position: Vector): boolean;
    /**
     * @param {Vector} p1
     * @param {Vector} p2
     * @param {Object} radius
     */
    static checkInsideArc(p1: Vector, p2: Vector, radius: number): boolean;
}
export default CatchPointUtil;
//# sourceMappingURL=catchPointUtil.d.ts.map