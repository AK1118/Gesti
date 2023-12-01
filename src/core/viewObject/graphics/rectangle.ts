import ViewObject from "@/core/abstract/view-object";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import {
  GenerateRectAngleOption,
  BorderDecoration,
  LineGradientDecoration,
} from "Graphics";
import { ViewObjectExportEntity } from "Serialization";

class Rectangle extends ViewObject {
  family: ViewObjectFamily;
  private decoration: GenerateRectAngleOption;
  private borderDecoration: BorderDecoration;
  constructor(option: GenerateRectAngleOption) {
    super();
    const { width, height } = option;
    this.decoration = option;
    this.borderDecoration = option?.borderDecoration;
    this.rect.setSize(width, height);
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    const { backgroundColor, gradient } = this.decoration;
    paint.beginPath();
    paint.save();
    paint.fillStyle = backgroundColor ?? "black";
    if (gradient) {
      paint.fillStyle = gradient.getGradient(paint);
    }
    paint.fillRect(
      this.width * -0.5,
      this.height * -0.5,
      this.width,
      this.height
    );
    this.renderBorder(paint);
    paint.closePath();
    paint.restore();
  }
  private renderBorder(paint: Painter): void {
    if (!this.borderDecoration) return;
    const {
      borderColor = "black",
      lineDash = [],
      borderWidth = 1,
      innerBorder = false,
      gradient = null,
    } = this.borderDecoration;
    paint.beginPath();
    paint.strokeStyle = borderColor;
    if (gradient) {
      paint.strokeStyle = gradient.getGradient(paint);
    }
    paint.lineWidth = borderWidth;
    paint.setLineDash(lineDash);
    const factor: number = innerBorder ? -1 : 1;
    const bw = this.width + borderWidth * factor,
      bh = this.height + borderWidth * factor;
    paint.strokeRect(bw * -0.5, bh * -0.5, bw, bh);
    paint.stroke();
    paint.closePath();
  }
  export(painter?: Painter): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    return this.export();
  }
}

export default Rectangle;
