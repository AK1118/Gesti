import ImageToolkit from "./image-toolkit";
import Rect from "./rect";
import Save from "./save";
import XImage from "./ximage";

interface GestiController {
    down(e: Event): void;
    up(e: Event): void;
    move(e: Event): void;
    wheel(e: Event): void;
}


/**
 * 初始化该 @Gesti 实例时，由于平台不确定，用户必须传入 @CanvasRenderingContext2D 画笔作为
 */
class Gesti {
    public controller: GestiController;
    private kit: ImageToolkit;
    public static XImage = XImage;
    static debug:boolean=false;
    /*
     * @description 初始化 @Gesti 所代理的画布高宽，在h5端可直接传入 HTMLCanvasElement 自动解析高宽
     * @param @CanvasRenderingContext2D paint 
     * @param rect
     */
    public init(canvas:HTMLCanvasElement=null,paint: CanvasRenderingContext2D=null,rect:{
        x?:number,
        y?:number,
        width:number,
        height:number,
    }=null) {
        if(!canvas&&!rect)throw Error("未指定Canvas大小或Canvas节点")
        if(typeof(document)!="undefined"&&canvas){
            const canvasRect:DOMRect=canvas.getBoundingClientRect();
            if(canvasRect){
                const g=canvas.getContext("2d");
                this.kit = new ImageToolkit(g, canvasRect);
                return;
            }
        }
        if(rect)
         this.kit = new ImageToolkit(paint, rect);
    }
    public async addImage(ximage: XImage | Promise<XImage>): Promise<boolean> {
        if (ximage.constructor.name == 'Promise') {
            const _ximage = await ximage;
            this.kit.addImage(_ximage);
            return true;
        }
        //使用any类型强制转换
        const _ximage: any = ximage;
        this.kit.addImage(_ximage);
        return true;
    }
    public createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage> {
        return new Promise(async (r) => {
            const bimp = await createImageBitmap(image);
            const { width, height } = bimp;
            const ximage = new XImage({
                data: bimp,
                width: options?.width || width,
                height: options?.height || height,
                scale: options?.scale || 1,
                maxScale: options?.maxScale || 10,
                minScale: options?.minScale || .1,
            });
            r(ximage)
        });
    }
}

export default Gesti;

const canvas:HTMLCanvasElement = document.querySelector("canvas");
const g = canvas.getContext("2d");
const gesti = new Gesti();
const img: HTMLImageElement = document.querySelector("#dog");
gesti.init(canvas);

for(let i=0;i<2;i++){
    gesti.addImage(gesti.createImage(img))
}

document.getElementById("save").addEventListener("click",()=>{
    const save=new Save();
    const imageData:ImageData=g.getImageData(0,0,canvas.width,canvas.height);
    const blob=new Blob([imageData.data],{type:'image/png'});
    
    // console.log(blob);
    // gesti.addImage(gesti.createImage(blob))
    const base64=canvas.toDataURL('image/png',1.0);
    const d:HTMLImageElement=document.querySelector("#result");
    d.src='';
})
