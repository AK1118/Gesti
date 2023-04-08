import Button from "./abstract/button";
import { RecordNode } from "./abstract/operation-observer";
import ViewObject from "./abstract/view-object";
import CatchPointUtil from "./catchPointUtil";
import Drag from "./drag";
import { FuncButtonTrigger } from "./enums";
import GestiEventManager, { GestiEvent } from "./event";
import Gesture from "./gesture";
import GestiController from "./interfaces/gesticontroller";
import RecorderInterface from "./interfaces/recorder";
import RenderObject from "./interfaces/render-object";
import Painter from "./painter";
import Recorder from "./recorder";
import Rect from "./rect";
import { classTypeIs } from "./utils";
import Vector from "./vector";
import ImageBox from "./viewObject/image";
import TextBox from "./viewObject/text";
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

interface ListenerTypes {
    onSelect(viewObject: ViewObject): void;
    onHide(viewObject: ViewObject): void;
    onCancel(viewObject: ViewObject):void;
}

/**
 * 监听类
 */
class Listeners implements ListenerTypes {
    onHide(viewObject: ViewObject): void { }
    onSelect(viewObject: ViewObject): void { }
    onCancel(viewObject: ViewObject):void{} 
}

class ImageToolkit implements GestiController {
    //所有图层集合
    private ViewObjectList: Array<ViewObject> = new Array<ViewObject>();
    //手势监听器
    private eventHandler: GestiEvent;
    //手势状态
    private eventHandlerState: EventHandlerState = EventHandlerState.up;
    //拖拽代理器
    private drag: Drag = new Drag();
    //手势处理识别器
    private gesture: Gesture = new Gesture();
    //当前选中的图层
    private selectedViewObject: ViewObject = null;
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
    /**
     * 本次点击是否有选中到对象，谈起时需要置于false
     */
    private _inObjectArea: boolean = false;
    /**
     * 工具
     */
    private tool: _Tools = new _Tools();
    private listen: Listeners = new Listeners();
    /**
     * 目前图层的显示状态，0表示隐藏，1表示显示
     */
    private currentViewObjectState:Array<0|1>=[];
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
    addListener(listenType: keyof ListenerTypes, callback: (obj: any) => void): void {
        switch (listenType) {
            case "onSelect": {
                this.listen.onSelect = callback;
            } break;
            case "onHide": {
                this.listen.onHide = callback;
            } break;
            case "onCancel":{
                this.listen.onCancel=callback;
            }
        }
    }
    updateText(text: string, options?: textOptions): void {
        const isTextBox = classTypeIs(this.selectedViewObject, TextBox);
        if (isTextBox) {
            (this.selectedViewObject as TextBox).updateText(text, options);
            this.update();
        }
    }
    center(): void {
        this.selectedViewObject?.center(this.canvasRect.size);
    }
    cancel(): void {
        this.selectedViewObject?.cancel();
        if(this.selectedViewObject){
            this.listen.onCancel(this.selectedViewObject);
        }
        this.update();
    }
    cancelAll(): void {
        this.ViewObjectList.forEach((item: ViewObject) => item.cancel());
        this.update();
    }
    layerLower(): void {
        this.tool.arrangeLayer(this.ViewObjectList, this.selectedViewObject, LayerOperationType.lower);
    }
    layerRise(): void {
        this.tool.arrangeLayer(this.ViewObjectList, this.selectedViewObject, LayerOperationType.rise);
    }
    layerTop(): void {
        this.tool.arrangeLayer(this.ViewObjectList, this.selectedViewObject, LayerOperationType.top);
    }
    layerBottom(): void {
        this.tool.arrangeLayer(this.ViewObjectList, this.selectedViewObject, LayerOperationType.bottom);
    }
    deLock(): void {
        this.selectedViewObject?.deblock();
    }
    lock(): void {
        this.selectedViewObject?.lock();
    }
    async fallback() {
        const node: RecordNode = await this.recorder.fallback();
        this.tool.fallbackViewObject(this.ViewObjectList, node, this);
    }
    async cancelFallback() {
        const node: RecordNode = await this.recorder.cancelFallback();
        this.tool.fallbackViewObject(this.ViewObjectList, node, this);
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
    //无需实现
    createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage> {
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
        this.gesture.addListenGesti("click", (ViewObject: ViewObject, position: Vector) => {
            //  console.log("点击",ViewObject);
        });
        this.gesture.addListenGesti("dbclick", (ViewObject: ViewObject, position: Vector) => {
            //  console.log("双击",position);
        })
        this.gesture.addListenGesti("longpress", (ViewObject: ViewObject, position: Vector) => {
            // console.log("长按",position);
        })
        this.gesture.addListenGesti("twotouch", (ViewObject: ViewObject, position: Vector) => {
            //console.log("二指",position);
            // this.gesture.onDown(this.selectedViewObject, position);
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
        this.gesture.onDown(this.selectedViewObject, event);

        if (this.selectedViewObject ?? false) {
            if (Array.isArray(event)) {
                return;
            }
            if (this.checkFuncButton(event)) return;
        }

        /**
         * 检测是否点击到ViewObject对象
         */
        const selectedViewObject: ViewObject = CatchPointUtil.catchViewObject(this.ViewObjectList, event);
        if (selectedViewObject ?? false) {
            this.debug(["选中了", selectedViewObject]);
            this.listen.onSelect(selectedViewObject);
            this._inObjectArea = true;
            if (!this.isMultiple && (this.selectedViewObject ?? false)) {
                this.selectedViewObject.cancel();
                this.listen.onCancel(this.selectedViewObject);
            }
            this.selectedViewObject = selectedViewObject;
            //选中后变为选中状态
            this.selectedViewObject.onSelected();
            //不允许在锁定时被拖拽选中进行操作
            if (!selectedViewObject.isLock)
                this.drag.catchViewObject(this.selectedViewObject.rect, event);
        }
        this.update();
    }
    public onMove(v: GestiEventParams): void {
        this.debug(["Event Move,", v]);
        if (this.eventHandlerState === EventHandlerState.down) {
            const event: Vector | Vector[] = this.correctEventPosition(v);
            //手势解析处理
            this.gesture.onMove(this.selectedViewObject, event);
            //手势
            if (Array.isArray(event)) {
                this.gesture.update(event);
                this.update();
                return;
            }
            //拖拽
            this.drag.update(event);
        }
        //有被选中对象才刷新
        if (this.selectedViewObject != null) this.update();
    }
    public onUp(v: GestiEventParams): void {
        this.debug(["Event Up,", v]);
        const event: Vector | Vector[] = this.correctEventPosition(v);
        this.eventHandlerState = EventHandlerState.up;
        //手势解析处理
        this.gesture.onUp(this.selectedViewObject, event);
        this.drag.cancel();
        if ((this.selectedViewObject ?? false) && this._inObjectArea) {
            this.selectedViewObject.onUp(this.paint);
            //鼠标|手指抬起时提交一次操作
            this.recorder.commit();
        }
        setTimeout(() => this.update(), 100)
        this._inObjectArea = false;
    }

    public onWheel(e: WheelEvent): void {
        const {
            deltaY
        } = e;
        if (this.selectedViewObject != null) {
            if (deltaY < 0)
                this.selectedViewObject.enlarge();
            else this.selectedViewObject.narrow();
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
        const _button: Button | boolean = this.selectedViewObject.checkFuncButton(eventPosition);
        const result: any = _button;
        //确保是按钮
        if (result instanceof Button) {
            this._inObjectArea = true;
            const button: Button = result;
            if (button.trigger == FuncButtonTrigger.drag) {
                button.onSelected();
                this.drag.catchViewObject(button.rect, eventPosition);
            } else if (button.trigger == FuncButtonTrigger.click) {
                button.effect();
            }
            return true;
        }

        this.drag.cancel();
        this.gesture.cancel();
        return false;
    }
    public update() {
        this.debug("Update the Canvas");
        this.paint.clearRect(0, 0, this.canvasRect.size.width, this.canvasRect.size.height);
        //当前显示标记数组初始化数据，且需要实时更新
        if(this.currentViewObjectState.length!=this.ViewObjectList.length){
            this.currentViewObjectState.push(1);
        }
        this.ViewObjectList.forEach((item: ViewObject,ndx:number) => {
            if (!item.disabled) {
                item.update(this.paint);
            }else if(this.currentViewObjectState[ndx]==1){
                //标记过后不会再次标记
                this.currentViewObjectState[ndx]=0;
                item.cancel();
                this.listen.onHide(item);
            }
        })
    }
    /**
     * @description 新增图片
     * @param ximage 
     * @returns 
     */
    public addImage(ximage: XImage): Promise<boolean> {
        this.debug("Add a Ximage");
        if (ximage.constructor.name != "XImage") throw Error("不是XImage类");
        const image: XImage = ximage;
        image.width *= image.scale;
        image.height *= image.scale;
        const imageBox: ImageBox = new ImageBox(image);
        imageBox.center(this.canvasRect.size);
        this.ViewObjectList.push(imageBox);
        setTimeout(() => {
            this.update();
        }, 100);
        return Promise.resolve(true);
    }
    /**
     * @description 新增文字
     * @param text 
     * @param options 
     * @returns 
     */
    public addText(text: string, options?: textOptions): Promise<boolean> {
        const textBox: TextBox = new TextBox(text, this.paint, options);
        textBox.center(this.canvasRect.size);
        this.ViewObjectList.push(textBox);
        setTimeout(() => {
            this.update();
        }, 100);
        return Promise.resolve(true);
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
     * @description 传入 @ViewObject 对象，设置该对象的layer层级
     * @param selectedViewObject 
     */
    public arrangeLayer(ViewObjectList: Array<RenderObject>, selectedViewObject: ViewObject, operationType: LayerOperationType): void {
        /**
         * 层级重构算法，使用换位
         * 如选中了第3个 @ViewObject ，就将第3个和第一个互换位置
         */
        const ndx = ViewObjectList.findIndex((item: ViewObject) => item.key === selectedViewObject.key);
        const len = ViewObjectList.length - 1;
        // 0为底部   len为顶部
        switch (operationType) {
            case LayerOperationType.top: {
                let temp = ViewObjectList[len];
                ViewObjectList[len] = selectedViewObject;
                ViewObjectList[ndx] = temp;
            }; break;
            case LayerOperationType.bottom: {
                let temp = ViewObjectList[0];
                ViewObjectList[0] = selectedViewObject;
                ViewObjectList[ndx] = temp;
            }; break;
            case LayerOperationType.rise: {
                if (ndx == len) break;
                let temp = ViewObjectList[ndx + 1];
                ViewObjectList[ndx + 1] = selectedViewObject;
                ViewObjectList[ndx] = temp;
            }; break;
            case LayerOperationType.lower: {
                console.log(ndx)
                if (ndx == 0) break;
                const temp = ViewObjectList[ndx - 1];
                ViewObjectList[ndx - 1] = selectedViewObject;
                ViewObjectList[ndx] = temp;

            }; break;
        }
    }

    public fallbackViewObject(ViewObjectList: Array<ViewObject>, node: RecordNode, kit: ImageToolkit) {
        if (node == null) return;
        const obj: ViewObject = ViewObjectList.find((item: ViewObject) => {
            return item.key == node.key;
        });
        if (obj) {
            switch (node.type) {
                case "position": obj.rect.position = node.data; break;
                case "angle": obj.rect.setAngle(node.data); break;
                case "scale": obj.rect.setScale(node.data); break;
                case "size": obj.rect.setSize(node.data.width, node.data.height); break;
                case "drag": {
                    obj.rect.setSize(node.data.size.width, node.data.size.height);
                    obj.rect.setAngle(node.data.angle);
                } break;
            }
            obj.didFallback();
        }
        kit.update();
    }
}
export default ImageToolkit;