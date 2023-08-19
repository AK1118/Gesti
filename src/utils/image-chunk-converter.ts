import { ImageChunk } from "../types/index";

/**
 * base64转换器
 */
class ImageChunkConverter{
    public chunkToBase64(chunk:ImageChunk):string{
        const base64= window?.btoa(chunk.imageData.data.join(','));
        chunk.base64=base64;
        chunk.imageData=null;
        return JSON.stringify(chunk);
    }
    public base64ToChunk(str:string):ImageChunk{
        const a:ImageChunk=JSON.parse(str);
        const arr=window?.atob(a.base64).split(",").map(str=>+str);
       const imageData =new ImageData(a.width,a.height,{
            colorSpace:"srgb"
        });
        imageData.data.set(arr);
        a.imageData=imageData;
        a.base64=null;
        return a;
    }
    public coverAllImageChunkToBase64(chunks:ImageChunk[]):string{
        const arr=chunks.map((item,ndx)=>this.chunkToBase64(item));
        return JSON.stringify(arr);
    }
    /**
     * @description chunks必须是数组类型json
     * @param chunks 
     * @returns 
     */
    public coverAllImageChunkBase64ToChunk(chunks:string):Array<ImageChunk>{
        const arr=JSON.parse(chunks);
        return arr.map((item,ndx)=>this.base64ToChunk(item));
    }
}  

export default ImageChunkConverter;