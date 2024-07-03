import { Painter, Shadow, ViewObject } from "./gesti";
import { LineGradientDecorationOption } from "./graphics";

declare enum TextDirection {
  ltr = "ltr",
  rtl = "rtl",
}
declare enum TextAlign {
  left = "left",
  right = "right",
  center = "center",
  justify = "justify",
  start = "start",
  end = "end",
  unset = "unset",
  none = "none",
}

declare enum FontWeight {
  normal = "normal",
  bold = "bold",
}

declare enum FontStyle {
  normal = "normal",
  italic = "italic",
}

declare enum TextDecoration {
  none = "none",
  underline = "underline",
  overline = "overline",
  lineThrough = "line-through",
}
declare enum TextDecorationStyle {
  solid = "solid",
  dashed = "dashed",
}
declare enum TextOverflow {
  /// Clip the overflowing text to fix its container.
  clip = "clip",
  /// Use an ellipsis to indicate that the text has overflowed.
  ellipsis = "ellipsis",
  /// Render overflowing text outside of its container.
  visible = "visible",
}
interface ParagraphStyleOption {
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  maxLines?: number;
  ellipsis?: string;
  height?: number;
  fontFamily?: string;
}
interface TextDecorationOption {
  decoration: TextDecoration;
  decorationStyle: TextDecorationStyle;
  decorationColor: string;
}

interface TextStyleOption extends ParagraphStyleOption, TextDecorationOption {
  color: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  letterSpacing: number;
  wordSpacing: number;
  foreground: any;
  shadow: Shadow;
  overflow: TextOverflow;
}

declare interface ForegroundOption {
  fillGradient: LineGradientDecorationOption;
  strokeGradient: LineGradientDecorationOption;
  fillColor: string;
  strokeColor: string;
}

declare interface BackgroundOption {
  backgroundColor: string;
  backgroundGradient: LineGradientDecorationOption;
}

declare interface ParagraphBoxOption
  extends BackgroundOption,
    ForegroundOption,
    TextStyleOption {
  constraintWidth: {
    minWidth: number;
    maxWidth: number;
  };
}

declare class ParagraphBox extends ViewObject {
  constructor(text: string, style?: ParagraphBoxOption);
  setText(text: string): void;
  updateOption(newOption: ParagraphBoxOption): void;
  setOption(newOption: ParagraphBoxOption): void;
  get styleOption(): Partial<ParagraphBoxOption>;
}
