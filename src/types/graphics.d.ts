import Painter from "@/core/lib/painter";
import XImage from "@/core/lib/ximage";
import ImageBox from "@/core/viewObject/image";
import Alignment from "@/core/lib/painting/alignment";
declare module "Graphics" {
  type GradientTypes = "lineGradient" | "radiusGradient";
  type GraphicsTypes = "rectangle" | "circle";
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
    static format(option:LineGradientDecorationOption): LineGradientDecoration;
    constructor(option: LineGradientDecorationOption);
  }

  // interface RadiusGradientDecoration extends GradientDecoration {}

  interface GenerateGraphicsOption {
    //隐式
    type?: GraphicsTypes;
    decoration: BoxDecoration;
    // borderDecoration?: BorderDecoration;
    x?: number;
    y?: number;
  }

  interface BorderDecoration {
    borderColor?: string;
    lineDash?: number[];
    innerBorder?: boolean;
    borderWidth?: number;
    gradient?: GradientDecorationBase;
  }

  interface BoxDecoration {
    backgroundColor?: string;
    backgroundImage?: XImage;
    opacity?: number;
    gradient?: GradientDecorationBase;
  }

  interface GenerateRectAngleOption extends GenerateGraphicsOption {
    width: number;
    height: number;
  }

  interface GenerateCircleOption extends GenerateGraphicsOption {
    radius: number;
  }
}
