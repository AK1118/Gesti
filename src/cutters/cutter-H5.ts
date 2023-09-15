import CutterInterface from "../interfaces/cutter";
import Painter from "../painter";
import { ImageChunk } from "../types/index";
import Vector from "../vector";
import ImageChunkConverter from "../utils/image-chunk-converter-H5";
import XImage from "../ximage";

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
      for (let x: number = 0; x < imgWidth; x += chunkSize) {
        const endX = Math.min(x + chunkSize, imgWidth);
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
    chunks.forEach((item) => {
      const chunk = coverter.base64ToChunk(item);
      const A = 4;
      //切片数组开始位置
      const sx = Math.max(0, chunk.x),
        sy = Math.max(0, chunk.y);
      //小切片最大宽度
      const mw: number = chunk.width * A;
      //在imageData中的下标
      let index: number = 0;
      //目前小切片下标在第几行了  目前小切片下标在第几个
      let y: number = 0,
        x: number = 0;
      chunk.imageData.data.forEach((item: number, ndx: number) => {
        x = ndx % mw;
        y = ~~(ndx / mw);
        //(sy+y)*width*A) 计算切片合并起始点Y
        //再加上起始点X x代表目前切片遍历x ，y代表目前切片遍历y
        //二位坐标转一维公式  x*y = index
        index = (sy + y) * width * A + (x + sx * A);
        imageData.data[index] = item;
      });
    });
    console.info("[H5] Merge successful.");
    return imageData;
  }
}

export default CutterH5;
