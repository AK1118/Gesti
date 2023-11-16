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
  setColor(color:string):void;
}
interface IconOption {
  color?: string;
  size?: number;
}
abstract class IconBase implements Icon {
  constructor(option?: IconOption) {
    this.color = option?.color ?? "#a4a6a8";
    this.size = option?.size ?? this.fixedSize;
    this.update();
  }
  setColor(color: string): void {
    this.color=color;
  }
  protected readonly fixedSize: number = 40;
  computedData: IconDataType = [];
  color: string;
  size: number = 40;
  abstract get data(): number[][][];
  render(paint: Painter, location: Vector) {
    //没有数据时切自定义
    if (this.data.length === 0) return this.customRender(paint, location);
    const [px, py] = location.toArray();
    const offset = this.size * -0.5;
    // paint.strokeRect(px + offset, py + offset, this.size, this.size);
    paint.beginPath();
    paint.strokeStyle = this.color;
    paint.fillStyle = this.color;
    paint.lineCap = "round";
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
    if (this.isFill) paint.fill();
    else paint.stroke();
  }
  get isFill(): boolean {
    return true;
  }
  protected customRender(paint: Painter, location: Vector): void {}
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

  // public rotate(angle:number):Icon{
  //   console.log("变化前",this.data);
  //   this.computedData = this.data.map((layer) =>
  //     layer.map((point) => this.rotatePoint(point,angle)
  //   ));
  //   console.log("变化后",this.computedData)
  //   return this;
  // }
  private readonly center:Vector=new Vector(20,20);
  private rotatePoint(point:Array<number>, angle: number): [x:number,y:number] {
  const [px,py]=point;
    const center=this.center;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
  
      const x = (px - center.x) * cos - (py - center.y) * sin + center.x;
      const y = (px - center.x) * sin + (py - center.y) * cos + center.y;
  
      return [x, y];
  }
}

export default IconBase;
