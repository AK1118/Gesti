import Painter from "@/core/lib/painter";
import XImage from "@/core/lib/ximage";
import ImageBox from "@/core/viewObject/image";
import Alignment from "@/core/lib/painting/alignment";
declare module "Graphics" {
  type GradientTypes = "lineGradient" | "radiusGradient";
  type GraphicsTypes = "rectangle" | "circle";
  type BorderRadiusAll = number;
  // type  = number | Iterable<number>;

  interface BorderRadius {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  }

  interface ColorStop {
    // [0,1]
    step: number;
    color: string;
  }
  //渐变参数基类
  interface GradientDecorationOptionBase {
    colors: Array<string>;
    //渐变类型，隐式，类内部必须实现，用于导入时判断渐变类型
    type?: GradientTypes;
  }

  //线性渐变
  interface LineGradientDecorationOption extends GradientDecorationOptionBase {
    begin: Alignment;
    end: Alignment;
  }

  //径向渐变
  interface RadiusGradientDecorationOption
    extends GradientDecorationOptionBase {}

  abstract class GradientDecorationBase {
    type: GradientTypes;
    public getGradient(paint: Painter, size: Size): CanvasGradient;
  }
  class LineGradientDecoration extends GradientDecorationBase {
    static format(option: LineGradientDecorationOption): LineGradientDecoration;
    constructor(option: LineGradientDecorationOption);
  }
  //装饰器
  interface DecorationOption {}

  //盒子装饰器
  interface BoxDecorationOption extends DecorationOption {
    //背景颜色
    backgroundColor?: string;
    //背景图片
    backgroundImage?: XImage;
    //不透明度
    opacity?: number;
    //渐变
    gradient?: GradientDecorationBase;
    //圆角矩形
    borderRadius?: BorderRadius | BorderRadiusAll;
  }

  interface GenerateGraphicsOption {
    //隐式
    type?: GraphicsTypes;
    decoration: BoxDecorationOption;
    // borderDecoration?: BorderDecoration;
    x?: number;
    y?: number;
  }
  interface GenerateRectAngleOption extends GenerateGraphicsOption {
    width: number;
    height: number;
  }

  interface GenerateCircleOption extends GenerateGraphicsOption {
    radius: number;
  }

  class Decoration {}

  class BoxDecoration extends Decoration {}
}
