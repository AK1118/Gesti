import GestiConfig from "../config/gestiConfig";
import Painter from "../core/lib/painter";
import Rect from "../core/lib/rect";
import Vector from "../core/lib/vector";
import { Point } from "../core/lib/vertex";
import ViewObject from "../core/abstract/view-object";

export interface ViewLines {
  view: ViewObject;
  points: Array<Vector>;
}
interface lp {
  axis: "vertical" | "horizon";
  point: Point;
  offset: Vector;
}
/**
 * 辅助线显示
 */
class AuxiliaryLine {
  //到距离5时参考线出现
  private readonly d: number = 3;
  //虚线
  private readonly dash=[3,3];
  private readonly color=GestiConfig.theme.dashedLineColor
  private readonly canvasRect:Rect;
  private readonly views:Array<ViewObject>;
  //参考点
  private referencePoint: Array<Point> = [];
  constructor(canvasRect:Rect,views:Array<ViewObject>){
    this.canvasRect=canvasRect;
    this.views=views;
  }
  public createReferencePoint(key: string) {
    this.referencePoint = [];
    //获取画布内所有课操作对象
    const views: Array<ViewObject> = this.views;
    //如果只有一个必定是自己
    if (views.length <= 1) return;
    views
      .filter((v) => v.key.toString() != key&&!v.disabled)
      .forEach((view: ViewObject) => {
        const rect = view.rect;
        const position = view.rect.position;
        this.referencePoint.push(...(view.getVertex() ?? []));
        this.referencePoint.push(position);
      });
  }
  /**
   * 遍历五个点
   */
  private getPoint(points: Array<Point>): any {
    const ps: Array<lp> = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      for (let j = 0; j < this.referencePoint.length; j++) {
        const rp = this.referencePoint[j];
        const item: lp = {
          axis: "vertical",
          point: p,
          offset: Vector.zero,
        };
        if (Math.abs(p.x - rp.x) < this.d || Math.abs(p.y - rp.y) < this.d) {
          if (Math.abs(p.x - rp.x) < this.d) {
            //y轴
            item.axis = "vertical";
            item.offset.x = p.x - rp.x;
          } else {
            //x轴
            item.axis = "horizon";
            item.offset.y = p.y - rp.y;
          }
          ps.push(item);
          break;
        }
      }
    }
    return ps.sort((a, b) => a.offset.x - b.offset.x);
  }
  public draw(paint: Painter, view: ViewObject) {
    if (!view.rect.vertex) return;
    const dots = view.getVertex();
    const canvasRect: Rect = this.canvasRect;//canvasConfig.rect;
    const canvasSize: Size = canvasRect.size;
    const size: Size = view.rect.size;
    const position: Vector = view.rect.position;
    //中心点对应上下左右四个点
    const left = new Vector(0, position.y).troweling(),
      top = new Vector(position.x, 0).troweling(),
      right = new Vector(canvasSize.width, position.y).troweling(),
      bottom = new Vector(position.x, canvasSize.height).troweling();
    //上下左右四条辅助线
    const getLinePoint = (point: Point, axis: "vertical" | "horizon") => {
      if (axis == "horizon") {
        return [
          [new Vector(0, point.y), new Vector(canvasSize.width, point.y)],
        ];
      } else {
        return [
          [new Vector(point.x, 0), new Vector(point.x, canvasSize.height)],
        ];
      }
    };
    //临近点
    const lpoints = this.getPoint([...dots, position]);
    //上锁的对象不能被操作，对齐
    // if (lpoints.length != 0&&!view.isLock) {
    //   const offset = lpoints[0].offset;
    //   if (offset.x < 0) view.rect.position.add(offset);
    //   else view.rect.position.sub(offset);
    // }
    //得到线数据
    const lines = lpoints.map((item) => getLinePoint(item.point, item.axis));
    const points = [left, top, right, bottom];
    paint.beginPath();
    lines.forEach((ls) => {
      const [[p1, p2]] = ls;
      paint.moveTo(p1.x, p1.y);
      paint.lineTo(p2.x, p2.y);
    });
    paint.setlineDash(this.dash)
    paint.strokeStyle = this.color;
    paint.lineWidth = 1;
    paint.stroke();
    paint.closePath();
    paint.setlineDash([])
  }
}
export default AuxiliaryLine;
