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
  private _width: number;
  private _height: number;
  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }
  static get zero(): Size {
    return new Size(0, 0);
  }
  get width(): number {
    return this._width;
  }
  get height(): number {
    return this._height;
  }
  toVector() {
    return new Vector(this._width, this._height);
  }
  copy(): Size {
    return new Size(this._width, this._height);
  }
  equals(size: Size | { width?: number; height?: number }): boolean {
    return size?.width === this._width && size?.height === this._height;
  }
  public setWidth(width: number): void {
    this._width = width;
  }
  public setHeight(height: number): void {
    this._height = height;
  }
  public toObject(): {
    width: number;
    height: number;
  } {
    return {
      width: this._width,
      height: this._height,
    };
  }
}

class Rect extends ObserverObj {
  public onDrag: onDragFunction;
  public beforeDrag: onDragFunction;
  private _angle: number = 0;
  private _vertex: Vertex;
  private _position: Vector;
  private _size: Size;
  private _deltaScale: number;
  private _absoluteScale: number = 1;
  public readonly key: string = Math.random().toString(16).substring(2);
  constructor(
    params?: RectParams,
    key?: string,
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
    if (params?.angle) {
      this.setAngle(params?.angle);
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
  static get zero(): Rect {
    return new Rect();
  }
  public get position(): Vector {
    return this._position;
  }
  public get size(): Size {
    return this._size;
  }
  public get absoluteScale(): number {
    return this._absoluteScale;
  }
  public get deltaScale(): number {
    return this._deltaScale;
  }
  public get vertex(): Vertex {
    return this._vertex;
  }
  public get getAngle(): number {
    return this._angle;
  }
  public set position(position: Vector) {
    if (position.equals(this.position)) return;
    this.beforeReport(this._position, "position");
    this._position = position;
    this._position.x = this._position.x;
    this._position.y = this._position.y;
    this.report(position, "position");
  }
  public setPosition(position: Vector): void {
    if (position.equals(this.position)) return;
    this.beforeReport(this._position, "position");
    this._position = position;
    this._position.x = this._position.x;
    this._position.y = this._position.y;
    this.report(position, "position");
  }
  public addPosition(delta: Vector) {
    if (delta.equals(Vector.zero)) return;
    this.beforeReport(delta, "addPosition");
    this._position.add(delta);
    this.report(delta, "addPosition");
  }
  public setDeltaScale(deltaScale: number, change?: boolean): void {
    this._absoluteScale *= deltaScale;
    if (deltaScale === this.deltaScale) return;
    this.beforeReport(deltaScale, "scale");
    //是否真正改变大小，还是之通知倍数改变了，后续可以考虑移除监听scale
    if (change ?? true) {
      this.size.setWidth(this.size.width * deltaScale);
      this.size.setHeight(this.size.height * deltaScale);
    }
    this.report(deltaScale, "scale");
  }
  /**
   * @description 拖拽处需要表明拖拽
   * @param width
   * @param height
   */
  public setSize(width: number, height: number): void {
    if (width === this.size.width && height === this.size.height) return;
    //之前
    this.beforeReport(new Size(width, height), "size");
    this.size.setWidth(width);
    this.size.setHeight(height);
    this.report(new Size(width, height), "size");
  }
  public setAngle(angle: number, isDrag?: boolean): void {
    if (angle === this._angle) return;
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
        angle: this.getAngle,
      },
      key
    );
  }

  public set(newRect: Rect) {
    this.position.set(newRect.position);
    this.setAngle(newRect.getAngle);
    this.setDeltaScale(newRect.deltaScale);
    this.setSize(newRect.size.width, newRect.size.height);
  }
  public setPositionXY(x: number, y: number) {
    if (this.position.x === x && this.position.y === y) return;
    this.beforeReport(this._position, "position");
    this._position.setXY(x, y);
    this.report(this._position, "position");
  }

  static format(option: RectParams): Rect {
    return new Rect(option);
  }
}

export default Rect;
export { onDragFunction };
