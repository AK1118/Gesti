import CutterInterface from "../interfaces/cutter";
import Painter from "../painter";
import { ImageChunk } from "../types/index";
import ImageChunkConverterWeChat from "../utils/image-chunk-converter-WeChat";
import XImage from "../ximage";
/**
 * 微信分割器
 */
class CutterWeChat implements CutterInterface {
  painter: Painter;
  constructor(painter: Painter) {
    this.painter = painter;
  }
  async getChunks(chunkSize: number, ximage: XImage): Promise<ImageChunk[]> {
    const imgWidth: number = ximage.fixedWidth,
      imgHeight: number = ximage.fixedHeight;
    const g: Painter = this.painter;
    const chunks: ImageChunk[] = [];
    const image = ximage.data;
    for (let y: number = 0; y < imgHeight; y += chunkSize) {
      //获取切割图片终点，预防临界点溢出
      const endY = Math.min(y + chunkSize, imgHeight);
      const height = endY - y;
      for (let x: number = 0; x < imgWidth; x += imgWidth) {
        const endX = Math.min(x + imgWidth, imgWidth);
        const width = endX - x;
        g.paint.drawImage(image, x, y, width, height, 0, 0, width, height);
        const imageData = await g.getImageData(0, 0, width, height);
        g.clearRect(x, y, width, height);
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
  merge(
    width: number,
    height: number,
    chunks: ImageChunk[],
    canvas?: any
  ): Promise<ImageData> {
    const converter:ImageChunkConverterWeChat = new ImageChunkConverterWeChat();
    const imageData = canvas.createImageData([], width, height);
    //数组合并
    let curentNdx = 0;
    chunks.forEach((item) => {
        const chunk = converter.base64ToChunk(item, canvas);
        chunk.imageData.data.forEach((item) => {
            imageData.data[curentNdx++] = item;
        });
    });
    console.info("[WeChat] Merge successful.")
    return imageData;
  }
}


export default CutterWeChat;