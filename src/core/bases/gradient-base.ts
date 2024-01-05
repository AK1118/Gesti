import { ColorStop, GradientDecorationOptionBase, GradientTypes } from "Graphics";
import Painter from "../lib/painter";
import Serializable from "../interfaces/Serialization";

/**
 * S 为渐变参数option类型，同时也为导出JSON时的类型
 */
abstract class GradientDecorationBase<S extends GradientDecorationOptionBase>
  implements Serializable<S>
{
  type: GradientTypes;
  private readonly colors: Array<string>;
  private readonly colorStops: Array<ColorStop>;
  protected gradient: CanvasGradient;
  protected option: S;
  constructor(option: GradientDecorationOptionBase) {
    const colors = option.colors;
    this.colors = colors;
    this.colorStops = this.computeColorStop();
  }
  toJSON(): S {
    return this.option;
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
  protected abstract generateGradient(
    paint: Painter,
    size: Size
  ): CanvasGradient;

  public getGradient(paint: Painter, size: Size): CanvasGradient {
    return (
      this.gradient || (this.gradient = this.generateGradient(paint, size))
    );
  }
}

export default GradientDecorationBase;
