import Button from "./abstract/button";
import { RecordNode } from "./abstract/operation-observer";
import ViewObject from "./abstract/view-object";
import WriteBase from "./abstract/write-category";
import CatchPointUtil from "./catchPointUtil";
import canvasConfig from "./config/canvasConfig";
import GestiConfig from "./config/gestiConfig";
import Drag from "./drag";
import { FuncButtonTrigger, ViewObjectFamily } from "./enums";
import GestiEventManager, { GestiEvent } from "./event";
import Gesture from "./gesture";
import GestiController from "./interfaces/gesticontroller";
import RecorderInterface from "./interfaces/recorder";
import RenderObject from "./interfaces/render-object";
import Painter from "./painter";
import GestiReader from "./abstract/reader";
import GestiReaderH5 from "./reader/reader-H5";
import Recorder from "./recorder";
import Rect from "./rect";
import { classTypeIs } from "./utils";
import Vector from "./vector";
import ImageBox from "./viewObject/image";
import TextBox from "./viewObject/text";
import WriteFactory, { WriteType } from "./write/write-factory";
import XImage from "./ximage";
import GestiReaderWechat from "./reader/reader-WeChat";

enum EventHandlerState {
  down,
  up,
  move,
}

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
 

type ListenerHook = (viewObject: ViewObject) => void;

/**
 * 监听类
 */
