

//uniapp
declare const uni: any;
//微信小程序
declare const wx: any;
//抖音小程序
declare const tt: any;
declare var document: Document;
declare interface EventHandle {}
declare class Size {
  width: number;
  height: number;
  constructor(width: number, height: number);
  toVector(): Vector;
  copy(): Size;
  static get zero(): Size;
}
declare interface CanvasRenderingContext2D {
  draw(): void;
}
declare interface Offset {
  offsetX: number;
  offsetY: number;
}
declare interface RectParams {
  x?: number;
  y?: number;
  width: number;
  height: number;
  angle?:number,
}


declare class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number);
  add(v: Vector): void;
  sub(v: Vector): this;
  mult(v: Vector): this;
  div(v: Vector): this;
  mag(): number;
  dist(v: Vector): number;
  normalize(): this;
  clamp(c: [max: number, min: number]): void;
  copy(): Vector;
  set(v: Vector): void;
  setXY(x: number, y: number): void;
  toJson(): { x: number; y: number };
  toArray(): number[];
  equals(v: Vector): boolean;
  troweling(): Vector;
  static dist(v1: Vector, v2: Vector): number;
  static mag(v: Vector): number;
  static sub(v1: Vector, v2: Vector): Vector;
  static add(v1: Vector, v2: Vector): Vector;
  static troweling(v: Vector): Vector;
  static get zero(): Vector;
  half(): Vector;
  toZero(): void;
  double(): Vector;
}



declare interface GestiEventParams {
  v: Vector | Vector[];
  sub(v: Vector): Vector;
}

declare interface GestiEventFunction {
  (params: GestiEventParams): void;
}

declare interface createImageOptions {
  /**
   * 图片数据源，确保你的数据源能正确的显示到canvas上后再添加进来
   */
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
  /**
   * 宽度
   */
  width?: number;
  /**
   * 高度
   */
  height?: number;
  /**
   * 缩放倍数
   */
  scale?: number;
  /**
   * 最大放大倍数
   */
  maxScale?: number;
  /**
   * 最小缩小倍数
   */
  minScale?: number;
  /**
   * 图片原始宽度
   */
  fixedWidth?: number;
  /**
   * 图片原始高度
   */
  fixedHeight?: number;
  /**
   * 图片网络地址
   */
  url?:string,
}

declare interface XImageOptions {
  /**
   * 图片数据源
   */
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
  /**
   * 宽度
   */
  width?: number;
  /**
   * 高度
   */
  height?: number;
  /**
   * 缩放倍数
   */
  scale?: number;
  /**
   * 最大放大倍数
   */
  maxScale?: number;
  /**
   * 最小缩小倍数
   */
  minScale?: number;
  /**
   * 图片原始宽度
   */
  fixedWidth?: number;
  /**
   * 图片原始高度
   */
  fixedHeight?: number;
}



declare type CenterAxis = "vertical" | "horizon";

declare type GestiControllerListenerTypes =
  | "onSelect"
  | "onHide"
  | "onCancel"
  | "onHover"
  | "onLeave"
  | "onUpdate"
  | "onLoad"
  | "onDestroy"
  | "onMirror"
  | "onBeforeDestroy"
  | "onCreateGraffiti";


declare type GraffitiType = "circle" | "write" | "line" | "rect" | "none";


declare type Boundary = {
  x: number;
  y: number;
  width: number;
  height: number;
};
declare interface Delta {
  readonly deltaX: number;
  readonly deltaY: number;
}
declare interface TextSingle {
  text: string;
  texts?: Array<TextSingle>;
  width: number;
  height: number;
  next?:boolean
}
declare interface FixedOption {
  fontSize: number;
  maxWidth: number;
}

/**
 * @description 导出平台，导出只有两个平台
 */
declare type PlatformType = "WeChat" | "Browser";