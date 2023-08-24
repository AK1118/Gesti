import { ImageBox, XImage } from "../index";
import CutterInterface from "../interfaces/cutter";
import Painter from "../painter";
import { ImageChunk } from "../types/index";
import Vector from "../vector";
import ImageChunkConverter from "../utils/image-chunk-converter-H5";

/**
 * 图片切割
 * 只做图片切割工作，其他不管
 */
class CutterH5 implements CutterInterface {
  painter: Painter;
  private offScreenPainter: OffscreenRenderingContext;
  /**
   * @description offScreen为false时，你必须要传入一个painter对象
   * @param offScreen
   * @param painter
   */
  constructor(offScreen?: boolean, painter?: Painter) {
    if (offScreen ?? true) {
      if (typeof OffscreenCanvas !== "undefined")
        //原生
        this.offScreenPainter = new OffscreenCanvas(10000, 10000).getContext(
          "2d"
        );
      else {
        throw Error(
          "This platform does not have off-screen rendering function, please select painter"
        );
      }
    } else {
      if (!painter)
        throw Error(
          "When you give up off-screen rendering, you must pass in a painter object"
        );
      this.painter = painter;
    }
  }

  /**
   * @description 切割图片成小块
   * @param chunkSize
   * @param ximage
   * @param offset
   * @returns
   */
  public async getChunks(
    chunkSize: number,
    ximage: XImage
  ): Promise<ImageChunk[]> {
    const imgWidth: number = ximage.fixedWidth,
      imgHeight: number = ximage.fixedHeight;
    const g: any = this.offScreenPainter || this.painter;
    const chunks: ImageChunk[] = [];
    const image = ximage.data;
    for (let y: number = 0; y < imgHeight; y += chunkSize) {
      //获取切割图片终点，预防临界点溢出
      const endY = Math.min(y + chunkSize, imgHeight);
      const height = endY - y;
      for (let x: number = 0; x < imgWidth; x += imgWidth) {
        const endX = Math.min(x + imgWidth, imgWidth);
        const width = endX - x;
      
        (g?.paint ? g?.paint : g).drawImage(
          image,
          x,
          y,
          width,
          height,
          0,
          0,
          width,
          height
        );
        const imageData = await g.getImageData(0, 0, width, height);
        g.clearRect(0, 0, width, height);
        chunks.push({
          x,
          y,
          width,
          height,
          imageData,
          base64: "",
        });
      }
    }
    return chunks;
  }

  public async merge(
    width: number,
    height: number,
    chunks: ImageChunk[]
  ): Promise<ImageData> {
    const g: any = this.offScreenPainter || this.painter;
    const coverter: ImageChunkConverter = new ImageChunkConverter();
    const imageData: ImageData = new ImageData(width, height, {
      colorSpace: "srgb",
    });
    //数组合并法，效率高，容错率低
    let curentNdx: number = 0;
    chunks.forEach((item: ImageChunk) => {
      const chunk = coverter.base64ToChunk(item);
      chunk.imageData.data.forEach((item) => {
        imageData.data[curentNdx++] = item;
      });
    });
    return imageData;
  }
}

export default CutterH5;
