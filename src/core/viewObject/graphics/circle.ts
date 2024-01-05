import GraphicsBase from "@/core/bases/graphics-base";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import { GenerateCircleOption } from "Graphics";
import { ViewObjectExportEntity } from "Serialization";

class Circle extends GraphicsBase<GenerateCircleOption> {
  constructor(option: GenerateCircleOption) {
    super(option);
    this.option.type = "circle";
    this.rect.setSize(option.radius * 2, option.radius * 2);
  }
  protected renderGraphicsBorder(paint: Painter): void {
    throw new Error("Method not implemented.");
  }
  protected renderGraphics(paint: Painter): void {
    const { backgroundColor, gradient } = this.decoration;
    paint.beginPath();
    paint.save();
    paint.fillStyle = backgroundColor ?? "black";

    if (this.canRenderCache) {
      paint.translate(this.width * 0.5, this.height * 0.5);
      if (gradient) paint.fillStyle = gradient.getGradient(paint, this.size);
      paint.arc(0, 0, this.width * 0.5, 0, Math.PI * 2);
    } else {
      paint.arc(0, 0, this.width * 0.5, 0, Math.PI * 2);
    }
    paint.fill();
    paint.restore();
    paint.closePath();
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    this.renderGraphics(paint);
  }
  family: ViewObjectFamily;
  export(painter?: Painter): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
}

export default Circle;
