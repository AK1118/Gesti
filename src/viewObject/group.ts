import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import Painter from "../painter";
import Rect from "../rect";

class Group extends ViewObject{
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
  // public update(paint: Painter): void {
  //     this.drawImage(paint);
  // }
  drawImage(paint: Painter): void {
    paint.fillRect(this.rect.size.width*-.5,this.rect.size.height*-.5,this.rect.size.width,this.rect.size.height);
    paint.stroke()
    const [deltaX,deltaY]=this.delta.delta;
    this.views.forEach(_=>{
      _.addPosition(deltaX,deltaY);
      
    });
    this.delta.clean();
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
   
    return this.views.length;
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
}

export default Group;
