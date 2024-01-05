import Serializable from "@/core/interfaces/Serialization";
import Vector from "../vector";
class Alignment implements Serializable<{ x: number; y: number }> {
  private x: number;
  private y: number;
  private offset: Offset = {
    offsetX: 0,
    offsetY: 0,
  };
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  toJSON(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y,
    };
  }
  public copyWithOffset(offset: Offset) {
    this.offset = offset;
    return this;
  }
  static format(x: number, y: number): Alignment {
    return new Alignment(x, y);
  }
  static readonly center: Alignment = new Alignment(0, 0);
  static readonly topLeft: Alignment = new Alignment(-1, -1);
  static readonly bottomLeft: Alignment = new Alignment(-1, 1);
  static readonly topRight: Alignment = new Alignment(1, -1);
  static readonly bottomRight: Alignment = new Alignment(1, 1);
  static readonly centerRight: Alignment = new Alignment(1, 0);
  static readonly bottomCenter: Alignment = new Alignment(0, 1);
  static readonly centerLeft: Alignment = new Alignment(-1, 0);
  static readonly topCenter: Alignment = new Alignment(0, -1);
  /**
   *
   *以矩形中心为原点，没有遵循计算机图形的左上角原点规则
   * @return Size
   */
  public compute(size: Size): Offset {
    const halfWidthDelta = 0.5 * size.width;
    const halfHeighDelta = 0.5 * size.height;
    return {
      offsetX: halfWidthDelta * this.x + this.offset.offsetX,
      offsetY: halfHeighDelta * this.y + this.offset.offsetY,
    };
  }

  public computeWithVector(v: Vector): Vector {
    v.x *= this.x;
    v.y *= this.y;
    return v;
  }
}

export default Alignment;
