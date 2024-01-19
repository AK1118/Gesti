import { ViewObjectFamily } from "@/core/enums";
import ViewObjectBase from "@/core/abstract/view-object";
import {
  ViewObjectExportBaseInfo,
  ViewObjectExportEntity,
} from "Serialization";
declare module "Gesti" {
  /*
   * @Author: AK1118
   * @Date: 2023-11-15 16:08:39
   * @Last Modified by: AK1118
   * @Last Modified time: 2024-01-06 16:12:45
   */
  type PluginKeys = "pako" | "offScreenBuilder";

  type ImportAllInterceptor = (
    views: Array<ViewObjectBase>
  ) => Promise<Array<ViewObjectBase>>;

  type ExportAllInterceptor = (
    views: Array<ViewObjectExportEntity>
  ) => Promise<Array<ViewObjectExportEntity>>;

  interface OffScreenCanvasBuilderOption {
    offScreenCanvasBuilder: (width: number, height: number) => any;
    offScreenContextBuilder: (offScreenCanvas: any) => any;
    imageBuilder?: (
      offScreenCanvas: any,
      url: string
    ) => HTMLImageElement | any;
    paintBuilder?: () => Painter;
  }
  class Vector {
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

  class Size {
    width: number;
    height: number;
    constructor(width: number, height: number);
    toVector(): Vector;
    copy(): Size;
    static get zero(): Size;
  }

  type ButtonOption = {
    location?: Alignment;
    icon?: Icon;
  };

  class Painter {}

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

  class IconBase implements Icon {
    color: string;
    size: number;
    get data(): IconDataType;
    computedData: IconDataType;
    render(paint: Painter, location: Vector);
    setSize(value: number): void;
  }

  class MirrorIcon extends IconBase {}

  class CloseIcon extends IconBase {}

  class DeleteIcon extends IconBase {}

  class ImageIcon extends IconBase {
    constructor(xImage: XImage);
  }

  class LockIcon extends IconBase {}

  class UnlockIcon extends IconBase {}

  class DefaultIcon extends IconBase {}

  interface GestiConfigOption {
    auxiliary?: boolean;
    dashedLine?: boolean;
  }

  class GestiConfig {
    static DPR: number;
  }

  interface RectParams {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }

  class Alignment {
    constructor(x: number, y: number);
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
  }

  interface TextOptions {
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
  class ImageToolkit {}
  interface ImageChunk {
    x: number;
    y: number;
    width: number;
    height: number;
    imageData?: ImageData;
    base64?: string;
  }
  abstract class ViewObject {
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
    public setId(id: string): void;
    //上锁
    lock(): void;
    //解锁
    unLock(): void;
    //隐藏
    hide(): void;
    //安装按钮
    installButton(button: Button): void;

    installMultipleButtons(buttons: Array<Button>): void;
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
    /**
     * 将对象设置为背景
     */
    public toBackground(): void;
    /**
     * 取消对象为背景
     */
    public unBackground(): void;
    public getLayer(): number;
  }
  class XImage {
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
    toJSON(): any;
  }
  class Group {
    remove(id: string): void;
    removeById(viewObject: ViewObject): void;
  }

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

  class TextBox extends ViewObject implements TextHandler {
    constructor(text: string, options?: TextOptions);
    setWeight(weight: FontWeight): void;
    setFontStyle(style: FontStyleType): void;
    setText(text: string): void;
    setFontFamily(family: string): void;
    setSpacing(value: number): void;
    setColor(color: string): void;
    setFontSize(fontSize: number): void;
    setDecoration(options: TextOptions): void;
    get fontSize(): number;
    updateText(text: string, options?: TextOptions): Promise<void>;
    public useCache(): void;
    public unUseCache(): void;
  }

  class ImageBox extends ViewObject {
    setDecoration(xImage: XImage): void;
    constructor(ximage: XImage);
  }

  type GraffitiCloser = [() => void, (callback: (view: any) => void) => void];

  class WriteViewObj extends ViewObject {
    setDecoration(decoration: {
      color?: string;
      isFill?: boolean;
      lineWidth?: number;
    }): void;
  }

  type CenterAxis = "vertical" | "horizon";

  interface DesignSizeOption {
    designWidth?: number;
    designHeight?: number;
  }
  interface CanvasSizeOption {
    canvasWidth: number;
    canvasHeight: number;
  }
  interface ScreenUtilOption extends DesignSizeOption, CanvasSizeOption {
    devicePixelRatio?: number;
    minTextAdapt?: boolean;
  }

  /**
   * @description 初始化传入参数
   */
  interface InitializationOption {
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
  abstract class GestiController {
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
      type: GraffitiTypes;
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
    center(view?: ViewObject, axis?: CenterAxis): void;
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
    //移除某个对象
    remove(view?: ViewObject): boolean;
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

  abstract class BaseButton {
    constructor(option?: ButtonOption);
  }

  abstract class Button extends BaseButton {
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
    // icon, iconColor, customAlignment, customIcon
  }

  class CloseButton extends Button {}
  class DragButton extends Button {
    constructor(options?: {
      angleDisabled?: boolean;
      buttonOption?: ButtonOption;
    });
  }
  class MirrorButton extends Button {}
  class LockButton extends Button {}
  class RotateButton extends Button {}
  class SizeButton extends Button {
    constructor(location: Alignment, option?: ButtonOption);
  }
  class UnLockButton extends Button {
    constructor(option?: ButtonOption);
  }
  type VerticalAlignmentType = "top" | "bottom";
  class VerticalButton extends Button {
    constructor(location?: VerticalAlignmentType, option?: ButtonOption);
  }
  type HorizonAlignmentType = "left" | "right";
  class HorizonButton extends Button {
    constructor(location?: HorizonAlignmentType, option?: ButtonOption);
  }
}
