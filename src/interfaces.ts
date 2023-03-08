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
    disabled: boolean;
}

//按钮抽象类
export abstract class Button implements RenderObject {
    constructor(master: ImageBox) {
        this.master = master;
    }
    //隐藏
    disabled: boolean = false;
    rect: Rect = new Rect();
    key: string | number;
    relativeRect: Rect = new Rect();
    master: ImageBox;
    radius: number = 10;
    oldAngle: number;
    //初始化时按钮离主体中心点的距离
    originDistance: number;
    //初始化时与父的比例对立关系
    private scaleWithMaster: Vector;
    //是否能被锁住
    private canBeeLocking: boolean = true;
    //能被锁住就不是自由的
    get isFree(): boolean {
        return !this.canBeeLocking;
    }
    set free(canBeeLocking: boolean) {
        this.canBeeLocking = !canBeeLocking;
    }
    /**
     * @description 设置相对定位
     * @param options 
     */
    public init(options: {
        percentage?: [x: number, y: number],
        position?: Vector,
    }) {
        const { percentage, position } = options;

        if (percentage)
            this.setRelativePositionRect(percentage);
        else
            if (position) this.setRelativePosition(position);

        this.setAbsolutePosition();
        this.oldAngle = Math.atan2(~~this.relativeRect.position.y, ~~this.relativeRect.position.x);
        //相对定位到中心的距离
        this.originDistance = Vector.mag(this.relativeRect.position);
        console.log(this.relativeRect.position);

        let scaleWidth=0,scaleHeight=0;
        if(this.relativeRect.position.x!=0){
            scaleWidth=this.master.rect.size.width / this.relativeRect.position.x
        }
        if(this.relativeRect.position.y!=0){
            scaleHeight=this.master.rect.size.height / this.relativeRect.position.y
        }
        /**
         * 获取比例关系，后续依赖这个关系改变
        * 关于 scale=1时，由于是相对定位，且 1/n=n,所以在等于1时需要做特殊处理
        */
       // this.scaleWithMaster = new Vector(scaleWidth == 1 ? 0 : scaleWidth, scaleHeight == 1 ? 0 : scaleHeight);
        this.scaleWithMaster = new Vector(scaleWidth,scaleHeight);
        console.log("初始化距离", this.originDistance, "对立比例", this.scaleWithMaster, "VECTOR", this.relativeRect.position);
    }
    abstract trigger: FuncButtonTrigger
    abstract setMaster(master: RenderObject): void;
    abstract effect(rect?: Rect): void;
    abstract updatePosition(vector: Vector): void;
    abstract draw(paint: Painter): void;
    abstract update(paint: Painter): void;
    abstract onSelected(): void;
    get getAbsolutePosition(): Vector {
        return Vector.add(this.relativeRect.position, this.master.rect.position);
    }
    get getRelativePosition(): Vector {
        return this.relativeRect.position;
    }
    public setAbsolutePosition(vector?: Vector) {
        this.rect.position = vector || this.getAbsolutePosition;
    }
    public isInArea(event: Vector): boolean {
        if (this.master.isLock && this.canBeeLocking) return false;
        return CatchPointUtil.checkInsideArc(this.rect.position, event, this
            .radius);
    }
    /**
     * @description 根据父Box的大小宽度比作为基础定位
     * @param percentage ,占比值，四个点坐标
     */
    public setRelativePositionRect(percentage: [x: number, y: number]) {
        const { width, height } = this.master.rect.size;
        const [percent_x, percent_y] = percentage;
        this.relativeRect.position = new Vector(width * percent_x, height * percent_y);
    }
    public updateRelativePosition() {
        const master: Size = this.master.rect.size;
        const { width, height } = master;
        
        let newWidth=width/this.scaleWithMaster.x,newHeight=height/this.scaleWithMaster.y;
        if(this.scaleWithMaster.x==0)newWidth=0;
        if(this.scaleWithMaster.y==0)newHeight=0;
        this.relativeRect.position.setXY(newWidth,newHeight);
        this.originDistance = Vector.mag(this.relativeRect.position);
    }
    public setRelativePosition(position: Vector) {
        this.relativeRect.position = position;
    }
}