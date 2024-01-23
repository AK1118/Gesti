import Button, { BaseButton } from "../abstract/baseButton";
import ViewObject from "../abstract/view-object";
import CatchPointUtil from "../../utils/event/catchPointUtil";
import Drag from "../../utils/event/drag";
import { FuncButtonTrigger, ViewObjectFamily } from "../enums";
import GestiEventManager, { GestiEvent } from "../../utils/event/event";
import Gesture from "../../utils/event/gesture";
import GestiController from "../interfaces/gesticontroller";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text/text";
import WriteFactory from "../viewObject/write/write-factory";
import { ViewObject as ViewObjectD } from "@/types/gesti";
import XImage from "./ximage";
import {
  ViewObjectExportEntity,
  ViewObjectExportWrapper,
  ViewObjectImportEntity,
} from "@/types/serialization";
import {
  ExportAllInterceptor,
  GraffitiCloser,
  ImportAllInterceptor,
  InitializationOption,
  TextOptions,
} from "@/types/gesti";
import WriteViewObj from "../viewObject/write";
import ScreenUtils from "@/utils/screenUtils/ScreenUtils";
import { ScreenUtilOption } from "Gesti";
import Platform from "../viewObject/tools/platform";
import Deserializer from "@/utils/deserializer/Deserializer";
import Plugins from "./plugins";
import OffScreenCanvasBuilder from "./plugins/offScreenCanvasGenerator";
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
abstract class ImageToolkitBase {
  //屏幕适配  默认不适配
  protected screenUtils: ScreenUtils;
  //所有图层集合
  protected _viewObjectList: Array<ViewObject> = new Array<ViewObject>();
  //手势监听器
  protected eventHandler: GestiEvent;
  //手势状态
  protected eventHandlerState: EventHandlerState = EventHandlerState.up;
  //拖拽代理器
  protected drag: Drag = new Drag();
  //手势处理识别器
  protected gesture: Gesture = new Gesture();
  //当前选中的图层
  protected selectedViewObject: ViewObject = null;
  //canvas偏移量
  protected offset: Vector;
  //画布矩形大小
  protected canvasRect: Rect;
  //画笔代理类 canvasContext 2d
  protected paint: Painter;
  //是否debug模式
  public isDebug: boolean = false;
  /**
   * 本次点击是否有选中到对象，谈起时需要置于false
   */
  protected _inObjectArea: boolean = false;
  /**
   * 工具
   */
  protected tool: _Tools = new _Tools();
  protected listen: Listeners = new Listeners();
  /**
   * 目前图层的显示状态，0表示隐藏，1表示显示
   */
  protected currentViewObjectState: Array<0 | 1> = [];
  //绘制对象工厂  //绘制对象，比如签字、矩形、圆形等
  protected writeFactory: WriteFactory;
  protected hoverViewObject: ViewObject = null;
  protected setViewObjectList(viewObjectArray: Array<ViewObject>) {
    this._viewObjectList = viewObjectArray;
  }
  protected cleanViewObjectList(): void {
    this._viewObjectList = [];
  }
  get ViewObjectList(): Array<ViewObject> {
    return this._viewObjectList;
  }
  protected debug(message: any): void {
    if (!this.isDebug) return;
    if (Array.isArray(message)) console.warn("Gesti debug: ", ...message);
    else console.warn("Gesti debug: ", message);
  }

