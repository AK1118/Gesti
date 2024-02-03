import Painter from "@/core/lib/painter";
import Plugins from "@/core/lib/plugins";
import OffScreenCanvasGenerator from "@/core/lib/plugins/offScreenCanvasGenerator";
import Platform from "@/core/viewObject/tools/platform";

/**
 * 通过插件获取设置大小的离屏画布
 * @param width 画布宽度
 * @param height 画布高度
 * @returns 设置好大小的离屏画布
 */
const getOffscreenCanvasWidthPlatform = (
  width: number,
  height: number
): any => {
  if (width === 0 || height === 0) return null;

  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");

  // 根据平台和插件情况返回不同的离屏画布
  if (offScreenContextBuilder) {
    return offScreenContextBuilder.buildOffScreenCanvas(width, height);
  } else if (Platform.isBrowser) {
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
const getOffscreenCanvasContext = (offCanvas: any): Painter => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  // 根据插件情况返回不同的上下文
  if (offScreenContextBuilder) {
    return offScreenContextBuilder.buildOffScreenContext(offCanvas);
  } else {
    const paint = offCanvas.getContext("2d");
    return new Painter(paint);
  }
};

/**
 * 等待图片加载完成
 * @param img 图片对象
 * @returns 返回一个 Promise，在图片加载完成后 resolve
 */
const waitingLoadImg = (img): Promise<void> => {
  return new Promise((resolve) => {
    if (img?.onload != undefined) img.onload = () => resolve();
    else {
      resolve();
    }
  });
};

/**
 * 获取图像对象
 * @param offScreenCanvas 离屏画布
 * @param url 图像的 URL
 * @returns 返回图像对象
 */
const getImage = (url: string,width:number,height:number,offCanvas:any
): HTMLImageElement | any => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");

  // 根据插件情况返回不同的图像对象
  if (offScreenContextBuilder) {
    return offScreenContextBuilder.buildImage(url,width,height,offCanvas);
  } else if (Platform.isBrowser) {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";
    return img;
  } else {
    return null;
  }
};

/**
 * 获取绘图上下文
 * @returns 返回绘图上下文
 */
const getPaintContext = (): Painter => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  // 返回绘图上下文
  return offScreenContextBuilder.buildPaintContext();
};

const getImageDataEntity = (ctx:any,width: number, height: number): ImageData => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  return offScreenContextBuilder.buildImageData(ctx,width, height);
};

const proxyGetImageData = (
  ctx: any,
  sx: number,
  sy: number,
  sw: number,
  sh: number
): Promise<ImageData> => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  return offScreenContextBuilder.proxyGetImageData(ctx, sx, sy, sw, sh);
};

const getMergedImageData = (
  source: CanvasImageSource | Blob | ImageData,
  width: number,
  height: number
): Promise<HTMLImageElement | ImageBitmap> => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  return offScreenContextBuilder.buildMergedImage(source, width, height);
};

export {
  getOffscreenCanvasWidthPlatform,
  getOffscreenCanvasContext,
  getImage,
  waitingLoadImg,
  getPaintContext,
  getImageDataEntity,
  proxyGetImageData,
  getMergedImageData,
};
