import {
  BorderRadius,
  BorderRadiusAll,
  BoxDecorationOption,
  DecorationOption,
} from "Graphics";
import XImage from "../../ximage";
import GradientDecorationBase from "@/core/bases/gradient-base";
import Painter from "../../painter";
import Rect from "../../rect";
import { RenderWidgetBase } from "../base";

abstract class Decoration<
  O extends DecorationOption = DecorationOption
> extends RenderWidgetBase {
  protected option: O;
  constructor(option: O) {
    super();
    this.option = option;
  }
  abstract render(paint: Painter, rect: Rect): void;
}

class BoxDecoration extends Decoration<BoxDecorationOption> {
  constructor(option: BoxDecorationOption) {
    super(option);
  }
  render(paint: Painter, rect: Rect): void {
    const { width, height } = rect.size;
    const { gradient, backgroundColor, backgroundImage } = this.option;
    paint.beginPath();
    paint.save();
    //如果没有渐变，普通矩形
    if (!gradient) {
      paint.fillStyle = backgroundColor ?? "black";
    } else if (gradient) {
      paint.fillStyle = gradient.getGradient(paint, rect.size);
    }
    //渲染圆角矩形
    const borderRadius = this.option.borderRadius;
    if (borderRadius) {
      this.renderRoundRect(paint, borderRadius, width, height);
    } else if (backgroundColor) {
      //渲染普通矩形
      paint.fillRect(width * -0.5, height * -0.5, width, height);
    }
    paint.fill();
    if (backgroundImage) {
      const image = backgroundImage.data;
      paint.clip();
      paint.drawImage(image, 0, 0, width, height);
    }
    paint.closePath();
    paint.restore();
  }
  private renderRoundRect(
    paint: Painter,
    borderRadius: BorderRadiusAll | BorderRadius,
    width: number,
    height: number
  ): void {
    let radiusArr = [];
    if (typeof borderRadius === "number") {
      radiusArr = new Array(4).fill(borderRadius as BorderRadiusAll);
    } else if (typeof borderRadius === "object") {
      const { topLeft, topRight, bottomLeft, bottomRight } =
        borderRadius as BorderRadius;
      radiusArr = [
        topLeft ?? 0,
        topRight ?? 0,
        bottomRight ?? 0,
        bottomLeft ?? 0,
      ];
    }
    paint.roundRect(width * -0.5, height * -0.5, width, height, radiusArr);
  }
}

export default BoxDecoration;
