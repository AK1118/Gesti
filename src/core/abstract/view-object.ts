import RenderObject from "../interfaces/render-object";
import Painter from "../lib/painter";
import Rect from "../lib/rect";
import Vector from "../lib/vector";
import { Point } from "../lib/vertex";
import Button from "./baseButton";
import OperationObserver from "./operation-observer";
import AuxiliaryLine from "../../tools/auxiliary-lines";
import GestiConfig from "../../config/gestiConfig";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../lib/image-toolkit";
import { Delta } from "../../utils/event/event";
//转换为json的类型
export type toJsonType = "image" | "text" | "write";

export interface toJSONInterface {
  viewObjType: toJsonType;
  options: Object;
}

/**
 * 图层基类
 */
abstract class BaseViewObject extends OperationObserver {
  //是否挂载到Gesti
  private _mounted: boolean = false;
  //缩放倍数
  protected scale: number = 1;
  //是否被选中
  protected selected: boolean = false;
  //图层唯一身份码
  public readonly key: string | number = +new Date();
  //是否处于镜像
  protected isMirror: boolean = false;
  //是否隐藏
  public disabled: boolean = false;
  //描述对象在二维坐标中的平面信息数据
  private _rect: Rect;
  //相对于自身描述对象在二维坐标中的平面信息数据
  private _relativeRect: Rect;
  //不透明度
  public opacity: number = 1;
  //按钮数组，所安装的按钮都在里面
  protected funcButton: Array<Button> = new Array<Button>();
  //瞬时移动delta
  protected delta: Delta = Delta.zero;
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
  private layer: number = 0;

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
    this.onMount();
  }
  public unMount(): void {
    this._mounted = false;
    this.onUnMount();
  }

  get mounted(): boolean {
    return this._mounted;
  }

  set relativeRect(value: Rect) {
    this._relativeRect = value;
  }
  get relativeRect(): Rect {
    return this._relativeRect;
  }
  set rect(value: Rect) {
    this._rect = value;
    this.relativeRect = value;
  }
  get rect(): Rect {
    return this._rect;
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
  /**
   * @description 强制刷新画布
   */
  protected forceUpdate(){
    this.kit.render();
  }
  protected onMount(): void {}
  protected onUnMount(): void {}
  //手指抬起在范围内时调用
  protected didEventUpWithInner(): void {}
  //手指抬起在范围外时调用
  protected didEventUpWithOuter(): void {}
}

abstract class ViewObject extends BaseViewObject implements RenderObject {
  //辅助线
  private auxiliary: AuxiliaryLine;
  public originFamily: ViewObjectFamily;

  constructor() {
    super();
    this.rect = Rect.zero;
    this.relativeRect = Rect.zero;
  }
  //获取对象值
  abstract get value(): any;
  /**
   * 被加入gesti内时调用
   */
  public ready(kit: ImageToolkit): void {}
  public initialization(kit: ImageToolkit): void {
    this.kit = kit;
    //初始化一些数据，准备挂载
    this.ready(kit);
    //添加监听
    this.addObserver(this);
    //初始化矩阵点
    this.rect.updateVertex();
    //挂载
    this.mount();
  }
  //设置大小
  public setSize(size: { width?: number; height?: number }) {
    const { width, height } = size;
    this.rect.setSize(
      width ?? this.rect.size.width,
      height ?? this.rect.size.height
    );
  }
  //卸载按钮
  public unInstallButton(buttons: Array<Button>) {
    this.funcButton = this.funcButton.filter((item) => !buttons.includes(item));
  }
  //安装按钮
  public installButton(button: Button) {
    button.initialization(this);
    this.funcButton.push(button);
  }
  /**
   * 重置按钮
   */
  public resetButtons(excludeNames?: Array<string>) {
    const arr = excludeNames ?? [];
    this.funcButton.forEach((button: Button) => {
      if (!arr.includes(button.name) && !button.disabled) button.reset();
    });
  }

