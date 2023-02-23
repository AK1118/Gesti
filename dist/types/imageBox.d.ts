import DragButton from "./dragbutton";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import { Point } from "./vertex";
import XImage from "./ximage";
declare class ImageBox {
    selected: boolean;
    private scale;
    private dragButton;
    /**
     * 提供 @CanvasRenderingContext2D 渲染的数据
     */
    private image;
    /**
     * 外层传入的 @XImage 原始数据
     */
    private ximage;
    private key;
    private isMirror;
    disabled: boolean;
    rect: Rect;
    beforeRect: Rect;
    set setDragButton(dragButton: DragButton);
    get getDragButton(): DragButton;
    constructor(image: XImage);
    update(paint: Painter): void;
    private drawImage;
    private drawStroke;
    private drawAnchorpoint;
    checkFuncButton(eventPosition: Vector): DragButton | boolean;
    hide(): void;
    getVertex(): Point[];
    onSelected(): void;
    cancel(): void;
    onUp(paint: Painter): void;
    enlarge(): void;
    narrow(): void;
    doScale(): void;
}
export default ImageBox;
//# sourceMappingURL=imageBox.d.ts.map