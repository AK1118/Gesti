import ImageBox from "./imageBox";
import Painter from "./painter";
import Rect from "./rect";
declare class DragButton {
    rect: Rect;
    imageBox: ImageBox;
    private oldImageBoxRect;
    private oldRadius;
    private oldAngle;
    radius: number;
    private disable;
    constructor(imageBox: ImageBox);
    get getOldAngle(): number;
    update(imageBox: ImageBox): void;
    changeScale(newRect: Rect): void;
    onSelected(): void;
    hide(): void;
    show(): void;
    draw(paint: Painter): void;
}
export default DragButton;
//# sourceMappingURL=dragbutton.d.ts.map