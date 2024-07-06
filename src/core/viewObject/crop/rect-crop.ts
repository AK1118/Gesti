import ViewObject from "@/core/abstract/view-object";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import { RectCropOption, RectCropValue } from "@/types/gesti";
import {
  ViewObjectExportEntity,
  ViewObjectExportRectCrop,
} from "Serialization";

class RectCrop extends ViewObject {
  private readonly optionDefault: RectCropOption = {
    width: 300,
    height: 300,
    maskColor: "rgba(0,0,0,.54)",
    lineDashColor: "#ffffff",
    count: 3,
    lineDash: [5, 5],
    lineWidth: 1,
  };
  private displayCrossLine: boolean = true;
  hiddenCrossLine() {
    this.displayCrossLine = false;
  }
  showCrossLine() {
    this.displayCrossLine = true;
  }
  constructor(option: RectCropOption) {
    super();
    this.option = Object.assign(this.optionDefault, option);
    this.setSize({
      width: option.width,
      height: option.height,
    });
    // this.disableRotate();
  }
  private option: RectCropOption;
  get value(): RectCropValue {
    return {
      sx: this.position.x - this.halfWidth,
      sy: this.position.y - this.halfHeight,
      width: this.width,
      height: this.height,
    };
  }
  public setMaskColor(maskColor: string): void {
    this.option.maskColor = maskColor;
  }
  public setLineDashColor(lineDashColor: string): void {
    this.option.lineDashColor = lineDashColor;
  }
  public setCount(count: number) {
    this.option.count = count;
  }
  drawImage(paint: Painter): void {
    paint.save();
    this.drawMask(paint);
    if (this.displayCrossLine) this.drawLineDesh(paint);
    paint.restore();
  }
  protected drawLineDesh(paint: Painter): void {
    const hw = this.halfWidth,
      hh = this.halfHeight;
    const count = this.option.count;
    const cellWidth = this.width / count,
      cellHeight = this.height / count;
    paint.strokeStyle = this.option.lineDashColor;
    paint.lineWidth = this.option.lineWidth;
    paint.setLineDash([5, 5]);
    for (let i = 1; i < count; i++) {
      const y = i * cellHeight - hh;
      paint.beginPath();
      paint.moveTo(-hw, y);
      paint.lineTo(hw, y);
      paint.stroke();
    }

    for (let i = 1; i < count; i++) {
      const x = i * cellWidth - hw;
      paint.beginPath();
      paint.moveTo(x, -hh);
      paint.lineTo(x, hh);
      paint.stroke();
    }
  }
  protected drawMask(paint: Painter): void {
    const x = this.position.x,
      y = this.position.y;
    const hw = this.halfWidth,
      hh = this.halfHeight;
    const { width, height } = this.getKit().getCanvasRect().size;

    // 保存当前绘图状态
    paint.save();

    // 平移和旋转画布
    // 开始绘制路径
    paint.beginPath();

    // 绘制整个画布的蒙版路径
    paint.moveTo(-width, -height);
    paint.lineTo(width, -height);
    paint.lineTo(width, height);
    paint.lineTo(-width, height);
    paint.closePath();

    // 绘制镂空部分的路径
    paint.moveTo(-hw, -hh);
    paint.lineTo(hw, -hh);
    paint.lineTo(hw, hh);
    paint.lineTo(-hw, hh);
    paint.closePath();

    // 使用奇偶规则（evenodd）进行填充，生成镂空效果
    paint.fillStyle = this.option.maskColor;
    paint.fill("evenodd");

    // 恢复绘图状态
    paint.restore();
  }

  family: ViewObjectFamily;
  async export(painter?: Painter): Promise<ViewObjectExportRectCrop> {
    return Promise.resolve({
      base: await this.getBaseInfo(),
      type: "rectCrop",
      option: this.option,
    });
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportRectCrop> {
    return this.export(painter);
  }
  public static async reserve(
    entity: ViewObjectExportRectCrop
  ): Promise<RectCrop> {
    const option = entity.option;
    const rectCrop: RectCrop = new RectCrop(option);
    return Promise.resolve(rectCrop);
  }
}

export default RectCrop;
