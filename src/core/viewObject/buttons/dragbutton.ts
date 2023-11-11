import { FuncButtonTrigger } from "../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Delta } from "../../../utils/event/event";
class DragButton extends BaseButton {
  protected percentage: [x: number, y: number]=[0.5, 0.5];
  public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
  private preViewObjectRect: Rect = null;
  public oldAngle: number = 0;
  private disable: boolean = false;
  private delta: Delta;
  public radius: number = 10;
  protected preMag: number = -1;
  private angleDisabled: boolean = false;
  key: string | number = +new Date();
  constructor(
    options?: {
      angleDisabled?: boolean;
    }
  ) {
    super();
    this.rect.onDrag = (currentButtonRect: Rect) => {
      /*拖拽缩放*/
      this.rect = currentButtonRect;
      this.effect(currentButtonRect);
    };
    if (options) {
      this.angleDisabled = options.angleDisabled;
    }
  }
  updatePosition(vector: Vector): void {
    this.updateRelativePosition();
    this.setAbsolutePosition(vector);
  }
  public setAxis(axis: "ratio" | "horizontal" | "vertical" | "free") {
    
  }
  setMaster(master: ViewObject): void {
    this.master = master;
  }
  /**
   * 为拖拽改变大小初始化
   */
  private initScale() {
    this.setRelativePositionRect(this.percentage);
    this.preMag = -1;
  }
  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    if (this.preMag === -1) this.preMag = mag;
    const deltaScale: number = mag / this.preMag;
      const [offsetX,offsetY]=currentButtonRect.position.sub(this.master.position).toArray();
    this.master.setDeltaScale(deltaScale);
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
