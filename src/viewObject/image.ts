import ViewObject from "../abstract/view-object";
import Painter from "../painter";
import Rect from "../rect";
import XImage from "../ximage";

class ImageBox extends ViewObject{
    private ximage:XImage;
   private image: HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
    constructor(ximage:XImage){
        super();
        this.ximage=this.ximage;
        this.image=ximage.data;
        this.rect=new Rect(ximage.toJson());
        this.init();
    }
    //@Override
    public drawImage(paint: Painter): void {
        paint.drawImage(this.image, this.rect.position.x, this.rect.position.y, this.rect.size.width,
			this.rect.size.height);
    }
}

export default ImageBox;