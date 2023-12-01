import GradientDecorationBase from "@/core/bases/gradient-base";
import Painter from "../../painter";
import { LineGradientDecorationOption } from "Graphics";
import {Alignment} from "@/core/enums";
class LineGradientDecoration extends GradientDecorationBase {
  private readonly option: LineGradientDecorationOption;
  constructor(option: LineGradientDecorationOption) {
    super(option.colors);
    this.option = option;
  }
  generateGradient(paint: Painter): CanvasGradient {
    const begin:Alignment=Alignment.topLeft;
    const end:Alignment=Alignment.bottomRight;
    const {
      begin: { x: sx, y: sy },
      end: { x: ex, y: ey },
    } = this.option;
    this.gradient = paint.createLinearGradient(sx, sy, ex, ey);
    this.mountColorStops(this.gradient);
    return this.gradient;
  }
}
export default LineGradientDecoration;
