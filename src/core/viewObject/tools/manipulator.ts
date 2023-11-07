/*
 * @Author: AK1118 
 * @Date: 2023-11-04 11:54:38 
 * @Last Modified by: AK1118
 * @Last Modified time: 2023-11-06 17:17:25
 */
import Painter from "@/core/lib/painter";
import SizeButton from "../buttons/sizeButton";
import ViewObject from "@/core/abstract/view-object";
import { SizeButtonLocation, ViewObjectFamily } from "@/core/enums";
import RotateButton from "../buttons/rotateButton";
/**
 * 代理操作机械收框架，代理渲染元素并操作
 * 初始化时需要设置自己的位置为子元素的位置，且大小也需要
 * 当子元素的大小变化时，自己也需要自适应子元素大小，且子元素位置不变
 */
class Manipulator<Widget extends ViewObject> extends ViewObject{
    widget:Widget;
    family: ViewObjectFamily;
    get value(): any {
        throw new Error("Method not implemented.");
    }
    setDecoration(args: any): void {
       
    }
    drawImage(paint: Painter): void {
       this.widget.drawImage(paint);
    }
    export(painter?: Painter): Promise<Object> {
        throw new Error("Method not implemented.");
    }
    exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
        throw new Error("Method not implemented.");
    }
    protected didChangePosition(position: Vector): void {
        this.widget.setPosition(position.x,position.y);
    }
    protected didChangeAngle(angle: number): void {
        this.widget.setAngle(angle);
    }
    protected didChangeScale(scale: number): void {
        this.widget.setScale(scale);
    }
    constructor(widget:Widget){
        super();
        this.rect=widget.rect.copy();
        this.widget=widget;
        this.widget.initialization(this.kit);
        this.family=this.widget.family;
        this.mountFrameWork();
    }
    private mountFrameWork():void{
        this.installButton(new SizeButton(SizeButtonLocation.LT));
        this.installButton(new SizeButton(SizeButtonLocation.LB));
        this.installButton(new SizeButton(SizeButtonLocation.RT));
        this.installButton(new SizeButton(SizeButtonLocation.RB));
        this.installButton(new RotateButton())
    }
}

export default Manipulator;