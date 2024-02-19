import { Alignment, Painter, XImage } from "./gesti";

export type GradientTypes = "lineGradient" | "radiusGradient";
export type GraphicsTypes = "rectangle" | "polygon";
export type DecorationTypes = "box" | "polygon";
type BorderRadiusAll = number;
// type  = number | Iterable<number>;

export interface BorderRadius {
  topLeft?: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
}

export interface ColorStop {
  // [0,1]
  step: number;
  color: string;
}
//渐变参数基类
export interface GradientDecorationOptionBase {
  /**
   * ### 传入颜色数组
   * - 例如 [red,orange,yellow]
   */
  colors: Array<string>;
  //渐变类型，隐式，类内部必须实现，用于导入时判断渐变类型
  type?: GradientTypes;
}

//线性渐变
export interface LineGradientDecorationOption
  extends GradientDecorationOptionBase {
  /**
   * ### 确定渐变开始的位置
   * - 传入一个Alignment
   */
  begin: Alignment;
  /**
   * ### 确定渐变结束位置
   * - 传入一个Alignment
   */
  end: Alignment;
}

//径向渐变
interface RadiusGradientDecorationOption extends GradientDecorationOptionBase {}

declare abstract class GradientDecorationBase {
  type: GradientTypes;
  public getGradient(paint: Painter, size: Size): CanvasGradient;
}

/**
 * ### 线性渐变
 * - 在BoxDecoration创建中使用
 */
export class LineGradientDecoration extends GradientDecorationBase {
  static format(option: LineGradientDecorationOption): LineGradientDecoration;
  constructor(option: LineGradientDecorationOption);
}
//装饰器
interface DecorationOption {
  type?: DecorationTypes;

  /**
   * - 背景颜色
   */
  backgroundColor?: string;
  /**
   * - 背景图片
   */
  backgroundImage?: XImage;
  /**
   * - 样式的不透明度
   */
  opacity?: number;
  /**
   * ### 渐变
   * -传入一个 GradientDecorationBase 类
   */
  gradient?: GradientDecorationBase;
}
export interface PolygonDecorationOption extends DecorationOption {
  points?: Array<Vector>;
}
//盒子装饰器
export interface BoxDecorationOption extends DecorationOption {
  /**
   * ### 圆角
   * - 传入一个数字或者一个数组
   * - 如传入数组，四个角对应数组顺序为 [TopLeft,TopRight,BottomRight,BottomLeft]
   */
  borderRadius?: BorderRadius | BorderRadiusAll;
}

export interface GenerateGraphicsOption {
  //隐式
  type?: GraphicsTypes;
  decoration: PolygonDecorationOption;
  // borderDecoration?: BorderDecoration;
  // x?: number;
  // y?: number;
}
export interface GenerateRectAngleOption extends GenerateGraphicsOption {
  width: number;
  height: number;
  decoration: BoxDecorationOption;
}

export interface GeneratePolygonOption extends GenerateGraphicsOption {
  radius: number;
  count: number;
  points?: Array<Vector>;
}

interface GenerateCircleOption extends GenerateGraphicsOption {
  radius: number;
}

export class Decoration {}

export class BoxDecoration extends Decoration {}
