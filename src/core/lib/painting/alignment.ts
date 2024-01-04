class Alignment {
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

  public copyWithOffset(offset: Offset) {
    this.offset = offset;
    return this;
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
   * 通过Alignment值按比例计算某矩形的位置
   * 例如Alignment.topLeft值为[-1,-1]，取一个100*100矩形，原点为它的
   * 中心点，通过以下方法计算得出   x=[(-1+1)*.5]*100=-50 ,得到计算后的位置
   * @return Size
   */
  public compute(size: Size): Offset {
    const halfWidthDelta = size.width * 0.5;
    const halfHeighDelta = size.height * 0.5;
    return {
      offsetX: halfWidthDelta * this.x + this.offset.offsetX,
      offsetY: halfHeighDelta * this.y + this.offset.offsetY,
    };
  }
}

export default Alignment;