class Listeners {
  hooks: any = {};
  addHook(
    hookType: GestiControllerListenerTypes,
    hook: any,
    prepend: boolean = false
  ) {
    const hooks: Array<ListenerHook> =
      this.hooks[hookType] || (this.hooks[hookType] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (arg) => hook(arg));
    //优先级
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
  callHooks(hookType: GestiControllerListenerTypes, arg: ViewObject) {
    const hooks = this.hooks[hookType] || [];
    hooks.forEach((hook: ListenerHook) => hook(arg));
  }
  removeHook(hookType: GestiControllerListenerTypes, hook: ListenerHook) {
    const hooks: Array<ListenerHook> = this.hooks[hookType] || [];
    const ndx: number = hooks.indexOf(hook);
    hooks.splice(ndx, 1);
  }
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
  private currentViewObjectState: Array<0 | 1> = [];
  //是否在绘制中
  private isWriting: boolean = false;
  //绘制对象工厂  //绘制对象，比如签字、矩形、圆形等
  private writeFactory: WriteFactory;
  //目前Hover的对象
  private hoverViewObject: ViewObject = null;
  //测试 将canvas快照下来，除了被选中的对象，其他都按按照这个渲染
  private snapshot: ImageData = null;
  //休眠,休眠时不能有任何操作
  private sleep: boolean = false;

  public get getCanvasRect(): Rect {
    return this.canvasRect;
  }
  public get getViewObjects() {
    return this.ViewObjectList;
  }
  constructor(paint: CanvasRenderingContext2D, rect: rectparams) {
    const { x: offsetx, y: offsety, width, height } = rect;
    this.offset = new Vector(offsetx || 0, offsety || 0);
    rect.x = this.offset.x;
    rect.y = this.offset.y;
    this.canvasRect = new Rect(rect);
    this.paint = new Painter(paint);
    canvasConfig.setGlobalPaint(this.paint);
    this.writeFactory = new WriteFactory(this.paint);
    this.bindEvent();
  }
  querySelector(select: string | ViewObjectFamily): Promise<ViewObject | ViewObject[]> {
    throw new Error("Method not implemented.");
  }
  getViewObjectById<T extends ViewObject>(id:string): Promise<T> {
      const arr=this.ViewObjectList;
      const obj:T|null=arr.find(item=>item.id===id) as T;
      return Promise.resolve<T>(obj);
  }
  position(x: number, y: number, view?: ViewObject): void {
      if(view){
        view.setPosition(x,y);
      }
      this.selectedViewObject?.setPosition(x,y);
      this.update();
  }

  /**
   * @description 清空所有元素
   * @returns
   */
  cleanAll(): Promise<void> {
    return new Promise((r, v) => {
      this.ViewObjectList = [];
      this.update();
      r();
    });
  }
  destroyGesti(): void {
    this.callHook("onBeforeDestroy");
    this.ViewObjectList = [];
    this.eventHandler = null;
    this.tool = null;
    new Promise((v, r) => {
      this.callHook("onDestroy");
    }).then((e) => {
      this.listen = null;
    });
    //监听器最后销毁，因为要执行回调
  }

  load(view: ViewObject): void {
    this.addViewObject(view);
  }
  select(select: ViewObject): Promise<void> {
    if (select && select.onSelected) {
      select.onSelected();
      this.selectedViewObject = select;
      this.callHook("onSelect", select);
      this.update();
      return Promise.resolve();
    }
    return Promise.resolve();
  }
  get currentViewObject(): ViewObject {
    return this.selectedViewObject;
  }
  async rotate(
    angle: number,
    existing?: boolean,
    view?: ViewObject
  ): Promise<void> {
    let obj = view || this.selectedViewObject;
    if (!obj) return Promise.resolve(null);
    let _angle = existing ? angle + obj.rect.getAngle : angle;
    obj.rect.setAngle(_angle);
    this.update();
    return Promise.resolve(null);
  }
  upward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.rect.position.y -= 1;
      return viewObject.rect.position.y;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.rect.position.y -= 1;
    return this.selectedViewObject.rect.position.y;
  }
  downward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.rect.position.y += 1;
      return viewObject.rect.position.y;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.rect.position.y += 1;
    return this.selectedViewObject.rect.position.y;
  }
  leftward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.rect.position.x -= 1;
      return viewObject.rect.position.x;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.rect.position.x -= 1;
    return this.selectedViewObject.rect.position.x;
  }
  rightward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.rect.position.x += 1;
      return viewObject.rect.position.x;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.rect.position.x += 1;
    return this.selectedViewObject.rect.position.x;
  }
  /**
   * @description 导入json解析成对象  H5
   * @param json
   * @returns
   */
  async importAll(json: string): Promise<void> {
    return new Promise(async (r, j) => {
      try {
        if (json == "[]" || !json) throw Error("Import Json is Empty");
        const str = JSON.parse(json);
        const reader = new GestiReaderH5();
        for await (const item of str) {
          const obj: ViewObject = await reader.getObjectByJson(
            JSON.stringify(item)
          );
          if (obj) this.addViewObject(obj);
        }
        this.update();
        r();
      } catch (error) {
        j(error);
      }
    });
  }

  /**
   * @description 微信专用导入
   * @param json
   * @param weChatCanvas
   * @returns
   */
  importAllWithWeChat(json: string, weChatCanvas: any): Promise<void> {
    return new Promise(async (r, j) => {
      try {
        if (json == "[]" || !json) throw Error("Import Json is Empty");
        const str = JSON.parse(json);
        const reader: GestiReaderWechat = new GestiReaderWechat();
        for await (const item of str) {
          const obj: ViewObject = await reader.getObjectByJson(
            JSON.stringify(item),
            this.paint,
            weChatCanvas
          );
          if (obj) this.addViewObject(obj);
        }
        this.update();
        r();
      } catch (error) {
        j(error);
      }
    });
  }
  addListener(
    listenType: GestiControllerListenerTypes,
    hook: ListenerHook,
    prepend: boolean = false
  ): any {
    return this.listen.addHook(listenType, hook, prepend);
  }
  removeListener(
    listenType: GestiControllerListenerTypes,
    hook: (object: any) => void
  ): void {
    this.listen.removeHook(listenType, hook);
  }
  /**
   * @description 导出画布内所有对象成json字符串
   */
  exportAll(
    offScreenPainter: CanvasRenderingContext2D,
    type: "H5" | "WeChat" = "H5"
  ): Promise<string> {
    const offPainter = new Painter(offScreenPainter);
    return new Promise(async (r, j) => {
      try {
        const jsons: Array<Object> = [];
        for await (const item of this.ViewObjectList) {
          if (item.disabled) continue;
          if (type == "H5") jsons.push(await item.export(offPainter));
          else if (type == "WeChat")
            jsons.push(await item.exportWeChat(offPainter));
        }
        r(JSON.stringify(jsons));
      } catch (error) {
        j(error);
      }
    });
  }
  /**
   * @description 导出画布内所有对象成json字符串  微信
   */
  exportAllWithWeChat(
    offScreenPainter: CanvasRenderingContext2D
  ): Promise<string> {
    return this.exportAll(offScreenPainter, "WeChat");
  }
  updateText(text: string, options?: textOptions): void {
    const isTextBox = classTypeIs(this.selectedViewObject, TextBox);
    if (isTextBox) {
      (this.selectedViewObject as TextBox)
        .updateText(text, options)
        .then(() => {
          this.update();
        });
    }
  }
  center(axis?: CenterAxis, view?: ViewObject): void {
    if (view) view.center(this.canvasRect.size, axis);
    else this.selectedViewObject?.center(this.canvasRect.size, axis);
  }
  cancel(view?: ViewObject): void {
    const _view = view || this.selectedViewObject;
    if (_view) {
      if (_view.key == this.selectedViewObject.key)
        this.selectedViewObject = null;
      _view?.cancel();
      this.callHook("onCancel", _view);
    }
    this.update();
  }
  cancelAll(): void {
    this.ViewObjectList.forEach((item: ViewObject) => item.cancel());
    this.update();
  }
  layerLower(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(
      this.ViewObjectList,
      _view,
      LayerOperationType.lower
    );
    this.update();
  }
  layerRise(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(this.ViewObjectList, _view, LayerOperationType.rise);
    this.update();
  }
  layerTop(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(this.ViewObjectList, _view, LayerOperationType.top);
    this.update();
  }
  layerBottom(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(
      this.ViewObjectList,
      _view,
      LayerOperationType.bottom
    );
    this.update();
  }
  unLock(view?: ViewObject): void {
    if (view) view?.unLock();
    else this.selectedViewObject?.unLock();
  }
  lock(view?: ViewObject): void {
    if (view) view?.lock();
    else this.selectedViewObject?.lock();
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
  createImage(
    image:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | Blob
      | ImageData
      | ImageBitmap
      | OffscreenCanvas,
    options?: createImageOptions
  ): Promise<XImage> {
    throw new Error("Method not implemented.");
  }
  private bindEvent(): void {
    this.eventHandler = new GestiEventManager().getEvent(this);
    if (this.eventHandler == null) return;
    this.eventHandler
      .down(this.onDown)
      .move(this.onMove)
      .up(this.onUp)
      .wheel(this.onWheel);
    this.addListening();
    this.debug(["Event Bind,", this.eventHandler]);
  }
  /**
   * 添加手势的动作，长按，双击，点击等
   * @description 只有在选中对象时该监听才生效
   */
  public addListening(): void {
    this.gesture.addListenGesti(
      "click",
      (ViewObject: ViewObject, position: Vector) => {}
    );
    this.gesture.addListenGesti(
      "dbclick",
      (ViewObject: ViewObject, position: Vector) => {
        //  console.log("双击",position);
      }
    );
    this.gesture.addListenGesti(
      "longpress",
      (ViewObject: ViewObject, position: Vector) => {
        // console.log("长按",position);
      }
    );
    this.gesture.addListenGesti(
      "twotouch",
      (ViewObject: ViewObject, position: Vector) => {
        //console.log("二指",position);
        // this.gesture.onDown(this.selectedViewObject, position);
      }
    );
    this.gesture.addListenGesti("globalClick", (position: Vector) => {
      // const selected = this.clickViewObject(position);
      // if (selected == null && this.selectedViewObject) {
      //     this.drag.cancel();
      //     this.cancel();
      // }
    });
  }
  //唤醒,可以继续操作
  public wakeUp(): void {
    this.sleep = false;
    this.update();
  }
  public cancelEvent(): void {
    if (this.eventHandler == null) return;
    this.eventHandler.disable();
  }
  public onDown(v: GestiEventParams): void {
    this.debug(["Event Down,", v]);
    //休眠不执行任何操作
    if (this.sleep) return;
    this.eventHandlerState = EventHandlerState.down;
    const event: Vector | Vector[] = this.correctEventPosition(v);

    //手势解析处理
    this.gesture.onDown(this.selectedViewObject, event);

    if (this.selectedViewObject ?? false) {
      if (Array.isArray(event) || this.checkFuncButton(event)) {
        return;
      }
    }

    /**
     * 处理拖拽的代码块，被选中图册是检测选中的最高优先级
     * 当有被选中图层时，拖拽的必然是他，不论层级
     *
     */
    let selectedViewObject: ViewObject = CatchPointUtil.catchViewObject(
      this.ViewObjectList,
      event
    );

    /**
     * 选中元素存在 且不是已选中元素,且不是锁定,且不是背景元素
     */
    if (
      selectedViewObject &&
      this.selectedViewObject === selectedViewObject &&
      !this.selectedViewObject.isLock&&!selectedViewObject.isBackground
    )
    this.drag.catchViewObject(selectedViewObject.rect, event);

    /**
     * 画笔代码块 可以有被选中的图层，前提是当前下落的位置必定不能在上一个被选中的图册内
     *
     * */
    if (
      this.selectedViewObject != selectedViewObject ||
      selectedViewObject == null
    )
      this.writeFactory.onDraw();

    this.update();
  }
  public onMove(v: GestiEventParams): void {
    this.debug(["Event Move,", v]);
    //休眠不执行任何操作
    if (this.sleep) return;
    if (this.eventHandlerState === EventHandlerState.down) {
      const event: Vector | Vector[] = this.correctEventPosition(v);

      //绘制处理,当down在已被选中的图册上时不能绘制
      if (this.writeFactory.current) {
        this.update();
        return this.writeFactory.current?.onMove(event);
      }

      //手势解析处理
      this.gesture.onMove(this.selectedViewObject, event);
      //手势
      if (Array.isArray(event)) {
        this.gesture.update(event);
        return this.update();
      }
      //拖拽
      this.drag.update(event);
      //有被选中对象才刷新
      if (this.selectedViewObject != null) this.update();
    } else {
      const event: Vector | Vector[] = this.correctEventPosition(v);
      //Hover检测
      const selectedViewObject: ViewObject = CatchPointUtil.catchViewObject(
        this.ViewObjectList,
        event
      );
      if (
        selectedViewObject &&
        this.hoverViewObject?.key != selectedViewObject.key
      ) {
        this.callHook("onHover", selectedViewObject);
        this.hoverViewObject = selectedViewObject;
      } else if (!selectedViewObject && this.hoverViewObject) {
        this.callHook("onLeave", this.hoverViewObject);
        this.hoverViewObject = null;
      }
    }
  }
  public onUp(v: GestiEventParams): void {
    this.debug(["Event Up,", v]);
    //休眠不执行任何操作
    if (this.sleep) return;
    const event: Vector | Vector[] = this.correctEventPosition(v);
    //判断是否选中对象
    this.clickViewObject(event);
    this.eventHandlerState = EventHandlerState.up;
    //手势解析处理
    this.gesture.onUp(this.selectedViewObject, event);
    this.drag.cancel();
    //绘制完了新建一个viewObj图册对象
    const writeObj = this.writeFactory.done();
    writeObj.then((value) => {
      if (value) {
        this.addViewObject(value);
      }
    });

    if ((this.selectedViewObject ?? false) && this._inObjectArea) {
      this.selectedViewObject.onUp(this.paint);
      //鼠标|手指抬起时提交一次操作
      this.recorder.commit();
    }
    setTimeout(() => this.update(), 100);
    this._inObjectArea = false;
  }

  public onWheel(e: WheelEvent): void {
    const { deltaY } = e;
    if (this.selectedViewObject != null) {
      if (deltaY < 0) this.selectedViewObject.enlarge();
      else this.selectedViewObject.narrow();
    }
    this.update();
  }

  /**
   * 传入一个Vector坐标判断是否选中了图册
   * @param event
   */
  private clickViewObject(event: Vector | Vector[]): ViewObject {
    const selectedViewObject: ViewObject = CatchPointUtil.catchViewObject(
      this.ViewObjectList,
      event
    );
    if (selectedViewObject ?? false) {
      //背景不给选中
      if(selectedViewObject.isBackground)return this.selectedViewObject;
      this.debug(["选中了", selectedViewObject]);
      this.callHook("onSelect", selectedViewObject);
      this._inObjectArea = true;
      //之前是否有被选中图层 如果有就取消之前的选中
      if (
        this.selectedViewObject &&
        selectedViewObject.key != this.selectedViewObject.key
      ) {
        this.selectedViewObject.cancel();
        //换的时候不需要
        //   this.callHook("onCancel", this.selectedViewObject);
      }
      this.selectedViewObject = selectedViewObject;
      //选中后变为选中状态
      this.selectedViewObject.onSelected();
      //不允许在锁定时被拖拽选中进行操作
      if (!selectedViewObject.isLock)
        this.drag.catchViewObject(this.selectedViewObject.rect, event);
      return selectedViewObject;
    }
    return null;
  }

  private correctEventPosition(vector: GestiEventParams): Vector | Vector[] {
    let _vector: Vector[] = new Array<Vector>();
    if (Array.isArray(vector)) {
      vector.map((item: Vector) => {
        _vector.push(item.sub(this.offset));
      });
      return _vector;
    }
    return vector.sub(this.offset);
  }
  private checkFuncButton(eventPosition: Vector): boolean {
    const _button: Button | boolean =
      this.selectedViewObject.checkFuncButton(eventPosition);
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
  private callHook(type: GestiControllerListenerTypes, arg = null) {
    this.listen.callHooks(type, arg);
  }

  private addViewObject(obj: ViewObject): void {
    this.ViewObjectList.push(obj);
    this.callHook("onLoad", obj);
    this.update();
    // this.tool.arrangeLayer(this.ViewObjectList,obj,obj.);
  }
  public update() {
    //休眠不执行任何操作
    if (this.sleep) return;
    /**
     * 在使用绘制对象时，根据值来判断是否禁止重绘
     */
    //  if (this.writeFactory.current?.disableCanvasUpdate) return;
    this.debug("Update the Canvas");
    this.callHook("onUpdate", null);
    this.paint.clearRect(
      0,
      0,
      this.canvasRect.size.width,
      this.canvasRect.size.height
    );
    //当前显示标记数组初始化数据，且需要实时更新
    if (this.currentViewObjectState.length != this.ViewObjectList.length) {
      this.currentViewObjectState.push(1);
    }
    this.ViewObjectList.forEach((item: ViewObject, ndx: number) => {
      if (!item.disabled) {
        //扫除
        this.cleaning(item);
        item.update(this.paint);
      } else if (this.currentViewObjectState[ndx] == 1) {
        //标记过后不会再次标记
        this.currentViewObjectState[ndx] = 0;
        item.cancel();
        this.callHook("onHide", item);
      }
    });
  }
  /**
   * 扫除没用的对象，根据大小判断
   * 清扫细微到不可见的对象
   * @param item
   */
  private cleaning(item: ViewObject) {
    if (item && item.rect) {
      const { width, height } = item.rect.size;
      if (width <= 3 && height <= 3) item.hide();
    }
  }
  /**
   * @description 新增图片
   * @param ximage
   * @returns
   */
  public addImage(ximage: XImage): Promise<ViewObject> {
    this.debug("Add a Ximage");
    if (ximage.constructor.name != "XImage") throw Error("不是XImage类");
    const image: XImage = ximage;
    const imageBox: ImageBox = new ImageBox(image);
    imageBox.center(this.canvasRect.size);
    this.addViewObject(imageBox);
    setTimeout(() => {
      this.update();
    }, 100);
    return Promise.resolve(imageBox);
  }
  /**
   * @description 新增文字
   * @param text
   * @param options
   * @returns
   */
  public addText(text: string, options?: textOptions): Promise<ViewObject> {
    const textBox: TextBox = new TextBox(text, options);
    textBox.center(this.canvasRect.size);
    this.addViewObject(textBox);
    //测试
    // this.selectedViewObject=textBox;
    // this.selectedViewObject.onSelected()
    setTimeout(() => {
      this.update();
    }, 100);
    return Promise.resolve(textBox);
  }
  public addWrite(options: {
    type: "circle" | "write" | "line" | "rect" | "none";
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): void {
    this.writeFactory.setConfig(options);
  }
  private debug(message: any): void {
    if (!this.isDebug) return;
    if (Array.isArray(message)) console.warn("Gesti debug: ", ...message);
    else console.warn("Gesti debug: ", message);
  }
}

class _Tools {
  /**
   * @description 传入 @ViewObject 对象，设置该对象的layer层级
   * @param selectedViewObject
   */
  public arrangeLayer(
    ViewObjectList: Array<ViewObject>,
    selectedViewObject: ViewObject,
    operationType: LayerOperationType
  ): void {
    /**
     * 层级重构算法，使用换位
     * 如选中了第3个 @ViewObject ，就将第3个和第一个互换位置
     */
    const ndx = ViewObjectList.findIndex(
      (item: ViewObject) => item.key === selectedViewObject.key
    );
    const len = ViewObjectList.length - 1;
    // 0为底部   len为顶部
    switch (operationType) {
      case LayerOperationType.top:
        {
          let temp = ViewObjectList[len];
          temp.setLayer(ndx);
          selectedViewObject.setLayer(len);
          // ViewObjectList[len] = selectedViewObject;
          // ViewObjectList[ndx] = temp;
        }
        break;
      case LayerOperationType.bottom:
        {
          let temp = ViewObjectList[0];
          temp.setLayer(ndx);
          selectedViewObject.setLayer(0);
          // ViewObjectList[0] = selectedViewObject;
          // ViewObjectList[ndx] = temp;
        }
        break;
      case LayerOperationType.rise:
        {
          if (ndx == len) break;
          let temp = ViewObjectList[ndx + 1];
          temp.setLayer(ndx);
          selectedViewObject.setLayer(ndx + 1);
          // ViewObjectList[ndx + 1] = selectedViewObject;
          // ViewObjectList[ndx] = temp;
        }
        break;
      case LayerOperationType.lower:
        {
          if (ndx == 0) break;
          const temp = ViewObjectList[ndx - 1];
          temp.setLayer(ndx);
          selectedViewObject.setLayer(ndx - 1);
          // ViewObjectList[ndx - 1] = selectedViewObject;
          // ViewObjectList[ndx] = temp;
        }
        break;
    }
    this.sortByLayer(ViewObjectList);
  }
  /**
   * @description 根据layer排序
   * @param ViewObjectList 
   */
  public sortByLayer(ViewObjectList: Array<RenderObject>):void{
    ViewObjectList.sort((a:ViewObject,b:ViewObject)=>a.getLayer()-b.getLayer());
  }
  public fallbackViewObject(
    ViewObjectList: Array<ViewObject>,
    node: RecordNode,
    kit: ImageToolkit
  ) {
    if (node == null) return;
    const obj: ViewObject = ViewObjectList.find((item: ViewObject) => {
      return item.key == node.key;
    });
    if (obj) {
      switch (node.type) {
        case "position":
          obj.rect.position = node.data;
          break;
        case "angle":
          obj.rect.setAngle(node.data);
          break;
        case "scale":
          obj.rect.setScale(node.data);
          break;
        case "size":
          obj.rect.setSize(node.data.width, node.data.height);
          break;
        case "drag":
          {
            obj.rect.setSize(node.data.size.width, node.data.size.height);
            obj.rect.setAngle(node.data.angle);
          }
          break;
      }
      obj.didFallback();
    }
    kit.update();
  }
}
export default ImageToolkit;
