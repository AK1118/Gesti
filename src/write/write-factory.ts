import ViewObject from "../abstract/view-object";
import WriteBase from "../abstract/write-category";
import WriteInterface from "../abstract/write-category";
import Painter from "../painter";
import Write from "./write";



export enum WriteType{
    None,
    Write,
    Rect,
    Circle,
}

/**
 * down在已被选中图册上时不能绘制，
 * 当down图册上时  current=null,
 * 需要存储被选中绘制的类型
 * 每个类的生命周期为   down-move-up-诞生图册-长存
 * down需要做动作:判定是否在选定图册内,没有就new对象
 * 
 */
class WriteFactory{
    //当前画笔类型
    private currentType:WriteType=WriteType.None;
    public current:WriteBase;
    private paint:Painter;

    constructor(paint:Painter){
        this.paint=paint;
    }
    public setWriteType(type:WriteType){
        this.currentType=type;
    }
    public onDraw(){
        switch (this.currentType) {
            case WriteType.Write:this.current=this.write();
        }
    }
    /**
     * 
     * @returns 普通的绘制类
     */
    private write():Write{
        const write:Write=new Write(this.paint);
        write.disableCanvasUpdate=true;
        this.current=write;
        return write;
    }
    
   async done():Promise<ViewObject>{
        if(!this.current)return;
        const obj=await this.current.getWriteViewObject();
        //obj?.onSelected();
        this.current=null;
        return obj;
    }

    cancel():void{
        this.current=null;
    }
}
export default WriteFactory;