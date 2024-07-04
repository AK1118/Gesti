import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import Painter from "../lib/painter";
import Rect from "../lib/rect";
import Cutter from "../../utils/cutters/cutter-H5";
import ImageChunkConverterH5 from "../../utils/converters/image-chunk-converter-H5";
import ImageChunkConverter from "../../utils/converters/image-chunk-converter-H5";
import ImageChunkConverterWeChat from "../../utils/converters/image-chunk-converter-WeChat";

// import CutterWeChat from "../..//utils/cutters/cutter-WeChat";
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
import BoxFit, { applyBoxFit } from "../lib/painting/box-fit";
import XImage from "../lib/ximage";
import Clipper from "@/test/clipper";
interface SrcDataOption {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
}
/**
 * 可设置背景，且背景
 */
class ImageBox extends Clipper {
  family: ViewObjectFamily = ViewObjectFamily.image;
  private srcWidth: number = 0;
  private srcHeight: number = 0;
  private srcX: number = 0;
  private srcY: number = 0;
  get value(): any {
    return this.image;
  }
  public xImage: XImage;
  private image:
    | HTMLOrSVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement
    | ImageBitmap
    | OffscreenCanvas;
  public originFamily: ViewObjectFamily = ViewObjectFamily.image;
  constructor(xImage: XImage) {
    super({
      image: xImage,
      width: xImage.width,
      height: xImage.height,
      maskColor: "rgba(0,0,0,.54)",
    });
    this.xImage = xImage;
    this.image = xImage.data;
    this.rect = new Rect(xImage.toJson());
    const decoration: BoxDecorationOption = {
      // backgroundImage: xImage,
    };

    this.setDecoration(decoration);
    // this.useCache();
  }

  public replaceXImage(xImage: XImage): void {
    this.xImage = xImage;
    this.image = xImage.data;
    console.log("替换", xImage.toJson());
    super.replaceXImage(xImage);
  }
  // protected onMounted(): void {
  //   super.onMounted();
  //   if (
  //     this.mounted &&
  //     this.xImage.fit != BoxFit.none &&
  //     this.xImage.fit != undefined
  //   ) {
  //     const kit = this.getKit();
  //     const size = kit.getCanvasRect().size;
  //     const fittedSizes = applyBoxFit(this.xImage.fit, this.size, size);
  //     this.setSize({
  //       width: fittedSizes.destination.width,
  //       height: fittedSizes.destination.height,
  //     });
  //   }
  // }
  async export(): Promise<any> {
    const url: string = this.xImage.url;
    let data: ImageChunk[];
    if (!url) {
      const cutter: Cutter = new Cutter();
      const chunks: ImageChunk[] = await cutter.getChunks(this.xImage);
      const coverter: ImageChunkConverter = new ImageChunkConverterH5();
      data = coverter.coverAllImageChunkToBase64(chunks);
    }

    const json: ViewObjectExportImageBox = {
      type: "image",
      base: await this.getBaseInfo(),
      fixedHeight: this.xImage.fixedHeight,
      fixedWidth: this.xImage.fixedWidth,
      data,
      url,
    };
    return json;
  }
  exportWeChat(): Promise<any> {
    return this.export();
  }
  public static async reverse(
    entity: ViewObjectImportImageBox
  ): Promise<ImageBox> {
    const xImage: XImage = await reverseXImage({
      url: entity.url,
      data: entity.data,
      fixedHeight: entity.fixedHeight,
      fixedWidth: entity.fixedWidth,
    });
    return new ImageBox(xImage);
  }
}
export default ImageBox;
