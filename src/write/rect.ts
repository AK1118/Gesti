import ViewObject from "../abstract/view-object";
import WriteBase from "../abstract/write-category";
import Rect from "../rect";
import Vector from "../vector";
import WriteViewObj from "../viewObject/write";

class WriteRect extends WriteBase{
    points:Array<Vector>=[];
    currentPosition:Vector=new Vector(0,0);
    draw(position: Vector) {
      
        this.paint.beginPath();
        const sx=this.startPoint.x,sy=this.startPoint.y;
        const x=position.x,y=position.y;

        this.paint.lineJoin="round";
        this.paint.lineCap="round";

        this.paint.moveTo(sx,sy);
        this.paint.lineTo(x,sy);
        this.paint.lineTo(x,y);
        this.paint.lineTo(sx,y);
        this.paint.closePath();
        this.paint.strokeStyle=this.config.color;
        this.paint.lineWidth=this.config.lineWidth;
        if (this.config.isFill ?? false) {
            this.paint.fillStyle=this.config.color;
            this.paint.fill();
        }else this.paint.stroke();
        this.currentPosition=position;
    }
    async getWriteViewObject(): Promise<ViewObject> {
        
        if(!this.startPoint)return null;
       
        const sx=this.startPoint.x,sy=this.startPoint.y;
        const x=this.currentPosition.x,y=this.currentPosition.y;
        const width=Math.abs(sx-x),height=Math.abs(sy-y);
        const minx=Math.min(x,sx),miny=Math.min(y,sy);
        const rect=new Rect({
            width,
            height,
            x:minx+width*.5,
            y:miny+height*.5,
        });
        const p1=new Vector(sx,sy),p2=new Vector(x,sy),p3=new Vector(x,y),p4=new Vector(sx,y);
        this.points=[p1,p2,p3,p4];
        const rx=rect.position.x,ry=rect.position.y;
        this.points.forEach((item:Vector)=>{
            item.x-=rx;
            item.y-=ry;
        })
        const viewobj =new WriteViewObj(this.points,this.color, this.config);
        viewobj.rect = rect;
        viewobj.init();
        viewobj.dragButton.setAxis("free");
        this.reset();
        this.points=[];
        return viewobj;
    }
    
}

export default WriteRect;