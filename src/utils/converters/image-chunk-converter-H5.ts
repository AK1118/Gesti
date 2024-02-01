import Plugins from "@/core/lib/plugins";
import ImageChunkConverter from "../../core/abstract/image-chunk-converter";
import { ImageChunk } from "../../types/gesti";
import { getImageDataEntity, getOffscreenCanvasWidthPlatform } from "../canvas";

/**
 * 切片解析器--H5
 * */
class ImageChunkConverterH5 extends ImageChunkConverter {
  chunkToBase64(chunk: ImageChunk): ImageChunk {
    const pako = Plugins.getPluginByKey("pako");
    if (!pako)throw Error("To resolve this error, you need to require the 'pako' plugin by running Gesti.installPlugin('pako', pako).") 
    const base64 = pako.deflate(chunk.imageData.data);
    chunk.base64 = base64;
    chunk.imageData = null;
    return chunk;
  }
  base64ToChunk(chunk: ImageChunk): ImageChunk {
    const pako = Plugins.getPluginByKey("pako");
    const a: ImageChunk = chunk;
    if (!pako)throw Error("To resolve this error, you need to require the 'pako' plugin by running Gesti.installPlugin('pako', pako).") 
    const arr=pako.inflate(a.base64);
    // const imageData = new ImageData(a.width, a.height, {
    //   colorSpace: "srgb",
    // });
    const offCanvas=getOffscreenCanvasWidthPlatform(a.width,a.height); 
    const imageData=getImageDataEntity(offCanvas,a.width,a.height);
    imageData.data.set(arr);
    a.imageData = imageData;
    a.base64 = null;
    return a;
  }
}

export default ImageChunkConverterH5;
