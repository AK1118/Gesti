import Vector from "./vector";
import { Point } from "./vertex";
declare class Line {
    p1: Point;
    p2: Point;
    constructor(p1: Point, p2: Point);
}
declare class CheckInside {
    onLine(l1: Line, p: Point): boolean;
    /**
     * @param {Vector} p1
     * @param {Vector} p2
     * @param {Object} radius
     */
    checkInsideArc(p1: Vector, p2: Vector, radius: number): boolean;
    direction(a: Point, b: Point, c: Vector): 0 | 2 | 1;
    isIntersect(l1: Line, l2: Line): boolean;
    checkInside(poly: any, n: any, p: any): number | boolean;
}
export default CheckInside;
//# sourceMappingURL=checkInside.d.ts.map