  public mirror(): boolean {
    this.isMirror = !this.isMirror;
    return this.isMirror;
  }
  public render(paint: Painter, isCache?: boolean) {
    if (!this.mounted) return;
    this.draw(paint, isCache);
  }

  abstract setDecoration(args: any): void;
  
  private renderCache(paint: Painter) {
    this.drawImage(paint);
  }
   
  public draw(paint: Painter, isCache?: boolean): void {
    //渲染缓存不需要设置或渲染其他属性
    if (isCache) return this.renderCache(paint);
    paint.beginPath();
    paint.save();
    //缓存不需要这两个
    paint.translate(this.rect.position.x, this.rect.position.y);
    paint.rotate(this.rect.getAngle);
    if (this.isMirror) paint.scale(-1, 1);
    paint.globalAlpha = this.opacity;
    this.drawImage(paint);
    paint.globalAlpha = 1;
    if (this.isMirror) paint.scale(-1, 1);
    if (this.selected) {
      //边框
      this.drawSelected(paint);
      //按钮
      this.updateFuncButton(paint);
    } else {
      //根据配置开关虚线框
      if (GestiConfig.dashedLine) this.strokeDashBorder(paint);
    }

    paint.restore();
    paint.translate(0, 0);
    /*更新顶点数据*/
    this.rect.updateVertex();
    paint.closePath();
    // if (this.selected) {
    //   //辅助线
    //   this.auxiliary?.draw(paint, this);
    // }
  }

