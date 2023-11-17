import IconBase from "@/core/lib/icon";
import Painter from "@/core/lib/painter";
import Vector from "@/core/lib/vector";

class RotateIcon extends IconBase{
    get data(): number[][][] {
       return []
    }
    protected customRender(paint: Painter, location: Vector): void {
        const scale = this.size / this.fixedSize;
        const x=location.x,y=location.y;
        const offset = this.size * -0.5;
        paint.beginPath();
        paint.fillStyle =this.color;
        paint.strokeStyle =this.color;
        paint.arc(x,y,12*scale,0,Math.PI*.9);
        paint.stroke();
        paint.closePath();
        paint.beginPath();
      
        paint.arc(x,y,12*scale,Math.PI,Math.PI*1.9);
        paint.stroke();
        paint.closePath();

        paint.beginPath();
        paint.moveTo(x-15*scale,y-4*scale);
        paint.lineTo(x-12*scale,y);
        paint.lineTo(x-8*scale,y-4*scale);
        paint.stroke();
        paint.closePath();

        paint.beginPath();
        paint.moveTo(x+15*scale,y+4*scale);
        paint.lineTo(x+12*scale,y);
        paint.lineTo(x+8*scale,y+4*scale);
        paint.stroke();
        paint.closePath();
    }
    
}
export default RotateIcon;