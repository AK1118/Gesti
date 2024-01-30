import GestiController from "./controller";
import {
  BoxDecorationOption,
  GenerateGraphicsOption,
  GeneratePolygonOption,
  GenerateRectAngleOption,
  PolygonDecorationOption,
} from "./graphics";
import {
  ViewObjectExportBaseInfo,
  ViewObjectExportEntity,
} from "./serialization";
export declare interface SelectedBorderStyle {
  borderColor?: string;
  lineDash?: Iterable<number>;
  lineWidth?: number;
  padding?: number;
}
declare class Gesti {
  constructor(config?: GestiConfigOption);
  get controller(): GestiController;
  static Family: ViewObjectFamily;
  initialized: boolean;
  public bindController(controller: GestiController): void;
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
   * 
   * ### 初始化Gesti
   * - 必须传入画布的高宽，即rect内的canvasWidth和canvasHeight
   * 
   * ``` TypeScript
   * InitializationOption {
      //画笔
      renderContext: CanvasRenderingContext2D | null;
      //画布矩形
      rect: {
        x?: number;
        y?: number;
        canvasWidth: number;
        canvasHeight: number;
      };
    }
   * ```
   */
  public initialization(option: InitializationOption): void;
  public static mount(option: InitializationOption): [Gesti, GestiController];
  /**
   * @description 安装预设插件
   * @param key
   * @param plugin
   */
  public static installPlugin(key: PluginKeys, plugin: any);
  /**
   * ### 销毁gesti实例
   */
  dispose(): void;
}
export type VoidFunctionCallback = () => void;
export declare enum ViewObjectFamily {
  image,
  write,
  line,
  circle,
  rect,
  text,
  group,
  graphicsRectangle,
  graphicsCircle,
}
/*
 * @Author: AK1118
 * @Date: 2023-11-15 16:08:39
 * @Last Modified by: AK1118
 * @Last Modified time: 2024-01-23 18:06:57
 */
export type PluginKeys = "pako" | "offScreenBuilder";

export type ImportAllInterceptor = (
  views: Array<ViewObject>
) => Promise<Array<ViewObject>>;

export type ExportAllInterceptor = (
  views: Array<ViewObjectExportEntity>
) => Promise<Array<ViewObjectExportEntity>>;

interface OffScreenCanvasBuilderOption {
  offScreenCanvasBuilder: (width: number, height: number) => any;
  offScreenContextBuilder: (offScreenCanvas: any) => any;
  imageBuilder?: (offScreenCanvas: any, url: string) => HTMLImageElement | any;
  paintBuilder?: () => Painter;
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

declare class Size {
  width: number;
  height: number;
  constructor(width: number, height: number);
  toVector(): Vector;
  copy(): Size;
  static get zero(): Size;
}

type ButtonOption = {
  alignment?: Alignment;
  icon?: Icon;
};

declare class Painter {}

type IconDataType = number[][][];

interface Icon {
  color: string;
  size: number;
  //静态
  get data(): IconDataType;
  //设置大小时根据静态数据更新数据
  computedData: IconDataType;
  render(paint: Painter, location: Vector);
  setSize(value: number): void;
}

declare class IconBase implements Icon {
  color: string;
  size: number;
  get data(): IconDataType;
  computedData: IconDataType;
  render(paint: Painter, location: Vector);
  setSize(value: number): void;
}

export declare class MirrorIcon extends IconBase {}

export declare class CloseIcon extends IconBase {}

export declare class DeleteIcon extends IconBase {}

export declare class ImageIcon extends IconBase {
  constructor(xImage: XImage);
}

export declare class LockIcon extends IconBase {}

export declare class UnlockIcon extends IconBase {}

export declare class DefaultIcon extends IconBase {}

export interface GestiConfigOption {
  auxiliary?: boolean;
  dashedLine?: boolean;
}

declare class GestiConfig {
  static DPR: number;
}

interface RectParams {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

export class Alignment {
  constructor(x: number, y: number);
  static format(x: number, y: number): Alignment;
  public copyWithOffset(offset: Offset): Alignment;
  static readonly center: Alignment;
  static readonly topLeft: Alignment;
  static readonly bottomLeft: Alignment;
  static readonly topRight: Alignment;
  static readonly bottomRight: Alignment;
  static readonly centerRight: Alignment;
  static readonly bottomCenter: Alignment;
  static readonly centerLeft: Alignment;
  static readonly topCenter: Alignment;
  public compute(size: Size): Offset;
}

export interface TextOptions {
  /**
   * @description 字体风格，可以浏览器搜索 canvas自定义字体
   */
  fontFamily?: string;
  weight?: FontWeight;
  fontStyle?: FontStyleType;
  fontSize?: number;
  /**
   * @description 文字间距
   */
  spacing?: number;
  /**
   * @description 文字颜色
   */
  color?: string;
  /**
   * @description 是否显示下划线,建议使用underLine
   * @deprecated
   */
  line?: boolean;
  /**
   * @description 下划线
   */
  underLine?: boolean;
  /**
   * @description 删除线
   */
  lineThrough?: boolean;
  /**
   * @description 上划线
   */
  overLine?: boolean;
  /**
   * @description 划线宽度
   */
  lineWidth?: number;
  /**
   * @description 下划线颜色
   *
   */
  lineColor?: string;
  /**
   * @deprecated
   * @description 已废弃，设置无效
   */
  lineOffsetY?: number;
  /**
   * @description 文字间距高度
   */
  lineHeight?: number;
  /**
   * @deprecated
   * @description 已废弃，设置无效
   */

