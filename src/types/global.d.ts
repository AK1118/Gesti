//uniapp
declare const uni: any;
//微信小程序
declare const wx: any;
//抖音小程序
declare const tt: any;
declare var document: Document;
declare interface EventHandle {}
declare interface Size {
  width: number;
  height: number;
}
declare interface CanvasRenderingContext2D {
  draw(): void;
}
declare interface Offset {
  offsetx: number;
  offsety: number;
}
declare interface RectParams {
  x?: number;
  y?: number;
  width: number;
  height: number;
}
/**
 * @description 初始化传入参数
 */
declare interface InitializationOption {
  //canvas
  canvas: HTMLCanvasElement;
  //画笔
  renderContext: CanvasRenderingContext2D | null;
  //离屏画布
  offScreenCanvas?: HTMLCanvasElement;
  //离屏画笔
  offScreenCanvasRenderContext?: CanvasRenderingContext2D | null;
  //画布矩形
  rect?: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  };
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

declare interface TextOptions {
  /**
   * 字体风格
   * 可以浏览器搜索   canvas自定义字体
   */
  fontFamily?: string;
  fontSize?: number;
  /**
   * 文字间距
   */
  spacing?: number;
  /**
   * 文字颜色
   */
  color?: string;
  /**
   * 是否显示下划线
   * @deprecated
   */
  line?: boolean;
  /**
   * 下划线粗细
   * @deprecated
   */
  lineWidth?: number;
  /**
   * 下划线颜色
   */
  lineColor?: string;
  /**
   * @deprecated
   * 下划线与文字偏移量
   */
  lineOffsetY?: number;
  /**
   * 文字间距高度
   */
  lineHeight?: number;

  width?: number;
  height?: number;
  /**
   * 如果为true,文字大小会随着选框的高而变化
   */
  resetFontSizeWithRect?: boolean;
  /**
   * 传入一个整数类型，用于限制字体大小最大值，默认不会限制
   */
  maxFontSize?: number;

  backgroundColor?: string;
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
  | "onBeforeDestroy";

declare function textHandler(options?: TextOptions): any;

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
