import ViewObject from "@/core/abstract/view-object";
import GraphicsBase from "@/core/bases/graphics-base";
import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import {
  GenerateRectAngleOption,
  GradientTypes,
  GraphicsTypes,
  LineGradientDecorationOption,
} from "Graphics";

// import {
//   GenerateRectAngleOption,
//   BorderDecoration,
//   LineGradientDecoration,
//   GenerateGraphicsOption,
//   BoxDecoration,
//   GraphicsTypes,
//   LineGradientDecorationOption,
// } from "Graphics";
import {
  ViewObjectExportEntity,
  ViewObjectExportGraphics,
  ViewObjectImportGraphics,
} from "Serialization";

class Rectangle extends GraphicsBase<GenerateRectAngleOption> {
  family: ViewObjectFamily = ViewObjectFamily.graphicsRectangle;
  constructor(option: GenerateRectAngleOption) {
    super(option);
    this.option.type = "rectangle";
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
    const exportEntity: ViewObjectExportGraphics<GenerateRectAngleOption> = {
      option: this.option,
      base: this.getBaseInfo(),
      type: "graphicsRectangle",
    };
    return Promise.resolve(exportEntity);
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    return this.export();
  }
  public static reserve(
    entity: ViewObjectImportGraphics<GenerateRectAngleOption>
  ): Promise<GraphicsBase<GenerateRectAngleOption>> {
    const gradientType: GradientTypes =
      entity.option.decoration?.gradient?.type;
    const option = entity.option;
    if (gradientType == "lineGradient") {
      option.decoration.gradient = LineGradientDecoration.format(
        option.decoration.gradient as any as LineGradientDecorationOption
      );
    }
    const rectAngle: Rectangle = new Rectangle(option);
    return Promise.resolve(rectAngle);
  }
}

export default Rectangle;
