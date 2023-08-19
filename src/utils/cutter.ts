import { ImageBox, XImage } from "../index";
import Painter from "../painter";
import { ImageChunk } from "../types/index";
import Vector from "../vector";

/**
 * 图片切割
 * 只做图片切割工作，其他不管
 */
class Cutter {
  private imageBox: ImageBox;
  private ximage: XImage;
  private painter: Painter;
  constructor(painter: Painter) {
    this.painter = painter;
    // this.imageBox=imageBox
    // this.ximage=this.imageBox.getXImage();
  }
  public getChunks(
    imgWidth: number,
    imgHeight: number,
    chunkSize: number,
    ximage:XImage,
    offset?: Vector,
  ): ImageChunk[] {
    const g: Painter = this.painter;
    const _offset: Vector = offset || new Vector(0, 0);
    const chunks: ImageChunk[] = [];
    const image = ximage.data;
    for (let y: number = 0; y < imgHeight; y += chunkSize) {
      //获取切割图片终点，预防临界点溢出
      const endY = Math.min(y + chunkSize, imgHeight);
      const height = endY - y;
      for (let x: number = 0; x < imgWidth; x += chunkSize) {
        const endX = Math.min(x + chunkSize, imgWidth);
        const width = endX - x;
        g.clearRect(0, 0, 1000, 1000);
        g.drawImage(
          image,
          _offset.x,
          _offset.y,
          ximage.fixedWidth,
          ximage.fixedHeight
        );
        g.drawImage(
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
          base64:"",
        });
      }
    }
    return chunks;
  }
}





export default Cutter;