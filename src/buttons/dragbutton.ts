import { FuncButtonTrigger } from "../enums";

import BaseButton from "../abstract/baseButton";
import Painter from "../painter";
import Rect, { Size } from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";
import ViewObject from "../abstract/view-object";
import GestiConfig from "../config/gestiConfig";
import { Delta } from "../event";
class DragButton extends BaseButton {
  public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
  private preViewObjectRect: Rect = null;
  public oldAngle: number = 0;
  private disable: boolean = false;
  private delta: Delta;
  public radius: number = 10;
  protected preMag: number = -1;
  private angleDisabled: boolean = false;
  //拉伸变化方式  比例   水平  垂直   自由
  private axis: "ratio" | "horizontal" | "vertical" | "free" = "ratio";
  key: string | number = +new Date();

  constructor(
    master: ViewObject,
    options?: {
      axis?: "ratio" | "horizontal" | "vertical" | "free";
      angleDisabled?: boolean;
    }
  ) {
    super(master);
    this.init({ percentage: [0.5, 0.5] });
    this.initScale();
    this.rect.onDrag = (currentButtonRect: Rect) => {
      /*拖拽缩放*/
      this.rect = currentButtonRect;
      this.effect(currentButtonRect);
    };
    if (options) {
      this.axis = options.axis ?? "ratio";
      this.angleDisabled = options.angleDisabled;
    }
  }
  updatePosition(vector: Vector): void {
    this.updateRelativePosition();
    this.setAbsolutePosition(vector);
  }
  public setAxis(axis: "ratio" | "horizontal" | "vertical" | "free") {
    this.axis = axis;
  }
  setMaster(master: ViewObject): void {
    this.master = master;
  }
  /**
   * 为拖拽改变大小初始化
   */
  private initScale() {
    this.setRelativePositionRect(this.options.percentage);
    this.preMag = -1;
  }
  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    if (this.preMag === -1) this.preMag = mag;
    const deltaScale: number = mag / this.preMag;
      const [offsetX,offsetY]=currentButtonRect.position.sub(this.master.position).toArray();
    this.master.setScale(deltaScale);
    if (!this.angleDisabled) {
      const angle = Math.atan2(offsetY, offsetX) - this.oldAngle;
      this.master.rect.setAngle(angle);
    }
    this.preMag = mag;
  }

  protected getButtonWidthMasterMag(currentButtonRect: Rect): number {
    const currentButtonPosition: Vector = currentButtonRect.position;
    const currentMasterPosition: Vector = this.master.rect.position;
    const mag: number = Vector.mag(
      Vector.sub(currentButtonPosition, currentMasterPosition)
    );
    return mag;
  }
  /**
   * @param {ImageRect} currentButtonRect
   * @description 万向点的坐标是基于 @ViewObject 内的Rect @ImageRect 的，所以得到的一直是相对坐标
   */
  // effect(currentButtonRect: Rect): void {
  //   const preViewObject = this.preViewObjectRect;
  //   // console.log([currentButtonRect.position,preViewObject.position])
  //   const [offsetX,offsetY]=currentButtonRect.position.sub(preViewObject.position).toArray();

  //   console.log("之前",[offsetX,offsetY]);

  //   /*等比例缩放*/
  //   const scale = Vector.mag(new Vector(offsetX, offsetY)) / this.oldRadius;

  //   console.log();

  //   let deltaScale = 1 + (scale - this.preScale);

  //   /*不适用于scale函数，需要基于原大小改变*/
  //   let newWidth = preViewObject.size.width *scale,
  //     newHeight = preViewObject.size.height*scale;

  //   // if (this.axis == "horizontal") {
  //   //   newHeight = preViewObject.size.height;
  //   // } else if (this.axis == "vertical") {
  //   //   newWidth = preViewObject.size.width;
  //   // } else if (this.axis == "ratio") {
  //   // } else if (this.axis == "free") {
  //   //   newWidth = preViewObject.size.width * ((offsetX * 1.5) / this.oldRadius);
  //   //   newHeight = preViewObject.size.height * ((offsetY * 1.5) / this.oldRadius);
  //   // }
  //   console.log("之后",newWidth===newHeight);
  //   this.master.rect.setSize(newWidth, newHeight, true);

  //   /*this.oldAngle为弧度，偏移量*/
  //   if (!this.angleDisabled) {
  //     const angle = Math.atan2(offsetY, offsetX) - this.oldAngle;
  //     if (this.axis == "ratio") this.master.rect.setAngle(angle, true);
  //   }
  //   this.master.rect.setScale(deltaScale, false);
  //   this.preScale = scale;

  // }
  public get getOldAngle(): number {
    return this.oldAngle;
  }
  public render(paint: Painter): void {
    if (!this.delta) this.delta = new Delta(this.position.x, this.position.y);
    this.delta.update(this.position.copy());
    this.draw(paint);
  }
  onSelected(): void {
    this.preViewObjectRect = this.master.rect.copy();
    this.initScale();
  }
  hide() {
    this.disable = true;
  }
  show() {
    this.disable = false;
  }
  draw(paint: Painter): void {
    this.drawButton(
      this.relativeRect.position,
      this.master.rect.size,
      this.radius,
      paint
    );
  }
  drawButton(
    position: Vector,
    size: Size,
    radius: number,
    paint: Painter
  ): void {
    const { width, height } = size;
    const halfRadius = this.radius * 0.75;
    const x = position.x,
      y = position.y;
    paint.beginPath();
    paint.fillStyle = GestiConfig.theme.buttonsBgColor;
    paint.arc(x, y, this.radius, 0, Math.PI * 2);
    paint.closePath();
    paint.fill();
    Widgets.drawGrag(paint, {
      offsetX: x - halfRadius + 2,
      offsetY: y - halfRadius + 2,
    });
  }
}

export default DragButton;
