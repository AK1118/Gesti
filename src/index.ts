import ImageToolkit from "./image-toolkit";
import Rect from "./rect";
import XImage from "./ximage";

interface GestiController{
   down(e:Event):void; 
   up(e:Event):void;
   move(e:Event):void;
   wheel(e:Event):void;
}

class GestiControllerImpl implements GestiController{
    down(e: Event): void {
        throw new Error("Method not implemented.");
    }
    up(e: Event): void {
        throw new Error("Method not implemented.");
    }
    move(e: Event): void {
        throw new Error("Method not implemented.");
    }
    wheel(e: Event): void {
        throw new Error("Method not implemented.");
    }
}
class Gesti{
    public controller:GestiController;
    private kit:ImageToolkit;
    public static XImage=XImage;
    constructor(){}
    init(paint:CanvasRenderingContext2D,rect:rectparams){
        this.kit=new ImageToolkit(paint,rect);
    }
    addImage(ximage:XImage):void{
        this.kit.addImage(ximage);
    }
    public async createImage(image:HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|Blob|ImageData|ImageBitmap|OffscreenCanvas):Promise<XImage>{
        const bimp=await createImageBitmap(image);
        return new Promise(r=>{
            const {width,height}=bimp;
            const ximage=new XImage({
                data:bimp,
                width:width,
                height:height,
                scale:1
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

gesti.createImage(img).then(e=>{
    gesti.addImage(e)
})

const netWorkSrc="https://picx.zhimg.com/v2-156bde726c8bd16cd52b369579bde83b_l.jpg?source=32738c0c";
const nimg=new Image();
nimg.src=netWorkSrc;
const bimp:Promise<ImageBitmap>=createImageBitmap(nimg);
gesti.addImage(image);
bimp.then((image:ImageBitmap)=>{
    
    gesti.addImage(new XImage(
        {data:image,
        width:image.width,
    height:image.height,
    scale:1,}
    ))
});
// export default new Gesti();