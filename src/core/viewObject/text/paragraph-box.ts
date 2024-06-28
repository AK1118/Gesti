import ViewObject from "@/core/abstract/view-object";
import { ViewObjectFamily } from "@/core/enums";
import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
import ImageToolkitAdapterController from "@/core/lib/image-tool-kit/adpater";
import Painter, { PaintingStyle } from "@/core/lib/painter";
import Alignment from "@/core/lib/painting/alignment";
import Vector from "@/core/lib/vector";
import { TextPainter, TextSpan, TextStyle } from "@/test/text-painter";
import { ViewObjectExportEntity } from "Serialization";
class ParagraphBox extends ViewObject {
  private textPainter: TextPainter;
  private text: TextSpan;
  private textStyle: TextStyle;
  constructor(text: string, textStyle?: TextStyle) {
    super();
    this.textStyle = textStyle;
    this.text = new TextSpan({
      text: text,
      textStyle,
    });
  }
  public initialization(kit: ImageToolkitAdapterController): void {
    super.initialization(kit);
    this.initTextPainter();
    this.size = this.textPainter.size.copy();
  }
  protected initTextPainter() {
    this.textPainter = new TextPainter(this.text);
    this.textPainter.layout();
  }
  get value(): any {
    return this.text.text;
  }
  drawImage(paint: Painter): void {
    const scaleWidth = this.size.width / this.textPainter.size.width;
    const scaleHeight = this.size.height / this.textPainter.size.height;
    paint.transform(scaleWidth, 0, 0, scaleHeight, 0, 0);

    const forground = paint;
    forground.fillStyle = "white";

    forground.strokeStyle = "black";
    // new LineGradientDecoration({
    //     begin: Alignment.topCenter,
    //     end: Alignment.bottomCenter,
    //     colors: ["orangered", "white"],
    //   }).getGradient(paint, this.size);

    // forground.setShadow({
    //   shadowBlur: 0,
    //   shadowColor: "black",
    //   shadowOffsetX: 3,
    //   shadowOffsetY: 3,
    // });
    forground.lineWidth=1;
    forground.style = PaintingStyle.both;
    this.textPainter.paragraph.textStyle.foreground = forground;

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
  setTextStyle(textStyle:TextStyle){
    this.textStyle=textStyle;
    this.markNeedsReBuild();
  }
  protected reBuild(): void {
    super.reBuild();
    this.initTextPainter();
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

export default ParagraphBox;
