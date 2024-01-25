import ViewObject from "@/core/abstract/view-object";
import GraphicsBase from "@/core/bases/graphics-base";
import { ViewObjectFamily } from "@/core/enums";
import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
import Painter from "@/core/lib/painter";
import BoxDecoration from "@/core/lib/rendering/decorations/box-decoration";
import XImage from "@/core/lib/ximage";
import { reverseXImage } from "@/utils/utils";
import {
  BoxDecorationOption,
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

class Rectangle extends GraphicsBase<
  GenerateRectAngleOption,
  BoxDecorationOption,
  BoxDecoration
> {
  family: ViewObjectFamily = ViewObjectFamily.graphicsRectangle;
  constructor(option: GenerateRectAngleOption) {
    super(option,(option)=>{
      return new BoxDecoration(option);
    });
    this.option.type = "rectangle";
    const { width, height } = option;
    this.rect.setSize(width, height);
    this.useCache();
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  setDecoration(option: BoxDecorationOption): void {}
  drawImage(paint: Painter): void {
    this.renderGraphics(paint);
  }
  protected renderGraphicsBorder(paint: Painter): void {
    throw new Error("Method not implemented.");
  }
  protected renderGraphics(paint: Painter): void {
    this.decoration.render(paint, this.rect);
  }
  export(painter?: Painter): Promise<ViewObjectExportGraphics> {
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
  public static async reserve(
    entity: ViewObjectImportGraphics<GenerateRectAngleOption>
  ): Promise<
    GraphicsBase<GenerateRectAngleOption, BoxDecorationOption, BoxDecoration>
  > {
    const option = entity.option;
    const rectAngle: Rectangle = new Rectangle(option);
    return Promise.resolve(rectAngle);
  }
}

class InteractiveImage extends Rectangle {
  constructor(xImage: XImage, decoration: BoxDecorationOption = {}) {
    super({
      width: xImage.width,
      height: xImage.height,
      decoration: {
        ...decoration,
        backgroundImage: xImage,
      },
    });
  }
}
export default Rectangle;
export { InteractiveImage };
