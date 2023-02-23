import Vector from "./vector";
import Vertex from "./vertex";
/**
 * @typedef 拖拽的回调函数
 */
declare interface onDragFunction {
    (rect: Rect): void;
}
declare class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
    toVector(): Vector;
}
declare class Rect {
    onDrag: onDragFunction;
    beforeDrag: onDragFunction;
    angle: number;
    vertex: Vertex;
    position: Vector;
    size: Size;
    constructor(params: rectparams);
    updateVertex(): void;
    setPotision(x: number, y: number): void;
    setScale(scale: number): void;
    setSize(width: number, height: number): void;
    setAngle(angle: number): void;
    get getAngle(): number;
    copy(): Rect;
}
export default Rect;
export { onDragFunction, };
//# sourceMappingURL=rect.d.ts.map