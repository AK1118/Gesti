import XImage from "./ximage";
declare class ImageToolkit {
    private imageBoxList;
    private eventHandler;
    private eventHandlerState;
    private drag;
    private gesture;
    private selectedImageBox;
    private isMultiple;
    private offset;
    private canvasRect;
    private paint;
    constructor(paint: CanvasRenderingContext2D, rect: rectparams);
    private bindEvent;
    private cancelEvent;
    down(v: GestiEventParams): void;
    move(v: GestiEventParams): void;
    up(v: GestiEventParams): void;
    wheel(e: WheelEvent): void;
    private correctEventPosition;
    private checkFuncButton;
    private update;
    addImage(ximage: XImage): void;
    private debug;
}
export default ImageToolkit;
//# sourceMappingURL=image-toolkit.d.ts.map