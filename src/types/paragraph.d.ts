export enum TextDirection {
  ltr = "ltr",
  rtl = "rtl",
}

export enum TextAlign {
  left = "left",
  right = "right",
  center = "center",
  justify = "justify",
  start = "start",
  end = "end",
  unset = "unset",
  none = "none",
}

interface ParagraphStyleOption {
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  maxLines?: number;
  ellipsis?: string;
  height?: number;
  fontFamily?: string;
}
