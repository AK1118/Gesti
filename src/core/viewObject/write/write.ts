import ViewObject from "../../abstract/view-object";
import WriteBase from "../../abstract/write-category";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import WriteViewObj from "../write";
/**
 * 写的时候的类，并不是ViewObject图册
 * https://www.cnblogs.com/fangsmile/p/14324460.html
 * 
 * donw在某个被选中的物体之中时，不能开始绘制
 */
class Write extends WriteBase {
    async getWriteViewObject(): Promise<ViewObject> {
        const rect:Rect=this.getRect();
        const x=rect.position.x,y=rect.position.y;
        this.points.forEach((item:Vector)=>{
            item.x-=x;
            item.y-=y;
        })
        if(this.points.length<2)return null;
        const viewobj =new WriteViewObj(this.points,this.color, this.config);
        viewobj.rect = rect;
        viewobj.init();
        this.reset();
        this.points=[];
        return viewobj;
    }
    public points:Array<Vector>=[];
    draw(position: Vector) {
        this.paint.strokeStyle=this.color;
        this.points.push(position);
        if(this.points.length<1)return;
        const len=this.points.length;
        this.paint.beginPath();
       
        for(let i=1;i<len;i++){
            const currentPoint=this.points[i];
            const beforePoint=this.points[i-1];
            this.paint.lineCap = "round";
            let prex = beforePoint.x, prey =beforePoint.y;
            let curx = currentPoint.x, cury = currentPoint.y;
            
            let cx = (prex + curx) * .5;
            let cy = (prey + cury) * .5;
           // this.paint.beginPath();
            // this.paint.moveTo(prex,prey);
            // this.paint.lineTo(curx,cury);
            this.paint.quadraticCurveTo(prex,prey,cx,cy);
            this.paint.lineWidth =3;//this.lineWidth(this.lastPosition, position);
        }
        this.paint.strokeStyle=this.config.color;
        this.paint.lineWidth=this.config.lineWidth;
         this.paint.stroke();
        this.paint.closePath();
    }
    //速度越快，线越细
    // private lineWidth(v1: Vector, v2: Vector): number {
    //     const maxWidth:number=10;
    //     const minWidth:number=3;
    //     const dt: number = Vector.dist(v1, v2);
    //     const speed=dt/maxWidth;

    //     const width = (maxWidth-minWidth)*speed+minWidth;
    //     return width;
    // }
}

export default Write;