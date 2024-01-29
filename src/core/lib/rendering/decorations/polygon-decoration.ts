import DecorationBase from "@/core/bases/decoration-base";
import { PolygonDecorationOption } from "@/types/graphics";
import Painter from "../../painter";
import Rect from "../../rect";
import LineGradientDecoration from "../../graphics/gradients/lineGradientDecoration";
import XImage from "../../ximage";
import { reverseXImage } from "@/utils/utils";

class PolygonDecoration extends DecorationBase<PolygonDecorationOption> {
  private points: Array<Vector>;
  constructor(option?: PolygonDecorationOption) {
    super(option);
    if (option) {
      this.points = option.points;
      this.option.points = this.points;
      this.option.type = "polygon";
    }
  }
  render(paint: Painter, rect: Rect): void {
    this.renderGraphics(paint, rect);
  }
  public setPoints(points: Array<Vector>) {
    this.points = points;
    this.option.points = this.points;
  }
  public updatePoint(deltaScale: number): void {
    this.points.forEach((_) => {
      _.x *= deltaScale;
      _.y *= deltaScale;
    });
  }
  protected renderGraphics(paint: Painter, rect: Rect): void {
    if (!this.points) return;
    if (this.points.length < 3) {
      throw new Error("Cannot render a polygon with less than 3 points.");
    }
    const { width, height } = rect.size;
    const { backgroundColor, backgroundImage, gradient } = this.option;
    paint.save();
    paint.beginPath();

    if (!gradient) {
      paint.fillStyle = backgroundColor ?? "black";
    } else if (gradient) {
      const size = rect.size.copy();
      size.setWidth(size.width * 0.5);
      size.setHeight(size.height * 0.5);
      paint.fillStyle = gradient.getGradient(paint, size);
    }
    paint.moveTo(
      this.points[0].x * rect.scaleWidth,
      this.points[0].y * rect.scaleHeight
    );
    for (let i = 1; i < this.points.length; i++) {
      paint.lineTo(
        this.points[i].x * rect.scaleWidth,
        this.points[i].y * rect.scaleHeight
      );
    }
    paint.closePath();
    paint.fill();
    if (backgroundImage) {
      const image = backgroundImage.data;
      //圆角时需要裁剪
      paint.clip();
      paint.drawImage(image, 0, 0, width, height);
    }

    paint.restore();
  }
  public async format(
    entity: PolygonDecorationOption
  ): Promise<PolygonDecoration> {
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
    this.points=entity.points;
    return Promise.resolve(this);
  }
}

export default PolygonDecoration;
