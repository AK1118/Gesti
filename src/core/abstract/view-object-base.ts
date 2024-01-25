import RenderObject from "../interfaces/render-object";
import Painter from "../lib/painter";
import Rect, { Size } from "../lib/rect";
import Vector from "../lib/vector";
import { Point } from "../lib/vertex";
import Button from "./baseButton";
import OperationObserver from "./operation-observer";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../lib/image-toolkit";
import { Delta } from "../../utils/event/event";
import { ViewObjectExportEntity } from "@/types/serialization";
import {
  getOffscreenCanvasContext,
  getOffscreenCanvasWidthPlatform,
} from "@/utils/canvas";
import RenderBox from "../lib/rendering/renderbox";
import BoxDecoration from "../lib/rendering/decorations/decoration";
import { BoxDecorationOption } from "Graphics";

class ViewObjectRenderBox extends RenderBox {}

/**
 * 图层基类
 */
abstract class BaseViewObject extends OperationObserver {
  protected decoration: BoxDecoration;
  public renderBox: RenderBox = new ViewObjectRenderBox();
  protected offScreenCanvas;
  protected offScreenPainter: Painter;
  private _isCache: boolean = false;
  private _didChanged: boolean = false;
  protected get canRenderCache(): boolean {
    return this._isCache && this.offScreenCreated;
  }
  protected get offScreenCreated(): boolean {
    return this.offScreenCanvas != null && this.offScreenPainter != null;
  }
  protected get isUseRenderCache(): boolean {
    return this._isCache;
  }
  protected get didChanged(): boolean {
    return this._didChanged;
  }
  protected _didChangedAll(): void {
    this._didChanged = true;
  }
  protected reBuild(): void {
    this._didChanged = false;
  }
  public useCache(): void {
    this._isCache = true;
  }
  public generateOffScreenCanvas(): boolean {
    this.offScreenCanvas = getOffscreenCanvasWidthPlatform(
      this.renderBox.width,
      this.renderBox.height
    );
    this.offScreenPainter = getOffscreenCanvasContext(this.offScreenCanvas);
    return this.offScreenCanvas != null && this.offScreenPainter != null;
  }
  public unUseCache(): void {
    this._isCache = false;
    this.offScreenCanvas = null;
    this.offScreenPainter = null;
  }
  private decorationOption: BoxDecorationOption = {};
  /**
   * ## 设置View盒子装饰
   * - decoration 装饰参数，包括背景颜色，背景图片，圆角，背景渐变，描边等详情见 [BoxDecorationOption]
   * - extension 是否在原来的基础上扩展，默认true
   * @param decoration
   * @param extension
   */
  public setDecoration(
    decoration: BoxDecorationOption,
    extension: boolean = true
  ): void {
    let _d = {
      ...decoration,
    };
    if (extension) {
      _d = Object.assign(this.decorationOption, _d);
    }
    this.decoration = new BoxDecoration(_d);
    this.decorationOption = decoration;
    this.forceUpdate();
  }
  public setDecorationEntity(decorationEntity: BoxDecoration) {
    this.decoration = decorationEntity;
    this.forceUpdate();
  }
  //是否挂载到Gesti
  private _mounted: boolean = false;
  //瞬时缩放倍数
  protected deltaScale: number = 1;
  //是否被选中
  public selected: boolean = false;
  //图层唯一身份码
  public readonly key: string | number = +new Date();
  //是否处于镜像
  protected isMirror: boolean = false;
  //是否隐藏
  public disabled: boolean = false;
  //不透明度
  public opacity: number = 1;
  //按钮数组，所安装的按钮都在里面
  protected funcButton: Array<Button> = new Array<Button>();
  //瞬时移动delta
  protected delta: Delta = Delta.zero;
  //瞬时宽高增长
  public sizeDelta: Delta = Delta.zero;
  //实现类属于什么家族
  abstract readonly family: ViewObjectFamily;
  //是否属于背景，如果是背景，就不能被选中，且永远置于最底层
  private _background: boolean = false;
  /**
   * @description 是否冻结锁住，
   * 锁住过后可被选取，但是不能位移和改变大小
   */
  private _lock: boolean = false;
  //元素名字，可以可以被重复
  public _name: string;
  //元素唯一id
  public _id: string;
  //image kit 对象
  protected kit: ImageToolkit;
  //对象层级 => 对象在数组中的位置
  private layer: number = null;

  //初始化时的尺寸，用于计算scaleWidth,和scaleHeight
  private _fixedSize: Size = Size.zero;
  get fixedSize(): Size {
    return this._fixedSize;
  }
  public setLayer(layer: number) {
    this.layer = layer;
  }

