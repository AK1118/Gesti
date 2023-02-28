import { FuncButtonTrigger } from "./enums";
import ImageBox from "./imageBox";
import { Button, RenderObject } from "./interfaces";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import Widgets from "./widgets";

class DragButton extends Button {
    public trigger: FuncButtonTrigger=FuncButtonTrigger.drag;
    public rect: Rect;
    public master: ImageBox
    private oldImageBoxRect: Rect = null;
    private oldRadius: number = 0;
    public oldAngle: number = 0;
    public radius: number = 10;
    private disable: boolean = false;
    public relativeRect: Rect;
    key: string | number=+new Date();
    constructor(master: ImageBox) {
        super(master);
        this.init([.5,.5]);
    }
    updatePosition(vector: Vector): void {
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ImageBox): void {
        this.master = master;
        //this.effect();
    }
    effect(): void {
        // const { width, height } = this.master.rect.size;
        // let oldButtonRect: Rect;

        // if (this.master.getDragButton != null)
        //     oldButtonRect = this.master.getDragButton.rect.copy();

        // this.oldRadius = Vector.mag(this.rect.position);
        // this.oldAngle = Math.atan2(~~this.rect.position.y, ~~this.rect.position.x);
        // if (this.master.getDragButton != null) this.rect.position = oldButtonRect.position;
        // /**
        //  * @param {ImageRect} newRect 新的万向点Rect三个月还有
        //  * @description 万向点的坐标是基于 @ImageBox 内的Rect @ImageRect 的，所以得到的一直是相对坐标
        //  */
        // this.rect.onDrag = (newRect: Rect) => {
        //     /*拖拽缩放*/
        //     this.changeScale(newRect);
        //     this.rect = newRect;
        //     //this.hide();
        // }
        this.master.rect.setAngle(this.master.rect.getAngle+1)
    }
    public get getOldAngle(): number {
        return this.oldAngle;
    }
    public update(paint: Painter): void {
        this.draw(paint);
    }
    changeScale(newRect: Rect): void {
        // const oldRect = this.oldImageBoxRect;
        // const offsetx = newRect.position.x - oldRect.position.x,
        //     offsety = newRect.position.y - oldRect.position.y;
        // /*等比例缩放*/
        // const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
        // /*不适用于scale函数，需要基于原大小改变*/
        // const newWidth = ~~(oldRect.size.width * scale),
        //     newHeight = ~~(oldRect.size.height * scale);
        // this.master.rect.setSize(newWidth, newHeight);
        // /*this.oldAngle为弧度，偏移量*/
        // const angle = Math.atan2(offsety, offsetx)-this.oldAngle;
        // this.master.rect.setAngle(angle);
    }
    onSelected(): void {
        this.oldImageBoxRect = this.master.relativeRect.copy();
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

        if (this.master.isLock) {
            //被锁定时渲染的
            //上锁
            {
                paint.beginPath();
                paint.fillStyle = "#fff";
                paint.arc(halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
                paint.closePath();
                paint.fill();
                Widgets.drawLock(paint, {
                    offsetx: halfWidth - halfRadius + 2,
                    offsety: halfHeight - halfRadius + 2
                });
            }

        } else {
            //拖拽
            {
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
    }
}

export default DragButton;

 // //镜像
            // {
            //     paint.beginPath();
            //     paint.fillStyle = "#fff";
            //     paint.arc(-halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
            //     paint.closePath();
            //     paint.fill();
            //     Widgets.drawMirror(paint, {
            //         offsetx: -halfWidth - halfRadius + 1,
            //         offsety: height / 2 - halfRadius + 3
            //     });
            // }
            // //叉叉
            // {
            //     paint.beginPath();
            //     paint.fillStyle = "#fff";
            //     paint.arc(halfWidth, -halfHeight, this.radius, 0, Math.PI * 2);
            //     paint.closePath();
            //     paint.fill();
            //     Widgets.drawClose(paint, {
            //         offsetx: halfWidth - halfRadius + 4,
            //         offsety: -height / 2 - 3
            //     });
            // }