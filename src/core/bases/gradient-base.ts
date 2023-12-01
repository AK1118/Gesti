import { ColorStop } from "Graphics";
import Painter from "../lib/painter";

abstract class GradientDecorationBase {
  private readonly colors: Array<string>;
  private readonly colorStops: Array<ColorStop>;
  protected gradient:CanvasGradient;
  constructor(colors: Array<string>) {
    this.colors = colors;
    this.colorStops = this.computeColorStop();
  }
  private computeColorStop(): Array<ColorStop> {
    const colorStops: Array<ColorStop> = [];
    const len = this.colors.length - 1;
    this.colors.forEach((color, ndx) => {
      colorStops.push({
        step: ndx / len,
        color,
      });
    });
    return colorStops;
  }
  protected mountColorStops(gradient: CanvasGradient): void {
    this.colorStops.forEach((_) => {
      gradient.addColorStop(_.step, _.color);
    });
  }
  /**
   * @description 生成一个渐变对象，返回线性或者径向渐变
   * @param paint
   */
  protected abstract generateGradient(paint: Painter):CanvasGradient;

  public getGradient(paint:Painter):CanvasGradient{
    return this.gradient||(this.gradient=this.generateGradient(paint));
  }
}

export default GradientDecorationBase;
