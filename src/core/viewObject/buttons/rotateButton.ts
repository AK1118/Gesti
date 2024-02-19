import {  FuncButtonTrigger } from "../../enums";
import Alignment from "@/core/lib/painting/alignment";
import BaseButton, { ButtonOption } from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Icon } from "@/core/lib/icon";
import RotateIcon from "@/static/icons/rotateIcon";

class RotateButton extends BaseButton {
  readonly name: ButtonNames="RotateButton";
  public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
  protected icon: Icon=new RotateIcon();
  private oldViewObjectRect: Rect = null;
  private oldRadius: number = 0;
  public oldAngle: number = 0;
  public radius: number = 10;
  private disable: boolean = false;
  key: string | number = +new Date();
  protected buttonAlignment:Alignment=Alignment.bottomCenter;
  constructor(buttonOption?: ButtonOption) {
    super(buttonOption);
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
    this.master.rect.setAngle(angle);
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
}

export default RotateButton;
