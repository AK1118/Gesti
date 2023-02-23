import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
declare class Point extends Vector {
    constructor(x: number, y: number);
    toArray(): Array<number>;
}
export { Point };
/**
 * 包裹图片Rect的矩阵点，通常为4个点
 */
declare class Vertex {
    private points;
    constructor(points: Array<Array<number>>);
    setPoints(points: Array<Point>): void;
    getPoints(): Point[];
    /**
     * @description 根据传入角度，旋转该类的顶点
     * @param angle
     * @param rect
     */
    rotate(angle: number, rect: Rect): void;
    /**
     * @description 矫正位置
     * @param rect
     */
    correctPosition(rect: Rect): void;
    drawPoints(paint: Painter): void;
}
export default Vertex;
//# sourceMappingURL=vertex.d.ts.map