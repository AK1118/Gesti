import ViewObject from "@/core/abstract/view-object";
import GraphicsBase from "@/core/bases/graphics-base";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import {
  getOffscreenCanvasContext,
  getOffscreenCanvasWidthPlatform,
} from "@/utils/canvas";
import {
  GenerateRectAngleOption,
  BorderDecoration,
  LineGradientDecoration,
  GenerateGraphicsOption,
  BoxDecoration,
} from "Graphics";
import { ViewObjectExportEntity } from "Serialization";

class Rectangle extends GraphicsBase<GenerateRectAngleOption> {
  family: ViewObjectFamily;
  constructor(option: GenerateRectAngleOption) {
    super(option);
    const { width, height } = option;
    this.rect.setSize(width, height);
    this.useCache();
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    this.renderGraphics(paint);
    //paint.drawImage(this.cachedOffscreenCanvas, 0, 0, this.width, this.height);
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
      if (gradient) {
        paint.fillStyle = gradient.getGradient(paint, this.size);
      }
      paint.translate(this.width * 0.5, this.height * 0.5);
      paint.fillRect(
        this.width * -0.5,
        this.height * -0.5,
        this.width,
        this.height
      );
    } else {
      paint.fillRect(
        this.width * -0.5,
        this.height * -0.5,
        this.width,
        this.height
      );
    }
    paint.closePath();
    paint.restore();
  }
  // protected renderBorder(paint: Painter): void {
  //   if (!this.borderDecoration) return;
  //   const {
  //     borderColor = "black",
  //     lineDash = [],
  //     borderWidth = 1,
  //     innerBorder = false,
  //     gradient = null,
  //   } = this.borderDecoration;
  //   paint.beginPath();
  //   paint.strokeStyle = borderColor;
  //   if (gradient) {
  //     paint.strokeStyle = gradient.getGradient(paint, this.size);
  //   }
  //   paint.lineWidth = borderWidth;
  //   paint.setLineDash(lineDash);
  //   const factor: number = innerBorder ? -1 : 1;
  //   const bw = this.width + borderWidth * factor,
  //     bh = this.height + borderWidth * factor;
  //   paint.strokeRect(bw * -0.5, bh * -0.5, bw, bh);
  //   paint.stroke();
  //   paint.closePath();
  // }
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
