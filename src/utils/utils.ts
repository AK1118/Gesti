import { ImageChunk } from "../types/index";
import ImageChunkConverterWeChat from "./converters/image-chunk-converter-WeChat";

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
  // //当切块过小时合并
  if (width - chunkSize < 20) chunkSize = width;
  if (height - chunkSize < 20) chunkSize = height;
 
  for (let y = 0; y < height; y += chunkSize) {
    for (let x = 0; x < width; x += chunkSize) {
      const chunkWidth = Math.min(chunkSize, width - x);
      const chunkHeight = Math.min(chunkSize, height - y);
      
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
      const imageData: {
        width:number,
        height:number,
        data:Uint8Array,
      } ={
        width:chunkWidth, height:chunkHeight,data:new Uint8Array(chunkData),
      };
      // imageData.data.set(chunkData);
      
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

type DebounceCallback = (args: any) => void;

//防抖
export const Debounce = (fun: DebounceCallback, delay: number) => {
  let timer = null;
  return (args: any) => {
    if (timer != null) clearTimeout(timer);
    timer = setTimeout(() => {
      fun(args);
    }, delay);
  };
};

//节流
export const Throttle = (fun: DebounceCallback, delay: number) => {
  let lastTime: number = 0;
  return (args: any) => {
    let nowTime = new Date().getTime();
    if (nowTime - lastTime < delay) return;
    fun(args);
    lastTime = nowTime;
  };
};

/**
 * 返回某个实例化对象是否等于某个类
 * @param obj 实例化对象
 * @param obj2 类名
 * @returns
 */
export const classTypeIs = (obj: any, obj2: any) => {
  const clazzName1 = obj?.constructor.name;
  return clazzName1 == obj2?.name;
};
/**
 * @description 1inch=72pt
 * @param inch
 */
export const inToPx = (inch: number): number => {
  return ptToPx(inch * 72);
};
/**
 * @description 1inch=25.5 mm
 * @param mm
 * @returns
 */
export const mmToIn = (mm: number): number => {
  return (mm / 25.4);
};
/**
 * @description 1pt是一英镑=1/72(inch)英寸   取dpi=96
 * 得到    px=(pt/72)*96
 * @param pt
 */
export const ptToPx = (pt: number): number => {
  return Math.round((pt / 72) * 96);
};

export const sp = (pt: number): number => {
  return ptToPx(pt);
};

export const coverUnit = (value: number): number => {
  const type: "mm" | "pt" = "mm";
  if (type == "mm") return +inToPx(mmToIn(value)).toFixed(2);
  else if (type == "pt") return +ptToPx(value).toFixed(2);
};


export { uint8ArrayConvert, parseUint8Array, uint8ArrayToChunks };