  public getLayer(): number {
    return this.layer;
  }

  public setId(id: string): void {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  public setName(name: string): void {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }

  public mount(): void {
    this._mounted = true;
    this.onMounted();
  }
  public unMount(): void {
    if (!this._mounted) return;
    this._mounted = false;
    this.onUnMount();
  }
  protected setMount(isMounted: boolean): void {
    this._mounted = isMounted;
    this._mounted ? this.onMounted() : this.onUnMount();
  }
  get mounted(): boolean {
    return this._mounted;
  }

  public toBackground(): void {
    this._background = true;
  }
  get isBackground(): boolean {
    return this._background;
  }
  public unBackground(): void {
    this._background = false;
  }
  get isLock(): boolean {
    return this._lock;
  }
  /**
   * @description 锁住
   */
  public lock(): void {
    this._lock = true;
    this.onLock();
  }
  /**
   * @description 解锁
   */
  public unLock(): void {
    this._lock = false;
    this.onUnLock();
  }
  //当被锁定时触发
  private onLock() {
    //锁定时，自由的按钮不会消失,反之会显示
    this.funcButton.forEach((button: Button) => {
      button.disabled = !button.isFree;
    });
  }
  //解锁时触发
  private onUnLock() {
    //解锁时，自由的按钮消失,反之会显示
    this.funcButton.forEach((button: Button) => {
      button.disabled = button.isFree;
    });
  }

  protected preWhRatio: number = 0;
  protected preHwRatio: number = 0;
  //设置大小
  public setSize(size: { width?: number; height?: number }) {
    const { width, height } = size;
    if (this._fixedSize.equals(Size.zero)) {
      this.setFixedSize(size);
    }
    this.renderBox.rect.setSize(
      width ?? this.renderBox.width,
      height ?? this.renderBox.height
    );
  }
  public get absoluteScale(): number {
    return this.renderBox.absoluteScale;
  }
  /**
   * 被加入gesti内时调用
   */
  protected ready(kit: ImageToolkit): void {}

  /**
   * 重置按钮
   */
  public resetButtons(excludeNames?: Array<string>) {
    const arr = excludeNames ?? [];
    this.funcButton.forEach((button: Button) => {
      if (!arr.includes(button.name) && !button.disabled) button.reset();
    });
  }
  public setFixedSize(size: { width?: number; height?: number }): void {
    const { width, height } = size;
    this._fixedSize.setWidth(width ?? 0);
    this._fixedSize.setHeight(height ?? 0);
  }
  /**
   * @description 强制刷新画布
   */
  public forceUpdate() {
    if (this.mounted) {
      this.offScreenCanvas = null;
      this.kit.render();
    }
  }
  //导出为JSON
  abstract export(painter?: Painter): Promise<ViewObjectExportEntity>;
  //微信端导出
  abstract exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity>;
  // abstract import()
  protected onMounted(): void {}
  protected onUnMount(): void {}
  //手指抬起在范围内时调用
  protected didEventUpWithInner(): void {}
  //手指抬起在范围外时调用
  protected didEventUpWithOuter(): void {}

  set rect(newRect: Rect) {
    this.renderBox.rect = newRect;
  }

  get rect(): Rect {
    return this.renderBox.rect;
  }
  set relativeRect(value: Rect) {
    this.renderBox.relativeRect = value;
  }
  get relativeRect(): Rect {
    return this.renderBox.relativeRect;
  }
  get size(): Size {
    return this.rect.size;
  }
  public get position(): Vector {
    return this.rect.position;
  }
  get width(): number {
    return this.size.width;
  }
  get height(): number {
    return this.size.height;
  }
  get positionX(): number {
    return this.position.x;
  }
  get positionY(): number {
    return this.position.y;
  }
  public get halfWidth(): number {
    return this.rect.halfWidth;
  }
  public get halfHeight(): number {
    return this.rect.halfHeight;
  }
  get scaleWidth(): number {
    return this.rect.scaleWidth;
  }
  get scaleHeight(): number {
    return this.rect.scaleHeight;
  }
  public setScaleWidth(scale: number) {
    this.rect.setScaleWidth(scale);
  }
  public setScaleHeight(scale: number) {
    this.rect.setScaleHeight(scale);
  }
  public setPosition(x: number, y: number): void {
    this.rect.setPosition(new Vector(x, y));
  }
  public addPosition(deltaX: number, deltaY: number) {
    this.rect.addPosition(new Vector(deltaX, deltaY));
  }
  public setAngle(angle: number) {
    this.rect.setAngle(angle);
  }
}

export default BaseViewObject;
