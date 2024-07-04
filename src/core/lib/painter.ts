import { Shadow } from "@/types/gesti";
import Rect from "./rect";

export enum PaintingStyle {
  fill = "fill",
  stroke = "stroke",
  both = "both",
}

/*
	使用代理模式重写Painter，兼容原生Painter
*/
class Painter implements Painter {
  private static _paint:
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D = null;
  paint: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D = null;
  style: PaintingStyle = PaintingStyle.fill;
  constructor(
    paint:
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D = Painter._paint
  ) {
    if (!paint) {
      if (Painter._paint) {
        this.paint = Painter._paint;
      } else {
        throw new Error(
          "The Painter must insert a paint object of CanvasRenderingContext2D. Try running new Painter(g) to avoid this error.The 'g' value is a CanvasRenderingContext2D object."
        );
      }
    } else {
      this.setPaintQuality(paint);
      this.paint = paint;
      Painter._paint = paint;
    }
    // this.setPaintQuality(paint);
    // this.paint = paint;
    // Painter._paint ??= paint;
    // if (Painter._paint) {
    //   this.paint = Painter._paint;
    // } else {
    //   throw Error(
    //     "The Painter must insert a paint object of CanvasRenderingContext2D. Try running new Painter(g) to avoid this error.The 'g' value is a CanvasRenderingContext2D object."
    //   );
    // }
  }
  public static setPaint(
    paint:
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D = Painter._paint
  ) {
    Painter._paint = paint;
  }
  private setPaintQuality(
    paint: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
  ): void {
    try {
      if (paint?.imageSmoothingEnabled) paint.imageSmoothingEnabled = true;
      if (paint?.imageSmoothingQuality) paint.imageSmoothingQuality = "high";
    } catch (error) {
      console?.error("Get error while set paint quality.");
    }
  }
  //仅限window
  get canvas() {
    if (typeof window != "undefined") return this.paint.canvas;
    return undefined;
  }
  set lineWidth(width: number) {
    this.paint.lineWidth = width;
  }
  set fillStyle(style: string | CanvasGradient) {
    this.paint.fillStyle = style;
  }
  set strokeStyle(style: string | CanvasGradient) {
    this.paint.strokeStyle = style;
  }
  set shadowColor(shadowColor: string) {
    this.paint.shadowColor = shadowColor;
  }
  set shadowBlur(shadowBlur: number) {
    this.paint.shadowBlur = shadowBlur;
    this.paint.shadowOffsetX;
  }
  public setShadow(option?: Shadow) {
    this.shadowColor = option?.shadowColor;
    this.shadowBlur = option?.shadowBlur || 0;
    this.shadowOffsetX = option?.shadowOffsetX || 0;
    this.shadowOffsetY = option?.shadowOffsetY || 0;
  }
  set shadowOffsetX(shadowOffsetX: number) {
    this.paint.shadowOffsetX = shadowOffsetX;
  }
  set shadowOffsetY(shadowOffsetY: number) {
    this.paint.shadowOffsetY = shadowOffsetY;
  }
  set textBaseLine(
    baseLine:
      | "top"
      | "hanging"
      | "middle"
      | "alphabetic"
      | "ideographic"
      | "bottom"
  ) {
    if (this.paint.textBaseline) this.paint.textBaseline = baseLine;
  }
  drawSync() {
    (this.paint as any)?.draw?.(this.paint);
  }
  private _hasDrawFunction: boolean = null;
  //只有uniapp才需要draw
  public get hasDrawFunction(): boolean {
    if (this._hasDrawFunction === null) {
      this._hasDrawFunction = !!(this.paint as any)?.draw;
    }
    return this._hasDrawFunction;
  }
  draw(): Promise<void> {
    return new Promise((r) => {
      const p = this.paint as any;
      if (p?.draw != null) {
        p?.draw?.(p, () => {
          r();
        });
      } else {
        r();
      }
    });
  }
  strokeRect(x: number, y: number, w: number, h: number) {
    this.paint.strokeRect(x, y, w, h);
  }
  fillRect(x: number, y: number, w: number, h: number) {
    this.paint.fillRect(x, y, w, h);
  }
  stroke() {
    this.paint.stroke();
  }
  clearRect(x: number, y: number, w: number, h: number) {
    this.paint.clearRect(x, y, w, h);
    this.drawSync();
  }
  save() {
    this.paint.save();
  }
  rotate(angle: number) {
    this.paint.rotate(angle);
  }
  beginPath() {
    this.paint.beginPath();
  }
  closePath() {
    this.paint.closePath();
  }
  restore() {
    this.paint.restore();
  }
  restoreShadow() {
    this.setShadow({
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
    });
  }
  translate(x: number, y: number) {
    this.paint.translate(x, y);
  }
  fill() {
    this.paint.fill();
  }
  rect(x: number, y: number, w: number, h: number) {
    this.paint.rect(x, y, w, h);
  }
  clip(fillRule?: "nonzero" | "evenodd") {
    if (fillRule) {
      this.paint?.clip(fillRule);
    } else {
      //部分平台没有该参数处理逻辑
      this.paint?.clip();
    }
  }
  arc(
    x: number,
    y: number,
    radius: number,
    start: number,
    end: number,
    counterclockwise?: boolean
  ) {
    this.paint.arc(x, y, radius, start, end, counterclockwise);
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    this.paint.arcTo(x1, y1, x2, y2, radius);
  }
  /**
   *
   * @param x 圆心点x
   * @param y 圆心点y
   * @param a width
   * @param b height
   */
  ellipse(x: number, y: number, a: number, b: number): void {
    this.paint.save();
    this.paint.translate(x, y);
    const r = a > b ? a : b;
    const rx = a / r,
      ry = b / r;
    this.paint.scale(rx, ry);
    this.paint.beginPath();
    this.paint.arc(0, 0, r, 0, 2 * Math.PI);
    this.paint.closePath();
    this.paint.restore();
  }
  drawImage(
    image:
      | HTMLOrSVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    x: number,
    y: number,
    width: number,
    height: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) {
    if (dx && dy) {
      this.paint.drawImage(
        image,
        -width / 2,
        -height / 2,
        width,
        height,
        dx,
        dy,
        dw,
        dh
      );
    } else {
      this.paint.drawImage(image, -width / 2, -height / 2, width, height);
    }
  }
  deepDrawImage(
    image:
      | HTMLOrSVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas,
    x: number,
    y: number,
    width: number,
    height: number,
    dx?: number,
    dy?: number,
    dw?: number,
    dh?: number
  ) {
    if (dx && dy) {
      this.paint.drawImage(image, x, y, width, height, dx, dy, dw, dh);
    } else {
      this.paint.drawImage(image, x, y, width, height);
    }
  }
  scale(a: number, b: number) {
    this.paint.scale(a, b);
  }
  moveTo(x: number, y: number) {
    this.paint.moveTo(x, y);
  }
  lineTo(x: number, y: number) {
    this.paint.lineTo(x, y);
  }
  getImageData(x: number, y: number, w: number, h: number): ImageData {
    return this.paint.getImageData(x, y, w, h);
  }
  fillText(text: string, x: number, y: number) {
    this.paint.fillText(text, x, y);
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number) {
    this.paint.strokeText(text, x, y, maxWidth);
  }
  set font(font: string) {
    this.paint!.font = font;
  }
  public setFont(font: string): void {
    this.font = font;
  }
  public getFont(): any {
    return this.paint?.font;
  }
  set globalAlpha(alpha: number) {
    this.paint.globalAlpha = alpha;
  }
  measureText(text: string): TextMetrics {
    return this.paint?.measureText(text);
  }
  set lineCap(lineCap: any) {
    this.paint.lineCap = lineCap;
  }
  set lineJoin(lineJoin: any) {
    this.paint.lineJoin = lineJoin;
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.paint.quadraticCurveTo(cpx, cpy, x, y);
  }
  setLineDash(segments: Iterable<number>) {
    this.paint?.setLineDash(segments);
  }
  putImageData(imagedata: ImageData, dx: number, dy: number): void {
    this.paint.putImageData(imagedata, dx, dy);
  }
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient {
    return this.paint?.createLinearGradient?.(x0, y0, x1, y1);
  }
  transform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.paint?.transform(a, b, c, d, e, f);
  }
  setTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) {
    this.paint?.transform(a, b, c, d, e, f);
  }
  resetTranslate() {
    this.setTransform(1, 0, 0, 1, 0, 0);
  }
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
  ): CanvasGradient {
    return this.paint?.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  createConicGradient() {}
  roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radii?: number | Iterable<number>
  ) {
    const r2d = Math.PI / 180;
    let r: Array<number>;
    if (Array.isArray(radii)) {
      r = radii.map((r) => Math.min(r, Math.min(width, height) / 2));
    } else {
      r = new Array(4)
        .fill(radii)
        .map((r) => Math.min(r, Math.min(width, height) / 2));
    }
    this.beginPath();
    this.moveTo(x + r[0], y);
    this.lineTo(x + width - r[1], y);
    this.arc(x + width - r[1], y + r[1], r[1], r2d * 270, r2d * 360, false);
    this.lineTo(x + width, y + height - r[2]);
    this.arc(
      x + width - r[2],
      y + height - r[2],
      r[2],
      r2d * 0,
      r2d * 90,
      false
    );
    this.lineTo(x + r[3], y + height);
    this.arc(x + r[3], y + height - r[3], r[3], r2d * 90, r2d * 180, false);
    this.lineTo(x, y + r[0]);
    this.arc(x + r[0], y + r[0], r[0], r2d * 180, r2d * 270, false);
    this.closePath();
    // if (this.paint.roundRect) {
    //   this.paint.roundRect(x, y, width, height, radii);
    // } else {
    //   const getRadius = (index: number): number => {
    //     if (typeof radii === "number") return radii;
    //     if (Array.isArray(radii)) {
    //       return radii[index] ?? 0;
    //     }
    //   };
    //   const paint = this.paint;
    //   paint.beginPath();
    //   paint.moveTo(x + getRadius(0), y);
    //   paint.arcTo(x + width, y, x + width, y + height, getRadius(1));
    //   paint.arcTo(x + width, y + height, x, y + height, getRadius(2));
    //   paint.arcTo(x, y + height, x, y, getRadius(3));
    //   paint.arcTo(x, y, x + width, y, getRadius(0));
    //   paint.closePath();
    // }
  }
  /*清空画布|刷新画布*/
  update() {}
  clipRect(clipPath: Rect, paint: VoidFunction, angle?: number) {
    // paint.beginPath();
		// 	paint.save();
		// 	paint.rect(this.position.x - this.width * 0.5,this.position.y - this.height * 0.5,this.width,this.height);
		// 	paint.clip();
		// 	const { data } = this.xImage;
		// 	const { width, height } = this.imageRect.size;
		// 	paint.deepDrawImage(data, this.imageRect.position.x - width * 0.5, this.imageRect.position.y - height * 0.5, width, height);
		// 	paint.restore();
		// 	paint.closePath();
    this.beginPath();
    this.save();
    this.rect(
      clipPath.position.x,
      clipPath.position.y,
      clipPath.size.width,
      clipPath.size.height
    );
    this.clip();
    paint();
    this.restore();
    this.closePath();
  }
}

export default Painter;
