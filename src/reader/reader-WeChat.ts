import ViewObject from "../abstract/view-object";
import GestiReader from "../abstract/reader";
import Painter from "../painter";
import Rect from "../rect";
import CutterH5 from "../cutters/cutter-H5";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text";
import WriteViewObj from "../viewObject/write";
import XImage from "../ximage";
import CutterWeChat from "../cutters/cutter-WeChat";
/**
 * 解析器  微信
 */
class GestiReaderWechat extends GestiReader {
  public async getViewObject(type: string, options: any,painter?:Painter,weChatCanvas?:any): Promise<ViewObject> {
    let viewObject: ViewObject;
    switch (type) {
      case "write":
        {
          viewObject = new WriteViewObj(
            options.points,
            options.config?.color ?? "red",
            options.config
          );
        }
        break;
      case "image":
        {
          const cutter = new CutterWeChat(painter);
          const source = cutter.merge(
            options.fixedWidth,
            options.fixedHeight,
            options.options.data,
            weChatCanvas
          );

          const image = weChatCanvas.createImage();
          const offCanvas = wx.createOffscreenCanvas({
            type: "2d",
            width: options.fixedWidth,
            height: options.fixedHeight,
          });
          const offPaint = offCanvas.getContext("2d");
          offPaint.putImageData(source, 0, 0);
          const ximage = new XImage({
            data: offCanvas,
            width: options.rect.width,
            height: options.rect.height,
            fixedWidth:options.fixedWidth,
            fixedHeight:options.fixedHeight,
          });
          viewObject = new ImageBox(ximage);
        }
        break;
      case "text":
        {
          viewObject = new TextBox(options.text, options.options);
        }
        break;
    }
    return viewObject;
  }

  public async getObjectByJson(str: string,painter?:Painter,weChatCanvas?:any) {
    const json = JSON.parse(str);
    const { options } = json;
    const rect: Rect = this.getRectByRectJson(options.rect);
    const relativeRect: Rect = super.getRectByRectJson(options.relativeRect);
    let viewObject: ViewObject = await this.getViewObject(
      json.viewObjType,
      options,
      painter,
      weChatCanvas
    );
    this.buildUp(viewObject, rect, relativeRect, options);
    return viewObject;
  }
}


export default GestiReaderWechat;