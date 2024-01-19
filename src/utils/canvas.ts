import Painter from "@/core/lib/painter";
import Plugins from "@/core/lib/plugins";
import OffScreenCanvasGenerator from "@/core/lib/plugins/offScreenCanvasGenerator";
import Platform from "@/core/viewObject/tools/platform";

/**
 * ### 获取设置大小的离屏画布
 * - 设置大小不能为0
 * @param width
 * @param height
 * @returns
 */
const getOffscreenCanvasWidthPlatform = (
  width: number,
  height: number
): any => {
  if (width === 0 || height === 0) return null;
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey<OffScreenCanvasGenerator>("offScreenBuilder");
  if (offScreenContextBuilder)
    return offScreenContextBuilder.buildOffScreenCanvas(width, height);
  if (Platform.isBrowser) return new OffscreenCanvas(width, height);
  if (Platform.isWeChatMiniProgram)
    return wx.createOffscreenCanvas({
      type: "2d",
      width,
      height,
    });
  if (Platform.isTikTok) {
    const offScreen = tt.createOffscreenCanvas();
    if (!offScreen) {
      offScreen.width = width;
      offScreen.height = height;
      return offScreen;
    }
  }
  //当前只支持浏览器、微信小程序、抖音离屏缓存
  if (
    !Platform.isBrowser &&
    !Platform.isWeChatMiniProgram &&
    !Platform.isTikTok
  ) {
    throw new Error(
      "Regrettably, your platform lacks support for OffscreenCanvas in [Gesti]. To remedy this, consider utilizing the Gesti.installPlugin method and installing the offScreenContextBuilder plugin. This will enable the custom generation of OffscreenCanvas, enhancing functionality on your platform."
    );
  }
  return null;
};

const getOffscreenCanvasContext = (offCanvas: any): Painter => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey("offScreenBuilder");
  if (offScreenContextBuilder)
    return offScreenContextBuilder.buildOffScreenContext(offCanvas);
  const paint = offCanvas.getContext("2d");
  return new Painter(paint);
};

const waitingLoadImg = (img): Promise<void> => {
  return new Promise((r) => {
    img.onload = () => r();
    //最慢加载10秒
    setTimeout(() => {
      r();
    }, 1000 * 10);
  });
};

const getImage = (
  offScreenCanvas: any,
  url: string
): HTMLImageElement | any => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey("offScreenBuilder");
  if (offScreenContextBuilder) {
    return offScreenContextBuilder.buildImage(offScreenCanvas, url);
  }
  if (Platform.isBrowser) return new Image();
  return null;
};

const getPaintContext = (): Painter => {
  const offScreenContextBuilder: OffScreenCanvasGenerator =
    Plugins.getPluginByKey("offScreenBuilder");
  return offScreenContextBuilder.buildPaintContext();
};

export {
  getOffscreenCanvasWidthPlatform,
  getOffscreenCanvasContext,
  getImage,
  waitingLoadImg,
  getPaintContext,
};
