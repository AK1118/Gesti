import Button from "./abstract/button";
import CatchPointUtil from "./catchPointUtil";
import Drag from "./drag";
import { FuncButtonTrigger } from "./enums";
import GestiEventManager, { GestiEvent } from "./event";
import Gesture from "./gesture";
import ImageBox from "./imageBox";
import GestiController from "./interfaces/gesticontroller";
import RecorderInterface from "./interfaces/recorder";
import RenderObject from "./interfaces/render-object";
import Painter from "./painter";
import Recorder from "./recorder";
import Rect from "./rect";
import Vector from "./vector";
import XImage from "./ximage";

enum EventHandlerState {
    down,
    up,
    move
}

/**
 * 图层操作枚举
 */
enum LayerOperationType {
    //下降一层
    lower,
    //上升一层
    rise,
    //至于顶层
    top,
    //至于底层
    bottom,
}

class ImageToolkit implements GestiController {
    //所有图层集合
    private imageBoxList: Array<ImageBox> = new Array<ImageBox>();
    //手势监听器
    private eventHandler: GestiEvent;
    //手势状态
    private eventHandlerState: EventHandlerState = EventHandlerState.up;
    //拖拽代理器
    private drag: Drag = new Drag();
    //手势处理识别器
    private gesture: Gesture = new Gesture();
    //当前选中的图层
    private selectedImageBox: ImageBox = null;
    //是否所选图层
    private isMultiple = false;
    //canvas偏移量
    private offset: Vector;
    //画布矩形大小
    private canvasRect: Rect;
    //画笔代理类 canvasContext 2d
    private paint: Painter;
    //是否debug模式
    public isDebug: boolean = false;
    //记录操作
    private recorder: RecorderInterface = Recorder.getInstance();
    private tool: _Tools = new _Tools();
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
    layerLower(): void {
        this.tool.arrangeLayer(this.imageBoxList, this.selectedImageBox, LayerOperationType.lower);
    }
    layerRise(): void {
        this.tool.arrangeLayer(this.imageBoxList, this.selectedImageBox, LayerOperationType.rise);
    }
    layerTop(): void {
        this.tool.arrangeLayer(this.imageBoxList, this.selectedImageBox, LayerOperationType.top);
    }
    layerBottom(): void {
        this.tool.arrangeLayer(this.imageBoxList, this.selectedImageBox, LayerOperationType.bottom);
    }
    deLock(): void {
        this.selectedImageBox.deblock();
    }
    lock(): void {
        this.selectedImageBox.lock();
    }
    async fallback() {
       const rect=await  this.recorder.fallback();
       this.tool.fallbackImageBox(this.imageBoxList,rect,this);
    }
    async cancelFallback(){
        const rect=await  this.recorder.cancelFallback();
        this.tool.fallbackImageBox(this.imageBoxList,rect,this);
    }
   
    
    //无须实现
    down(e: Event): void {
        throw new Error("Method not implemented.");
    }
    //无须实现
    up(e: Event): void {
        throw new Error("Method not implemented.");
    }
    //无须实现
    move(e: Event): void {
        throw new Error("Method not implemented.");
    }
    //无须实现
    wheel(e: Event): void {
        throw new Error("Method not implemented.");
    }
    private bindEvent(): void {
        this.eventHandler = new GestiEventManager().getEvent(this);
        if (this.eventHandler == null) return;
        this.eventHandler.down(this.onDown).move(this.onMove).up(this.onUp).wheel(this.onWheel);
        this.addListening();
        this.debug(["Event Bind,", this.eventHandler]);
    }
    /**
     * 添加手势的动作，长按，双击，点击等
     * @description 只有在选中对象时该监听才生效
     */
    public addListening(): void {
        this.gesture.addListenGesti("click", (imageBox: ImageBox, position: Vector) => {
            //  console.log("点击",imageBox);
        });
        this.gesture.addListenGesti("dbclick", (imageBox: ImageBox, position: Vector) => {
            //  console.log("双击",position);
        })
        this.gesture.addListenGesti("longpress", (imageBox: ImageBox, position: Vector) => {
            // console.log("长按",position);
        })
        this.gesture.addListenGesti("twotouch", (imageBox: ImageBox, position: Vector) => {
            //console.log("二指",position);
            // this.gesture.onDown(this.selectedImageBox, position);
        });
    }
    public cancelEvent(): void {
        if (this.eventHandler == null) return;
        this.eventHandler.disable();
    }
    public onDown(v: GestiEventParams): void {
        this.debug(["Event Down,", v]);
        this.eventHandlerState = EventHandlerState.down;
        const event: Vector | Vector[] = this.correctEventPosition(v);

        //手势解析处理
        this.gesture.onDown(this.selectedImageBox, event);

        if (this.selectedImageBox ?? false) {
            if (Array.isArray(event)) {
                return;
            }
            if (this.checkFuncButton(event)) return;
        }

        /**
         * 检测是否点击到ImageBox对象
         */
        const selectedImageBox: ImageBox = CatchPointUtil.catchImageBox(this.imageBoxList, event);
        if (selectedImageBox ?? false) {
            this.debug(["选中了", selectedImageBox]);
            if (!this.isMultiple && (this.selectedImageBox ?? false)) {
                this.selectedImageBox.cancel();
            }
            this.selectedImageBox = selectedImageBox;
            //选中后变为选中状态
            this.selectedImageBox.onSelected();
            //不允许在锁定时被拖拽选中进行操作
            if (!selectedImageBox.isLock)
                this.drag.catchImageBox(this.selectedImageBox.rect, event);
        }
        this.update();
    }
    public onMove(v: GestiEventParams): void {
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
    public onUp(v: GestiEventParams): void {
        this.debug(["Event Up,", v]);
        const event: Vector | Vector[] = this.correctEventPosition(v);
        this.eventHandlerState = EventHandlerState.up;
        //手势解析处理
        this.gesture.onUp(this.selectedImageBox, event);
        this.drag.cancel();
        if (this.selectedImageBox ?? false) {
            this.selectedImageBox.onUp(this.paint);
            //鼠标|手指抬起时提交一次操作
            this.recorder.commit();
        }
        setTimeout(() => this.update(), 100)
    }

    public onWheel(e: WheelEvent): void {
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
        const _button: Button | boolean = this.selectedImageBox.checkFuncButton(eventPosition);
        const result: any = _button;

        //确保是按钮
        if (result instanceof Button) {
            const button: Button = result;
            if (button.trigger == FuncButtonTrigger.drag) {
                button.onSelected();
                this.drag.catchImageBox(button.rect, eventPosition);
            } else if (button.trigger == FuncButtonTrigger.click) {
                button.effect();
            }
            return true;
        }

        this.drag.cancel();
        this.gesture.cancel();
        // this.selectedImageBox.cancel();
        // this.selectedImageBox = null;
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


class _Tools {
    /**
     * @description 传入 @ImageBox 对象，设置该对象的layer层级
     * @param selectedImageBox 
     */
    public arrangeLayer(imageBoxList: Array<RenderObject>, selectedImageBox: ImageBox, operationType: LayerOperationType): void {
        /**
         * 层级重构算法，使用换位
         * 如选中了第3个 @ImageBox ，就将第3个和第一个互换位置
         */
        const ndx = imageBoxList.findIndex((item: ImageBox) => item.key === selectedImageBox.key);
        const len = imageBoxList.length - 1;
        // 0为底部   len为顶部
        switch (operationType) {
            case LayerOperationType.top: {
                let temp = imageBoxList[len];
                imageBoxList[len] = selectedImageBox;
                imageBoxList[ndx] = temp;
            }; break;
            case LayerOperationType.bottom: {
                let temp = imageBoxList[0];
                imageBoxList[0] = selectedImageBox;
                imageBoxList[ndx] = temp;
            }; break;
            case LayerOperationType.rise: {
                if (ndx == len) break;
                let temp = imageBoxList[ndx + 1];
                imageBoxList[ndx + 1] = selectedImageBox;
                imageBoxList[ndx] = temp;
            }; break;
            case LayerOperationType.lower: {
                console.log(ndx)
                if (ndx == 0) break;
                console.log("捡")
                const temp = imageBoxList[ndx - 1];
                imageBoxList[ndx - 1] = selectedImageBox;
                imageBoxList[ndx] = temp;

            }; break;
        }
    }

    public fallbackImageBox(imageBoxList: Array<RenderObject>,rect:Rect,kit:ImageToolkit){
        if(rect==null)return;
        const ndx=imageBoxList.findIndex((item:ImageBox)=>{
             return item.rect.key==rect.key;
        });
        if(ndx!=-1){
            imageBoxList[ndx].rect.set(rect);
        }
        kit.update();
    }
}
export default ImageToolkit;