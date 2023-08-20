import ViewObject, { toJSONInterface } from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import Painter from "../painter";
import Rect from "../rect";
import { ImageChunk } from "../types/index";
import Cutter from "../utils/cutter";
import ImageChunkConverter from "../utils/image-chunk-converter";
import XImage from "../ximage";
class ImageBox extends ViewObject {
  family: ViewObjectFamily = ViewObjectFamily.image;
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
  public originFamily: ViewObjectFamily=ViewObjectFamily.image;
  constructor(ximage: XImage) {
    super();
    this.ximage = ximage;
    this.image = ximage.data;
    this.rect = new Rect(ximage.toJson());
    this.init();
  }
  setDecoration(xImage: XImage): void {
    this.ximage = xImage;
    this.image = xImage.data;
    const {width,height}=xImage.toJson();
    const oldPosition:Vector=this.rect.position.copy();
    this.rect.setPosition(oldPosition);
    this.rect.setSize(width,height);
    
    this.init();
  }
  //@Override
  public drawImage(paint: Painter): void {
    paint.drawImage(
      this.image,
      this.rect.position.x>>0,
      this.rect.position.y>>0,
      this.rect.size.width>>0,
      this.rect.size.height>>0
    );
  }
  async export(): Promise<Object> {
    // const base64Head = "data:image/jpeg;base64,";
    // let base64 = "";
    // //img标签导出
    // if (classIs(this.ximage.originData, "HTMLImageElement")) {
    //   base64 = await imageHtmltoBase64(this.ximage.originData);
    // } else if (classIs(this.ximage.originData, "File")) {
    //   base64 = await fileToBase64(this.ximage.originData);
    // }


    const cutter:Cutter=new Cutter();

    const chunkSize:number=500;
    
    const chunks:ImageChunk[]=cutter.getChunks(chunkSize,this.ximage);

    const coverter:ImageChunkConverter=new ImageChunkConverter();

    const base64s:ImageChunk[]=coverter.coverAllImageChunkToBase64(chunks);


    const json: toJSONInterface = {
      viewObjType: "image",
      options: {
        options: {
          data: base64s,
        },
        ...this.getBaseInfo(),
        fixedWidth:this.ximage.fixedWidth,
        fixedHeight:this.ximage.fixedHeight,
      },
    };
    return json;
  }

  public didDrag(value: { size: Size; angle: number }): void {
    this.resetButtons(["rotate"]);
  }

  public getXImage():XImage{
    return this.ximage;
  }
}
export default ImageBox;
