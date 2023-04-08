import { CloseButton, MirrorButton, RotateButton } from "../buttons";
import DelockButton from "../buttons/delockButton";
import DragButton from "../buttons/dragbutton";
import LockButton from "../buttons/lockbutton";
import RenderObject from "../interfaces/render-object";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import { Point } from "../vertex";
import Button from "./button";
import OperationObserver from "./operation-observer";

/**
 * 凡是带有操作点的对象都是它，
 * 例如 图片、文字 等
 */
abstract class ViewObject extends OperationObserver implements RenderObject {
	public selected: boolean = false;
	private scale: number = 1;
	public key: string | number = +new Date();
	private isMirror: boolean = false;
	public disabled: boolean = false;
	public rect: Rect;
	public beforeRect: Rect;
	private layer: number = 0;
	private funcButton: Array<Button> = new Array<Button>();
	public relativeRect: Rect;
	/**
	 * @description 是否冻结锁住，
	 * 锁住过后可被选取，但是不能位移和改变大小
	 */
	private _lock: boolean = false;
	constructor() {
		super();
		
	}
	public init() {
		this.funcButton = [
			new DragButton(this),
			new MirrorButton(this),
			new CloseButton(this),
			new RotateButton(this),
			new LockButton(this),
			new DelockButton(this),
		];
		this.relativeRect = new Rect({
			x: 0,
			y: 0,
			width: this.rect.size.width,
			height: this.rect.size.height,
		});
		this.addObserver(this);
	}
	
	/**
	 * @description 锁住
	 */
	public lock(): void {
		this._lock = true;
		this.onLock();
	}
	/**
	 * @description 解锁
	 */
	public deblock() {
		this._lock = false;
		this.onDelock();
	}
	/**
	 * @description 查看是否锁住
	 */
	get isLock(): boolean {
		return this._lock;
	}
	set setLayer(layer: number) {
		this.layer = layer;
	}
	get getLayer(): number {
		return this.layer;
	}
	public mirror() {
		this.isMirror = !this.isMirror;
	}
	public update(paint: Painter) {
		this.draw(paint)
	}
	public draw(paint: Painter): void {
		paint.beginPath();
		paint.save();
		paint.translate(this.rect.position.x, this.rect.position.y);
		paint.rotate(this.rect.getAngle);
		if (this.isMirror) paint.scale(-1, 1)
		this.drawImage(paint);
		if (this.isMirror) paint.scale(-1, 1)
		if (this.selected) {
			this.drawStroke(paint);
			this.updateFuncButton(paint);
		}
		paint.restore();
		paint.translate(0, 0);
		/*更新顶点数据*/
		this.rect.updateVertex();
		/*渲染顶点*/
		paint.closePath();

	}
	//当被锁定时触发
	private onLock() {
		//锁定时，自由的按钮不会消失,反之会显示
		this.funcButton.forEach((button: Button) => {
			button.disabled = !button.isFree;
		});
	}
	//解锁时触发
	private onDelock() {
		//解锁时，自由的按钮消失,反之会显示
		this.funcButton.forEach((button: Button) => {
			button.disabled = button.isFree;
		});
	}
	/**
	 * 该方法需要子类实现
	 * @param paint 
	 */
	abstract drawImage(paint: Painter): void;
	/**
	 * 被选中后外边框
	 * @param paint 
	 */
	private drawStroke(paint: Painter): void {
		paint.lineWidth = 2;
		paint.strokeStyle = "#fff";
		paint.strokeRect(-this.rect.size.width >> 1, -this.rect.size.height >> 1, this.rect.size.width + 1, this.rect.size.height +
			1);
		paint.stroke();
	}
	/**
	 * @description 刷新功能点
	 * @param paint 
	 */
	private updateFuncButton(paint: Painter): void {
		
		const rect: Rect = this.rect;
		const x: number = rect.position.x,
			y: number = rect.position.y;
		this.funcButton.forEach((button: Button) => {
			const len: number = button.originDistance;
			if (button.disabled) return;
			const angle = this.rect.getAngle + button.oldAngle;
			const newx = Math.cos(angle) * len + x;
			const newy = Math.sin(angle) * len + y;
			const vector = new Vector(~~newx, ~~newy);
			button.updatePosition(vector);
			button.update(paint);
		});
	}
	/**
	 * @description
	 * 
	 * 检测 @ViewObject 的4个顶点是否被点击到
	 * 顶点位置
	 * 0   1
	 * 3   2
	 * @param eventPosition 
	 * @returns 
	 */
	public checkFuncButton(eventPosition: Vector): Button | boolean {
		/**
		 * 遍历功能键
		 */
		const button: Button = this.funcButton.find((button: Button) => {
			return button.isInArea(eventPosition);
		});
		return button;
	}
	public hide() {
		this.disabled = true;
	}
	public getVertex(): Point[] {
		return this.rect.vertex.getPoints();
	}
	public onSelected() {
		this.selected = true;
	}
	public cancel() {
		this.selected = false;
	}
	public onUp(paint: Painter) {
		/*在抬起鼠标时，ViewObject还没有被Calcel，为再次聚焦万向按钮做刷新数据*/
		this.onChanged();
	}
	public enlarge() {
		this.scale = 1;
		this.scale += .1;
		this.rect.setScale(this.scale);
		this.doScale();
	}
	public narrow() {
		this.scale = 1;
		this.scale -= .1;
		this.rect.setScale(this.scale);
		this.doScale();
	}
	private doScale() {
		if (this.isLock) return;
		this.onChanged();
	}
	/*每次改变大小后都需要刷新按钮的数据*/
	public onChanged() {
		this.funcButton.forEach((item: Button) => {
			item.setMaster(this);
		})
	}
	/**
	 * 世界坐标居中
	 */
	public center(canvasSize:Size) {
		const x=canvasSize.width>>1,y=canvasSize.height>>1;
		this.rect.position=new Vector(x,y);
	}
	/**
	 * 撤销 | 取消撤销回调
	 */
	public didFallback(){

	}
}


export default ViewObject;
