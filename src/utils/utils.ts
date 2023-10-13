import { ImageChunk } from "../types/index";
import ImageChunkConverterWeChat from "./image-chunk-converter-WeChat";

/**
 * @description uint8Array 序列化
 * @param arr
 * @returns
 */
const uint8ArrayConvert = (arr: Uint8ClampedArray) => {
  const pako = require("pako");
  return pako.gzip(arr);
};
/**
 * @description 字符串转换为 UintArray
 * @param string
 * @returns
 */
const parseUint8Array = (string: string): Uint8Array => {
  const pako = require("pako");
  return pako.inflate(string);
};

const uint8ArrayToChunks = (
  uint8Array: Uint8Array,
  width: number,
  height: number,
  chunkSize: number
): ImageChunk[] => {
  const chunks: ImageChunk[] = [];
  const A = 4; // 假设每个像素有4个通道（RGBA）

  for (let y = 0; y < height; y += chunkSize) {
    for (let x = 0; x < width; x += chunkSize) {
      const chunkWidth = Math.min(chunkSize, width - x);
      const chunkHeight = Math.min(chunkSize, height - y);
      const imageData: {
        width:number,
        height:number,
        data:Array<number>,
      } ={
        width:chunkWidth, height:chunkHeight,data:[],
      };
      const chunkData = [];
      for (let cy = 0; cy < chunkHeight; cy++) {
        for (let cx = 0; cx < chunkWidth; cx++) {
          const sourceX = x + cx;
          const sourceY = y + cy;
          const sourceIndex = (sourceY * width + sourceX) * A;

          for (let channel = 0; channel < A; channel++) {
            chunkData.push(uint8Array[sourceIndex + channel]);
          }
        }
      }
      imageData.data=chunkData;
      chunks.push({
        x,
        y,
        width: chunkWidth,
        height: chunkHeight,
        imageData:imageData as unknown as ImageData,
        base64: "",
      });
    }
  }
  const coverter: ImageChunkConverterWeChat = new ImageChunkConverterWeChat();
  const base64s: ImageChunk[] = coverter.coverAllImageChunkToBase64(chunks);
  return base64s;
};

export { uint8ArrayConvert, parseUint8Array, uint8ArrayToChunks };
