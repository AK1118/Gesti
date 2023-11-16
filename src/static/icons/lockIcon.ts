import IconBase from "@/core/lib/icon";
import Painter from "@/core/lib/painter";
import Vector from "@/core/lib/vector";

class LockIcon extends IconBase{
    get data(): number[][][] {
        return [];
    }
    protected customRender(paint: Painter, location: Vector): void {
        const scale = this.size / this.fixedSize;
        const x=location.x,y=location.y;
        const offset = this.size * -0.5;
        const drawX =  x + offset,drawY = y+ offset;
        paint.beginPath();
        paint.fillStyle=this.color;
        paint.strokeStyle=this.color;
        paint.lineJoin="round";
        paint.strokeRect((8*scale+drawX),(15*scale+drawY),(26*scale),(20*scale));
        paint.stroke();
        paint.closePath();

        // 绘制上半圆
        paint.beginPath();
        paint.arc(21*scale+drawX,15*scale+drawY, 8*scale, 0, Math.PI,true);
       
        paint.stroke();
        paint.closePath();

        paint.beginPath();
        paint.arc(21*scale+drawX,22*scale+drawY, 4*scale, 0, Math.PI*2);
        paint.fill();
        paint.closePath()
       paint.fillRect(19*scale+drawX,22*scale+drawY,4*scale,10*scale);
    }
}

export default LockIcon;