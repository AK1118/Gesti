import { FuncButtonTrigger } from "../enums";
import ImageBox from "../imageBox";
import Button from "../abstract/button";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";

class DragButton extends Button {
    public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
    public rect: Rect;
    public master: ImageBox
    private oldImageBoxRect: Rect = null;
    private oldRadius: number = 0;
    public oldAngle: number = 0;
    public radius: number = 10;
    private disable: boolean = false;
    public relativeRect: Rect;
    key: string | number = +new Date();
    constructor(master: ImageBox) {
        super(master);
        this.init({percentage:[.5, .5]});
        this.initScale();
        this.rect.onDrag = (newRect: Rect) => {
            /*拖拽缩放*/
            this.rect = newRect;
            this.effect(newRect);
        }
    }
    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ImageBox): void {
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
         * @description 万向点的坐标是基于 @ImageBox 内的Rect @ImageRect 的，所以得到的一直是相对坐标
         */
        const oldRect = this.oldImageBoxRect;
        const offsetx = newRect.position.x - oldRect.position.x,
            offsety = newRect.position.y - oldRect.position.y;
        /*等比例缩放*/
        const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
        /*不适用于scale函数，需要基于原大小改变*/
        const newWidth = ~~(oldRect.size.width * scale),
            newHeight = ~~(oldRect.size.height * scale);
        this.master.rect.setSize(newWidth, newHeight,true);
        /*this.oldAngle为弧度，偏移量*/
        const angle = Math.atan2(offsety, offsetx) - this.oldAngle;
        this.master.rect.setAngle(angle,true);
    }
    public get getOldAngle(): number {
        return this.oldAngle;
    }
    public update(paint: Painter): void {
        this.draw(paint);
    }
    onSelected(): void {
        this.oldImageBoxRect = this.master.rect.copy();
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
        const {
            width,
            height
        } = this.master.rect.size;
        const halfRadius = this.radius * .75;

        const halfWidth = width >> 1,
            halfHeight = height >> 1;

        paint.beginPath();
        paint.fillStyle = "#fff";
        paint.arc(halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
        paint.closePath();
        paint.fill();
        Widgets.drawGrag(paint, {
            offsetx: halfWidth - halfRadius + 2,
            offsety: halfHeight - halfRadius + 2
        });
    }
}

export default DragButton;