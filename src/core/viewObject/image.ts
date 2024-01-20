import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import Painter from "../lib/painter";
import Rect from "../lib/rect";
import Cutter from "../../utils/cutters/cutter-H5";
import ImageChunkConverterH5 from "../../utils/converters/image-chunk-converter-H5";
import ImageChunkConverter from "../../utils/converters/image-chunk-converter-H5";
import ImageChunkConverterWeChat from "../../utils/converters/image-chunk-converter-WeChat";
import XImage from "../lib/ximage";
import CutterWeChat from "../..//utils/cutters/cutter-WeChat";
import CutterH5 from "../../utils/cutters/cutter-H5";
import Platform from "./tools/platform";
import {
  FetchXImageForImportCallback,
  ViewObjectExportEntity,
  ViewObjectExportImageBox,
  ViewObjectImportBaseInfo,
  ViewObjectImportImageBox,
} from "@/types/serialization";
import { ImageChunk } from "@/types/gesti";
import {
  getOffscreenCanvasContext,
  getOffscreenCanvasWidthPlatform,
  waitingLoadImg,
} from "@/utils/canvas";
import { reverseXImage } from "@/utils/utils";
import { BoxDecorationOption } from "Graphics";
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
  public originFamily: ViewObjectFamily = ViewObjectFamily.image;
  constructor(ximage: XImage) {
    super();
    this.ximage = ximage;
    this.image = ximage.data;
    this.rect = new Rect(ximage.toJson());
    this.setDecoration({
      backgroundImage: ximage,
    });
    this.useCache();
  }

  public replaceXImage(xImage: XImage): void {
    this.ximage = xImage;
    this.image = xImage.data;
    const { width, height } = xImage.toJson();
    const oldPosition: Vector = this.rect.position.copy();
    this.rect.setPosition(oldPosition);
    this.rect.setSize(width, height);
    this.forceUpdate();
  }

  //@Override
  public drawImage(paint: Painter): void {
    paint.drawImage(
      this.image,
      this.rect.position.x >> 0,
      this.rect.position.y >> 0,
      this.rect.size.width >> 0,
      this.rect.size.height >> 0
    );
  }

  async export(): Promise<ViewObjectExportImageBox> {
    const cutter: Cutter = new Cutter();
    const url: string = this.ximage.url;
    let data: ImageChunk[];
    if (!url) {
      const chunks: ImageChunk[] = await cutter.getChunks(this.ximage);
      const coverter: ImageChunkConverter = new ImageChunkConverterH5();
      data = coverter.coverAllImageChunkToBase64(chunks);
    }

    const json: ViewObjectExportImageBox = {
      type: "image",
      base: this.getBaseInfo(),
      fixedHeight: this.ximage.fixedHeight,
      fixedWidth: this.ximage.fixedWidth,
      data,
      url,
    };
    return json;
  }
  exportWeChat(): Promise<ViewObjectExportImageBox> {
    return this.export();
  }
  public static async reverse(
    entity: ViewObjectImportImageBox
  ): Promise<ImageBox> {
    const ximage: XImage = await reverseXImage({
      url: entity.url,
      data: entity.data,
      fixedHeight: entity.fixedHeight,
      fixedWidth: entity.fixedWidth,
    });
    return new ImageBox(ximage);
  }
}
export default ImageBox;
