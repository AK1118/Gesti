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
    lineWidth: 2,
  };
  constructor(option: RectCropOption) {
    super();
    this.option = Object.assign(this.optionDefault, option);
    this.setSize({
      width: option.width,
      height: option.height,
    });
    this.disableRotate();
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
    this.drawLineDesh(paint);
    paint.restore();
  }
  private drawLineDesh(paint: Painter): void {
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
  private drawMask(paint: Painter): void {
    const x = this.position.x,
      y = this.position.y;
    const hw = this.halfWidth,
      hh = this.halfHeight;
    const { width, height } = this.kit.getCanvasRect().size;
    paint.fillStyle = this.option.maskColor;
    paint.fillRect(-x, -y, width * 2, y - hh);
    paint.fillRect(hw, -hh, width * 2, height * 2);
    paint.fillRect(-hw, hh, this.width, height * 2);
    paint.fillRect(-x, -hh, x - hw, height * 2);
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
