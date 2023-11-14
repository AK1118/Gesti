import Painter from "./painter";
import Vector from "./vector";

type IconDataType = number[][][];

export interface Icon {
  color: string;
  size: number;
  //静态
  get data(): IconDataType;
  //设置大小时根据静态数据更新数据
  computedData: IconDataType;
  render(paint: Painter, location: Vector);
  setSize(value: number): void;
}
export interface IconOption {
  color?: string;
  size?: number;
}
abstract class IconBase implements Icon {
  constructor(option?: IconOption) {
    this.color = option?.color ?? "black";
    this.size = option?.size ?? this.fixedSize;
    this.update();
  }
  private readonly fixedSize: number = 40;
  computedData: IconDataType = [];
  color: string;
  size: number = 40;
  abstract get data(): number[][][];
  render(paint: Painter, location: Vector) {
    const [px, py] = location.toArray();
    const offset = this.size * -0.5;
    paint.strokeRect(px + offset, py + offset, this.size, this.size);
    paint.beginPath();
    paint.strokeStyle = this.color;
    paint.fillStyle = this.color;
    this.computedData.forEach((layer) => {
      layer.forEach((point, index) => {
        const [x, y] = point;
        const drawX = x + px + offset,
          drawY = y + py + offset;
        if (index === 0) {
          paint.moveTo(drawX, drawY);
        } else {
          paint.lineTo(drawX, drawY);
        }
      });
    });
    paint.closePath();
    paint.fill();
  }
  setSize(value: number): void {
    this.size = value;
    this.update();
  }
  protected update(): void {
    const scale = this.size / this.fixedSize;
    this.computedData = this.data.map((layer) =>
      layer.map((point) => point.map((coord) => coord * scale))
    );
  }
}

class MirrorIcon extends IconBase {
  get data(): number[][][] {
    return [
      [
        [10, 10],
        [0, 20],
        [10, 30],
      ],
      [
        [10, 10],
        [0, 20],
        [10, 30],
      ],
      [
        [30, 10],
        [40, 20],
        [30, 30],
      ],
      [
        [17, 5],
        [23, 5],
        [23, 35],
        [17, 35],
      ],
    ];
  }
}

export default MirrorIcon;
