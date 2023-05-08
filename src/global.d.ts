declare const uni: any;
declare const wx: any;
declare var document: Document;
declare interface EventHandle {}
declare interface Size {
  width: number;
  height: number;
}

declare interface CanvasRenderingContext2D {
  draw(): void;
}
declare interface Offset {
  offsetx: number;
  offsety: number;
}
declare interface rectparams {
  x?: number;
  y?: number;
  width: number;
  height: number;
}

declare class Vector {
  x: number;
  y: number;
  constructor(x: number, y: number);
  add(v: Vector): void;
  sub(v: Vector): this;
  mult(v: Vector): this;
  div(v: Vector): this;
  mag(): number;
  dist(v: Vector): number;
  normalize(): this;
  clamp(c: [max: number, min: number]): void;
  copy(): Vector;
  set(v: Vector): void;
  setXY(x: number, y: number): void;
  toJson(): { x: number; y: number };
  toArray(): number[];
  equals(v: Vector): boolean;
  troweling():Vector;
  static dist(v1: Vector, v2: Vector): number;
  static mag(v: Vector): number;
  static sub(v1: Vector, v2: Vector): Vector;
  static add(v1: Vector, v2: Vector): Vector;
  static troweling(v:Vector):Vector;
}

declare interface GestiEventParams {
  v: Vector | Vector[];
  sub(v: Vector): Vector;
}

declare interface GestiEventFunction {
  (params: GestiEventParams): void;
}

declare interface createImageOptions {
  data?:
    | HTMLImageElement
    | SVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | Blob
    | ImageData
    | ImageBitmap
    | OffscreenCanvas;
  originData?: any;
  options?: createImageOptions;
  width?: number;
  height?: number;
  scale?: number;
  maxScale?: number;
  minScale?: number;
}

declare interface textOptions {
  fontFamily?: string;
  fontSize?: number;
  spacing?: number;
  color?: string;
  linesMarks?: Array<number>;
  lineWidth?: number;
  lineColor?: string;
  lineOffsetY?: number;
}

type CenterAxis="vertical"|"horizon";