  width?: number;
  /**
   * @deprecated
   * @description 已废弃，设置无效
   */
  height?: number;
  /**
   * @description 如果为true,文字大小会随着选框的高而变化
   */
  resetFontSizeWithRect?: boolean;
  /**
   * @description 传入一个整数类型，用于限制字体大小最大值，默认不会限制
   */
  maxFontSize?: number;
  /**
   * @description 文字背景颜色
   */
  backgroundColor?: string;
  /**
   * @description 最大宽度
   */
  maxWidth?: number;
}

interface createImageOptions {
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
  // options: createImageOptions;
  width: number;
  height: number;
  scale?: number;
  maxScale?: number;
  minScale?: number;
}

interface Rect {
  readonly key: string;
  get position(): Vector;
  get getAngle(): number;
  // get scale(): number;
  get size(): Size;
  setPosition(position: Vector): void;
  setSize(width: number, height: number): void;
  // setScale(scale: number): void;
  setSize(width: number, height: number): void;
  setAngle(angle: number, isDrag?: boolean): void;
  copy(key?: string): Rect;
}

export interface ImageChunk {
  x: number;
  y: number;
  width: number;
  height: number;
  imageData?: ImageData;
  base64?: string;
}
export abstract class ViewObject {
  public getBaseInfo(): ViewObjectExportBaseInfo;
  readonly rect: Rect;
  get value(): any;
  readonly family: ViewObjectFamily;
  readonly originFamily: ViewObjectFamily;
  readonly name: string;
  get position(): Vector;
  get size(): Size;
  get width(): number;
  get height(): number;
  get positionX(): number;
  get positionY(): number;
  get scaleWidth(): number;
  get scaleHeight(): number;
  get absoluteScale(): number;
  get mounted(): boolean;
  get id(): string;
  readonly key: string | number;
  readonly selected: boolean;
  public disabled: boolean;
  get isLock(): boolean;
  setName(name: string): void;
  //设置名称
  public setId(id: string): void;
  //上锁
  lock(): void;
  //解锁
  unLock(): void;
  //隐藏
  hide(): void;
  /**
   * - 安装单个按钮
   * @param button
   */
  installButton(button: Button): void;
  /**
   * - 安装多个按钮
   * @param buttons
   */
  installMultipleButtons(buttons: Array<Button>): void;
  /**
   * - 卸载出传入数组按钮
   * @param buttons
   */
  unInstallButton(buttons: Array<Button>): void;
  /**
   * ### 设置盒子样式
   * - 可设置盒子的背景颜色、背景图片、背景渐变、圆角等样式
   * - 注意：如果使用了屏幕适配，请在设置时将大小用屏幕适配计算方法计算后再传入
   */
  setDecoration(option: BoxDecorationOption): void;
  /**
   * - 设置矩形大小
   * @param size
   */
  setSize(size: { width?: number; height?: number }): void;
  /**
   * - 设置位置
   * @param x
   * @param y
   */
  setPosition(x: number, y: number): void;
  /**
   * @description 设置不透明度
   * @param opacity  0.0~1.0
   */
  setOpacity(opacity: number): void;
  /**
   * 将对象设置为背景
   */
  public toBackground(): void;
  /**
   * 取消对象为背景
   */
  public unBackground(): void;
  /**
   * - 获取当前对象所在层级
   */
  public getLayer(): number;
  /**
   * - 强制刷新画布
   */
  public forceUpdate(): void;
  /**
   * - 水平垂直居中，在挂载后生效
   */
  public toCenter(axis?: CenterAxis): void;
  /**
   * - 通过id获取该图层上的按钮,返回Promise
   */
  public getButtonById<ButtonType extends BaseButton>(
    id: string
  ): Promise<ButtonType | undefined>;
  /**
   * - 通过id获取该图层上的按钮
   */
  public getButtonByIdSync<ButtonType extends BaseButton>(
    id: string
  ): ButtonType | undefined;
  /**
   * - 获取该图层所有按钮
   */
  get allButtons(): Array<BaseButton>;
  /**
   * ### 设置被选中时边框的样式
   * - 颜色，dash,padding，lineWidth
   */
  public setSelectedBorder(option: SelectedBorderStyle): void 
}
export class XImage {
  constructor(params: createImageOptions);
  originData: any;
  data: any;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
  fixedWidth: number;
  fixedHeight: number;
  url: string;
  //矩形位置大小信息
  toJson(): RectParams;
  toJSON(): any;
}
// class Group {
//   remove(id: string): void;
//   removeById(viewObject: ViewObject): void;
// }

export type FontStyleType = "normal" | "italic" | "oblique";
export type FontWeight =
  | "bold"
  | "normal"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;

interface TextHandler {
  setFontSize(fontSize: number): void;
  setFontFamily(family: string): void;
  setSpacing(value: number): void;
  setColor(color: string): void;
  setText(text: string): void;
  setFontStyle(style: FontStyleType): void;
  setWeight(weight: FontWeight): void;
}

export class TextBox extends ViewObject implements TextHandler {
  constructor(text: string, options?: TextOptions);
  setWeight(weight: FontWeight): void;
  /**
   * ### 设置文字样式，斜体
   */
  setFontStyle(style: FontStyleType): void;
  /**
   * ### 设置文字样式
   *
   */
  setTextStyle(args: TextOptions): void;
  /**
   * ### 设置文字
   * - 会完全替换文本内原有内容
   */
  setText(text: string): void;
  setFontFamily(family: string): void;
  setSpacing(value: number): void;
  setColor(color: string): void;
  setFontSize(fontSize: number): void;
  setDecoration(decoration: BoxDecorationOption): void;
  get fontSize(): number;
  /**
   * @deprecated
   * @param text
   * @param options
   */
  updateText(text: string, options?: TextOptions): Promise<void>;
  public useCache(): void;
  public unUseCache(): void;
}

export declare class ImageBox extends ViewObject {
  constructor(ximage: XImage);
}

type GraffitiCloser = [
  () => void,
  (callback: (view: ViewObject) => void) => void
];

export declare class WriteViewObj extends ViewObject {}

export type CenterAxis = "vertical" | "horizon";

/**
 * - 设计稿大小，默认 750*750
 */
export interface DesignSizeOption {
  designWidth?: number;
  designHeight?: number;
}
/**
 * - 屏幕(画布大小)
 */
export interface CanvasSizeOption {
  canvasWidth: number;
  canvasHeight: number;
}

export interface ScreenUtilOption extends DesignSizeOption, CanvasSizeOption {
  devicePixelRatio?: number;
  /**
   * - 是否使用宽高中的最小值计算文字大小，默认 true
   */
  minTextAdapt?: boolean;
}
export class ScreenUtils {
  constructor(option?: ScreenUtilOption);
  /**
   * ## 文字大小设置适配
   * - 返回一个根据设计稿与传入值计算得到的数字
   */
  public setSp(fontSize: number): number;
  /**
   * ## 宽度设置适配
   * - 返回一个根据设计稿与传入值计算得到的数字
   */
  public setWidth(width: number): number;
  /**
   * ## 高度设置适配
   * - 返回一个根据设计稿与传入值计算得到的数字
   */
  public setHeight(height: number): number;
  /**
   * ### 全屏宽度
   * - 设计稿宽度,默认 750
   */
  public get fullWidth(): number;
  /**
   * ### 全屏高度
   * - 设计稿高度，默认  1334
   */
  public get fullHeight(): number;
}
/**
 * @description 初始化传入参数
 */
export interface InitializationOption {
  //画笔
  renderContext: CanvasRenderingContext2D | null;
  //画布矩形
  rect: {
    x?: number;
    y?: number;
    canvasWidth: number;
    canvasHeight: number;
  };
}

type EventHandle = null;
type GraffitiTypes = "circle" | "write" | "line" | "rect" | "none";
/**
 * 添加监听
 */
type GestiControllerListenerTypes =
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
  | "onCreateGraffiti"
  | "onUpdateText"
  | "onRemove";

declare abstract class BaseButton {
  constructor(option?: ButtonOption);
}

export abstract class Button extends BaseButton {
  get btnLocation(): Alignment;
  protected drawButton(
    position: Vector,
    size: Size,
    radius: number,
    paint: Painter
  ): void;
  public setLocation(location: Alignment): void;
  public setBackgroundColor(color: string): void;
  public hideBackground(): void;
  public setIconColor(color: string): void;
  public setSenseRadius(senseRadius: number): void;
  public setId(id: string): void;
  get id(): string;
}

export class CloseButton extends Button {}
export class DragButton extends Button {
  constructor(options?: {
    angleDisabled?: boolean;
    buttonOption?: ButtonOption;
  });
}
export class MirrorButton extends Button {}
export class LockButton extends Button {}
export class RotateButton extends Button {}
/**
 * ### 创建一个自定义按钮对象
 * - 按钮可以自定义child和点击事件，但是点击事件不能被导出
 */
export class CustomButton extends Button {
  constructor(option: {
    child: ViewObject;
    onClick?: VoidFunction;
    option?: ButtonOption;
  });
}
export class SizeButton extends Button {
  constructor(alignment: Alignment, option?: ButtonOption);
}
export class UnLockButton extends Button {
  constructor(option?: ButtonOption);
}
type VerticalAlignmentType = "top" | "bottom";
export class VerticalButton extends Button {
  constructor(location?: VerticalAlignmentType, option?: ButtonOption);
}
type HorizonAlignmentType = "left" | "right";
export class HorizonButton extends Button {
  constructor(location?: HorizonAlignmentType, option?: ButtonOption);
}

declare abstract class GraphicsBase<
  T extends GenerateGraphicsOption
> extends ViewObject {}

/**
 * ### 普通矩形
 * - 内置decoration，可设置该矩形的样式
 */
export class Rectangle extends GraphicsBase<GenerateRectAngleOption> {
  constructor(option: GenerateRectAngleOption);
  setDecoration<BoxDecorationOption>(option: BoxDecorationOption): void;
}
export class Polygon extends GraphicsBase<GeneratePolygonOption> {
  constructor(option: GeneratePolygonOption);
  setDecoration<PolygonDecorationOption>(option: PolygonDecorationOption): void;
}

/**
 * ### 离屏画布构建器
 * - 在使用缓存,序列化传输时使用
 */
export class OffScreenCanvasBuilder {
  constructor(option: OffScreenCanvasBuilderOption);
}
