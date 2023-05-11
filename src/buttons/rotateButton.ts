import { FuncButtonTrigger } from "../enums";

import Button from "../abstract/button";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";
import ViewObject from "../abstract/view-object";
import GestiConfig from "../config/gestiConfig";

class RotateButton extends Button {
    public trigger: FuncButtonTrigger = FuncButtonTrigger.drag;
    public rect: Rect;
    public master: ViewObject
    private oldViewObjectRect: Rect = null;
    private oldRadius: number = 0;
    public oldAngle: number = 0;
    public radius: number = 10;
    private disable: boolean = false;
    public relativeRect: Rect;
    key: string | number = +new Date();
    constructor(master: ViewObject) {
        super(master);
        this.name="rotate";
        this.init({
            position:new Vector(0,(master.rect.size.height>>1)+10),
        });
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
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    /**
     * 为拖拽改变大小初始化
     */
    private initScale() {
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
        let angle = Math.atan2(offsety, offsetx) - this.oldAngle;
        //辅助旋转
        {
            let _angle = +angle.toFixed(2);
            const _45 = 0.78;
            const limit = 0.1;
            const scale = (angle / 0.78) >> 0;
            angle = Math.abs(_angle - scale * _45) < limit ? scale * _45 : _angle;
        }
        this.master.rect.setAngle(angle);
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
        const x = this.relativeRect.position.x, y = this.relativeRect.position.y;
        paint.beginPath();
        paint.fillStyle = GestiConfig.theme.buttonsBgColor;
        paint.arc(x, y, this.radius, 0, Math.PI * 2);
        paint.closePath();
        paint.fill();
        Widgets.drawRotate(paint, {
            offsetx: x,
            offsety: y,
        });
    }
}

export default RotateButton;