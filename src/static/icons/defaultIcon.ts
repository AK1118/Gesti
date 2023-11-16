import IconBase from "@/core/lib/icon";
import Painter from "@/core/lib/painter";
import Vector from "@/core/lib/vector";

class DefaultIcon extends IconBase{
    get data(): number[][][] {
       return [];
    }
    protected customRender(paint: Painter, location: Vector): void {
        const scale = this.size / this.fixedSize;
        const x=location.x,y=location.y;
        const offset = this.size * -0.5;
        const drawX =  x + offset,drawY = y+ offset;
        paint.fillStyle=this.color;
        paint.beginPath();
        paint.arc(x,y,10*scale,0,Math.PI*2);
        paint.closePath();
        paint.fill();
    }
}

export default DefaultIcon;