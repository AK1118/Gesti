import CatchPointUtil from "../catchPointUtil";
import { FuncButtonTrigger } from "../enums";

import RenderObject from "../interfaces/render-object";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import ViewObject from "./view-object";

//按钮抽象类
export abstract class Button implements RenderObject {
  constructor(master: ViewObject) {
    this.master = master;
  }
  name: string = "";
  //隐藏
  disabled: boolean = false;
  rect: Rect = new Rect();
  key: string | number;
  relativeRect: Rect = new Rect();
  master: ViewObject;
  //渲染UI按钮半径
  radius: number = 20;
  //点击感应范围
  senseRadius: number = 20;
  oldAngle: number;
  //初始化时按钮离主体中心点的距离
  originDistance: number;
  //初始化时与父的比例对立关系
  private scaleWithMaster: Vector;
  //是否能被锁住
  private canBeeLocking: boolean = true;
  //与寄主的位置关系，根据寄主的大小获取最初的距离
  private originPositionWithSize: Offset;
  //能被锁住就不是自由的
  get isFree(): boolean {
    return !this.canBeeLocking;
  }
  set free(canBeeLocking: boolean) {
    this.canBeeLocking = !canBeeLocking;
  }
  public options: {
    percentage?: [x: number, y: number];
    position?: Vector;
  };
  /**
   * 重置按钮坐标
   */
  public reset() {
    this.init(this.options);
  }
  /**
   * @description 设置相对定位
   * @param options
   */
  public init(options: {
    percentage?: [x: number, y: number];
    position?: Vector;
  }) {
    if(this.disabled)return;
    this.options = options;
    const { percentage, position } = options;

    if (percentage) this.setRelativePositionRect(percentage);
    else if (position) this.setRelativePosition(position);

    if (!this.originPositionWithSize)
      this.originPositionWithSize = {
        offsetx:
         ~~ (this.relativeRect.position.x),
        offsety:
         ~~ (this.relativeRect.position.y),
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
     * 关于 scale=1时，由于是相对定位，且 1/n=n,所以在等于1时需要做特殊处理
     */
    // this.scaleWithMaster = new Vector(scaleWidth == 1 ? 0 : scaleWidth, scaleHeight == 1 ? 0 : scaleHeight);
    this.scaleWithMaster = new Vector(scaleWidth, scaleHeight);
  }
  abstract trigger: FuncButtonTrigger;
  abstract setMaster(master: RenderObject): void;
  abstract effect(rect?: Rect): void;
  abstract updatePosition(vector: Vector): void;
  abstract draw(paint: Painter): void;
  abstract render(paint: Painter): void;
  abstract onSelected(): void;
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
  /**
   * @description 根据父Box的大小宽度比作为基础定位
   * @param percentage ,占比值，四个点坐标
   */
  public setRelativePositionRect(percentage: [x: number, y: number]) {
    const { width, height } = this.master.rect.size;
    const [percent_x, percent_y] = percentage;
  
    //更改相对定位，看好了，这可是按钮类里面的
    this.relativeRect.position = new Vector(
      width * percent_x,
      height * percent_y
    );
  }
  public updateRelativePosition() {
    const master: Size = this.master.rect.size;
    const { width, height } = master;

    let newWidth = width / this.scaleWithMaster.x,
      newHeight = height / this.scaleWithMaster.y;
    if (this.scaleWithMaster.x == 0) newWidth = 0;
    if (this.scaleWithMaster.y == 0) newHeight = 0;
    this.relativeRect.position.setXY(newWidth, newHeight);
    this.originDistance = Vector.mag(this.relativeRect.position);
  }
  public setRelativePosition(position: Vector) {
    this.relativeRect.position = position;
  }
  hide(): void {
    this.disabled=true;
  }
  get position():Vector{
    return this.rect.position;
  }
  setSenseRadius(senseRadius:number){
    this.senseRadius=senseRadius;
    this.radius=senseRadius;
    this.reset()
  }
  abstract drawButton(position:Vector,size:Size,radius:number,paint:Painter):void;
}

export default Button;
