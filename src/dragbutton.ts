import ImageBox from "./imageBox";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import Widgets from "./widgets";

class DragButton {
    public rect: Rect;
    public imageBox: ImageBox
    private oldImageBoxRect: Rect = null;
    private oldRadius: number = 0;
    private oldAngle: number = 0;
    public radius: number = 10;
    private disable: boolean = false;
    constructor(imageBox: ImageBox) {
        this.update(imageBox);
    }
    public get getOldAngle():number{
        return this.oldAngle;
    }
    public update(imageBox: ImageBox): void {
        this.imageBox = imageBox;
        const { width, height } = this.imageBox.rect.size;
        let oldButtonRect: Rect;

        if (this.imageBox.getDragButton != null)
            oldButtonRect = this.imageBox.getDragButton.rect.copy();

        this.rect = new Rect({
            x: width * .5,
            y: height * .5,
            width: this.radius,
            height: this.radius,
        });

        this.oldRadius = Vector.mag(this.rect.position);
        this.oldAngle = Math.atan2(~~this.rect.position.y, ~~this.rect.position.x);

        if (this.imageBox.getDragButton != null) this.rect.position = oldButtonRect.position;
        /**
         * @param {ImageRect} newRect 新的万向点Rect三个月还有
         * @description 万向点的坐标是基于 @ImageBox 内的Rect @ImageRect 的，所以得到的一直是相对坐标
         */
        this.rect.onDrag = (newRect:Rect) => {
            /*拖拽缩放*/
            this.changeScale(newRect);
            this.rect = newRect;
            //this.hide();
        }
    }
    changeScale(newRect:Rect): void {
        const oldRect = this.oldImageBoxRect;
        const offsetx = newRect.position.x - oldRect.position.x,
            offsety = newRect.position.y - oldRect.position.y;
        /*等比例缩放*/
        const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
        /*不适用于scale函数，需要基于原大小改变*/
        const newWidth = ~~(oldRect.size.width * scale),
            newHeight = ~~(oldRect.size.height * scale);
        this.imageBox.rect.setSize(newWidth, newHeight);
        /*this.oldAngle为弧度，偏移量*/
        const angle = Math.atan2(offsety, offsetx) - this.oldAngle;
        this.imageBox.rect.setAngle(angle);
    }
    onSelected():void{
		this.oldImageBoxRect = this.imageBox.rect.copy();
	}
    hide() {
		this.disable =true;
	}
	show() {
		this.disable = false;
	}
    draw(paint:Painter) {
		if (this.disable) return;
		const {
			width,
			height
		} = this.imageBox.rect.size;
		const halfRadius = this.radius * .75;

		const halfWidth = width >> 1,
			halfHeight = height >> 1;
		//镜像
		{
			paint.beginPath();
			paint.fillStyle = "#fff";
			paint.arc(-halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
			paint.closePath();
			paint.fill();
			Widgets.drawMirror(paint, {
				offsetx: -halfWidth - halfRadius + 1,
				offsety: height / 2 - halfRadius + 3
			});
		}
		//叉叉
		{
			paint.beginPath();
			paint.fillStyle = "#fff";
			paint.arc(halfWidth, -halfHeight, this.radius, 0, Math.PI * 2);
			paint.closePath();
			paint.fill();
			Widgets.drawClose(paint, {
				offsetx: halfWidth - halfRadius + 4,
				offsety: -height / 2 - 3
			});
		}
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

export default DragButton;