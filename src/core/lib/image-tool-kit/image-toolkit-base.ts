import ViewObject from "../../abstract/view-object";
import Drag from "../../../utils/event/drag";
import { GestiEvent } from "../../../utils/event/event";
import Gesture from "../../../utils/event/gesture";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import WriteFactory from "../../viewObject/write/write-factory";
import ScreenUtils from "@/utils/screenUtils/ScreenUtils";
import { GestiControllerListenerTypes } from "@/types/controller";
import Listeners from "../listener";
import _Tools from "./utils";
import RenderObjectBase from "../rendering/object";
export enum EventHandlerState {
  down,
  up,
  move,
}
abstract class ImageToolkitBase {
  protected readonly key: string = "test"; // Math.random().toString(16).substring(2);
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
  private _focusedViewObject: ViewObject = null;
  get focusedViewObject(): ViewObject {
    return this._focusedViewObject;
  }
  set focusedViewObject(view: ViewObject) {
    this._focusedViewObject = view;
    this.markNeedsCompileLayer();
  }
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
  protected setlayers(viewObjectArray: Array<ViewObject>) {
    this._viewObjectList = viewObjectArray;
  }
  protected cleanlayers(): void {
    this._viewObjectList = [];
  }
  get layers(): Array<ViewObject> {
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
  public getCanvasRect(): Rect {
    return this.canvasRect;
  }
  public getViewObjects() {
    return this.layers;
  }
  //上一次是否渲染完成
  private preRenderFinished: boolean = true;
  private lowerCompileLayer: CompileRenderLayer = new CompileRenderLayer();
  private upperCompileLayer: CompileRenderLayer = new CompileRenderLayer();
  private middleCompileLayer: CompileRenderLayer = new CompileRenderLayer();
  private preRenderDate: number = +new Date();
  get canRender(): boolean {
    const nowDate = +new Date();
    return nowDate - this.preRenderDate > 1000 / 90;
  }
  public render() {
    if (!this.canRender) return;
    /**
     * 在使用绘制对象时，根据值来判断是否禁止重绘
     */
    this.debug("Update the Canvas");
    this.callHook("onUpdate", null);
    // this.paint.clearRect(
    //   0,
    //   0,
    //   this.canvasRect.size.width,
    //   this.canvasRect.size.height
    // );

    //当前显示标记数组初始化数据，且需要实时更新
    if (this.currentViewObjectState.length != this.layers.length) {
      this.currentViewObjectState.push(1);
    }
    /**
     * 元素显示条件   mounted&&!disabled
     * 当为disabled时不会被清除，只是被隐藏，可以再次显示
     * 当mounted为false时，从kit中删除该对象。
     */
    this.paint.save();
    //适配屏幕分辨率
    if (this.screenUtils)
      this.paint.scale(this.screenUtils.devScale, this.screenUtils.devScale);
    this.lowerCompileLayer.render(this.paint);
    this.layers.forEach((item: ViewObject, ndx: number) => {
      if (!item.disabled) {
        //扫除
        if (item.selected) {
          this.middleCompileLayer.updateFrame();
          this.middleCompileLayer.render(this.paint);
        }
        this.paint.drawSync();
        this.currentViewObjectState[ndx] = 1;
      } else if (this.currentViewObjectState[ndx] == 1) {
        //标记过后不会再次标记
        this.currentViewObjectState[ndx] = 0;
        item.cancel();
        this.callHook("onHide", item);
        this.paint.drawSync();
      }
    });
    this.upperCompileLayer.render(this.paint);
    this.focusedViewObject?.performRenderSelected(this.paint);
    this.paint.restore();
    this.preRenderDate = +new Date();
  }
  private performRender() {}
  protected markNeedsCompileLayer(): void {
    const view = this.focusedViewObject;
    const canvasSize = this.getCanvasRect().size;
    this.lowerCompileLayer.update(canvasSize.width, canvasSize.height);
    this.upperCompileLayer.update(canvasSize.width, canvasSize.height);
    this.middleCompileLayer.update(canvasSize.width, canvasSize.height);
    this.handleCompileLayers(view);
  }
  protected handleCompileLayers(currentView: ViewObject) {
    //没有任何选中时合成所有帧
    if (!currentView) {
      this.lowerCompileLayer.performCompileRender(this.layers);
      return;
    }
    const currentNdx = this.layers.findIndex(
      (item) => item.key === currentView.key
    );
    this.lowerCompileLayer.performCompileRender(
      this.getLowerLayers(currentNdx)
    );
    this.upperCompileLayer.performCompileRender(
      this.getUpperLayers(currentNdx)
    );
    if (currentView) {
      this.middleCompileLayer.performCompileRender([currentView]);
    }
  }
  private getLowerLayers(currentNdx: number) {
    return this.layers.slice(0, currentNdx);
  }
  private getUpperLayers(currentNdx: number) {
    return this.layers.slice(currentNdx + 1, this.layers.length);
  }
  public getScreenUtil(): ScreenUtils {
    return this.screenUtils;
  }
  public focus(view: ViewObject) {
    this.focusedViewObject = view;
    this.callHook("onSelect", view);
  }
  public blur() {
    this.focusedViewObject = null;
  }
}

class CompileRenderLayer {
  private canvas: OffscreenCanvas;
  private painter: Painter;
  private initialized: boolean = false;
  private width: number = 0;
  private height: number = 0;
  private layers: Array<ViewObject> = [];
  public update(
    width: number = this.canvas.width,
    height: number = this.canvas.height
  ) {
    this.canvas = new OffscreenCanvas(width, height);
    const g: OffscreenCanvasRenderingContext2D = this.canvas.getContext(
      "2d"
    ) as OffscreenCanvasRenderingContext2D;
    this.painter = new Painter(g);
    this.initialized = true;
    this.width = width;
    this.height = height;
  }
  render(paint: Painter) {
    if (!this.initialized) return;
    console.log("渲染合成图层");
    paint.deepDrawImage(
      this.canvas,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
  public performCompileRender(layers: Array<ViewObject>) {
    if (!this.initialized || layers.length === 0) return;
    layers.forEach((_) => {
      _.render(this.painter);
    });
    this.layers = layers;
    console.log("合成", layers.length);
  }
  //清除画布，再次渲染当前帧
  public updateFrame() {
    if (!this.initialized || this.layers.length === 0) return;
    console.log("清空");
    this.painter.clearRect(0, 0, this.width, this.height);
    this.performCompileRender(this.layers);
  }
}
export default ImageToolkitBase;
