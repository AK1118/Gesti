import ViewObject, { toJSONInterface } from "../abstract/view-object";
import Painter from "../painter";
import Rect from "../rect";
import { classIs, fileToBase64, imageHtmltoBase64 } from "../utils/index";
import XImage from "../ximage";

class ImageBox extends ViewObject {
  get value(): any {
    return this.image;
  }
 
  private ximage: XImage;
  private image:
    | HTMLOrSVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | ImageBitmap
    | OffscreenCanvas;
  constructor(ximage: XImage) {
    super();
    this.ximage = ximage;
    this.image = ximage.data;
    this.rect = new Rect(ximage.toJson());
    this.init();
  }
  //@Override
  public drawImage(paint: Painter): void {
    paint.drawImage(
      this.image,
      this.rect.position.x,
      this.rect.position.y,
      this.rect.size.width,
      this.rect.size.height
    );
  }
  async export(): Promise<Object> {
    const base64Head = "data:image/jpeg;base64,";
    let base64 = "";
    //img标签导出
    if (classIs(this.ximage.originData, "HTMLImageElement")) {
      base64 = await imageHtmltoBase64(this.ximage.originData);
    } else if (classIs(this.ximage.originData, "File")) {
      base64 = await fileToBase64(this.ximage.originData);
    }
    
    const json: toJSONInterface = {
      viewObjType: "image",
      options: {
        options: {
          data: base64,
        },
        ...this.getBaseInfo(),
      },
    };
    return json;
  }

  public didDrag(value: { size: Size; angle: number; }): void {
    this.resetButtons(["rotate"]);
  }
}
export default ImageBox;
