import { ImageBox, XImage } from "../index";
import Painter from "../painter";
import { ImageChunk } from "../types/index";
import Vector from "../vector";
import ImageChunkConverter from "./image-chunk-converter";
import { classIs } from "./index";

/**
 * 图片切割
 * 只做图片切割工作，其他不管
 */
class Cutter {
  private painter: Painter;
  private offScreenPainter: OffscreenRenderingContext;
  /**
   * @description offScreen为false时，你必须要传入一个painter对象
   * @param offScreen 
   * @param painter 
   */
  constructor(offScreen?: boolean, painter?: Painter) {
    if (offScreen ?? true) {
      if (typeof OffscreenCanvas !== 'undefined')
      //原生
        this.offScreenPainter = new OffscreenCanvas(10000, 10000).getContext("2d");
      else if(typeof wx!=='undefined'){
        //微信
        this.offScreenPainter=wx.createOffscreenCanvas({type: '2d', width: 10000, height: 10000});
      }else if(typeof tt!=='undefined'){
        //抖音
        this.offScreenPainter=tt.createOffscreenCanvas({type: '2d', width: 10000, height: 10000});
      }else{
        throw Error("This platform does not have off-screen rendering function, please select painter");
      }
    }
    else {
      if (!painter) throw Error("When you give up off-screen rendering, you must pass in a painter object")
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
  public getChunks(
    chunkSize: number,
    ximage: XImage,
    offset?: Vector,
  ): ImageChunk[] {
    const imgWidth: number = ximage.fixedWidth,
      imgHeight: number = ximage.fixedHeight;
    const g: any = this.offScreenPainter || this.painter;
    const _offset: Vector = offset || new Vector(0, 0);
    const chunks: ImageChunk[] = [];
    const image = ximage.data;
    for (let y: number = 0; y < imgHeight; y += chunkSize) {
      //获取切割图片终点，预防临界点溢出
      const endY = Math.min(y + chunkSize, imgHeight);
      const height = endY - y;
      for (let x: number = 0; x < imgWidth; x += imgWidth) {
        const endX = Math.min(x + imgWidth, imgWidth);
        const width = endX - x;
        g.clearRect(0, 0, imgWidth, chunkSize);
        (g?.paint ? g?.paint : g).drawImage(
          image,
          x,
          y,
          endX - x,
          endY - y,
          _offset.x,
          _offset.y,
          endX - x,
          endY - y
        );
        const imageData: ImageData = g.getImageData(
          _offset.x,
          _offset.y,
          endX - x,
          endY - y
        );
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

  public merge(width: number, height: number, chunks: ImageChunk[]): ImageData {
    const g: any = this.offScreenPainter || this.painter;
    const coverter: ImageChunkConverter = new ImageChunkConverter();
    const imageData: ImageData = new ImageData(width, height, {
      colorSpace: "srgb"
    });
    //数组合并法，效率高，容错率低
    let curentNdx: number = 0;
    chunks.forEach((item: ImageChunk) => {
      const chunk = coverter.base64ToChunk(item);
      chunk.imageData.data.forEach(item => {
        imageData.data[curentNdx++] = item;
      })
    });


    //图画合并法,容错率高，对画布有要求
    // chunks.forEach((item: ImageChunk) => {
    //   const chunk = coverter.base64ToChunk(item);
    //   console.log("合并", chunk.imageData.data)
    //   imageData.data.set([...imageData.data, ...chunk.imageData.data]);
    //   g.putImageData(chunk.imageData, item.x, item.y);

    // });
    return imageData;
  }
}





export default Cutter;