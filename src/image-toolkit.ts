import CatchPointUtil from "./catchPointUtil";
import Drag from "./drag";
import DragButton from "./dragbutton";
import GestiEventManager, { GestiEvent } from "./event";
import Gesture from "./gesture";
import ImageBox from "./imageBox";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import XImage from "./ximage";

enum EventHandlerState {
    down,
    up,
    move
}

class ImageToolkit {
    private imageBoxList: Array<ImageBox> = new Array<ImageBox>();
    private eventHandler: GestiEvent;
    private eventHandlerState: EventHandlerState = EventHandlerState.up;
    private drag: Drag = new Drag();
    private gesture: Gesture = new Gesture();
    private selectedImageBox: ImageBox = null;
    private isMultiple = false;
    private offset: Vector;
    private canvasRect: Rect;
    private paint: Painter;
    public isDebug: boolean = false;
    constructor(paint: CanvasRenderingContext2D, rect: rectparams) {
        const {
            x: offsetx,
            y: offsety,
            width,
            height
        } = rect;
        this.offset = new Vector(offsetx || 0, offsety || 0);
        this.canvasRect = new Rect(rect);
        this.paint = new Painter(paint);
        this.bindEvent();
    }
    private bindEvent(): void {
        this.eventHandler = new GestiEventManager().getEvent(this);
        if (this.eventHandler == null) return;
        this.eventHandler.down(this.down).move(this.move).up(this.up).wheel(this.wheel);
        this.debug(["Event Bind,", this.eventHandler]);
    }
    public cancelEvent(): void {
        if (this.eventHandler == null) return;
        this.eventHandler.disable();
    }
    public down(v: GestiEventParams): void {
        this.debug(["Event Down,", v]);
        this.eventHandlerState = EventHandlerState.down;
        const event: Vector | Vector[] = this.correctEventPosition(v);

        //手势解析处理
        this.gesture.onDown(this.selectedImageBox, event);

        if (this.selectedImageBox ?? false) {
            if (Array.isArray(event)) {
               return this.gesture.onDown(this.selectedImageBox, event);// return this.gesture.onStart(this.selectedImageBox, event);
            }
            if (this.checkFuncButton(event)) return;
        }

        const selectedImageBox: ImageBox = CatchPointUtil.catchImageBox(this.imageBoxList, event);
        if (selectedImageBox ?? false) {
            /**
             * 如果对象属于封锁状态，永远不会被选中
             */
            if (selectedImageBox.isLock) return;

            this.debug(["选中了", selectedImageBox]);
            if (!this.isMultiple && (this.selectedImageBox ?? false)) {
                this.selectedImageBox.cancel();
            }
            this.selectedImageBox = selectedImageBox;
            this.arrangeLayer(selectedImageBox);
            this.selectedImageBox.onSelected();
            this.drag.catchImageBox(this.selectedImageBox.rect, event);
        }
        this.update();
    }
    /**
     * @description 传入 @ImageBox 对象，设置该对象的layer层级
     * @param selectedImageBox 
     */
    private arrangeLayer(selectedImageBox: ImageBox): void {
        // selectedImageBox.setLayer = 1;
        /**
         * 层级重构算法，使用换位
         * 如选中了第3个 @ImageBox ，就将第3个和第一个互换位置
         */
        const ndx = this.imageBoxList.findIndex((item: ImageBox) => item.key === selectedImageBox.key);
        const len = this.imageBoxList.length - 1;
        let temp = this.imageBoxList[len];
        this.imageBoxList[len] = selectedImageBox;
        this.imageBoxList[ndx] = temp;
    }
    public move(v: GestiEventParams): void {
        this.debug(["Event Move,", v]);
        if (this.eventHandlerState === EventHandlerState.down) {
            const event: Vector | Vector[] = this.correctEventPosition(v);
            //手势解析处理
            this.gesture.onMove(this.selectedImageBox, event);
            //手势
            if (Array.isArray(event)) {
                this.gesture.update(event);
                this.update();
                return;
            }
            //拖拽
            this.drag.update(event);
        }
        this.update();
    }
    public up(v: GestiEventParams): void {
        this.debug(["Event Up,", v]);
        const event: Vector | Vector[] = this.correctEventPosition(v);
        this.eventHandlerState = EventHandlerState.up;
        //手势解析处理
        this.gesture.onUp(this.selectedImageBox,event);
        this.drag.cancel();
        if (this.selectedImageBox ?? false) {
            this.selectedImageBox.onUp(this.paint);
        }
        this.update();
    }

    public wheel(e: WheelEvent): void {
        const {
            deltaY
        } = e;
        if (this.selectedImageBox != null) {
            if (deltaY < 0)
                this.selectedImageBox.enlarge();
            else this.selectedImageBox.narrow();
        }
        this.update();

    }
    private correctEventPosition(vector: GestiEventParams): Vector | Vector[] {
        let _vector: Vector[] = new Array<Vector>;
        if (Array.isArray(vector)) {
            vector.map((item: Vector) => {
                _vector.push(item.sub(this.offset));
            });
            return _vector;
        }
        return vector.sub(this.offset);
    }
    private checkFuncButton(eventPosition: Vector): boolean {
        const _dragButton: DragButton | boolean = this.selectedImageBox.checkFuncButton(eventPosition);
        const dragButton: any = _dragButton;
        if (dragButton.constructor.name == "DragButton") {
            const button: DragButton = dragButton;
            button.onSelected();
            this.drag.catchImageBox(button.rect, eventPosition);
            return true;

        }
        this.selectedImageBox.cancel();
        this.drag.cancel();
        this.gesture.cancel();
        this.selectedImageBox = null;
        return false;
    }
    public update() {
        this.debug("Update the Canvas");
        this.paint.clearRect(0, 0, this.canvasRect.size.width, this.canvasRect.size.height);
        this.imageBoxList.forEach((item: ImageBox) => {
            if (!item.disabled) item.update(this.paint);
        })
    }
    public addImage(ximage: XImage): void {
        this.debug("Add a Ximage");
        if (ximage.constructor.name != "XImage") throw Error("不是XImage类");
        const image: XImage = ximage;
        image.width *= image.scale;
        image.height *= image.scale;
        image.x = this.canvasRect.size.width >> 1;
        image.y = this.canvasRect.size.height >> 1;
        const imageBox: ImageBox = new ImageBox(image);
        this.imageBoxList.push(imageBox);
        setTimeout(() => {
            this.update();
        }, 100)
    }
    private debug(message: any): void {
        if (!this.isDebug) return;
        if (Array.isArray(message))
            console.warn("Gesti debug: ", ...message);
        else console.warn("Gesti debug: ", message);
    }
}
export default ImageToolkit;