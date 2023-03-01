import CatchPointUtil from "./catchPointUtil";
import { FuncButtonTrigger } from "./enums";
import ImageBox from "./imageBox";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
/**
 * 在页面上渲染的对象
 */
export interface RenderObject {
    key: string | number;
    /**
     * 世界坐标，相对于画布的坐标
     */
    rect: Rect;
    draw(paint: Painter): void;
    update(paint: Painter): void;
    onSelected(): void;
    //相对坐标，相对于画布在translate
    relativeRect: Rect;
    disabled:boolean;
}

//按钮抽象类
export abstract class Button implements RenderObject {
    constructor(master:ImageBox){
        this.master=master;
    }
    //隐藏
    disabled: boolean=false;
    rect: Rect=new Rect();
    key: string | number;
    relativeRect: Rect=new Rect();
    master: ImageBox;
    radius: number=10;
    oldAngle: number;
    //是否能被锁住
    private canBeeLocking:boolean=true;
    //能被锁住就不是自由的
    get isFree():boolean{
        return !this.canBeeLocking;
    }
    set free(canBeeLocking:boolean){
        this.canBeeLocking=!canBeeLocking;
    }
    public init(percentage:[x:number,y:number]){
        this.setRelativePosition(percentage);
        this.setAbsolutePosition();
        this.oldAngle = Math.atan2(~~this.relativeRect.position.y, ~~this.relativeRect.position.x);
    }
    abstract trigger:FuncButtonTrigger
    abstract setMaster(master: RenderObject): void;
    abstract effect(rect?:Rect): void;
    abstract updatePosition(vector: Vector): void;
    abstract draw(paint: Painter): void;
    abstract update(paint: Painter): void;
    abstract onSelected(): void;
    get getAbsolutePosition():Vector{
        return Vector.add(this.relativeRect.position,this.master.rect.position);
    }
    get getRelativePosition():Vector{
        return this.relativeRect.position;
    }
    public setAbsolutePosition(vector?:Vector){
        this.rect.position=vector||this.getAbsolutePosition;
    }
    public isInArea(event:Vector):boolean{
        if(this.master.isLock&&this.canBeeLocking)return false;
        return CatchPointUtil.checkInsideArc(this.rect.position, event, this
            .radius);
    }
    /**
     * @description
     * @param percentage ,占比值，四个点坐标
     */
    public setRelativePosition(percentage:[x:number,y:number]){
        const {width,height}=this.master.rect.size;
        const [percent_x,percent_y]=percentage;
        this.relativeRect.position=new Vector(width*percent_x,height*percent_y);
    } 
}