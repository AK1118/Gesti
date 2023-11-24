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
  ViewObjectExportImageBox,
  ViewObjectImportBaseInfo,
  ViewObjectImportImageBox,
} from "@/types/serialization";
import { ImageChunk } from "@/types/index";
import {
  getOffscreenCanvasContext,
  getOffscreenCanvasWidthPlatform,
  waitingLoadImg,
} from "@/utils/canvas";
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
  }
  setDecoration(xImage: XImage): void {
    this.ximage = xImage;
    this.image = xImage.data;
    const { width, height } = xImage.toJson();
    const oldPosition: Vector = this.rect.position.copy();
    this.rect.setPosition(oldPosition);
    this.rect.setSize(width, height);
  }
  //@Override
  public drawImage(paint: Painter): void {
    // paint.save();
    // paint.scale(this.scaleWidth, this.scaleHeight);
    paint.drawImage(
      this.image,
      this.rect.position.x >> 0,
      this.rect.position.y >> 0,
      this.rect.size.width >> 0,
      this.rect.size.height >> 0
    );
    // paint.restore()
  }
  private readonly chunkSize: number = 200;
  async export(painter?: Painter): Promise<ViewObjectExportImageBox> {
    const cutter: Cutter = new Cutter();
    const url: string = this.ximage.url;
    let data: ImageChunk[];
    if (!url) {
      const chunks: ImageChunk[] = await cutter.getChunks(this.ximage);
      const coverter: ImageChunkConverter = new ImageChunkConverterH5();
      data = coverter.coverAllImageChunkToBase64(chunks);
    }
    //有图片路径时不适用切片数据
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
  async exportWeChat(painter?: Painter): Promise<ViewObjectExportImageBox> {
    const cutter: CutterWeChat = new CutterWeChat();
    const chunkSize: number = 200;
    const chunks: ImageChunk[] = await cutter.getChunks(this.ximage);
    const converter: ImageChunkConverterWeChat =
      new ImageChunkConverterWeChat();
    const base64s: ImageChunk[] = converter.coverAllImageChunkToBase64(chunks);

    const json: ViewObjectExportImageBox = {
      type: "image",
      base: this.getBaseInfo(),
      fixedHeight: this.ximage.fixedHeight,
      fixedWidth: this.ximage.fixedWidth,
      data: base64s,
      url: this.ximage.url,
    };

    return json;
  }
  public didDrag(value: { size: Size; angle: number }): void {
    this.resetButtons(["RotateButton"]);
  }
  public getXImage(): XImage {
    return this.ximage;
  }
  /**
   * 请求
   */
  private static fetchXImageCallback: FetchXImageForImportCallback = async (
    entity: ViewObjectImportImageBox
  ): Promise<XImage> => {
    const url: string = entity.url;
    const base: ViewObjectImportBaseInfo = entity.base;
    const platform: PlatformType = Platform.platform;
    if (platform == "Browser") {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      await waitingLoadImg(img);
      return new XImage({
        data: img,
        height: entity.fixedHeight,
        width: entity.fixedWidth,
        url,
      });
    } else if (platform == "WeChat") {
      const offCanvas = wx.createOffscreenCanvas({
        type: "2d",
        width: entity.fixedWidth,
        height: entity.fixedHeight,
      });
      const img = offCanvas.createImage();
      img.src = url;
      if (img?.crossOrigin) img.crossOrigin = "anonymous";
      await waitingLoadImg(img);
      return new XImage({
        data: img,
        height: entity.fixedHeight,
        width: entity.fixedWidth,
        url,
      });
    }
    return null;
  };

  private static async _loadImg(img): Promise<void> {
    return new Promise((r) => {
      img.onload = () => r();
    });
  }

  public static setFetchXImageCallback(
    _fetchXImageCallback: FetchXImageForImportCallback
  ): void {
    ImageBox.fetchXImageCallback = _fetchXImageCallback;
  }

  public static async reverse(
    entity: ViewObjectImportImageBox
  ): Promise<ImageBox> {
    const base: ViewObjectImportBaseInfo = entity.base,
      url: string = entity?.url,
      chunks: ImageChunk[] = entity?.data;

    if (url) {
      //网络路径存在，不负责请求，任务交由开发者，通过回调函数获取用户传入的XImage
      const xImage: XImage = await ImageBox.fetchXImageCallback(entity);
      if (!xImage)
        throw Error(
          "Your platform does not support fetching this URL for ximage; you could run 'ImageBox.setFetchXImageCallback' to customize the fetch method and resolve this error."
        );
      return new ImageBox(xImage);
    } /*使用数据切片合并图片*/ else if (chunks && chunks?.length != 0) {
      //微信小程序
      if (Platform.isWeChatMiniProgram) return this.reverseWeChat(entity);
      const cutter = new CutterH5();
      const source: ImageData = await cutter.merge(
        entity.fixedWidth,
        entity.fixedHeight,
        chunks
      );
      const imageBitmap: ImageBitmap = await createImageBitmap(source);
      const ximage = new XImage({
        data: imageBitmap,
        width: imageBitmap.width,
        height: imageBitmap.height,
      });
      return new ImageBox(ximage);
    }
    return null;
  }

  public static async reverseWeChat(
    entity: ViewObjectImportImageBox
  ): Promise<ImageBox> {
    const chunks: ImageChunk[] = entity?.data;
    const offCanvas = getOffscreenCanvasWidthPlatform(
      entity.fixedWidth,
      entity.fixedHeight
    );
    const offPainter: Painter = getOffscreenCanvasContext(offCanvas);
    //使用数据切片合并图片
    const cutter = new CutterWeChat();
    const source: ImageData = await cutter.merge(
      entity.fixedWidth,
      entity.fixedHeight,
      chunks,
      offCanvas
    );
    offPainter.putImageData(source, 0, 0);
    const image=offCanvas.createImage();
    image.src=offCanvas.toDataURL();
    await waitingLoadImg(image);
    const ximage = new XImage({
      data: image,
      width: entity.fixedWidth,
      height: entity.fixedHeight,
    });

    return new ImageBox(ximage);
  }
}
export default ImageBox;
