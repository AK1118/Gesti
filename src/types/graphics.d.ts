import Painter from "@/core/lib/painter";
import XImage from "@/core/lib/ximage";
import ImageBox from "@/core/viewObject/image";

declare module "Graphics" {
  interface ColorStop {
    // [0,1]
    step: number;
    color: string;
  }
 

 

  interface LineGradientDecorationOption {
    colors: Array<string>;
    begin:{x:number,y:number},
    end:{x:number,y:number}
    angle?: number;
  }
  abstract class GradientDecorationBase{
    public getGradient(paint:Painter):CanvasGradient
  }
  class LineGradientDecoration extends GradientDecorationBase {
    constructor(option:LineGradientDecorationOption);
  }

  // interface RadiusGradientDecoration extends GradientDecoration {}

  interface GenerateGraphicsOption {
    backgroundColor?: string;
    backgroundImage?: XImage;
    borderDecoration?: BorderDecoration;
    opacity?: number;
    //渐变
    gradient?: GradientDecorationBase;
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

  interface GenerateRectAngleOption extends GenerateGraphicsOption {
    width: number;
    height: number;
  }
}
