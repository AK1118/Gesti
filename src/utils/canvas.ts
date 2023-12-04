import Painter from "@/core/lib/painter";
import Plugins from "@/core/lib/plugins";
import OffScreenCanvasGenerator from "@/core/lib/plugins/offScreenCanvasGenerator";
import Platform from "@/core/viewObject/tools/platform";

const offScreenContextBuilder: OffScreenCanvasGenerator = Plugins.getPluginByKey(
  "offScreenBuilder"
);
const getOffscreenCanvasWidthPlatform = (
  width: number,
  height: number
): any => {
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

const getOffscreenCanvasContext = (offCanvas): Painter => {
  if (offScreenContextBuilder)
    return offScreenContextBuilder.buildOffScreenContext(OffscreenCanvas);
  const paint = offCanvas.getContext("2d");
  return new Painter(paint);
};

const waitingLoadImg = (img): Promise<void> => {
  return new Promise((r) => {
    img.onload = () => r();
  });
};


const getImage=(offScreenCanvas:any):HTMLImageElement|any=>{
  if(offScreenContextBuilder){
    return offScreenContextBuilder.buildImage(offScreenCanvas);
  }
  if(Platform.isBrowser)return new Image();
  return null;
}

export {
  getOffscreenCanvasWidthPlatform,
  getOffscreenCanvasContext,
  getImage,
  waitingLoadImg,
};
