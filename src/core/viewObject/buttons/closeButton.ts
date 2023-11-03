import { FuncButtonTrigger } from "../../../enums";
import BaseButton from "../../abstract/baseButton";
import Painter from "../../../painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";

class CloseButton extends BaseButton {
    trigger: FuncButtonTrigger = FuncButtonTrigger.click;
    constructor(master: ViewObject) {
        super(master);
        this.init({
            percentage:[.5, -.5]
        });
    }
    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    effect(): void {
        this.master.hide();
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
        Widgets.drawClose(paint, {
            offsetX: x - halfRadius + 4,
            offsetY: -height / 2 - 3
        });
    }
    render(paint: Painter): void {
        this.draw(paint);
    }
    onSelected(): void {

    }
}


export default CloseButton;