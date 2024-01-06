import OperationObserver from "../abstract/operation-observer";
import ViewObject from "../abstract/view-object";
import Painter from "../lib/painter";
import { ViewObjectFamily } from "../enums";
import GestiConfig from "../../config/gestiConfig";
import {
  FetchXImageForImportCallback,
  ViewObjectExportEntity,
  ViewObjectExportGraffiti,
  ViewObjectExportImageBox,
  ViewObjectImportBaseInfo,
  ViewObjectImportGraffiti,
  ViewObjectImportImageBox,
} from "@/types/serialization";
import { GraffitiTypes } from "@/types/gesti";
/**
 * 实现逻辑
 * 新建一个 canvas等宽高的矩阵,锁定它，
 *
 */
class WriteViewObj extends ViewObject {
  family: ViewObjectFamily = ViewObjectFamily.write;
  async export(): Promise<ViewObjectExportGraffiti> {
    // this.points.forEach((item) => {
    //   item.x = ~~item.x;
    //   item.y = ~~item.y;
    // });
    // const json = {
    //   viewObjType: "write",
    //   options: {
    //     config: {
    //       ...this.config,
    //       scaleX: this._scalex,
    //       scaleY: this._scaley,
    //     },
    //     points: this.points,

    //     ...this.getBaseInfo(),
    //   },
    // };
    // return json;
    return {
      type: "write",
      base: this.getBaseInfo(),
      config: this.config,
      points: this.points,
    };
  }
  public static reserve(
    entity: ViewObjectImportGraffiti
  ): Promise<WriteViewObj> {
    return Promise.resolve(
      new WriteViewObj(entity.points, entity.config.color, entity.config)
    );
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    // return this.export();
    throw new Error("Method not implemented.");
  }
  private points: Array<Vector> = [];
  private _scalex: number = 1;
  private _scaley: number = 1;
  private color: string = "";
  private isFill: boolean = false;
  public originFamily: ViewObjectFamily = ViewObjectFamily.write;
  private type: GraffitiTypes = "write";
  private config: {
    color?: string;
    lineWidth?: number;
    type: GraffitiTypes;
    isFill?: boolean;
  };
  private lineWidth: number = 3;
  constructor(
    points: Array<Vector>,
    color: string,
    config: {
      color?: string;
      lineWidth?: number;
      type: GraffitiTypes;
      scaleX?: number;
      scaleY?: number;
      isFill?: boolean;
    }
  ) {
    super();
    this.points = points;
    this.type = config.type;
    this.color = config.color ?? "black";
    this.isFill = config.isFill ?? false;
    this.lineWidth = config.lineWidth ?? 3;
    this._scalex = config.scaleX ?? 1;
    this._scaley = config.scaleY ?? 1;
    this.config = config;
  }
  public setDecoration(decoration: {
    //strokeColor?: string;
    color?: string;
    isFill?: boolean;
    lineWidth?: number;
  }): void {
    this.color = decoration?.color;
    this.isFill = decoration?.isFill;
    this.lineWidth = decoration?.lineWidth;
  }
  //供外部设置数据
  public setParams(config: {
    color?: string;
    lineWidth?: number;
    type: GraffitiTypes;
    scaleX?: number;
    scaleY?: number;
    isFill?: boolean;
  }) {
    this.type = config.type;
    this.color = config.color ?? "black";
    this.isFill = config.isFill ?? false;
    this.lineWidth = config.lineWidth ?? 3;
    this._scalex = config.scaleX ?? 1;
    this._scaley = config.scaleY ?? 1;
    this.config = config;
    this.custom();
  }

  public custom(): void {
    //线条没有填充
    if (this.type == "line") {
      this.isFill = false;
      this.family = ViewObjectFamily.line;
    } else if (this.type == "rect") {
      this.family = ViewObjectFamily.rect;
    } else if (this.type == "circle") {
      this.family = ViewObjectFamily.circle;
    } else if (this.type == "write") {
      this.family = ViewObjectFamily.write;
    }
  }
  //重写被选中后的样式
  public drawSelected(paint: Painter): void {
    paint.beginPath();
    const width = this.rect.size.width,
      height = this.rect.size.height;
    paint.fillStyle = GestiConfig.theme.textSelectedMaskBgColor;
    paint.fillRect(-width >> 1, -height >> 1, width, height);
    paint.closePath();
    paint.fill();
  }
  drawImage(paint: Painter): void {
    paint.closePath();
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
    if (this.isFill) {
      paint.fillStyle = this.color;
      paint.fill();
    } else paint.stroke();
    if (this.type == "write") paint.closePath();
    paint.closePath();
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
  public didChangeDeltaScale(scale: number): void {
    this._scalex = this.size.width / this.fixedSize.width;
    this._scaley = this.size.height / this.fixedSize.height;
  }
  protected didChangeScaleWidth(): void {
    this._scalex = this.size.width / this.fixedSize.width;
  }
  protected didChangeScaleHeight(): void {
    this._scaley = this.size.height / this.fixedSize.height;
  }
  get value(): any {
    return {
      ...this.config,
      points: this.points,
    };
  }
}

export default WriteViewObj;
