import GradientDecorationBase from "@/core/bases/gradient-base";
import Painter from "../../painter";
import { LineGradientDecorationOption } from "Graphics";
class LineGradientDecoration extends GradientDecorationBase {
  private readonly option: LineGradientDecorationOption;
  constructor(option: LineGradientDecorationOption) {
    super(option.colors);
    this.option = option;
  }
  generateGradient(paint: Painter,size:Size): CanvasGradient {
    // const begin:Alignment=Alignment.topLeft;
    // const end:Alignment=Alignment.bottomRight;
    const { begin, end } = this.option;
    const {offsetX,offsetY}=begin.compute(size);
    const {offsetX:ex,offsetY:ey}=end.compute(size);
    this.gradient = paint.createLinearGradient(offsetX, offsetY, ex, ey);
    this.mountColorStops(this.gradient);
    return this.gradient;
  }
}
export default LineGradientDecoration;
