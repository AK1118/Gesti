import OperationObserver from "../abstract/operation-observer";
import ViewObject, { toJSONInterface } from "../abstract/view-object";
import Painter from "../painter";

/**
 * 实现逻辑
 * 新建一个 canvas等宽高的矩阵,锁定它，
 *
 */
class WriteViewObj extends ViewObject {
  async export(): Promise<Object> {
    const json: toJSONInterface = {
      viewObjType: "write",
      options: {
        config: {
          ...this.config,
          scaleX: this._scalex,
          scaleY: this._scaley,
        },
        points: this.points,

        ...this.getBaseInfo(),
      },
    };
    return json;
  }
  private points: Array<Vector> = [];
  private _scalex: number = 1;
  private _scaley: number = 1;
  private color: string = "";
  private type: "circle" | "write" | "line" | "rect" | "none" = "write";
  private config: {
    color?: string;
    lineWidth?: number;
    type: "circle" | "write" | "line" | "rect" | "none";
  };
  private lineWidth: number = 3;
  constructor(
    points: Array<Vector>,
    color: string,
    config: {
      color?: string;
      lineWidth?: number;
      type: "circle" | "write" | "line" | "rect" | "none";
      scaleX?: number;
      scaleY?: number;
    }
  ) {
    super();
    this.points = points;
    this.color = color;
    this.type = config.type;
    this.color = config.color ?? "black";
    this.lineWidth = config.lineWidth ?? 3;
    this._scalex = config.scaleX ?? 1;
    this._scaley = config.scaleY ?? 1;
    this.config = config;
  }
  drawImage(paint: Painter): void {
    paint.strokeStyle = this.color;
    const len = this.points.length;
    paint.beginPath();
    //普通涂鸦
    if (this.type == "write")
      for (let i = 1; i < len; i++) {
        const currentPoint = this.points[i];
        const beforePoint = this.points[i - 1];
        paint.lineCap = "round";
        let prex = beforePoint.x,
          prey = beforePoint.y;
        let curx = currentPoint.x,
          cury = currentPoint.y;
        let cx = (prex + curx) * 0.5;
        let cy = (prey + cury) * 0.5;
        paint.quadraticCurveTo(
          prex * this._scalex,
          prey * this._scaley,
          cx * this._scalex,
          cy * this._scaley
        );
      }
    if (this.type == "rect" || this.type == "line")
      for (let i = 0; i < len; i++) {
        const point = this.points[i];
        if (i == 0)
          paint.moveTo(point.x * this._scalex, point.y * this._scaley);
        paint.lineTo(point.x * this._scalex, point.y * this._scaley);
      }

    if (this.type == "circle") {
      const { sx, sy, x, y, minx, miny, width, height } = this.getCircleParams(
        this.points[0],
        this.points[1]
      );
      paint.ellipse(
        minx + width * 0.5,
        miny + height * 0.5,
        width * 0.5,
        height * 0.5
      );
    }
    paint.lineWidth = this.lineWidth;
    paint.strokeStyle = this.color;
    if (this.type != "write") paint.closePath();
    paint.stroke();
    if (this.type == "write") paint.closePath();
  }
  private getCircleParams(p1: Vector, p2: Vector) {
    const sx = p1.x * this._scalex,
      sy = p1.y * this._scaley;
    const x = p2.x * this._scalex,
      y = p2.y * this._scaley;
    const width = Math.abs(sx - x),
      height = Math.abs(sy - y);
    const minx = Math.min(x, sx),
      miny = Math.min(y, sy);
    return {
      sx,
      sy,
      x,
      y,
      minx,
      miny,
      width,
      height,
    };
  }
  public didChangeScale(scale: number): void {
    this._scalex = this.rect.size.width / this.relativeRect.size.width;
    this._scaley = this.rect.size.height / this.relativeRect.size.height;
    if (this.type == "rect") {
    }
  }
}

export default WriteViewObj;
