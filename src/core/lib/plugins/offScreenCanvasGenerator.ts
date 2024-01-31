import { OffScreenCanvasBuilderOption } from "@/types/gesti";
import Painter from "../painter";
import Platform from "@/core/viewObject/tools/platform";
// 定义 OffScreenCanvasBuilderInterface 接口
interface OffScreenCanvasBuilderInterface {
  // 构建离屏画布
  buildOffScreenCanvas(width: number, height: number): any;
  // 构建图像
  buildImage(offScreenCanvas: any, url: string): any;
  // 构建离屏上下文
  buildOffScreenContext(offScreenCanvas: any): Painter | null;
  // 构建绘图上下文
  buildPaintContext(): Painter;
  // 构建图像数据
  buildImageData(width: number, height: number): ImageData;
  // 代理获取图像数据
  proxyGetImageData(
    offScreenContext: any,
    sx: number,
    sy: number,
    ex: number,
    ey: number
  ): Promise<ImageData> | null;
}

// OffScreenCanvasBuilder 类实现 OffScreenCanvasBuilderInterface 接口
class OffScreenCanvasBuilder implements OffScreenCanvasBuilderInterface {
  private offScreenCanvasBuilder: (width: number, height: number) => any;
  private offScreenContextBuilder: (offScreenCanvas: any) => any;
  private imageBuilder: (
    offScreenCanvas: any,
    url: string
  ) => HTMLImageElement | any;
  private paintBuilder: () =>
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  private _buildImageData: (width: number, height: number) => ImageData;
  private _proxyGetImageData: (
    ctx: any,
    sx: number,
    sy: number,
    ex: number,
    ey: number
  ) => Promise<ImageData> | null;

  constructor(option: OffScreenCanvasBuilderOption) {
    // 初始化选项
    this.offScreenCanvasBuilder = option?.offScreenCanvasBuilder;
    this.offScreenContextBuilder = option?.offScreenContextBuilder;
    this.imageBuilder = option?.imageBuilder;
    this.paintBuilder = option?.paintBuilder;
    this._buildImageData = option?.buildImageData;
    this._proxyGetImageData = option?.proxyGetImageData;
  }

  // 实现构建离屏画布方法
  public buildOffScreenCanvas(width: number, height: number): any {
    if (!this.buildOffScreenCanvas)
      return getOffscreenCanvasWidthPlatform(width, height);
    return this.offScreenCanvasBuilder?.(width, height);
  }

  // 实现构建图像方法
  public buildImage(offScreenCanvas: any, url: string) {
    if (!this.imageBuilder) return getImage(offScreenCanvas, url);
    return this.imageBuilder?.(offScreenCanvas, url);
  }

  // 实现构建离屏上下文方法
  public buildOffScreenContext(offScreenCanvas: any): Painter | null {
    if (!this.offScreenContextBuilder)
      return getOffscreenCanvasContext(offScreenCanvas);
    const paint = this.offScreenContextBuilder?.(offScreenCanvas);
    if (!paint) return null;
    return new Painter(paint as any);
  }

  // 实现构建绘图上下文方法
  public buildPaintContext(): Painter {
    const paint: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D =
      this.paintBuilder?.();
    return new Painter(paint);
  }

  // 实现构建图像数据方法
  public buildImageData(width: number, height: number): ImageData {
    if (!this._buildImageData) return getImageDataEntity(width, height);
    // 实现方法逻辑
    return this._buildImageData?.(width, height);
  }

  // 实现代理获取图像数据方法
  public proxyGetImageData(
    ctx: any,
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): Promise<ImageData> | null {
    if(!this._proxyGetImageData)return proxyGetImageData(ctx,sx, sy, sw, sh);
    // 实现方法逻辑
    return this._proxyGetImageData?.(ctx, sx, sy, sw, sh);
  }
}

//给默认的函数提供调用

//离屏画布
const getOffscreenCanvasWidthPlatform = (
  width: number,
  height: number
): OffscreenCanvas => {
  if (Platform.isBrowser) {
    return new OffscreenCanvas(width, height);
  } else if (Platform.isWeChatMiniProgram) {
    return wx.createOffscreenCanvas({ type: "2d", width, height });
  } else if (Platform.isTikTok) {
    const offScreen = tt.createOffscreenCanvas();
    if (!offScreen) {
      offScreen.width = width;
      offScreen.height = height;
      return offScreen;
    }
  } else {
    // 抛出错误信息
    throw new Error(
      "Regrettably, your platform lacks support for OffscreenCanvas in [Gesti]. To remedy this, consider utilizing the Gesti.installPlugin method and installing the offScreenContextBuilder plugin. This will enable the custom generation of OffscreenCanvas, enhancing functionality on your platform."
    );
  }
};

/**
 * 获取离屏画布的上下文
 * @param offCanvas 离屏画布
 * @returns 离屏画布的上下文
 */
const getOffscreenCanvasContext = (offCanvas: OffscreenCanvas): Painter => {
  const paint = offCanvas.getContext("2d");
  return new Painter(paint as any);
};

/**
 * 获取图像对象
 * @param offScreenCanvas 离屏画布
 * @param url 图像的 URL
 * @returns 返回图像对象
 */
const getImage = (screenCanvas: any, url: string): HTMLImageElement | any => {
  if (Platform.isBrowser) {
    const image = new Image();
    image.src = url;
    return image;
  }
};

const getImageDataEntity = (width: number, height: number): ImageData => {
  if (Platform.isBrowser)
    return new ImageData(width, height, {
      colorSpace: "srgb",
    });
};

const proxyGetImageData = (
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): Promise<ImageData> => {
  if (Platform.isBrowser)
    return Promise.resolve(ctx.getImageData(sx, sy, sw, sh));
};
export default OffScreenCanvasBuilder;
