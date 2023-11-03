import ViewObject from "../../abstract/view-object";
import WriteBase from "../../abstract/write-category";
import WriteViewObj from "../write";
import Rect from "../../lib/rect";


class WriteLine extends WriteBase {
    currentPosition: Vector = new Vector(0, 0);
    points: Array<Vector> = [];
    draw(position: Vector) {
        const sx = this.startPoint.x, sy = this.startPoint.y;
        const x = position.x, y = position.y;
        this.paint.beginPath();
        this.paint.moveTo(sx, sy);
        this.paint.lineTo(x, y);
        this.paint.lineJoin = "round";
        this.paint.lineCap = "round";
        this.paint.lineWidth=this.config.lineWidth;
        this.paint.strokeStyle=this.config.color;
        this.paint.stroke();
        this.paint.closePath()
        this.currentPosition = position;
    }
    async getWriteViewObject(): Promise<ViewObject> {
        if (!this.startPoint) return null;
        const sx = this.startPoint.x, sy = this.startPoint.y;
        const x = this.currentPosition.x, y = this.currentPosition.y;
        const width=Math.abs(sx-x),height=Math.abs(sy-y);
        const minx=Math.min(x,sx),miny=Math.min(y,sy);
        const sub=Vector.sub(this.currentPosition,this.startPoint);
        const dt=Vector.dist(this.currentPosition,this.startPoint);
        const angle:number= Math.atan2(sub.y,sub.x);
        const cx=minx+Math.abs(sx-x)*.5,cy=miny+Math.abs(sy-y)*.5;
        const radius=dt*.5;
        //已知直径，中心点，
        const rect=new Rect({
            width:dt,
            height:30,
            x:minx+Math.abs(sx-x)*.5,
            y:miny+Math.abs(sy-y)*.5,
        });
        rect.setAngle(angle);
        this.points = [
            new Vector(rect.position.x-dt*.5, cy),
            new Vector(rect.position.x+dt*.5, cy),
        ];
        const rx=rect.position.x,ry=rect.position.y;
        this.points.forEach((item:Vector)=>{
            item.x-=rx;
            item.y-=ry;
        })
        const viewobj =new WriteViewObj(this.points,this.color, this.config);
        viewobj.rect = rect;
        viewobj.init();
        // viewobj.dragButton.setAxis("horizontal");
        this.reset();
        this.points=[];
        return viewobj;
    }
}

export default WriteLine;