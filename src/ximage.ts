
class XImage{
    originData:any;
    data:any;
    width:number=0;
    height:number=0;
    x:number=0;
    y:number=0;
    scale:number=1;
/**
 *   interface createImageOptions {
        data?: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions,
        width?: number,
        height?: number,
        scale?: number,
        maxScale?: number,
        minScale?: number,
    }
 * 
 */
    constructor(params:createImageOptions){
        const {data,width,height,scale,originData}=params;
        if(!data||!width||!height)throw Error("宽或高不能为0");
        this.originData=originData;
        this.data=data;
        this.width=width;
        this.height=height;
        this.scale=scale||1;
    }
    toJson():rectparams{
		return {
			x:this.x,
			y:this.y,
			width:this.width,
			height:this.height,
		}
	}
}   
export default XImage;