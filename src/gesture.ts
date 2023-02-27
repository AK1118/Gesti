import ImageBox from "./imageBox";
import Rect from "./rect";
import Vector from "./vector";

/**
 * 手势操作基统一接口
 */
interface Operate{
	onStart(imageBox:ImageBox,start:Vector|Vector[]):void;
	update(positions:Vector[]):void;
	cancel():void;
}


/**
 * 二指操作类
 */
class TwoFingerOperate implements Operate{
	private imageBox:ImageBox=null;
    private oldRect:Rect=null;
    private start:Vector[];
    private oldDist:number=0;
    private oldAngle:number=-1;
	public onStart(imageBox:ImageBox,start:Vector[]){
        this.imageBox = imageBox;
		this.oldRect = this.imageBox.rect.copy();
		this.start = start;
		/**
		 * 解构得到两个 @Vector ,算出它们的距离，并赋值给 @oldDist
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


/**
 * 该类为手势判断类
 * 点击
 * 抬起
 * 滑动
 * 双击
 * 长按
 * 
 * ！！！ 双击和长按等手势只支持单指
 */
class Gesture{
	//判断长按事件，间隔时长
    private longPressTimeout:number=1000;
	//双击间隔时长
	private dbClickTimeout:number=200;
	//按下屏幕的时间
	private pressTime:number=0;
	//抬起屏幕的时间
	private upTime:number=0;
	//抬起屏幕的时间
	private preUpTime:number=0;
	//按下屏幕的坐标
	private pressVector:Vector;
	//抬起屏幕的坐标
	private upVector:Vector;
	private operate:Operate=null;
    private isTwoFingers(touches:Vector|Vector[]):boolean{
        if(Array.isArray(touches)&&touches.length==2) return true;
        return false; 
    }
	public onUp(imageBox:ImageBox,position:Vector|Vector[]):void{
		this.preUpTime=this.upTime;
		this.upTime=+new Date();
		if(imageBox==null)return;
		const _position:any=position;
		this.upVector=_position;
		//判断长按
		if(this.isLonePress){
			this.onLonePress(imageBox,position);
		}else if(this.isDbClick){
			this.onDbClick(imageBox,position);
		}
		
	}
	public onMove(imageBox:ImageBox,position:Vector|Vector[]):void{
		this.pressTime=+new Date();
		if(imageBox==null)return;
		const vector:any=position;
		this.update(vector);
	}
	public onDown(imageBox:ImageBox,position:Vector|Vector[]):void{
		this.pressTime=+new Date();
		if(imageBox==null)return;

		const _position:any=position;
		this.pressVector=_position;
		if(this.isTwoFingers(position)){
			this.onTwoFingers(imageBox,position);
		}
	}
	get isLonePress():boolean{
		if(this.upTime-this.pressTime>this.longPressTimeout)return true;
		return false
	}
	get isDbClick():boolean{
		return this.upTime-this.preUpTime<this.dbClickTimeout;
	}
	/**
	 * 二指操作
	 * @param imageBox 
	 * @param start 
	 */
	private onTwoFingers(imageBox:ImageBox,start:Vector|Vector[]){
		this.operate=new TwoFingerOperate();
		this.operate.onStart(imageBox,start);
	}
	/**
	 * @description 长按操作
	 * @param imageBox 
	 * @param start 
	 */
	private onLonePress(imageBox:ImageBox,start:Vector|Vector[]){

	}
	private onDbClick(imageBox:ImageBox,start:Vector|Vector[]):void{
		
	}
    public cancel(): void{
		if(this.operate==null)return;
		this.operate.cancel();
    }
    update(positions:Vector[]) {
		if(this.operate==null)return;
		this.operate.update(positions);
	}
}
export default Gesture;