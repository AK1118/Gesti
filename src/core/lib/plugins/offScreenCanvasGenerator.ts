import { OffScreenCanvasBuilderOption } from "@/types/gesti";
import Painter from "../painter";

class OffScreenCanvasBuilder {
  private offScreenCanvasBuilder: (width: number, height: number) => any;
  private offScreenContextBuilder: (offScreenCanvas: any) => any;
  private imageBuilder: (
    offScreenCanvas: any,
    url: string
  ) => HTMLImageElement | any;
  private paintBuilder: () =>
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  constructor(option: OffScreenCanvasBuilderOption) {
    this.offScreenCanvasBuilder =
      option?.offScreenCanvasBuilder ||
      ((width: number, height: number) => null);
    this.offScreenContextBuilder =
      option?.offScreenContextBuilder || (() => null);
    this.imageBuilder =
      option?.imageBuilder || ((offScreenCanvas: any, url: string) => null);
    this.paintBuilder = option.paintBuilder || (() => null);
  }
  public buildOffScreenCanvas(width: number, height: number): any {
    return this.offScreenCanvasBuilder?.(width, height);
  }
  public buildImage(offScreenCanvas: any, url: string) {
    return this.imageBuilder?.(offScreenCanvas, url);
  }
  public buildOffScreenContext(offScreenCanvas): Painter {
    const paint = this.offScreenContextBuilder?.(offScreenCanvas);
    if (!paint) return null;
    return new Painter(paint as any);
  }
  public buildPaintContext(): Painter {
    const paint: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D =
      this.paintBuilder();
    return new Painter(paint);
  }
}

export default OffScreenCanvasBuilder;
