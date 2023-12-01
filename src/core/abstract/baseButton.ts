import {  FuncButtonTrigger } from "@/core/enums";
import RenderObject from "../interfaces/render-object";
import Painter from "@/core/lib/painter";
import CatchPointUtil from "../../utils/event/catchPointUtil";
import ViewObject from "./view-object";
import Rect from "../lib/rect";
import Vector from "../lib/vector";
import { Icon } from "../lib/icon";
import DefaultIcon from "@/static/icons/defaultIcon";
import GestiConfig from "@/config/gestiConfig";
import Alignment from "../lib/painting/alignment";
export type ButtonOption = {
  alignment?: Alignment;
  icon?: Icon;
};
//按钮抽象类
export abstract class BaseButton implements RenderObject {
  protected icon: Icon = new DefaultIcon({
    color: "#c1c1c1",
    size: 10,
  });
  public iconColor:string="#c1c1c1";
  //自定义位置
  private customAlignment: Alignment;
  /**
   * 获取按钮的位置枚举
   */
  get btnLocation(): Alignment {
    return this.buttonAlignment;
  }
  private customIcon: Icon;
  //是否显示背景，按钮默认有一个白色背景
  public displayBackground: boolean = true;
  public background: string = "rgba(255,255,255,.8)";
  constructor(option?: ButtonOption) {
    if (!option) return;
    this.customAlignment = option?.alignment;
    console.log(this.customAlignment);
    this.customIcon = option?.icon;
  }
  protected abstract buttonAlignment: Alignment;
  abstract readonly name: ButtonNames;
  //隐藏
  disabled: boolean = false;
  rect: Rect = new Rect();
  key: string | number;
  relativeRect: Rect = new Rect();
  master: ViewObject;
  //渲染UI按钮半径
  radius: number = 10;
  //点击感应范围
  senseRadius: number = 10;
  oldAngle: number;
  //初始化时按钮离主体中心点的距离
  originDistance: number;
  //初始化时与父的比例对立关系
  private scaleWithMaster: Vector;
  //是否能被锁住
  private canBeeLocking: boolean = true;
  //与寄主的位置关系，根据寄主的大小获取最初的距离
  private originPositionWithSize: Offset;
  private _mounted: boolean = false;
  get mounted(): boolean {
    return this._mounted;
  }
  public mount(): void {
    this._mounted = true;
  }
  public unMount(): void {
    this._mounted = false;
  }
  //能被锁住就不是自由的
  get isFree(): boolean {
    return !this.canBeeLocking;
  }
  set free(canBeeLocking: boolean) {
    this.canBeeLocking = !canBeeLocking;
  }

  private location: [x: number, y: number];
  /**
   * 重置按钮坐标
   */
  public reset() {
    this.computeSelfLocation();
  }
  public onUpWithInner(): void {}
  public onUpWithOuter(): void {}
  /**
   * @description 设置相对定位
   * @param options
   */
  public computeSelfLocation() {
    if (this.disabled) return;
    this.computeRelativePositionByLocation();
    if (!this.originPositionWithSize)
      this.originPositionWithSize = {
        offsetX: ~~this.relativeRect.position.x,
        offsetY: ~~this.relativeRect.position.y,
      };
    this.setAbsolutePosition();
    this.oldAngle = Math.atan2(
      ~~this.relativeRect.position.y,
      ~~this.relativeRect.position.x
    );
    //相对定位到中心的距离
    this.originDistance = Vector.mag(this.relativeRect.position);

    let scaleWidth = 0,
      scaleHeight = 0;
    if (this.relativeRect.position.x != 0) {
      scaleWidth = this.master.rect.size.width / this.relativeRect.position.x;
    }
    if (this.relativeRect.position.y != 0) {
      scaleHeight = this.master.rect.size.height / this.relativeRect.position.y;
    }
    /**
     * 获取比例关系，后续依赖这个关系改变
     */
    this.scaleWithMaster = new Vector(scaleWidth, scaleHeight);
  }

