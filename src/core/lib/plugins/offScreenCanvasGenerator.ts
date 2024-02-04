import { OffScreenCanvasBuilderOption } from "@/types/gesti";
import Painter from "../painter";
import Platform from "@/core/viewObject/tools/platform";
// 定义 OffScreenCanvasBuilderInterface 接口
interface OffScreenCanvasBuilderInterface {
  // 构建离屏画布
  buildOffScreenCanvas(width: number, height: number): any;
  // 构建图像
  buildImage(url: string,width: number, height: number,offCanvas:any): any;
  // 构建离屏上下文
  buildOffScreenContext(offScreenCanvas: any): Painter | null;
  // 构建绘图上下文
  buildPaintContext(): Painter;
  // 构建图像数据
  buildImageData(ctx:any,width: number, height: number): ImageData;
  // 代理获取图像数据
  proxyGetImageData(
    offScreenContext: any,
    sx: number,
    sy: number,
    ex: number,
    ey: number
  ): Promise<ImageData> | null;
  //获取图片合成时用于装载ImageData的载体，返回 image或者 ImageBitmap 或者其他可以被drawImage渲染的对象
  buildMergedImage(
    source: CanvasImageSource | Blob | ImageData,
    width: number,
    height: number
  ): Promise<HTMLImageElement | ImageBitmap>;
}

// OffScreenCanvasBuilder 类实现 OffScreenCanvasBuilderInterface 接口
class OffScreenCanvasBuilder implements OffScreenCanvasBuilderInterface {
  private offScreenCanvasBuilder: (width: number, height: number) => any;
  private offScreenContextBuilder: (offScreenCanvas: any) => any;
  private imageBuilder: (
    url: string,
    width: number,
    height: number,offCanvas:any
  ) => HTMLImageElement | any;
  private paintBuilder: () =>
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  private _buildImageData: (ctx:any,width: number, height: number) => ImageData;
  private _proxyGetImageData: (
    ctx: any,
    sx: number,
    sy: number,
    ex: number,
    ey: number
  ) => Promise<ImageData> | null;
  private _buildMergedImage: (
    source: CanvasImageSource | Blob | ImageData,
    width: number,
    height: number
  ) => Promise<HTMLImageElement | ImageBitmap>;
  constructor(option: OffScreenCanvasBuilderOption) {
    // 初始化选项
    this.offScreenCanvasBuilder = option?.offScreenCanvasBuilder;
    this.offScreenContextBuilder = option?.offScreenContextBuilder;
    this.imageBuilder = option?.imageBuilder;
    this.paintBuilder = option?.paintBuilder;
    this._buildImageData = option?.buildImageData;
    this._proxyGetImageData = option?.proxyGetImageData;
    this._buildMergedImage = option?.buildMergedImage;
  }

  buildMergedImage(
    source: CanvasImageSource | Blob | ImageData,
    width: number,
    height: number
  ): Promise<HTMLImageElement | ImageBitmap> {
    if (!this._buildMergedImage) {
      return buildMergedImage(source, width, height);
    }
    return this._buildMergedImage?.(source, width, height);
  }

  // 实现构建离屏画布方法
  public buildOffScreenCanvas(width: number, height: number): any {
    if (!this.buildOffScreenCanvas)
      return getOffscreenCanvasWidthPlatform(width, height);
    return this.offScreenCanvasBuilder?.(width, height);
  }

  // 实现构建图像方法
  public buildImage(url: string, width: number, height: number,offCanvas:any) {
    if (!this.imageBuilder) return getImage(url, width, height);
    return this.imageBuilder?.(url, width, height,offCanvas);
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
  public buildImageData(ctx:any,width: number, height: number): ImageData {
    if (!this._buildImageData) return getImageDataEntity(width, height);
    // 实现方法逻辑
    return this._buildImageData?.(ctx,width, height);
  }

  // 实现代理获取图像数据方法
  public proxyGetImageData(
    ctx: any,
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): Promise<ImageData> | null {
    if (!this._proxyGetImageData) return proxyGetImageData(ctx, sx, sy, sw, sh);
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
const getImage = (
  url: string,
  width: number,
  height: number
): HTMLImageElement | any => {
  if (Platform.isBrowser) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    return image;
  }
};

const getImageDataEntity = (width: number, height: number): ImageData => {
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
  if (Platform.isBrowser||Platform.isWeChatMiniProgram)
    return Promise.resolve(ctx.getImageData(sx, sy, sw, sh));
};

const buildMergedImage = (
  source: CanvasImageSource | Blob | ImageData,
  width: number,
  height: number
): Promise<HTMLImageElement | ImageBitmap> => {
  if (Platform.isBrowser) {
    return createImageBitmap(source);
  }
  return null;
};
export default OffScreenCanvasBuilder;
