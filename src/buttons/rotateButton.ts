import { FuncButtonTrigger } from "../enums";
import ImageBox from "../imageBox";
import { Button } from "../interfaces";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";

class RotateButton extends Button {
    public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
    public rect: Rect;
    public master: ImageBox
    private oldImageBoxRect: Rect = null;
    private oldRadius: number = 0;
    public oldAngle: number = 0;
    public radius: number = 20;
    private disable: boolean = false;
    public relativeRect: Rect;
    key: string | number = +new Date();
    constructor(master: ImageBox) {
        super(master);
        this.init([0,1]);
        this.initScale();
        this.rect.onDrag = (newRect: Rect) => {
            /*拖拽缩放*/
            this.rect = newRect;
            this.effect(newRect);
        }
    }
    updatePosition(vector: Vector): void {
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ImageBox): void {
        this.master = master;
    }
    /**
     * 为拖拽改变大小初始化
     */
    private initScale() {
        this.setRelativePosition([0,1]);
        let oldButtonRect: Rect;
        this.oldRadius = Vector.mag(this.relativeRect.position);
    }
    effect(newRect:Rect): void {

        /**
         * @param {ImageRect} newRect 新的万向点Rect三个月还有
         * @description 万向点的坐标是基于 @ImageBox 内的Rect @ImageRect 的，所以得到的一直是相对坐标
         */
        const oldRect = this.oldImageBoxRect;
        const offsetx = newRect.position.x - oldRect.position.x,
            offsety = newRect.position.y - oldRect.position.y;
        /*等比例缩放*/
        const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
        const angle = Math.atan2(offsety, offsetx) - this.oldAngle;
        this.master.rect.setAngle(angle);
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
            paint.arc(0, halfHeight*2+10, 10, 0, Math.PI * 2);
            paint.closePath();
            paint.fill();
            Widgets.drawRotate(paint, {
                offsetx: 0 ,
                offsety: halfHeight*2+10
            });

    }
}

export default RotateButton;