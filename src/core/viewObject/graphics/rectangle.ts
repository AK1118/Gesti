import ViewObject from "@/core/abstract/view-object";
import Painter from "@/core/lib/painter";
import { ViewObjectFamily } from "@/index";
import {
  getOffscreenCanvasContext,
  getOffscreenCanvasWidthPlatform,
} from "@/utils/canvas";
import {
  GenerateRectAngleOption,
  BorderDecoration,
  LineGradientDecoration,
  GenerateGraphicsOption,
  BoxDecoration,
} from "Graphics";
import { ViewObjectExportEntity } from "Serialization";

/**
 *
 */
abstract class GraphicsBase<
  T extends GenerateGraphicsOption
> extends ViewObject {
  constructor(option: T) {
    super();
    this.option=option;
    this.decoration = option?.decoration;
    // this.borderDecoration = option?.borderDecoration;
  }
  protected option: T;
  //主题装饰
  protected decoration: BoxDecoration;
  //边框装饰
  protected borderDecoration: BorderDecoration;
  //渲染边框
  protected abstract renderGraphicsBorder(paint: Painter): void;
  protected abstract renderGraphics(paint:Painter):void;
  protected mountDecoration(paint: Painter): void {
    
  }

  protected mountBorderDecoration(paint: Painter): void {}
}

class Rectangle extends GraphicsBase<GenerateRectAngleOption>  {
  
  
  family: ViewObjectFamily;
  constructor(option: GenerateRectAngleOption) {
    super(option);
    const { width, height } = option;
    this.rect.setSize(width, height);
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  private handlePaintingGradient(paint:Painter) {
    const { backgroundColor, gradient } = this.decoration;
    paint.beginPath();
    paint.save();
    paint.translate(this.width * 0.5, this.height * 0.5);
    paint.fillStyle = backgroundColor ?? "black";
    if (gradient) {
      paint.fillStyle = gradient.getGradient(
        paint,
        this.size
      );
    }
    paint.fillRect(
      this.width * -0.5,
      this.height * -0.5,
      this.width,
      this.height
    );
    paint.closePath();
    paint.restore();
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    this.renderGraphics(paint);
    //paint.drawImage(this.cachedOffscreenCanvas, 0, 0, this.width, this.height);
  }
  protected renderGraphicsBorder(paint: Painter): void {
    throw new Error("Method not implemented.");
  }
  protected renderGraphics(paint: Painter): void {
    
  }
  // protected renderBorder(paint: Painter): void {
  //   if (!this.borderDecoration) return;
  //   const {
  //     borderColor = "black",
  //     lineDash = [],
  //     borderWidth = 1,
  //     innerBorder = false,
  //     gradient = null,
  //   } = this.borderDecoration;
  //   paint.beginPath();
  //   paint.strokeStyle = borderColor;
  //   if (gradient) {
  //     paint.strokeStyle = gradient.getGradient(paint, this.size);
  //   }
  //   paint.lineWidth = borderWidth;
  //   paint.setLineDash(lineDash);
  //   const factor: number = innerBorder ? -1 : 1;
  //   const bw = this.width + borderWidth * factor,
  //     bh = this.height + borderWidth * factor;
  //   paint.strokeRect(bw * -0.5, bh * -0.5, bw, bh);
  //   paint.stroke();
  //   paint.closePath();
  // }
  export(painter?: Painter): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    return this.export();
  }
}

export default Rectangle;
