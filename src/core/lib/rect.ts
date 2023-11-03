import { ObserverObj, OperationType } from "../abstract/operation-observer";
import RecorderInterface from "../interfaces/recorder";
import Vector from "./vector";
import Vertex from "./vertex";

/**
 * @ 拖拽的回调函数
 */
declare interface onDragFunction {
  (rect: Rect): void;
}

export class Size {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  static get zero():Size{
    return new Size(0,0);
  }
  toVector() {
    return new Vector(this.width, this.height);
  }
  copy(): Size {
    return new Size(this.width, this.height);
  }
}

class Rect extends ObserverObj {
  public onDrag: onDragFunction;
  public beforeDrag: onDragFunction;
  private _angle: number = 0;
  private _vertex: Vertex;
  private _position: Vector;
  private _size: Size;
  private _scale: number;
  public readonly key: string = Math.random().toString(16).substring(2);
  constructor(
    params?: RectParams,
    key?: string,
    options?: {
      angle: number;
    }
  ) {
    super();
    const { width, height, x, y } = params || {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this._size = new Size(width, height);
    this._position = new Vector(x || 0, y || 0);
    if (key) {
      this.key = key;
    }
    if (options) {
      const { angle } = options;
      this.setAngle(angle);
    }
  }
  public updateVertex(): void {
    const half_w = this._size.width * 0.5,
      half_h = this._size.height * 0.5;
    this._vertex = new Vertex([
      [-half_w, -half_h],
      [+half_w, -half_h],
      [+half_w, +half_h],
      [-half_w, +half_h],
    ]);
    this._vertex.rotate(this.getAngle, this);
  }
  public get position(): Vector {
    return this._position;
  }
  public get size(): Size {
    return this._size;
  }
  public get scale(): number {
    return this._scale;
  }
  public get vertex(): Vertex {
    return this._vertex;
  }
  public get getAngle(): number {
    return this._angle;
  }
  public set position(position: Vector) {
    if(position.equals(this.position))return;
    this.beforeReport(this._position, "position");
    this._position = position;
    this._position.x = this._position.x;
    this._position.y = this._position.y;
    this.report(position, "position");
  }
  public setPosition(position: Vector): void {
    if(position.equals(this.position))return;
    this.beforeReport(this._position, "position");
    this._position = position;
    this._position.x = this._position.x;
    this._position.y = this._position.y;
    this.report(position, "position");
  }
  public setScale(scale: number, change?: boolean): void {
    if(scale===this.scale)return;
    this.beforeReport(scale, "scale");
    //是否真正改变大小，还是之通知倍数改变了，后续可以考虑移除监听scale
    if (change ?? true) {
      this._size.width *= scale;
      this._size.height *= scale;
    }
    this.report(scale, "scale");
  }
  /**
   * @description 拖拽处需要表明拖拽
   * @param width
   * @param height
   */
  public setSize(width: number, height: number, isDrag?: boolean): void {
    if(width===this.size.width&&height===this.size.height)return;
    //之前
    if (isDrag)
      this.beforeReport(
        { size: this.size.copy(), angle: this._angle },
        "drag"
      );
    else this.beforeReport(new Size(width, height), "size");
    this._size.width = width;
    this._size.height = height;
    //之后
    if (isDrag)
      this.report(
        { size: new Size(width, height), angle: this._angle },
        "drag"
      );
    else this.report(new Size(width, height), "size");
  }
  public setAngle(angle: number, isDrag?: boolean): void {
    if(angle===this._angle)return;
    //之前
    if (isDrag)
      this.beforeReport(
        { size: this._size.copy(), angle: this._angle },
        "drag"
      );
    else this.beforeReport(this._angle, "angle");
    this._angle = angle;
    if (isDrag)
      this.report({ size: this._size.copy(), angle: this._angle }, "drag");
    else this.report(angle, "angle");
  }
  /**
   * @description 向观察者汇报自己的变化情况
   * @param value
   * @param type
   * @returns
   */
  private report(value: any, type: keyof OperationType): void {
    if (this.observer == null) return;
    this.observer.report(value, type);
  }
  /**
   * @description 向观察者汇报自己的变化情况之前
   * @param value
   * @param type
   * @returns
   */
  private beforeReport(value: any, type: keyof OperationType): void {
    if (this.observer == null) return;
    this.observer.beforeReport(value, type);
  }
  public copy(key?: string) {
    return new Rect(
      {
        width: this._size.width,
        height: this._size.height,
        x: this._position.x,
        y: this._position.y,
      },
      key,
      {
        angle: this.getAngle,
      }
    );
  }
  public set(newRect: Rect) {
    this.position.set(newRect.position);
    this.setAngle(newRect.getAngle);
    this.setScale(newRect.scale);
    this.setSize(newRect.size.width, newRect.size.height);
  }
  public setPositionXY(x:number,y:number){
    if(this.position.x===x&&this.position.y===y)return;
    this.beforeReport(this._position, "position");
    this._position.setXY(x,y);
    this.report(this._position, "position");
  }
}

export default Rect;
export { onDragFunction };
