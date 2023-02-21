import ImageToolkit from "./image-toolkit";
import Rect from "./rect";
import XImage from "./ximage";

interface GestiController{
   down(e:Event):void; 
   up(e:Event):void;
   move(e:Event):void;
   wheel(e:Event):void;
}



class Gesti{
    public controller:GestiController;
    private kit:ImageToolkit;
    public static XImage=XImage;
    constructor(){}
    public init(paint:CanvasRenderingContext2D,rect:rectparams){
        this.kit=new ImageToolkit(paint,rect);
    }
    public async addImage(ximage:XImage|Promise<XImage>):Promise<boolean>{
        if(ximage.constructor.name=='Promise'){
            const _ximage=await ximage;
            this.kit.addImage(_ximage);
            return true;
        }
        //使用any类型强制转换
        const _ximage:any=ximage;
        this.kit.addImage(_ximage);
        return true;
    }
    public createImage(image:HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|Blob|ImageData|ImageBitmap|OffscreenCanvas,options?:createImageOptions):Promise<XImage>{
        return new Promise(async (r)=>{
            const bimp=await createImageBitmap(image);
            const {width,height}=bimp;
            const ximage=new XImage({
                data:bimp,
                width:options?.width ||width,
                height:options?.height||height,
                scale:options?.scale || 1,
                maxScale:options?.maxScale||10,
                minScale:options?.minScale||.1,
            });
            r(ximage)
        });
    }
}

const canvas=document.querySelector("canvas");
const g=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const gesti=new Gesti();
const img:HTMLImageElement=document.querySelector("#dog");
gesti.init(g,{
    x:0,
    y:0,
    width:canvas.width,
    height:canvas.height,
});

const image=new XImage(
    {data:img,
    width:img.width,
    height:img.height,
    scale:1,}
);
const a=gesti.createImage(img)
gesti.addImage(a)
gesti.addImage(gesti.createImage(img,{
    scale:.5
}))
gesti.createImage(img).then(e=>{
    gesti.addImage(e)
});


// const netWorkSrc="https://picx.zhimg.com/v2-156bde726c8bd16cd52b369579bde83b_l.jpg?source=32738c0c";
// const nimg=new Image();
// nimg.src=netWorkSrc;
// const bimp:Promise<ImageBitmap>=createImageBitmap(nimg);
// gesti.addImage(image);

// bimp.then((image:ImageBitmap)=>{
//     gesti.addImage(new XImage(
//         {data:image,
//         width:image.width,
//     height:image.height,
//     scale:1,}
//     ))
// });
// export default new Gesti();