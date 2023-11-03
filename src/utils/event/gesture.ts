
import ViewObject from "../../core/abstract/view-object";
import Rect from "../../core/lib/rect";
import Vector from "../../core/lib/vector";

/**
 * 手势操作基统一接口
 */
interface Operate{
	onStart(ViewObject:ViewObject,start:Vector|Vector[]):void;
	update(positions:Vector[]):void;
	cancel():void;
}


/**
 * 二指操作类
 */
class TwoFingerOperate implements Operate{
	private ViewObject:ViewObject=null;
    private oldRect:Rect=null;
    private start:Vector[];
    private oldDist:number=0;
    private oldAngle:number=-1;
	public onStart(ViewObject:ViewObject,start:Vector[]){
        this.ViewObject = ViewObject;
		this.oldRect = this.ViewObject.rect.copy();
		this.start = start;
		/**
		 * 解构得到两个 @Vector ,算出它们的距离，并赋值给 @oldDist
		 */
		const [a, b] = this.start;
		this.oldDist = Vector.dist(a, b);
		const v = Vector.sub(a, b);
		this.oldAngle = Math.atan2(v.y, v.x) - this.ViewObject.rect.getAngle;
    }
    public cancel(){
        this.ViewObject = null;
		this.oldRect = null;
    }
    update(positions:Vector[]) {
		if (this.ViewObject == null) return;
		const [a, b] = positions;
		const dist = Vector.dist(a, b);
		const scale = dist / this.oldDist;
		const newWidth = this.oldRect.size.width * scale,
			newHeight = this.oldRect.size.height * scale;
		this.ViewObject.rect.setSize(newWidth, newHeight);
		const v = Vector.sub(a, b);
		const angle = Math.atan2(v.y, v.x) - this.oldAngle;
		this.ViewObject.rect.setAngle(angle);
	}
}


/**
 * 添加点击事件时触发
 */
type listenCallback=(ViewObject:ViewObject,position:Vector|Vector[])=>void;

type GlobalListenCallback=(position:Vector|Vector[])=>void;
/**
 * 该类为手势判断类
 * 点击
 * 抬起
 * 滑动
 * 双击
 * 长按
 * 
 * ！！！ 双击和长按等手势只支持单指
 * ！！！待优化，单击和双击存在竞争问题
 */
class Gesture{
	//判断长按事件，间隔时长
    private longPressTimeout:number=1000;
	//双击间隔时长
	private dbClickTimeout:number=200;
	private clickTimeout:number=200;
	//按下屏幕的时间
	private pressTime:number=0;
	//down的时间，不包括move
	private downTime:number=0;
	//抬起屏幕的时间
	private upTime:number=0;
	//抬起屏幕的时间
	private preUpTime:number=0;
	//按下屏幕的坐标
	private pressVector:Vector;
	//抬起屏幕的坐标
	private upVector:Vector;
	private clickEventList:Array<listenCallback>=new Array<listenCallback>();
	private dbclickEventList:Array<listenCallback>=new Array<listenCallback>();
	private longpressEventList:Array<listenCallback>=new Array<listenCallback>();
	private twoTouchEventList:Array<listenCallback>=new Array<listenCallback>();
	private globalClickEventList:Array<GlobalListenCallback>=[];
	private globalDownEventList:Array<GlobalListenCallback>=[];
	private operate:Operate=null;
	private startPosition:Vector;
	private endPosition:Vector;
    private isTwoFingers(touches:Vector|Vector[]):boolean{
        if(Array.isArray(touches)&&touches.length==2) return true;
        return false; 
    }
	public onUp(ViewObject:ViewObject,position:Vector|Vector[]):void{
		if(!Array.isArray(position)){
			this.endPosition=position;
		}
		this.preUpTime=this.upTime;
		this.upTime=+new Date();

		if(this.isClick){
			this.onGlobalClick(position);
		}

		if(ViewObject==null)return;
		const _position:any=position;
		this.upVector=_position;
		//判断长按
		if(this.isLonePress){
			this.onLonePress(ViewObject,position);
		}else if(this.isDbClick){
			this.onDbClick(ViewObject,position);
		}else if(this.endPosition.equals(this.startPosition)){
			this.onClick(ViewObject,position);
		}
		
	}
	public onMove(ViewObject:ViewObject,position:Vector|Vector[]):void{
		this.pressTime=+new Date();
		if(ViewObject==null)return;
		const vector:any=position;
		this.update(vector);
	}
	public onDown(ViewObject:ViewObject,position:Vector|Vector[]):void{
		if(!Array.isArray(position)){
			this.startPosition=position;
		}
		this.downTime=+new Date()
		this.pressTime=+new Date();
		if(ViewObject==null)return;

		const _position:any=position;
		this.pressVector=_position;
		if(this.isTwoFingers(position)){
			this.onTwoFingers(ViewObject,position);
		}
	}
	get isLonePress():boolean{
		if(this.upTime-this.pressTime>this.longPressTimeout)return true;
		return false
	}
	get isDbClick():boolean{
		return this.upTime-this.preUpTime<this.dbClickTimeout;
	}
	get isClick():boolean{
		return this.upTime-this.downTime<=this.clickTimeout;
	}
	/**
	 * 二指操作
	 * @param ViewObject 
	 * @param start 
	 */
	private onTwoFingers(ViewObject:ViewObject,position:Vector|Vector[]){
		this.operate=new TwoFingerOperate();
		this.operate.onStart(ViewObject,position);
		this.twoTouchEventList.forEach((listenCallback:listenCallback)=>{
			listenCallback(ViewObject,position);
		})
	}
	/**
	 * @description 长按操作
	 * @param ViewObject 
	 * @param start 
	 */
	private onLonePress(ViewObject:ViewObject,position:Vector|Vector[]){
		this.longpressEventList.forEach((listenCallback:listenCallback)=>{
			listenCallback(ViewObject,position);
		})
	}
	private onDbClick(ViewObject:ViewObject,position:Vector|Vector[]):void{
		this.dbclickEventList.forEach((listenCallback:listenCallback)=>{
			listenCallback(ViewObject,position);
		})
	}
	private onClick(ViewObject:ViewObject,position:Vector|Vector[]){
		this.clickEventList.forEach((listenCallback:listenCallback)=>{
			listenCallback(ViewObject,position);
		})
	}
	private onGlobalClick(position:Vector|Vector[]){
		this.globalClickEventList.forEach(eventCallback=>{
			eventCallback(position);
		});
	}
	/**
	 * @description 添加监听事件
	 * @param gestiType 
	 * @param listenCallback 
	 */
	public addListenGesti(gestiType:"click"|"longpress"|"dbclick"|'twotouch'|'globalClick',listenCallback:listenCallback|GlobalListenCallback){
		if(gestiType==='click')this.clickEventList.push(listenCallback as listenCallback);
		if(gestiType==='longpress')this.longpressEventList.push(listenCallback as listenCallback);
		if(gestiType==='dbclick')this.dbclickEventList.push(listenCallback as listenCallback);
		if(gestiType==="twotouch")this.twoTouchEventList.push(listenCallback as listenCallback);
		if(gestiType==='globalClick')this.globalClickEventList.push(listenCallback as GlobalListenCallback);
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