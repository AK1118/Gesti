import { FuncButtonTrigger } from "../../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../../painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";

class RotateButton extends BaseButton {
  public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
  private oldViewObjectRect: Rect = null;
  private oldRadius: number = 0;
  public oldAngle: number = 0;
  public radius: number = 10;
  private disable: boolean = false;
  key: string | number = +new Date();
  constructor(master: ViewObject) {
    super(master);
    this.name = "rotate";
    this.init({
      position: new Vector(0, master.rect.size.height * 0.5 + 10),
    });
    this.initScale();
    this.rect.onDrag = (newRect: Rect) => {
      /*拖拽缩放*/
      this.rect = newRect;
      this.effect(newRect);
    };
  }
  updatePosition(vector: Vector): void {
    this.updateRelativePosition();
    this.setAbsolutePosition(vector);
  }
  setMaster(master: ViewObject): void {
    this.master = master;
  }
  /**
   * 为拖拽改变大小初始化
   */
  private initScale() {
    this.oldRadius = Vector.mag(this.relativeRect.position);
  }
  effect(currentButtonRect: Rect): void {
    const [offsetX, offsetY] = currentButtonRect.position
      .sub(this.master.position)
      .toArray();
    let angle = Math.atan2(offsetY, offsetX) - this.oldAngle;
    {
      let _angle = +angle.toFixed(2);
      const _45 = 0.78;
      const limit = 0.1;
      const scale = (angle / 0.78) >> 0;
      angle = Math.abs(_angle - scale * _45) < limit ? scale * _45 : _angle;
    }
    this.master.rect.setAngle(angle, true);
  }
  public get getOldAngle(): number {
    return this.oldAngle;
  }
  public render(paint: Painter): void {
    this.draw(paint);
  }
  onSelected(): void {
    this.oldViewObjectRect = this.master.rect.copy();
    this.initScale();
  }
  hide() {
    this.disable = true;
  }
  show() {
    this.disable = false;
  }
  draw(paint: Painter) {
    if (this.disable) return;
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
    Widgets.drawRotate(paint, {
      offsetX: x,
      offsetY: y,
    });
  }
}

export default RotateButton;
