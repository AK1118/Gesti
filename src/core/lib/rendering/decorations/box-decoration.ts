import {
  BorderRadius,
  BorderRadiusAll,
  BoxDecorationOption,
  DecorationOption,
  LineGradientDecorationOption,
  PolygonDecorationOption,
} from "Graphics";
import XImage from "../../ximage";
import GradientDecorationBase from "@/core/bases/gradient-base";
import Painter from "../../painter";
import Rect from "../../rect";
import { ClipRRect, RenderColoredRRect, RenderWidgetBase } from "../base";
import Serializable from "@/core/interfaces/Serialization";
import LineGradientDecoration from "../../graphics/gradients/lineGradientDecoration";
import { reverseXImage } from "@/utils/utils";
import DecorationBase from "@/core/bases/decoration-base";



class BoxDecoration extends DecorationBase<BoxDecorationOption> {
  constructor(option?: BoxDecorationOption) {
    super(option);
  }
  render(paint: Painter, rect: Rect): void {
    const { width, height } = rect.size;
    const { gradient, backgroundColor, backgroundImage } = this.option;
    paint.save();
    paint.beginPath();
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
    } else if (backgroundColor || gradient) {
      //渲染普通矩形
      paint.fillRect(width * -0.5, height * -0.5, width, height);
    }
    paint.fill();
    if (backgroundImage) {
      const image = backgroundImage.data;
      //圆角时需要裁剪
      if (borderRadius) {
        paint.clip();
      }
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
  public async format(entity: BoxDecorationOption): Promise<BoxDecoration> {
    this.option = {};
    const { gradient, backgroundImage } = entity;
    if (gradient?.type == "lineGradient") {
      entity.gradient = LineGradientDecoration.format(gradient as any);
    }
    if (backgroundImage) {
      const ximage: XImage = await reverseXImage({
        url: backgroundImage.url,
        data: backgroundImage.data,
        fixedHeight: backgroundImage.height,
        fixedWidth: backgroundImage.width,
      });
      entity.backgroundImage = ximage;
    }

    this.option = entity;

    return Promise.resolve(this);
  }
}

export default BoxDecoration;