  /**
   * 该方法需要子类实现
   * @param paint
   */
  abstract drawImage(paint: Painter): void;
  /**
   * 被选中后外边框
   * @param paint
   */
  public drawSelected(paint: Painter): void {
    paint.beginPath();
    paint.lineWidth = 2;
    paint.strokeStyle = "#fff";
    paint.strokeRect(
      -this.rect.size.width >> 1,
      -this.rect.size.height >> 1,
      this.rect.size.width + 1,
      this.rect.size.height + 1
    );
    paint.closePath();
    paint.stroke();
  }
  /**
   * 对象渲染虚线框
   */
  public strokeDashBorder(paint: Painter): void {
    paint.closePath();
    paint.beginPath();
    paint.lineWidth = 1;
    paint.setlineDash([3, 3]);
    paint.strokeStyle = "#999";
    paint.strokeRect(
      -this.rect.size.width >> 1,
      -this.rect.size.height >> 1,
      this.rect.size.width + 1,
      this.rect.size.height + 1
    );
    paint.closePath();
    paint.stroke();
    paint.setlineDash([]);
  }
  /**
   * 镜像翻转
   */
  public setMirror(isMirror: boolean) {
    this.isMirror = isMirror;
  }
  /**
   * @description 刷新功能点
   * @param paint
   */
  private updateFuncButton(paint: Painter): void {
    const rect: Rect = this.rect;
    const x: number = rect.position.x,
      y: number = rect.position.y;
    this.funcButton.forEach((button: Button) => {
      const len: number = button.originDistance;
      if (button.disabled) return;
      const angle = this.rect.getAngle + button.oldAngle;
      const newx = Math.cos(angle) * len + x;
      const newy = Math.sin(angle) * len + y;
      const vector = new Vector(~~newx, ~~newy);
      button.updatePosition(vector);
      button.render(paint);
    });
  }
  /**
   * @description 功能点是否被点击
   * @param eventPosition
   * @returns
   */
  public checkFuncButton(eventPosition: Vector): Button | boolean {
    /**
     * 遍历功能键
     * 传入的时global位置，转换为相对位置判断是否点击到按钮
     */
    const event: Vector = Vector.sub(eventPosition, this.rect.position);
    const button: Button = this.funcButton.find((button: Button) => {
      if (button.disabled) return false;
      const angle = button.oldAngle + this.rect.getAngle;
      const x = Math.cos(angle) * button.originDistance;
      const y = Math.sin(angle) * button.originDistance;
      const buttonPosi: Vector = new Vector(x, y);
      return button.isInArea(event, buttonPosi);
    });
    return button;
  }
  public hide() {
    this.disabled = true;
    this.onHide();
    this.cancel();
  }
  public getVertex(): Point[] {
    return this.rect.vertex?.getPoints();
  }
  public onSelected() {
    //被选中过后对所有图层点进行备份，不需要每次渲染都获取一次
    this.auxiliary?.createReferencePoint(this.key.toString());
    this.selected = true;
  }
  public cancel() {
    this.selected = false;
  }
  //
  public onUpWithInner(paint: Painter) {
    /*在抬起鼠标时，ViewObject还没有被Calcel，为再次聚焦万向按钮做刷新数据*/
    this.onChanged();
    this.didEventUpWithInner();
  }
  public onUpWithOuter(paint: Painter): void {
    this.didEventUpWithOuter();
  }
  private readonly enlargeScale: number = 1.1;
  private readonly narrowScale: number = 1 / 1.1;
  public enlarge() {
    this.scale = this.enlargeScale;
    this.rect.setScale(this.scale);
    this.doScale();
  }
  public narrow() {
    this.scale = this.narrowScale;
    this.rect.setScale(this.scale);
    this.doScale();
  }
  private doScale() {
    if (this.isLock) return;
    this.onChanged();
  }
  public setScale(scale: number) {
    this.scale = scale;
    this.rect.setScale(scale);
  }
  /*每次改变大小后都需要刷新按钮的数据*/
  public onChanged() {
    this.funcButton.forEach((item: Button) => {
      item.setMaster(this);
    });
  }
  /**
   * 世界坐标居中
   */
  public center(canvasSize: Size, axis?: CenterAxis) {
    if (axis) {
      if (axis == "vertical")
        return (this.rect.position = new Vector(
          this.rect.position.x,
          canvasSize.height >> 1
        ));
      if (axis == "horizon")
        return (this.rect.position = new Vector(
          canvasSize.width >> 1,
          this.rect.position.y
        ));
    }
    const x = canvasSize.width >> 1,
      y = canvasSize.height >> 1;
    this.rect.position = new Vector(x, y);
  }
  protected _didChangeScale(scale: number): void {}
  protected _didChangePosition(position: Vector): void {
    if (!this.delta) this.delta = new Delta(position.x, position.y);
    this.delta.update(position.copy());
  }
  /**
   * 撤销 | 取消撤销回调
   */
  public didFallback() {}
  //导出为JSON
  abstract export(painter?: Painter): Promise<Object>;
  //微信端导出
  abstract exportWeChat(painter?: Painter, canvas?: any): Promise<Object>;
  /**
   * @description 提供公用基础信息导出
   * @returns
   */
  public getBaseInfo(): Object {
    return {
      rect: {
        x: ~~this.rect.position.x,
        y: ~~this.rect.position.y,
        width: ~~this.rect.size.width,
        height: ~~this.rect.size.height,
        angle: this.rect.getAngle,
      },
      relativeRect: {
        x: ~~this.relativeRect.position.x,
        y: ~~this.relativeRect.position.y,
        width: ~~this.relativeRect.size.width,
        height: ~~this.relativeRect.size.height,
        angle: this.rect.getAngle,
      },
      mirror: this.isMirror,
      locked: this.isLock,
      buttons: this.funcButton.map((button: Button) => button.constructor.name),
      id: this.id,
      layer: this.getLayer(),
      isBackground: this.isBackground,
    };
  }
  /**
   * 自定义一些操作
   */
  public custom() {}

  public setPosition(x: number, y: number): void {
    this.rect.setPosition(new Vector(x, y));
  }
  public addPosition(deltaX: number, deltaY: number) {
    this.rect.addPosition(new Vector(deltaX, deltaY));
  }
  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }
  public setAngle(angle: number) {
    this.rect.setAngle(angle);
  }
}

export default ViewObject;