  protected callHook(type: GestiControllerListenerTypes, arg = null) {
    this.listen.callHooks(type, arg);
  }
  /**
   * 扫除没用的对象，根据大小判断
   * 清扫细微到不可见的对象
   * @param item
   */
  private cleaning(item: ViewObject) {
    // if (item && item.rect) {
    //   const { width, height } = item.rect.size;
    //   if (width <= 3 && height <= 3) item.unMount();
    // }
  }
  public getCanvasRect(): Rect {
    return this.canvasRect;
  }
  public getViewObjects() {
    return this.ViewObjectList;
  }
  public render() {
    /**
     * 在使用绘制对象时，根据值来判断是否禁止重绘
     */
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
    /**
     * 元素显示条件   mounted&&!disabled
     * 当为disabled时不会被清除，只是被隐藏，可以再次显示
     * 当mounted为false时，从kit中删除该对象。
     */
    this.ViewObjectList.forEach((item: ViewObject, ndx: number) => {
      if (!item.disabled) {
        //扫除
        this.cleaning(item);
        item.render(this.paint);
      } else if (this.currentViewObjectState[ndx] == 1) {
        //标记过后不会再次标记
        this.currentViewObjectState[ndx] = 0;
        item.cancel();
        this.callHook("onHide", item);
      }
    });
  }
  public getScreenUtil(): ScreenUtils {
    return this.screenUtils;
  }
}

class ImageToolkit extends ImageToolkitBase implements GestiController {
  constructor(option: InitializationOption) {
    super();
    const {
      x: offsetX,
      y: offsetY,
      canvasWidth,
      canvasHeight,
    } = option?.rect || {};
    this.offset = new Vector(offsetX || 0, offsetY || 0);
    this.canvasRect = new Rect({
      x: this.offset.x,
      y: this.offset.y,
      width: canvasWidth,
      height: canvasHeight,
    });
    this.paint = new Painter(option.renderContext);
    this.writeFactory = new WriteFactory(this.paint);
    this.bindEvent();
  }
  cancelGesture(): void {
    this.gesture.disable();
  }
  getViewObjectByIdSync<T extends ViewObject>(id: string): T {
    const arr = this.ViewObjectList;
    const obj: T | null = arr.find((item) => item.id === id) as T;
    return obj;
  }
  generateScreenUtils(option: ScreenUtilOption): ScreenUtils {
    //只要生成了必须使用屏幕适配器
    this.screenUtils = new ScreenUtils(option);
    return this.screenUtils;
  }

  remove(view?: ViewObject): boolean {
    const _view = this.selectedViewObject || view;
    if (!_view) return false;
    this.setViewObjectList(
      this.ViewObjectList.filter((_) => _.key != _view.key)
    );
    this.callHook("onRemove", null);
    this.render();
    return true;
  }
  getAllViewObject(): ViewObject[] {
    return this.ViewObjectList;
  }
  getAllViewObjectSync(): Promise<ViewObject[]> {
    return Promise.resolve(this.ViewObjectList);
  }

  mount(view: ViewObject): void {
    this.load(view);
  }
  unMount(view: ViewObject): void {
    const result: boolean = this.deleteViewObject(
      view || this.selectedViewObject
    );
    if (result) this.render();
  }
  //返回删除结果
  private deleteViewObject(view: ViewObject): boolean {
    if (!view) return false;
    const key: string | number = view.key;
    const newList: Array<ViewObject> = this.ViewObjectList.filter(
      (_) => _.key !== key
    );
    this.setViewObjectList(newList);
    return false;
  }

