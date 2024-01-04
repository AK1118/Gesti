import Painter from "@/core/lib/painter";
import XImage from "@/core/lib/ximage";
import ImageBox from "@/core/viewObject/image";
import Alignment from "@/core/lib/painting/alignment";
declare module "Graphics" {
  interface ColorStop {
    // [0,1]
    step: number;
    color: string;
  }

  interface LineGradientDecorationOption {
    colors: Array<string>;
    begin: Alignment;
    end: Alignment;
    // angle?: number;
  }
  abstract class GradientDecorationBase {
    public getGradient(paint: Painter, size: Size): CanvasGradient;
  }
  class LineGradientDecoration extends GradientDecorationBase {
    constructor(option: LineGradientDecorationOption);
  }

  // interface RadiusGradientDecoration extends GradientDecoration {}

  interface GenerateGraphicsOption {
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
