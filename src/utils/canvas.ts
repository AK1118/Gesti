import Painter from "@/core/lib/painter";
import Platform from "@/core/viewObject/tools/platform";

const getOffscreenCanvasWidthPlatform = (
  width: number,
  height: number
): any => {
  if (Platform.isBrowser) return new OffscreenCanvas(width, height);
  if (Platform.isWeChatMiniProgram)
    return wx.createOffscreenCanvas({
      type: "2d",
      width,
      height,
    });
  //当前只支持浏览器和微信小程序离屏缓存
  if (!Platform.isBrowser && !Platform.isWeChatMiniProgram) {
    throw new Error(
      "Your platform does not support OffscreenCanvas in [Gesti]. Please run textBox.unUseCache() to resolve this error."
    );
  }
  return null;
};


const getOffscreenCanvasContext=(offCanvas):Painter=>{
    const paint=offCanvas.getContext("2d");
    return new Painter(paint);
}

export {
    getOffscreenCanvasWidthPlatform,
    getOffscreenCanvasContext
}
