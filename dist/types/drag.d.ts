import Rect from "./rect";
import Vector from "./vector";
declare class Drag {
    rect: Rect;
    offset: Offset;
    catchImageBox(rect: Rect, position: Vector | any): void;
    cancel(): void;
    update(position: Vector | any): void;
}
export default Drag;
//# sourceMappingURL=drag.d.ts.map