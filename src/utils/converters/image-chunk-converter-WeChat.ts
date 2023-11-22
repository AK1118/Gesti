import Plugins from "@/core/lib/plugins";
import ImageChunkConverter from "../../core/abstract/image-chunk-converter";
import { ImageChunk } from "../../types/index";

/**
 * 切片解析器--微信
 * */
class ImageChunkConverterWeChat extends ImageChunkConverter {
  // chunkToBase64(chunk: ImageChunk): ImageChunk {

  //     chunk.base64 = base64;
  //     chunk.imageData = null;
  //     return chunk;
  //   }
  chunkToBase64(chunk) {
    const pako = Plugins.getPluginByKey("pako");
    if (!pako)
      throw Error(
        "To resolve this error, you need to require the 'pako' plugin by running Gesti.installPlugin('pako', pako)."
      );
    const base64 = pako.gzip(chunk.imageData.data);
    chunk.base64 = base64;
    chunk.imageData = null;
    return chunk;
  }
  base64ToChunk(chunk, weChatCanvas) {
    const pako = Plugins.getPluginByKey("pako");
    const a = chunk;
    if (!pako)
      throw Error(
        "To resolve this error, you need to require the 'pako' plugin by running Gesti.installPlugin('pako', pako)."
      );
    const arr = pako.inflate(a.base64);
    const imageData = weChatCanvas.createImageData(arr, a.width, a.height);
    imageData.data.set(arr);
    a.imageData = imageData;
    a.base64 = null;
    return a;
  }
}

export default ImageChunkConverterWeChat;