  abstract trigger: FuncButtonTrigger;
  abstract setMaster(master: RenderObject): void;
  abstract effect(currentButtonRect?: Rect): void;
  abstract updatePosition(vector: Vector): void;
  draw(paint: Painter): void {
    //是否显示背景
    if (this.displayBackground)
      this.renderBackground(paint, this.relativeRect.position);
    this.drawButton(
      this.relativeRect.position,
      this.master.rect.size,
      this.radius,
      paint
    );
  }
  private renderBackground(paint: Painter, position: Vector): void {
    paint.beginPath();
    paint.arc(position.x, position.y, this.senseRadius, 0, Math.PI * 2);
    paint.closePath();
    paint.fillStyle = this.background;
    paint.fill();
  }
  render(paint: Painter): void {
    this.draw(paint);
  }
  abstract onSelected(): void;
  public initialization(master: ViewObject) {
    this.master = master;
    this.beforeMounted();
    this.location = this.setLocationByAlignment(this.customAlignment);
    this.icon = this.customIcon || this.icon;
    //icon的大小等于半径
    this.icon.setSize(this.radius);
    this.computeSelfLocation();
    this.mount();
    this.afterMounted();
  }
  protected beforeMounted(...args): void {}
  protected afterMounted(...args): void {}
  get getAbsolutePosition(): Vector {
    return Vector.add(this.relativeRect.position, this.master.rect.position);
  }
  get getRelativePosition(): Vector {
    return this.relativeRect.position;
  }
  public setAbsolutePosition(vector?: Vector) {
    this.rect.position = vector || this.getAbsolutePosition;
  }
  public isInArea(event: Vector, target: Vector): boolean {
    if (this.master.isLock && this.canBeeLocking) return false;
    return CatchPointUtil.checkInsideArc(target, event, this.senseRadius);
  }
  protected setLocationByAlignment(
    _location?: Alignment
  ): [x: number, y: number] {
    //如果没有自定义位置，就使用自己的位置
    const location = _location ?? this.buttonAlignment;
    this.buttonAlignment = location;
    const {offsetX,offsetY}:Offset=this.buttonAlignment.compute(this.master.size);
    console.log(offsetX,offsetY);
    return [offsetX,offsetY];
  }
  /**
   * @description 根据父Box的大小宽度比作为基础定位
   * @param location ,占比值，四个点坐标
   */
  private computeRelativePositionByLocation() {
    const { width, height } = this.master.rect.size;
    const {offsetX,offsetY}= this.buttonAlignment.compute(this.master.size);
    // const [cx, cy] = this.getFixedLocationPosition(
    //   this.buttonAlignment,
    //   width,
    //   height,
    //   percent_x,
    //   percent_y
    // );
    //更改相对定位，看好了，这可是按钮类里面的
    this.relativeRect.position.setXY(offsetX, offsetY);
  }
  public getOriginDistance(): number {
    return this.originDistance;
  }
  /**
   * @description 渲染按钮时用的点是相对坐标
   * @abstract
   * @returns
   */
  protected updateRelativePosition() {
    const master: Size = this.master.size;
    const { width, height } = master;
    if (!this.scaleWithMaster) {
      this.scaleWithMaster = new Vector(1, 1);
      return;
    }
    let newX = width / this.scaleWithMaster.x,
      newY = height / this.scaleWithMaster.y;
    if (this.scaleWithMaster.x == 0) newX = 0;
    if (this.scaleWithMaster.y == 0) newY = 0;
    this.relativeRect.position.setXY(newX, newY);
    this.computeRelativePositionByLocation();
    this.originDistance = Vector.mag(this.relativeRect.position);
  }
  public setRelativePosition(position: Vector) {
    this.relativeRect.position = position;
  }
  hide(): void {
    this.disabled = true;
  }
  get position(): Vector {
    return this.rect.position;
  }
  setSenseRadius(senseRadius: number) {
    this.senseRadius = senseRadius;
    this.radius = senseRadius;
    if (!this.mounted) return;
    this.icon.setSize(this.radius);
    this.reset();
  }
  
  //设置Icon颜色
  public setIconColor(color: string) {
    this.iconColor=color;
    this.icon.setColor(color);
  }
  /**
   * @description 关闭背景
   */
  public hideBackground() {
    this.displayBackground = false;
  }
  public setBackgroundColor(color: string) {
    this.background = color;
  }
  public setLocation(location: Alignment): void {
    this.customAlignment = location;
    this.buttonAlignment = location;
    //如果已经被初始化
    if (this.mounted) {
      this.initialization(this.master);
    }
  }

  protected drawButton(
    position: Vector,
    size: Size,
    radius: number,
    paint: Painter
  ) {
    this.icon.render(paint, position);
  }
}

export default BaseButton;