  update(): void {
    this.render();
  }
  //隐藏某个对象
  close(view?: ViewObject): void {
    if (!view) this.selectedViewObject?.hide?.();
    view?.hide?.();
    this.render();
  }
  //镜像某个对象
  mirror(view?: ViewObject): boolean {
    if (!view) {
      const isMirror: boolean = this.selectedViewObject?.mirror?.();
      this.render();
      this.callHook("onMirror", isMirror);
      return isMirror;
    }
    const isMirror: boolean = view.mirror();
    this.render();
    this.callHook("onMirror", isMirror);
    return isMirror;
  }
  setBoundary(boundaryRect: Boundary): void {
    throw new Error("Method not implemented.");
  }
  querySelector(
    select: string | ViewObjectFamily
  ): Promise<ViewObject | ViewObject[]> {
    throw new Error("Method not implemented.");
  }
  getViewObjectById<T extends ViewObject>(id: string): Promise<T> {
    const arr = this.ViewObjectList;
    const obj: T | null = arr.find((item) => item.id === id) as T;
    return Promise.resolve<T>(obj);
  }
  public getPainter(): Painter {
    return this.paint;
  }
  position(x: number, y: number, view?: ViewObject): void {
    if (view) {
      view.setPosition(x, y);
    }
    this.selectedViewObject?.setPosition(x, y);
    this.render();
  }
  /**
   * @description 清空所有元素
   * @returns
   */
  cleanAll(): Promise<void> {
    return new Promise((r, v) => {
      this.cleanViewObjectList();
      this.render();
      r();
    });
  }
  destroyGesti(): void {
    this.callHook("onBeforeDestroy");
    this.cleanAll();
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
      this.render();
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
    this.render();
    return Promise.resolve(null);
  }
  upward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.y -= 1;
      return viewObject.position.y;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.position.y -= 1;
    return this.selectedViewObject.position.y;
  }
  downward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.y += 1;
      return viewObject.position.y;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.position.y += 1;
    return this.selectedViewObject.position.y;
  }
  leftward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.x -= 1;
      return viewObject.position.x;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.position.x -= 1;
    return this.selectedViewObject.position.x;
  }
  rightward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.x += 1;
      return viewObject.position.x;
    }
    if (!this.selectedViewObject) return null;
    this.selectedViewObject.position.x += 1;
    return this.selectedViewObject.position.x;
  }
  /**
   * @description 导入json解析成对象  H5
   * @param json
   * @returns
   */
  async importAll(
    json: string,
    interceptor: ImportAllInterceptor = (views: Array<any>) =>
      Promise.resolve(views as Array<ViewObjectD>)
  ): Promise<void> {
    return new Promise(async (r, j) => {
      try {
        if (!json)
          throw Error("Can not deserialization,because Json is empty.");
        const jsonObj = JSON.parse(json);
        const wrapperEntity: ViewObjectExportWrapper = jsonObj;
        const info = wrapperEntity.info;
        const entities: Array<ViewObjectExportEntity> = wrapperEntity.entities;
        if (info.screen) {
          //屏幕适配器大小需要变为自己的大小
          /**
           * - 双方设计稿大小必须一致
           * - 计算新的屏幕适配尺寸之前必须根据适配因子还原绝对大小
           */
          this.screenUtils = this.generateScreenUtils({
            ...info.screen,
            canvasWidth: this.canvasRect.size.width,
            canvasHeight: this.canvasRect.size.height,
          });
        }
        //还原另一端的屏幕适配器
        const otherScreenUtils = ScreenUtils.format(info.screen);
        //反序列化
        const deserializer = new Deserializer(this, otherScreenUtils);
        const temp: Array<ViewObject> = [];
        for await (const item of entities) {
          const importEntity: ViewObjectImportEntity = item;
          const obj: ViewObject = await deserializer.getObjectByJson(
            importEntity
          );
          if (obj) temp.push(obj);
        }
        //携所有解析数据调用拦截器
        await interceptor?.(temp as any);
        temp.forEach((_) => this.load(_));
        this.render();
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
    exportAllInterceptor: ExportAllInterceptor = (
      _: Array<ViewObjectExportEntity>
    ): Promise<Array<ViewObjectExportEntity>> => Promise.resolve(_)
  ): Promise<string> {
    return new Promise(async (r, j) => {
      try {
        const viewObjectList: Array<ViewObjectExportEntity> = [];
        for await (const item of this.ViewObjectList) {
          if (item.disabled) continue;
          const exportEntity = await item.export();
          viewObjectList.push(exportEntity);
        }
        const exportWrapper: ViewObjectExportWrapper = {
          entities: await exportAllInterceptor?.(viewObjectList),
          info: {
            platform: Platform.platform,
            screen: this.screenUtils?.toJSON(),
          },
        };
        r(JSON.stringify(exportWrapper));
      } catch (error) {
        j(error);
      }
    });
  }
  updateText(text: string, options?: TextOptions): void {
    //const isTextBox = classTypeIs(this.selectedViewObject, TextBox);
    const isTextBox: boolean =
      this.selectedViewObject?.family === ViewObjectFamily.text;
    if (isTextBox) {
      const view: TextBox = this.selectedViewObject as TextBox;
      view.setDecoration(options ?? {});
      view.setText(text);
      this.render();
      this.callHook("onUpdateText", view);
    }
  }
  center(view?: ViewObject, axis?: CenterAxis): void {
    if (view) view.center(this.canvasRect.size, axis);
    else this.selectedViewObject?.center(this.canvasRect.size, axis);
    this.render();
  }
  cancel(view?: ViewObject): void {
    const _view = view || this.selectedViewObject;
    if (_view) {
      if (_view.key == this.selectedViewObject.key)
        this.selectedViewObject = null;
      _view?.cancel();
      this.callHook("onCancel", _view);
    }
    this.render();
  }
  cancelAll(): void {
    this.ViewObjectList.forEach((item: ViewObject) => item.cancel());
    this.render();
  }
  layerLower(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(
      this.ViewObjectList,
      _view,
      LayerOperationType.lower
    );
    this.render();
  }
  layerRise(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(this.ViewObjectList, _view, LayerOperationType.rise);
    this.render();
  }
  layerTop(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(this.ViewObjectList, _view, LayerOperationType.top);
    this.render();
  }
  layerBottom(view?: ViewObject): void {
    let _view = view || this.selectedViewObject;
    this.tool.arrangeLayer(
      this.ViewObjectList,
      _view,
      LayerOperationType.bottom
    );
    this.render();
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
    // const node: RecordNode = await this.recorder.fallback();
    // this.tool.fallbackViewObject(this.ViewObjectList, node, this);
  }
  async cancelFallback() {
    // const node: RecordNode = await this.recorder.cancelFallback();
    // this.tool.fallbackViewObject(this.ViewObjectList, node, this);
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
    this.debug(["Event Bind,", this.eventHandler]);
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
      if (Array.isArray(event) || this.checkFuncButton(event)) {
        return;
      }
    }
    /**
     * 处理拖拽的代码块，被选中图册是检测选中的最高优先级
     * 当有被选中图层时，拖拽的必然是他，不论层级
     *
     */
    let selectedTarget: ViewObject = CatchPointUtil.catchViewObject(
      this.ViewObjectList,
      event
    );
    /**
     * 已选中图层移动优先级>涂鸦动作优先级>选中图层动作优先级
     * 没有选中的图层时执行涂鸦动作，判断涂鸦动作是否开启
     * */
    if (selectedTarget && !selectedTarget.isBackground) {
      if (selectedTarget.selected) {
        if (!selectedTarget.isLock)
          this.drag.catchViewObject(selectedTarget.rect, event);
        this.selectedViewObject = this.handleSelectedTarget(event);
        return;
      }

      //涂鸦等待且现在手机点击在已选中对象内
      if (this.writeFactory.watching && !selectedTarget.selected)
        this.writeFactory.onDraw();

      this.selectedViewObject = this.handleSelectedTarget(event);
      this.ViewObjectList.forEach((item) =>
        item.key === selectedTarget.key ? "" : item.cancel()
      );
    } else {
      //点击图像外取消选中上一个对象
      this.selectedViewObject?.cancel();
      if (this.writeFactory.watching && !selectedTarget?.selected)
        return this.writeFactory.onDraw();
    }

    // /**
    //  * 选中元素存在 且不是已选中元素,且不是锁定,且不是背景元素
    //  */
    // if (
    //   selectedViewObject &&
    //   this.selectedViewObject === selectedViewObject &&
    //   !this.selectedViewObject.isLock &&
    //   !selectedViewObject.isBackground
    // ) {
    //   this.drag.catchViewObject(selectedViewObject.rect, event);
    // }

    // /**
    //  * 已选中图层移动优先级>涂鸦动作优先级>选中图层动作优先级
    //  * */
    // if (
    //   this.selectedViewObject != selectedViewObject ||
    //   selectedViewObject == null
    // ) {
    //   this.writeFactory.onDraw();
    // }

    // /**
    //  * 按下，有选中对象
    //  */
    // const selectedTarget = this.handleSelectedTarget(event);
    // if (selectedTarget ?? false) {
    //   //判断抬起时手指是在对象范围内还是外
    //   this.selectedViewObject = selectedTarget;
    // }

    this.render();
  }
  public onMove(v: GestiEventParams): void {
    this.debug(["Event Move,", v]);
    if (this.eventHandlerState === EventHandlerState.down) {
      const event: Vector | Vector[] = this.correctEventPosition(v);

      //绘制处理,当down在已被选中的图册上时不能绘制
      if (this.writeFactory.current) {
        this.render();
        return this.writeFactory.current?.onMove(event);
      }

      //手势解析处理
      this.gesture.onMove(this.selectedViewObject, event);
      //手势
      if (Array.isArray(event)) {
        this.gesture.update(event);
        return this.render();
      }
      //拖拽
      this.drag.update(event);
      //有被选中对象才刷新
      if (this.selectedViewObject != null) this.render();
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
    const event: Vector | Vector[] = this.correctEventPosition(v);
    //判断是否选中对象
    this.eventHandlerState = EventHandlerState.up;
    //手势解析处理
    this.gesture.onUp(this.selectedViewObject, event);
    this.drag.cancel();
    //绘制完了新建一个viewObj图册对象
    const writeObj = this.writeFactory.done();
    writeObj.then((value: WriteViewObj) => {
      if (value) {
        this.selectedViewObject?.cancel();
        this.callHook("onCreateGraffiti", value);
        this.addViewObject(value);
      }
    });

    // /**
    //  * 抬起时，有选中对象
    //  */
    // const selectedTarget = this.handleSelectedTarget(event);
    // if (selectedTarget ?? false) {
    //   //判断抬起时手指是在对象范围内还是外
    //   if (this._inObjectArea) selectedTarget.onUpWithInner(this.paint);
    //   else selectedTarget.onUpWithOuter(this.paint);
    //   this.selectedViewObject = selectedTarget;
    // }
    if (this.selectedViewObject) {
      if (this._inObjectArea) this.selectedViewObject.onUpWithInner(this.paint);
      else this.selectedViewObject.onUpWithOuter(this.paint);
    }
    this.render();
    this._inObjectArea = false;
  }

  public onWheel(e: WheelEvent): void {
    const { deltaY } = e;
    if (this.selectedViewObject != null) {
      if (deltaY < 0) this.selectedViewObject.enlarge();
      else this.selectedViewObject.narrow();
    }
    this.render();
  }

  /**
   * 传入一个Vector坐标判断是否选中了图册
   * @param event
   */
  private handleSelectedTarget(event: Vector | Vector[]): ViewObject {
    const selectedViewObjectTarget: ViewObject = CatchPointUtil.catchViewObject(
      this.ViewObjectList,
      event
    );
    if (selectedViewObjectTarget ?? false) {
      this.debug(["选中了", selectedViewObjectTarget]);
      this.callHook("onSelect", selectedViewObjectTarget);
      this._inObjectArea = true;
      //之前是否有被选中图层 如果有就取消之前的选中
      if (
        this.selectedViewObject &&
        selectedViewObjectTarget.key != this.selectedViewObject.key
      ) {
        this.selectedViewObject.cancel();
      }
      //选中后变为选中状态
      selectedViewObjectTarget.onSelected();
      //不允许在锁定时被拖拽选中进行操作
      if (!selectedViewObjectTarget.isLock)
        this.drag.catchViewObject(selectedViewObjectTarget.rect, event);
      return selectedViewObjectTarget;
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
    const _button: BaseButton | boolean =
      this.selectedViewObject.checkFuncButton(eventPosition);
    const result: any = _button;
    //确保是按钮
    if (result instanceof Button) {
      this._inObjectArea = true;
      const button: BaseButton = result;
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

  /**
   * @description 获取当前所存图层长度
   * @returns number
   */
  public getViewObjectCount(): number {
    return this.ViewObjectList.length;
  }

  private addViewObject(obj: ViewObject): void {
    this.ViewObjectList.push(obj);
    obj.initialization(this);
    if (obj.getLayer() === null) obj.setLayer(this.getViewObjectCount() - 1);
    this.callHook("onLoad", obj);
    this.render();
    this.tool.sortByLayer(this.ViewObjectList);
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
    this.render();
    return Promise.resolve(imageBox);
  }
  /**
   * @description 新增文字
   * @param text
   * @param options
   * @returns
   */
  public addText(text: string, options?: TextOptions): Promise<ViewObject> {
    const textBox: TextBox = new TextBox(text, options);
    textBox.center(this.canvasRect.size);
    this.addViewObject(textBox);
    //测试
    // this.selectedViewObject=textBox;
    // this.selectedViewObject.onSelected()
    setTimeout(() => {
      this.render();
    }, 100);
    return Promise.resolve(textBox);
  }
  public addWrite(options: {
    type: "circle" | "write" | "line" | "rect" | "none";
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): GraffitiCloser {
    this.writeFactory.setConfig(options);
    return [
      () => {
        //关闭涂鸦
        this.writeFactory.close();
      },
      (callback) => {
        this.writeFactory.onCreateGraffiti.bind(this.writeFactory)(callback);
      },
    ];
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
    //对象是否在数组中
    const ndx = ViewObjectList.findIndex(
      (item: ViewObject) => item.key === selectedViewObject.key
    );
    if (ndx === -1) return;

    //所有对象数量
    const len = ViewObjectList.length - 1;

    /**
     * 排序规则，layer越大，数组下标越大
     * 向上一级操作 => layer设置为 i+i 的layer+1
     */
    switch (operationType) {
      //图层向上移，layer增大,下标增大
      // current = next+1
      case LayerOperationType.top:
        {
          if (ndx === len) break;
          const current = selectedViewObject,
            next = ViewObjectList[ndx + 1];
          current.setLayer(next.getLayer() + 1);
          // for (let i = ndx + 1; i <= len; i++) {
          //   ViewObjectList[i].setLayer(ViewObjectList[i].getLayer() - 1);
          // }
          // selectedViewObject.setLayer(len);
        }
        break;
      //图层向下移动，layer减小,下标减小
      // current=pre-1
      case LayerOperationType.bottom:
        {
          if (ndx === 0) break;
          const current = selectedViewObject,
            next = ViewObjectList[ndx - 1];
          current.setLayer(next.getLayer() - 1);
          // for (let i = ndx - 1; i >= 0; i--) {
          //   ViewObjectList[i].setLayer(ViewObjectList[i].getLayer() + 1);
          // }
          // selectedViewObject.setLayer(0);
        }
        break;
      //最高图层   current=max +1
      case LayerOperationType.rise:
        {
          // if (ndx === len) break;//
          const max = ViewObjectList[len];
          const current = selectedViewObject;
          current.setLayer(max.getLayer() + 1);
          // 交换图层
          // const tempLayer = ViewObjectList[ndx].getLayer();
          // ViewObjectList[ndx].setLayer(ViewObjectList[ndx + 1].getLayer());
          // ViewObjectList[ndx + 1].setLayer(tempLayer);
          // selectedViewObject.setLayer(ndx + 1);
        }
        break;
      //最低图层   current=min-1
      case LayerOperationType.lower:
        {
          const min = ViewObjectList[0];
          const current = selectedViewObject;
          current.setLayer(min.getLayer() - 1);
          // if (ndx === 0) break;
          // 交换图层
          // const tempLayerLower = ViewObjectList[ndx].getLayer();
          // ViewObjectList[ndx].setLayer(ViewObjectList[ndx - 1].getLayer());
          // ViewObjectList[ndx - 1].setLayer(tempLayerLower);
          // selectedViewObject.setLayer(ndx - 1);
        }
        break;
    }
    this.sortByLayer(ViewObjectList);
  }

  public sortByLayer(ViewObjectList: Array<ViewObject>): void {
    ViewObjectList.sort(
      (a: ViewObject, b: ViewObject) => a.getLayer() - b.getLayer()
    );
  }
}
export default ImageToolkit;
