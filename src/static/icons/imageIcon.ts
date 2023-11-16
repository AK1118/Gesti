import IconBase from "@/core/lib/icon";
import Painter from "@/core/lib/painter";
import Vector from "@/core/lib/vector";
import XImage from "@/core/lib/ximage";
class ImageIcon extends IconBase{
    private image:XImage;
    constructor(xImage:XImage){
        super();
        this.image=xImage;
    }
    get data(): number[][][] {
        return [];
    }
    protected customRender(paint: Painter, location: Vector): void {
        const image=this.image;
        const width=image.width,height=image.height;
        const x=location.x,y=location.y;
        const scale = this.size / this.fixedSize;
        const offsetX = width * -0.5,offsetY=height*-.5;
        const drawX =  x + offsetX,drawY = y+ offsetY;
        const img=image.data;
        paint.deepDrawImage(img,drawX,drawY,width,height);
    }

}


export default ImageIcon;