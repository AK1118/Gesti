import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../image-toolkit";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";

class Group extends ViewObject{
  private beforeAngle:number=0;
  constructor(){
    super();
    this.rect=new Rect({
      width:100,
      height:100,
      x:0,
      y:0,
    });
    this.init();
  }
  family: ViewObjectFamily;
  get value(): any {
    return this.value;
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    paint.fillRect(this.rect.size.width*-.5,this.rect.size.height*-.5,this.rect.size.width,this.rect.size.height);
    paint.stroke()
    const [deltaX,deltaY]=this.delta.delta;
    this.views.forEach(_=>{
      _.addPosition(deltaX,deltaY);
    });
     this.delta.clean();
  }
  public ready(kit: ImageToolkit): void {
      kit.layerTop(this);
  }
  export(painter?: Painter): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  private views: Array<ViewObject> = [];
  add(obj:ViewObject):number{
    if(!obj)throw Error("The addition object should be of the ViewObject type.");
    this.views.push(obj);
    this.onAddObj(obj);
    return this.views.length;
  }
  /**
   * @description 新增对象做某些事
   * @param obj 
   */
  onAddObj(obj:ViewObject){
    obj.rect.position.sub(this.rect.position);
    //无双不组
    if(this.views.length>=2){
      let ltP,rbP;
      this.views.forEach(item=>{
        const points=item.getVertex();
        points.forEach(_=>{
          if(!ltP)ltP=_;
          if(!rbP)rbP=_;
          if(_.x<ltP.x&&_.y<ltP.y)ltP=_;
          if(_.x>rbP.x&&_.y>rbP.y)rbP=_;
        })
      });
      const width=rbP.x-ltP.x;
      const height=rbP.y-ltP.y;
      console.log(width,height);
      this.setSize({width,height});
    }
  }
  addAll(objs:Array<ViewObject>):number{
    if(!Array.isArray(objs))throw Error("The addition variable should be of the Array<ViewObject> type.");
    objs.forEach(_=>this.add(_));
    return this.views.length;
  }
  public remove(obj: ViewObject) {
    const ndx:number=this.views.findIndex(_=>_.key===obj.key);
    if(ndx!=-1)this.views.splice(ndx,1);
  }
  public removeById(id: string) {
    const obj: ViewObject | undefined = this.views.find((_) => _.id === id);
    if (obj) this.remove(obj);
  }
  public  beforeChangeAngle(angle: number): void {
    this.beforeAngle=angle;
  }
  public didChangeAngle(angle: number): void {
    const _angle=angle-this.beforeAngle;
    const sp=this.rect.position;
      this.views.forEach((view,ndx)=>{
        const ap=view.rect.position;
        const dv=Vector.sub(ap,sp);
        const newX=dv.x*Math.cos(_angle)-dv.y*Math.sin(_angle)+sp.x;
        const newY=dv.x*Math.sin(_angle)+dv.y*Math.cos(_angle)+sp.y;
        view.setPosition(newX,newY);
         view.setAngle(angle);
      });
     
  }
}

export default Group;
