import { FuncButtonTrigger } from "../enums";
import ImageBox from "../imageBox";
import Button from "../abstract/button";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import Widgets from "../widgets";



class LockButton extends Button {
    trigger: FuncButtonTrigger = FuncButtonTrigger.click;
    radius: number = 10;
    key: string | number;
    //世界坐标
    rect: Rect;
    //相对坐标
    relativeRect: Rect;
    master: ImageBox;
    constructor(master: ImageBox) {
        super(master);
        this.init({percentage:[-.5, -.5]});
    }

    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ImageBox): void {
        this.master = master;
    }
    effect(): void {
        this.master.lock();
    }
    draw(paint: Painter): void {
        const {
            width,
            height
        } = this.master.rect.size;
        const halfRadius = this.radius * .75;

        const halfWidth = width >> 1,
            halfHeight = height >> 1;
        paint.beginPath();
        paint.fillStyle = "#fff";
        paint.arc(-halfWidth, -halfHeight, this.radius, 0, Math.PI * 2);
        paint.closePath();
        paint.fill();
        Widgets.drawLock(paint, {
            offsetx: -halfWidth - halfRadius + 1,
            offsety: -height / 2 - halfRadius + 3
        });
    }
    update(paint: Painter): void {
        this.draw(paint);
    }
    onSelected(): void {

    }

}

export default LockButton;