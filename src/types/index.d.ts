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
export declare interface textOptions {
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
export declare interface createImageOptions {
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
  base64:string,
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
  setPosition(x:number,y:number):void;
  /**
   * @description 设置不透明度
   * @param opacity  0.0~1.0
   */
  setOpacity(opacity:number):void;
  //是否已被选中
  readonly selected: boolean;
  /**
   * 将对象设置为背景
   */
  public toBackground():void;
  /**
   * 取消对象为背景
   */
  public unBackground():void;
}
export declare class XImage {
  new(params: createImageOptions): XImage;
  constructor(params: createImageOptions);
  originData: any;
  data: any;
  width: number;
  height: number;
  x: number;
  y: number;
  //背书
  scale: number;
  //矩形位置大小信息
  toJson(): RectParams;
}

export declare class TextBox extends ViewObject {
  new(text: string, options?: textOptions): TextBox;
  constructor(text: string, options?: textOptions);
  setDecoration(options: textOptions): void;
  get fontSize(): number;
  updateText(text: string, options?: textOptions): Promise<void>;
}

export declare class ImageBox extends ViewObject {
  new(xImage: XImage): ImageBox;
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

export declare class Gesti {
  new(config?: gesticonfig): Gesti;
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
  updateText(text: string, options?: textOptions): void;
  center(axis?: CenterAxis, view?: ViewObject): void;
  addText(text: string, options?: textOptions): Promise<ViewObject>;
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
export declare abstract class Button {}
export declare class CloseButton extends Button {
  new(view: ViewObject): CloseButton;
  constructor(view: ViewObject);
}
export declare class DragButton extends Button {
  new(view: ViewObject): DragButton;
  constructor(view: ViewObject);
}
export declare class MirrorButton extends Button {
  new(view: ViewObject): MirrorButton;
  constructor(view: ViewObject);
}
export declare class LockButton extends Button {
  new(view: ViewObject): LockButton;
  constructor(view: ViewObject);
}
export declare class RotateButton extends Button {
  new(view: ViewObject): RotateButton;
  constructor(view: ViewObject);
}
export declare class UnLockButton extends Button {
  new(view: ViewObject): UnLockButton;
  constructor(view: ViewObject);
}
export declare class VerticalButton extends Button {
  new(view: ViewObject): VerticalButton;
  constructor(view: ViewObject);
}
export declare class HorizonButton extends Button {
  new(view: ViewObject): HorizonButton;
  constructor(view: ViewObject);
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
export declare const useController: (
  target?: Gesti
) => import("../interfaces/gesticontroller").default;
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
  options?: textOptions
) => TextBox;
export declare const createImageBox: (
  xImage: XImage
) => import("../viewObject/image").default;
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
) => (text: string, options?: textOptions) => void | Promise<never>;
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
  axis?: CenterAxis,
  view?: ViewObject,
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
