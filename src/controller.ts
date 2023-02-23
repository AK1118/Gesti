import ImageToolkit from "./image-toolkit";
import { GestiController } from "./index";
import Vector from "./vector";


class GestiControllerImpl implements GestiController{
	/**
	 * @ImageToolkit
	 * @private
	 */
	public kit:ImageToolkit;
	constructor(kit:ImageToolkit) {
        //使用控制器时，取消原有控制
        kit.cancelEvent();
		this.kit = kit;
	}
	/**
	 * @param {Event} e
	 * @description  点击
	 * @public
	 */
	public  down(e:MouseEvent|Event|EventHandle) {
		this.eventTransForm(e,this.kit.down);
	}
	/**
	 * @param {Event} e
	 * @description 移动
	 * @public
	 */
	public move(e:MouseEvent|Event|EventHandle) {
		this.eventTransForm(e,this.kit.move)
	}
	/**
	 * @param {Event} e
	 * @description 抬起
	 * @public
	 */
	public up(e:MouseEvent|Event|EventHandle) {
		this.eventTransForm(e,this.kit.up,"changedTouches")
	}
	/**
	 * @param {Event} e
	 * @description 鼠标滚轮
	 * @public
	 */
	public wheel(e:MouseEvent|Event|EventHandle){
		//只有Pc端有
		if('touches' in e)return;
		this.kit.wheel.bind(this.kit)(e);
	}
	/**
	 * @param {Event} e
	 * @param {Function} callback
	 * @description 判断是移动端还是Pc端
	 * @private
	 */
	private eventTransForm(e:MouseEvent|Event|EventHandle,callback,key?:string){
		if('touches' in e){
			//移动端
			/**
			 * 移动端分为 browser 和 微信
			 * 微信内没有clientX，而是 x
			 */
			return this.action(e,callback,key||"");
		}else if('clientX' in e){
			//pc端
			const {clientX:x,clientY:y}=e;
			const vector = new Vector(x,y);
			return callback.bind(this.kit)(vector);
		}
		
	}
	/**
	 * @param {Array<Event>} touches
	 * @return Array<Vector>
	 */
	private twoFingers(touches:Event|EventHandle) {
		const e1 = touches[0];
		const e2 = touches[1];
		const vector1 = new Vector(e1.clientX||e1.x, e1.clientY||e1.y);
		const vector2 = new Vector(e2.clientX||e2.x, e2.clientY||e2.y);
		return [vector1, vector2];
	}
	/**
	 * @param {Event} _e
	 * @param {Function} callback
	 * @description 移动端分为微信和browser
	 * @private
	 */
	private action(_e:any,callback:any,key:string){
		/**
		 * 点击和移动事件 三个都有
		 * 抬起事件只有changedTouches
		 * 针对Up事件，提供以下针对方案
		 */
		const touches = key?_e[key]:_e.touches||_e.targetTouches||_e.changedTouches;
		if (touches.length >= 2) {
			callback.bind(this.kit)(this.twoFingers(touches));
		} else {
			const e = touches[0];
			const vector = new Vector(e.clientX||e.x,e.clientY||e.y);
			callback.bind(this.kit)(vector);
		}
	}
}

export default GestiControllerImpl;