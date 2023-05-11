declare interface gesticonfig{
  auxiliary?: boolean,
  dashedLine?:boolean,
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
  lineHeight?:number,
  width?:number,
  height?:number,
}
declare interface createImageOptions {
  data:
    | HTMLImageElement
    | SVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | Blob
    | ImageData
    | ImageBitmap
    | OffscreenCanvas;
  originData?: any;
  options: createImageOptions;
  width: number;
  height: number;
  scale?: number;
  maxScale?: number;
  minScale?: number;
}
declare enum ViewObjectFamily{
  image,
  write,
  text,
}
export declare interface Rect{
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

export declare class ViewObject {
  getBaseInfo():Object;
  rect:Rect;
  get value():any;
  family:ViewObjectFamily;
  name:string;
  setName(name:string):void;
}
export declare interface XImage {
  new(params: createImageOptions):XImage;
  constructor(params: createImageOptions):XImage;
  originData: any;
  data: any;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  toJson(): rectparams;
}

export declare type CenterAxis = "vertical" | "horizon";

declare class Gesti{
  new(config?:gesticonfig):Gesti;
  constructor(config?:gesticonfig);
  get controller():GestiController;
  static Family:ViewObjectFamily;
  static XImage:XImage;
  /**
   * canvas必传，在h5端时paint可不传
   * 关于rect  width 和 height 对应的是canvas的高宽   而 x,y其实对应的是canvas在屏幕的位置，或者可以理解为偏移量
   * @param canvas 
   * @param paint 
   * @param rect 
   */
  init( canvas: HTMLCanvasElement|null,
    paint?: CanvasRenderingContext2D|null,
    rect?:{
      x?: number;
      y?: number;
      width: number;
      height: number;
    }):void;
}
/**
 * 添加监听
 */
declare type GestiControllerListenerTypes="onSelect" | "onHide" | "onCancel"|"onHover";
export declare class GestiController {
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
    listenType: GestiControllerListenerTypes,
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



export declare const onSelected:(hook:()=>any)=>void;
export declare const createGesti:()=>Gesti;


export default Gesti;