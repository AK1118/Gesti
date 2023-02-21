import ImageBox from "./imageBox";
import Rect from "./rect";
import Vector from "./vector";
import XImage from "./ximage";

class Gesture{
    private imageBox:ImageBox=null;
    private oldRect:Rect=null;
    private start:Vector[];
    private end:Vector[];
    private oldDist:number=0;
    private oldAngle:number=-1;
    public isTwoFingers(touches:Vector|Vector[]):boolean{
        if(Array.isArray(touches)&&touches.length==2) return true;
        return false; 
    }
    public onStart(imageBox:ImageBox,start:Vector[]){
        this.imageBox = imageBox;
		this.oldRect = this.imageBox.rect.copy();
		this.start = start;
		/**
		 * 解构得到两个 @Vector,算出它们的距离，并赋值给 @oldDist
		 */
		const [a, b] = this.start;
		this.oldDist = Vector.dist(a, b);
		const v = Vector.sub(a, b);
		this.oldAngle = Math.atan2(v.y, v.x) - this.imageBox.rect.getAngle;
    }
    public cancel(){
        this.imageBox = null;
		this.oldRect = null;
    }
    update(positions:Vector[]) {
		if (this.imageBox == null) return;
		const [a, b] = positions;
		const dist = Vector.dist(a, b);
		const scale = dist / this.oldDist;
		const newWidth = this.oldRect.size.width * scale,
			newHeight = this.oldRect.size.height * scale;
		this.imageBox.rect.setSize(newWidth, newHeight);

		const v = Vector.sub(a, b);
		const angle = Math.atan2(v.y, v.x) - this.oldAngle;
		this.imageBox.rect.setAngle(angle);
	}
}
export default Gesture;