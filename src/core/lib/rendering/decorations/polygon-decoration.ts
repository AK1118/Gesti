import DecorationBase from "@/core/bases/decoration-base";
import { PolygonDecorationOption } from "@/types/graphics";
import Painter from "../../painter";
import Rect from "../../rect";

class PolygonDecoration extends DecorationBase<PolygonDecorationOption> {
  private readonly points: Array<Vector> = [];
  constructor(option?: PolygonDecorationOption) {
    super(option);
  }
  render(paint: Painter, rect: Rect): void {
    this.renderGraphics(paint);
  }
  protected renderGraphics(paint: Painter): void {
    if (this.points.length < 3) {
      throw new Error("Cannot render a polygon with less than 3 points.");
    }

    paint.beginPath();
    paint.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      paint.lineTo(this.points[i].x, this.points[i].y);
    }

    paint.closePath();

    // Fill the polygon with a fill color (you can customize the color)
    paint.fillStyle = "black";
    paint.fill();

    // You can also add a stroke (border) if needed
    // paint.strokeStyle = "your_stroke_color";
    // paint.stroke();
  }
}

export default PolygonDecoration;
