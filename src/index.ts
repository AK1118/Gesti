import GestiControllerImpl from "./controller";
import ImageToolkit from "./image-toolkit";
import XImage from "./ximage";

export interface GestiController {
    kit:ImageToolkit;
    down(e: Event): void;
    up(e: Event): void;
    move(e: Event): void;
    wheel(e: Event): void;
}

export interface createImageOptions {
    data?: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions,
    width?: number,
    height?: number,
    scale?: number,
    maxScale?: number,
    minScale?: number,
}


/**
 * 初始化该 @Gesti 实例时，由于平台不确定，用户必须传入 @CanvasRenderingContext2D 画笔作为
 */
class Gesti {
    private kit: ImageToolkit;
    public static XImage = XImage;
    static debug: boolean = false;
    get controller():GestiController{
        return new GestiControllerImpl(this.kit);
    }
    /*
     * @description 初始化 @Gesti 所代理的画布高宽，在h5端可直接传入 HTMLCanvasElement 自动解析高宽
     * @param @CanvasRenderingContext2D paint 
     * @param rect
     */
    public init(canvas: HTMLCanvasElement = null, paint: CanvasRenderingContext2D = null, rect: {
        x?: number,
        y?: number,
        width: number,
        height: number,
    } = null) {
        if (!canvas && !rect) throw Error("未指定Canvas大小或Canvas节点")
        if (typeof (document) != "undefined" && canvas) {
            const canvasRect: DOMRect = canvas.getBoundingClientRect();
            if (canvasRect) {
                const g = canvas.getContext("2d");
                this.kit = new ImageToolkit(g, canvasRect);
                return;
            }
        }
        if (rect)
            this.kit = new ImageToolkit(paint, rect);
    }
    /**
     * @description 添加 @XImage 到canvas里面
     * @param @XImage 
     * @returns 
     */
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
    /**
     * @description 根据传入的image生成一个 @ImageBitmap 实例，拿到图片的宽高数据，创建XImage对象
     * @param image 
     * @param options 
     * @returns Promise< @XImage >
     */
    public createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage> {
        return new Promise(async (r, e) => {
            try {
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
            } catch (error) {
                r(error)
            }
        });
    }
}

export default Gesti;







// const canvas: HTMLCanvasElement = document.querySelector("canvas");
// const g = canvas.getContext("2d");
// const gesti = new Gesti();
// const img: HTMLImageElement = document.querySelector("#dog");
// gesti.init(canvas);

// for (let i = 0; i < 2; i++) {
//     gesti.addImage(gesti.createImage(img))
// }

// const controller:GestiController=gesti.controller;


// window.addEventListener('touchstart',(e)=>{
//     controller.down(e);
// })
// window.addEventListener('touchmove',(e)=>{
//     controller.move(e);
// })
// window.addEventListener('touchend',(e)=>{
//     controller.up(e);
// })

// window.addEventListener('mousedown',(e)=>{
//     controller.down(e);
// })
// window.addEventListener('mousemove',(e)=>{
//     controller.move(e);
// })
// window.addEventListener('mouseup',(e)=>{
//     controller.up(e);
// })
// window.addEventListener('wheel',(e)=>{
//     controller.wheel(e);
// })

// document.getElementById("save").addEventListener("click", () => {
//     const imageData:ImageData=g.getImageData(0,0,canvas.width,canvas.height);
//      const blob=new Blob([imageData.data.buffer],{type:'image/png'});
//     console.log(new File([blob],"测试.png",{type:blob.type}))
//     const link = document.createElement('a');
//     const base64=canvas.toDataURL('image/png',1.0);
//     const d:HTMLImageElement=document.querySelector("#result");
//     d.src=base64;
// })
