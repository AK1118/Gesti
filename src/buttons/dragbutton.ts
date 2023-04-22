import { FuncButtonTrigger } from "../enums";
 
import Button from "../abstract/button";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";
import ViewObject from "../abstract/view-object";

class DragButton extends Button {
    public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
    public rect: Rect;
    public master: ViewObject
    private oldViewObjectRect: Rect = null;
    private oldRadius: number = 0;
    public oldAngle: number = 0;
    public radius: number = 10;
    private disable: boolean = false;
    public relativeRect: Rect;
    //拉伸变化方式  比例   水平  垂直   自由
    private axis:"ratio"|"horizontal"|"vertical"|"free"="ratio";
    key: string | number = +new Date();
    constructor(master: ViewObject,options?:{
        axis?:"ratio"|"horizontal"|"vertical"|"free"
    }) {
        super(master);
        this.init({percentage:[.5, .5]});
        this.initScale();
        this.rect.onDrag = (newRect: Rect) => {
            /*拖拽缩放*/
            this.rect = newRect;
            this.effect(newRect);
        }
        if(options)this.axis=options.axis??"ratio";
    }
    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    public setAxis(axis:"ratio"|"horizontal"|"vertical"|"free"){
        this.axis=axis;
    }
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    /**
     * 为拖拽改变大小初始化
     */
    private initScale() {
        this.setRelativePositionRect([.5, .5]);
        this.oldRadius = Vector.mag(this.relativeRect.position);
    }
    effect(newRect: Rect): void {

        /**
         * @param {ImageRect} newRect 新的万向点Rect三个月还有
         * @description 万向点的坐标是基于 @ViewObject 内的Rect @ImageRect 的，所以得到的一直是相对坐标
         */
        const oldRect = this.oldViewObjectRect;
        const offsetx = newRect.position.x - oldRect.position.x,
            offsety = newRect.position.y - oldRect.position.y;
        /*等比例缩放*/
        const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
        
        /*不适用于scale函数，需要基于原大小改变*/
        let newWidth = ~~(oldRect.size.width * scale),
            newHeight = ~~(oldRect.size.height * scale);
        
        if(this.axis=="horizontal"){
            newHeight = ~~(oldRect.size.height * 1);
        }
        else if(this.axis=="vertical"){
            newWidth = ~~(oldRect.size.width * 1);
        }
        else if(this.axis=="ratio"){

        }else if(this.axis=="free"){
           newWidth=oldRect.size.width*(offsetx*1.5/this.oldRadius);
           newHeight=oldRect.size.height*(offsety*1.5/this.oldRadius);
        }
        this.master.rect.setSize(newWidth, newHeight,true);
        /*this.oldAngle为弧度，偏移量*/
        const angle = Math.atan2(offsety, offsetx) - this.oldAngle;
       if(this.axis=="ratio") this.master.rect.setAngle(angle,true);
        this.master.rect.setScale(scale,false);
    }
    public get getOldAngle(): number {
        return this.oldAngle;
    }
    public update(paint: Painter): void {
        this.draw(paint);
    }
    onSelected(): void {
        this.oldViewObjectRect = this.master.rect.copy();
        this.initScale();
    }
    hide() {
        this.disable = true;
    }
    show() {
        this.disable = false;
    }
    draw(paint: Painter) {
        if (this.disable) return;
        const halfRadius = this.radius * .75;
        const x=this.relativeRect.position.x,y=this.relativeRect.position.y;

        paint.beginPath();
        paint.fillStyle = "#fff";
        paint.arc(x, y, this.radius, 0, Math.PI * 2);
        paint.closePath();
        paint.fill();
        Widgets.drawGrag(paint, {
            offsetx: x - halfRadius + 2,
            offsety: y - halfRadius + 2
        });
    }
}

export default DragButton;