import ViewObject from "@/core/abstract/view-object";
import { ViewObjectFamily } from "@/core/enums";
import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
import ImageToolkitAdapterController from "@/core/lib/image-tool-kit/adpater";
import Painter, { PaintingStyle } from "@/core/lib/painter";
import Alignment from "@/core/lib/painting/alignment";
import Vector from "@/core/lib/vector";
import { TextPainter, TextSpan, TextStyle } from "@/test/text-painter";
import { ForegroundOption, TextStyleOption } from "@/types/paragraph";
import { ViewObjectExportEntity } from "Serialization";
class ParagraphBox extends ViewObject {
  private textPainter: TextPainter;
  private text: TextSpan;
  private textStyle: TextStyle;
  private option: Partial<TextStyleOption & ForegroundOption>;
  constructor(
    text: string,
    option?: Partial<TextStyleOption & ForegroundOption>
  ) {
    super();
    this.textStyle = new TextStyle(option ?? {});
    this.text = new TextSpan({
      text: text,
      textStyle: this.textStyle,
    });
    this.option = option;
  }
  protected initTextPainter() {
    this.textPainter = new TextPainter(this.text);
    this.textPainter.layout();
    this.size = this.textPainter.size.copy();
    this.size.setWidth(this.size.width*this.absoluteScale);
    this.size.setHeight(this.size.height*this.absoluteScale);
  }
  get value(): any {
    return this.text.text;
  }
  drawImage(paint: Painter): void {
    const scaleWidth = this.size.width / this.textPainter.size.width;
    const scaleHeight = this.size.height / this.textPainter.size.height;
    paint.transform(scaleWidth, 0, 0, scaleHeight, 0, 0);

    const { fillGradient, strokeGradient } = this.option;
    if (fillGradient) {
      const foreground = paint;
      foreground.fillStyle = new LineGradientDecoration({
        begin: fillGradient.begin,
        end: fillGradient.end,
        colors: fillGradient.colors,
      }).getGradient(paint, this.size);
      this.textPainter.paragraph.textStyle.foreground = foreground;
    }
    if (strokeGradient) {
      const foreground = paint;
      foreground.fillStyle = new LineGradientDecoration({
        begin: strokeGradient.begin,
        end: strokeGradient.end,
        colors: strokeGradient.colors,
      }).getGradient(paint, this.size);
      this.textPainter.paragraph.textStyle.foreground = foreground;
    }

    if (strokeGradient) {
      paint.style = PaintingStyle.stroke;
    } else if (fillGradient) {
      paint.style = PaintingStyle.fill;
    } else if (strokeGradient && fillGradient) {
      paint.style = PaintingStyle.both;
    }

    this.textPainter.paint(
      paint,
      new Vector(
        (this.size.width * -0.5) / scaleWidth,
        (this.size.height * -0.5) / scaleHeight
      )
    );
    paint.transform(0, 0, 0, 0, 0, 0);
    // paint.restore();
  }
  setText(text: string) {
    this.text = new TextSpan({
      text,
      textStyle: this.textStyle,
    });
    this.markNeedsReBuild();
  }
  setTextStyle(textStyle: TextStyle) {
    this.textStyle = textStyle;
    this.markNeedsReBuild();
  }
  performRebuild(): void {
    super.performRebuild();
    this.initTextPainter();
  }
  family: ViewObjectFamily = ViewObjectFamily.text;
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

export default ParagraphBox;
