import { FuncButtonTrigger } from "../enums";

import Button from "../abstract/button";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";
import ViewObject from "../abstract/view-object";
import GestiConfig from "../config/gestiConfig";



class MirrorButton extends Button {
    trigger: FuncButtonTrigger = FuncButtonTrigger.click;
    radius: number = 10;
    key: string | number;
    //世界坐标
    rect: Rect;
    //相对坐标
    relativeRect: Rect;
    master: ViewObject;
    constructor(master: ViewObject) {
        super(master);
        this.init({
            percentage: [-.5, .5]
        });
    }
    /**
     * @description 相对坐标为以父对象为原点的定位
     * 绝对坐标是以canvas为原点的定位
     * 相对坐标用于渲染
     * 绝对坐标用于事件捕获
     * 相对坐标一般会直接以父对象为原点进行设置数据
     * 绝对坐标一般需要参考父对象进行设置数据  绝对坐标等于 = 父.绝对+ 相对  
     * 绝对.x=父绝对+cos(θ+初始定位θ)*父半径
     * @param vector 
     */
    updatePosition(vector: Vector): void {
        // this.setRelativePosition([-.5,.5]);
        //this.setAbsolutePosition(vector);
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    effect(): void {
        this.master.mirror();
    }
    draw(paint: Painter): void {
        this.drawButton(this.relativeRect.position,this.master.rect.size,this.radius,paint);
    }
    drawButton(position: Vector, size: Size,radius:number, paint: Painter): void {
        const {
            width,
            height
        } = size;
        const halfRadius = this.radius * .75;
        const x = position.x, y = position.y;
        paint.beginPath();
        paint.fillStyle = GestiConfig.theme.buttonsBgColor;
        paint.arc(x, y, this.radius, 0, Math.PI * 2);
        paint.closePath();
        paint.fill();
        Widgets.drawMirror(paint, {
            offsetx: x - halfRadius + 1,
            offsety: height / 2 - halfRadius + 3
        });
    }
    update(paint: Painter): void {
        this.draw(paint);
    }
    onSelected(): void {

    }

}

export default MirrorButton;