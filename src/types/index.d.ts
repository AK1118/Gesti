/*
 * @Author: AK1118
 * @Date: 2023-11-15 16:08:39
 * @Last Modified by: AK1118
 * @Last Modified time: 2023-11-18 17:49:42
 */

import "./serialization";

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

declare class Size {
  width: number;
  height: number;
  constructor(width: number, height: number);
  toVector(): Vector;
  copy(): Size;
  static get zero(): Size;
}

declare type ButtonOption = {
  location?: ButtonLocation;
  icon?: Icon;
};

declare class Painter {}

type IconDataType = number[][][];

declare interface Icon {
  color: string;
  size: number;
  //静态
  get data(): IconDataType;
  //设置大小时根据静态数据更新数据
  computedData: IconDataType;
  render(paint: Painter, location: Vector);
  setSize(value: number): void;
}

export declare interface gesticonfig {
  auxiliary?: boolean;
  dashedLine?: boolean;
}

declare interface RectParams {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

/**
 *
 * @description 按钮位置枚举,前缀为Out的位置处于对象外层
 */
export declare enum ButtonLocation {
  /**左上 */
  LT,
  /**左下 */
  LB,
  RT,
  RB,
  RC,
  BC,
  LC,
  TC,
  OutBC,
  OutTC,
  OutRC,
  OutLC,
  OutLT,
  OutLB,
  OutRT,
  OutRB,
}

export declare interface TextOptions {
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  color?: string;
  linesMarks?: Array<number>;
  lineWidth?: number;
  lineColor?: string;
  lineOffsetY?: number;
  lineHeight?: number;
  width?: number;
  height?: number;
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

export declare enum ViewObjectFamily {
  image,
  write,
  line,
  circle,
  rect,
  text,
}

export declare interface Rect {
  readonly key: string;
  get position(): Vector;
  get getAngle(): number;
  get scale(): number;
  get size(): Size;
  setPosition(position: Vector): void;
  setSize(width: number, height: number): void;
  setScale(scale: number): void;
  setSize(width: number, height: number): void;
  setAngle(angle: number, isDrag?: boolean): void;
  copy(key?: string): Rect;
}
export declare class ImageToolkit {}
export declare interface ImageChunk {
  x: number;
  y: number;
  width: number;
  height: number;
  imageData: ImageData;
  base64: string;
}
export declare abstract class ViewObject {
  getBaseInfo(): Object;
  readonly rect: Rect;
  get value(): any;
  readonly family: ViewObjectFamily;
  readonly originFamily: ViewObjectFamily;
  readonly name: string;
  setName(name: string): void;
  //上锁
  lock(): void;
  //解锁
  unLock(): void;
  //隐藏
  hide(): void;
  //显示
  show(): void;
  //安装按钮
  installButton(button: Button): void;
  //卸载按钮
  unInstallButton(buttons: Array<Button>): void;
  //设置样式
  setDecoration(args: any): void;
  //设置矩形大小
  setSize(size: { width?: number; height?: number }): void;
  //设置位置
  setPosition(x: number, y: number): void;
  /**
   * @description 设置不透明度
   * @param opacity  0.0~1.0
   */
  setOpacity(opacity: number): void;
  //是否已被选中
  readonly selected: boolean;
  /**
   * 将对象设置为背景
   */
  public toBackground(): void;
  /**
   * 取消对象为背景
   */
  public unBackground(): void;
  get position(): Vector;
  get size(): Size;
  get mounted(): boolean;
}
export declare class XImage {
  constructor(params: createImageOptions);
  originData: any;
  data: any;
  width: number;
  height: number;
  x: number;
  y: number;
  //背书
  scale: number;

  fixedWidth: number;
  fixedHeight: number;

