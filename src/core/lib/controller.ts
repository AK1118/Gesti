import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "./image-toolkit";
import GestiController from "../interfaces/gesticontroller";
import Vector from "./vector";
import XImage from "./ximage";
import { GraffitiCloser, TextOptions } from "@/types/gesti";

declare type CenterAxis = "vertical" | "horizon";

class GesteControllerImpl implements GestiController {
  /**
   * @ImageToolkit
   * @private
   */
  private kit: ImageToolkit;
  constructor(kit: ImageToolkit) {
    //使用控制器时，取消原有控制
    this.kit = kit;
  }
  remove(view?: ViewObject): boolean {
    return this.kit.remove(view);
  }
  getAllViewObject(): ViewObject[] {
   return this.kit.getAllViewObject();
  }
  getAllViewObjectSync(): Promise<ViewObject[]> {
    return this.kit.getAllViewObjectSync();
  }
  mount(view: ViewObject): void {
    this.kit.mount(view);
  }
  unMount(view: ViewObject): void {
    this.kit.unMount(view);
  }
  
  close(view?: ViewObject): void {
    this.kit.close(view);
  }
  mirror(view?: ViewObject): boolean {
    return this.kit.mirror(view);
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
    if (!id) throw Error("Invalid id");
    return this.kit.getViewObjectById<T>(id);
  }
  /**
   * @description 设置某个对象的位置
   * @param x
   * @param y
   * @param view
   */
  position(x: number, y: number, view?: ViewObject): void {
    this.kit.position(x, y, view);
  }
  /**
   * @description 微信小程序导出
   * @param offScreenPainter 离屏画笔
   * @returns
   */
  exportAllWithWeChat(
    offScreenPainter: CanvasRenderingContext2D
  ): Promise<string> {
    return this.kit.exportAllWithWeChat(offScreenPainter);
  }
  /**
   * @description 微信小程序导入
   * @param offScreenPainter 离屏画布
   * @returns
   */
  importAllWithWeChat(json: string, weChatCanvas: any): Promise<void> {
    return this.kit.importAllWithWeChat(json, weChatCanvas);
  }
  cleanAll(): Promise<void> {
    return this.kit.cleanAll();
  }
  destroyGesti(): void {
    this.kit.destroyGesti();
  }
  removeListener(
    listenType: GestiControllerListenerTypes,
    hook: (object: any) => void
  ): void {
    this.kit.removeListener(listenType, hook);
  }
  load(view: ViewObject): void {
    return this.kit.load(view);
  }
  select(select: ViewObject): Promise<void> {
    return this.kit.select(select);
  }
  get currentViewObject(): ViewObject {
    return this.kit.currentViewObject;
  }
  rotate(angle: number, existing?: boolean, view?: ViewObject): Promise<void> {
    return this.kit.rotate(angle, existing, view);
  }
  upward(viewObject?: ViewObject): number {
    return this.kit.upward(viewObject);
  }
  downward(viewObject?: ViewObject): number {
    return this.kit.downward(viewObject);
  }
  leftward(viewObject?: ViewObject): number {
    return this.kit.leftward(viewObject);
  }
  rightward(viewObject?: ViewObject): number {
    return this.kit.rightward(viewObject);
  }
  importAll(json: string): Promise<void> {
    return this.kit.importAll(json);
  }
  exportAll(offScreenPainter: CanvasRenderingContext2D): Promise<string> {
    return this.kit.exportAll(offScreenPainter);
  }
  addWrite(options: {
    type: "circle" | "write" | "line" | "rect" | "none";
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): GraffitiCloser {
    return this.kit.addWrite(options);
  }
  addListener(
    listenType: GestiControllerListenerTypes,
    callback: (obj: any) => void,
    prepend?: boolean
  ): any {
    return this.kit.addListener(listenType, callback, prepend);
  }

  updateText(text: string, options?: TextOptions): void {
    this.kit.updateText(text, options);
  }
  center(view?: ViewObject,axis?: CenterAxis): void {
    this.kit.center( view,axis);
  }
  addText(text: string, options?: TextOptions): Promise<ViewObject> {
    return this.kit.addText(text, options);
  }
  cancel(view?: ViewObject): void {
    this.kit.cancel(view);
  }
  cancelAll(): void {
    this.kit.cancelAll();
  }

  layerLower(view?: ViewObject): void {
    this.kit.layerLower(view);
  }
  layerRise(view?: ViewObject): void {
    this.kit.layerRise(view);
  }
  layerTop(view?: ViewObject): void {
    this.kit.layerTop(view);
  }
  layerBottom(view?: ViewObject): void {
    this.kit.layerBottom(view);
  }
  render(): void {
    this.kit.render();
  }
  /**
   * @deprecated 即将废弃，请使用 render()
   */
  update(): void {
    this.render();
  }
  cancelEvent(): void {
    this.kit.cancelEvent();
  }
  unLock(view?: ViewObject): void {
    this.kit.unLock(view);
  }
  lock(view?: ViewObject): void {
    this.kit.lock(view);
  }
  fallback(): void {
    this.kit.fallback();
  }
  cancelFallback(): void {
    this.kit.cancelFallback();
  }
  /**
   * @param {Event} e
   * @description  点击
   * @public
   */
  public down(e: MouseEvent | Event | EventHandle) {
    this.eventTransForm(e, this.kit.onDown);
  }
  /**
   * @param {Event} e
   * @description 移动
   * @public
   */
  public move(e: MouseEvent | Event | EventHandle) {
    this.eventTransForm(e, this.kit.onMove);
  }
  /**
   * @param {Event} e
   * @description 抬起
   * @public
   */
  public up(e: MouseEvent | Event | EventHandle) {
    this.eventTransForm(e, this.kit.onUp, "changedTouches");
  }
  /**
   * @param {Event} e
   * @description 鼠标滚轮
   * @public
   */
  public wheel(e: MouseEvent | Event | EventHandle) {
    //只有Pc端有
    if ("touches" in e) return;
    this.kit.onWheel.bind(this.kit)(e);
  }
  /**
   * @param {Event} e
   * @param {Function} callback
   * @description 判断是移动端还是Pc端
   * @private
   */
  private eventTransForm(
    e: MouseEvent | Event | EventHandle,
    callback: Function,
    key?: string
  ) {
    if ("touches" in e) {
      //移动端
      /**
       * 移动端分为 browser 和 微信
       * 微信内没有clientX，而是 x
       */
      return this.action(e, callback, key || "");
    } else if ("clientX" in e) {
      //pc端
      const { clientX: x, clientY: y } = e;
      const vector = new Vector(x, y);
      return callback.bind(this.kit)(vector);
    }
  }
  /**
   * @param {Array<Event>} touches
   * @return Array<Vector>
   */
  private twoFingers(touches: Event | EventHandle) {
    const e1 = touches[0];
    const e2 = touches[1];
    const vector1 = new Vector(e1.clientX || e1.x, e1.clientY || e1.y);
    const vector2 = new Vector(e2.clientX || e2.x, e2.clientY || e2.y);
    return [vector1, vector2];
  }
  /**
   * @param {Event} _e
   * @param {Function} callback
   * @description 移动端分为微信和browser
   * @private
   */
  private action(_e: any, callback: any, key: string) {
    /**
     * 点击和移动事件 三个都有
     * 抬起事件只有changedTouches
     * 针对Up事件，提供以下针对方案
     */
    const touches = key
      ? _e[key]
      : _e.touches || _e.targetTouches || _e.changedTouches;
    if (touches.length >= 2) {
      callback.bind(this.kit)(this.twoFingers(touches));
    } else {
      const e = touches[0];
      const vector = new Vector(e.clientX || e.x, e.clientY || e.y);
      callback.bind(this.kit)(vector);
    }
  }
  async addImage(ximage: XImage | Promise<XImage>): Promise<ViewObject> {
    if (ximage.constructor.name == "Promise") {
      const _ximage = await ximage;
      return this.kit.addImage(_ximage);
    }
    //使用any类型强制转换
    const _ximage: XImage = ximage as any;
    return this.kit.addImage(_ximage);
  }
  /**
   * @description 根据传入的image生成一个 @ImageBitmap 实例，拿到图片的宽高数据，创建XImage对象
   * @param image
   * @param options
   * @returns Promise< @XImage >
   */
  public createImage(
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
    return new Promise(async (r, e) => {
      try {
        const bimp = await createImageBitmap(image);
        const { width, height } = bimp;
        const ximage = new XImage({
          data: bimp,
          originData: image,
          width: options?.width || width,
          height: options?.height || height,
          scale: options?.scale || 1,
          maxScale: options?.maxScale || 10,
          minScale: options?.minScale || 0.1,
        });
        r(ximage);
      } catch (error) {
        r(error);
      }
    });
  }
}

export default GesteControllerImpl;
