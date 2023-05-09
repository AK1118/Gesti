declare interface gesticonfig{
  auxiliary?: boolean,
}
declare interface textOptions {
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  color?: string;
  linesMarks?: Array<number>;
  lineWidth?: number;
  lineColor?: string;
  lineOffsetY?: number;
}
declare interface createImageOptions {
  data?:
    | HTMLImageElement
    | SVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | Blob
    | ImageData
    | ImageBitmap
    | OffscreenCanvas;
  originData?: any;
  options?: createImageOptions;
  width?: number;
  height?: number;
  scale?: number;
  maxScale?: number;
  minScale?: number;
}
declare interface Rect{
  readonly key: string;
  get position(): Vector;
  get getAngle(): number ;
  get scale(): number ;
  get size(): Size;
  setPosition(position: Vector):void;
  setSize(width:number,height:number):void;
  setScale(scale: number): void ;
  setSize(width: number, height: number): void;
  setAngle(angle: number, isDrag?: boolean): void;
  copy(key?: string):Rect;
}
declare class ImageToolkit {}
declare class ViewObject {
  getBaseInfo():Object;
  rect:Rect;
}
declare class XImage {
  originData: any;
  data: any;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  constructor(params: createImageOptions);
  toJson(): rectparams;
}
declare type CenterAxis = "vertical" | "horizon";

declare class Gesti{
  constructor(config?:gesticonfig);
  get controller():GestiController;
  init(canvas: HTMLCanvasElement, paint: CanvasRenderingContext2D , rect: {
    x?: number,
    y?: number,
    width: number,
    height: number,
}):Gesti;
}

declare class GestiController {
  /**
   * @ImageToolkit
   * @private
   */
  private kit;
  constructor(kit: ImageToolkit);
  rotate(angle: number): Promise<void>;
  upward(viewObject?: ViewObject): number;
  downward(viewObject?: ViewObject): number;
  leftward(viewObject?: ViewObject): number;
  rightward(viewObject?: ViewObject): number;
  importAll(json: string): Promise<void>;
  exportAll(): Promise<string>;
  addWrite(options: {
    type: "circle" | "write" | "line" | "rect" | "none";
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): void;
  addListener(
    listenType: "onSelect" | "onHide" | "onCancel",
    callback: (obj: any) => void
  ): void;
  updateText(text: string, options?: textOptions): void;
  center(axis?: CenterAxis): void;
  addText(
    text: string,
    options?: textOptions
  ): Promise<boolean>;
  cancel(): void;
  cancelAll(): void;
  layerLower(): void;
  layerRise(): void;
  layerTop(): void;
  layerBottom(): void;
  update(): void;
  cancelEvent(): void;
  deLock(): void;
  lock(): void;
  fallback(): void;
  cancelFallback(): void;
  /**
   * 获取当前选中对象
   */
  get currentViewObject():Promise<ViewObject>;
  /**
   * @param {Event} e
   * @description  点击
   * @public
   */
  down(e: MouseEvent | Event | EventHandle): void;
  /**
   * @param {Event} e
   * @description 移动
   * @public
   */
  move(e: MouseEvent | Event | EventHandle): void;
  /**
   * @param {Event} e
   * @description 抬起
   * @public
   */
  up(e: MouseEvent | Event | EventHandle): void;
  /**
   * @param {Event} e
   * @description 鼠标滚轮
   * @public
   */
  wheel(e: MouseEvent | Event | EventHandle): void;
  /**
   * @param {Event} e
   * @param {Function} callback
   * @description 判断是移动端还是Pc端
   * @private
   */
  private eventTransForm;
  /**
   * @param {Array<Event>} touches
   * @return Array<Vector>
   */
  private twoFingers;
  /**
   * @param {Event} _e
   * @param {Function} callback
   * @description 移动端分为微信和browser
   * @private
   */
  private action;
  addImage(ximage: XImage | Promise<XImage>): Promise<boolean>;
  /**
   * @description 根据传入的image生成一个 @ImageBitmap 实例，拿到图片的宽高数据，创建XImage对象
   * @param image
   * @param options
   * @returns Promise< @XImage >
   */
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
  ): Promise<XImage>;
}