  url: string;
  //矩形位置大小信息
  toJson(): RectParams;
}
export declare class Group {
  remove(id: string): void;
  removeById(viewObject: ViewObject): void;
}
export declare interface TextHandler {
  setFontSize(fontSize: number): void;
  setFontFamily(family: string): void;
  setSpacing(value: number): void;
  setColor(color: string): void;
  setText(text: string): void;
}
export declare class TextBox extends ViewObject implements TextHandler {
  constructor(text: string, options?: TextOptions);
  setText(text: string): void;
  setFontFamily(family: string): void;
  setSpacing(value: number): void;
  setColor(color: string): void;
  setFontSize(fontSize: number): void;
  setDecoration(options: TextOptions): void;
  get fontSize(): number;
  updateText(text: string, options?: TextOptions): Promise<void>;
}

export declare class ImageBox extends ViewObject {
  setDecoration(xImage: XImage): void;
  constructor(ximage: XImage);
}

export declare class WriteViewObj extends ViewObject {
  setDecoration(decoration: {
    color?: string;
    isFill?: boolean;
    lineWidth?: number;
  }): void;
}

export declare type CenterAxis = "vertical" | "horizon";

/**
 * @description 初始化传入参数
 */
export declare interface InitializationOption {
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

export declare class Gesti {
  constructor(config?: gesticonfig);
  get controller(): GestiController;
  static Family: ViewObjectFamily;
  static XImage: XImage;
  /**
   * canvas必传，在h5端时paint可不传
   * 关于rect  width 和 height 对应的是canvas的高宽   而 x,y其实对应的是canvas在屏幕的位置，或者可以理解为偏移量
   * @param canvas
   * @param paint
   * @param rect
   * @deprecated
   */
  init(
    canvas: HTMLCanvasElement | null,
    paint?: CanvasRenderingContext2D | null,
    rect?: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    }
  ): void;
  /**
   * @description 初始化Gesti
   * @param option 传入一个对象
   */
  public initialization(option: InitializationOption): void;
}
declare type EventHandle = null;
/**
 * 添加监听
 */
export declare type GestiControllerListenerTypes =
  | "onSelect"
  | "onHide"
  | "onCancel"
  | "onHover"
  | "onLeave"
  | "onUpdate"
  | "onLoad";
export declare abstract class GestiController {
  /**
   * @ImageToolkit
   * @private
   */
  private kit;
  constructor(kit: ImageToolkit);
  load(view: ViewObject): void;
  select(select: ViewObject): Promise<void>;
  get currentViewObject(): ViewObject;
  rotate(angle: number, existing?: boolean, view?: ViewObject): Promise<void>;
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
    callback: (obj: any) => void,
    prepend?: boolean
  ): void;
  updateText(text: string, options?: TextOptions): void;
  center( view?: ViewObject,axis?: CenterAxis): void;
  addText(text: string, options?: TextOptions): Promise<ViewObject>;
  cancel(view?: ViewObject): void;
  cancelAll(): void;
  layerLower(view?: ViewObject): void;
  layerRise(view?: ViewObject): void;
  layerTop(view?: ViewObject): void;
  layerBottom(view?: ViewObject): void;
  update(): void;
  cancelEvent(): void;
  unLock(view?: ViewObject): void;
  lock(view?: ViewObject): void;
  fallback(): void;
  cancelFallback(): void;
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
  addImage(ximage: XImage | Promise<XImage>): Promise<ViewObject>;
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

declare abstract class BaseButton {
  constructor(option?: ButtonOption);
}

export declare abstract class Button extends BaseButton {
  get btnLocation(): ButtonLocation;
  protected drawButton(
    position: Vector,
    size: Size,
    radius: number,
    paint: Painter
  ): void;
  public setLocation(location: ButtonLocation): void;
  public setBackgroundColor(color: string): void;
  public hideBackground(): void;
  public setIconColor(color: string): void;
  public setSenseRadius(senseRadius: number): void;
}

export declare class CloseButton extends Button {}
export declare class DragButton extends Button {
  constructor(options?: {
    angleDisabled?: boolean;
    buttonOption?: ButtonOption;
  });
}
export declare class MirrorButton extends Button {}
export declare class LockButton extends Button {}
export declare class RotateButton extends Button {}
export declare class SizeButton extends Button{
  constructor(location:ButtonLocation,option?:ButtonOption);
}
export declare class UnLockButton extends Button {
  constructor(option?: ButtonOption);
}
declare type VerticalButtonLocationType='top'| 'bottom';
export declare class VerticalButton extends Button {
  constructor(
    location?:VerticalButtonLocationType,
    option?: ButtonOption
  );
}
declare type HorizonButtonLocationType='left'| 'right';
export declare class HorizonButton extends Button {
  constructor(
    location?: HorizonButtonLocationType,
    option?: ButtonOption
  );
}
export declare const createGesti: (config?: gesticonfig) => Gesti;
/**
 * Hook 分发
 */
export declare const onSelected: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onHover: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onLeave: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onCancel: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onHide: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onUpdate: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const onLoad: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export declare const removeListener: (
  type: GestiControllerListenerTypes,
  hook: (_args: any) => any,
  target?: Gesti
) => void;
export declare const useController: (target?: Gesti) => GestiController;
/**
 * 添加预设图形
 */
export declare const addVerticalLine: (target?: Gesti) => Promise<ViewObject>;
export declare const addHorizonLine: (target?: Gesti) => Promise<ViewObject>;
export declare const addRect: (target?: Gesti) => Promise<ViewObject>;
export declare const addCircle: (target?: Gesti) => Promise<ViewObject>;
/**
 * 创建可操作对象
 */
export declare const createTextBox: (
  text: string,
  options?: TextOptions
) => TextBox;
export declare const createImageBox: (xImage: XImage) => XImage;
/**
 * @description 踩踩踩
 * @param option
 * @returns
 */
export declare const createXImage: (option: {
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
  width: number;
  height: number;
  scale?: number;
  maxScale?: number;
  minScale?: number;
}) => XImage;
/**
 * @description 使用文字控制Hook
 * @param textBox
 * @param target
 * @returns
 */
export declare const useTextHandler: (
  textBox: TextBox,
  target?: Gesti
) => (text: string, options?: TextOptions) => void | Promise<never>;
/**
 * @description 将可操作对象载入到画布内
 * @param view
 * @param target
 * @returns
 */
export declare const loadToGesti: (view: ViewObject, target?: Gesti) => void;
export declare const useGraffitiRect: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export declare const useGraffitiCircle: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export declare const useGraffitiLine: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export declare const useGraffitiWrite: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export declare const useCloseGraffiti: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
/**
 * @description 导入json到画布内,该json数据格式必须由 exportAll Hook导出
 * @param json
 * @param target
 * @returns
 */
export declare const importAll: (json: string, target?: Gesti) => Promise<void>;
/**
 * @description 导出可操作对象为json，不建议导出图片
 * @param target
 * @returns
 */
export declare const exportAll: (target?: Gesti) => Promise<string>;
export declare const createDragButton: (view: ViewObject) => Button;
export declare const createHorizonButton: (view: ViewObject) => Button;
export declare const createRotateButton: (view: ViewObject) => Button;
export declare const createLockButton: (view: ViewObject) => Button;
export declare const createUnlockButton: (view: ViewObject) => Button;
export declare const createCloseButton: (view: ViewObject) => Button;
export declare const createVerticalButton: (view: ViewObject) => Button;
export declare const createMirrorButton: (view: ViewObject) => Button;
/**
 * @description 给某个可操作对象安装按钮
 * @param view
 * @param button
 */
export declare const installButton: (
  view: ViewObject,
  button: Button | Array<Button>
) => void;
export declare const unInstallButton: (
  view: ViewObject,
  button: Button | Array<Button>
) => void;
export declare const doSelect: (view?: ViewObject, target?: Gesti) => void;
export declare const doLayerLower: (view?: ViewObject, target?: Gesti) => void;
export declare const doLayerBottom: (view?: ViewObject, target?: Gesti) => void;
export declare const doLayerTop: (view?: ViewObject, target?: Gesti) => void;
export declare const doLayerRise: (view?: ViewObject, target?: Gesti) => void;
export declare const doLock: (view?: ViewObject, target?: Gesti) => void;
export declare const doUnLock: (view?: ViewObject, target?: Gesti) => void;
export declare const doUpward: (view?: ViewObject, target?: Gesti) => void;
export declare const doDownward: (view?: ViewObject, target?: Gesti) => void;
export declare const doLeftward: (view?: ViewObject, target?: Gesti) => void;
export declare const doRightward: (view?: ViewObject, target?: Gesti) => void;
export declare const doCancel: (view?: ViewObject, target?: Gesti) => void;
export declare const doUpdate: (view?: ViewObject, target?: Gesti) => void;
export declare const doCancelAll: (view?: ViewObject, target?: Gesti) => void;
export declare const doCancelEvent: (view?: ViewObject, target?: Gesti) => void;
export declare const doCenter: (
  view?: ViewObject,
  axis?: CenterAxis,
  target?: Gesti
) => void;
export declare const doRotate: (
  angle: number,
  existing?: boolean,
  view?: ViewObject,
  target?: Gesti
) => void;
export declare const currentViewObject: (target?: Gesti) => ViewObject;
export declare const useReader: (json: string) => Promise<ViewObject>;
export declare const driveMove: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export declare const driveDown: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export declare const driveUp: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export declare const driveWheel: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export default Gesti;

/**
 * @description 毫米转换为英寸
 */
export declare const mmToIn: (mm: number) => number;

/**
 * @description 英寸转换为像素
 */
export declare const inToPx: (inch: number) => number;

/**
 * @description 榜转换为像素
 */
export declare const ptToPx: (pt: number) => number;

/**
 * @description 将Uint8Array数组分割成小切片(压缩后的)
 */
export declare const uint8ArrayToChunks: (
  uint8Array: Uint8Array,
  width: number,
  height: number,
  chunkSize: number
) => ImageChunk[];
