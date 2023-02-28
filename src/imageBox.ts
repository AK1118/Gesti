import { MirrorButton } from "./buttons";
import CatchPointUtil from "./catchPointUtil";
import DragButton from "./dragbutton";
import { Button, RenderObject } from "./interfaces";
import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";
import { Point } from "./vertex";
import XImage from "./ximage";
class ImageBox implements RenderObject {
	public selected: boolean = false;
	private scale: number = 1;
	private dragButton: DragButton;
	/**
	 * 提供 @CanvasRenderingContext2D 渲染的数据
	 */
	private image: HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
	/**
	 * 外层传入的 @XImage 原始数据
	 */
	private ximage: XImage;
	public key: string | number = +new Date();
	private isMirror: boolean = false;
	public disabled: boolean = false;
	public rect: Rect;
	public beforeRect: Rect;
	private layer: number = 0;
	private funcButton: Array<Button> = new Array<Button>();

	constructor(image: XImage) {
		this.image = image.data;
		this.ximage = image;
		this.rect = new Rect(image.toJson());
		this.beforeRect = this.rect.copy();
		this.dragButton = new DragButton(this);
		this.funcButton = [
			new DragButton(this),
			new MirrorButton(this),
		];
		this.relativeRect = new Rect({
			x: 0,
			y: 0,
			width: this.rect.size.width,
			height: this.rect.size.height,
		});
	}
	relativeRect: Rect;
	/**
	 * @description 是否冻结锁住，
	 * 锁住过后可被选取，但是不能位移和改变大小
	 */
	private _lock: boolean = false;
	/**
	 * @description 锁住
	 */
	public lock(): void {
		this._lock = true;
	}
	/**
	 * @description 解锁
	 */
	public deblock() {
		this._lock = false;
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
	set setDragButton(dragButton: DragButton) {
		this.dragButton = dragButton;
	}
	get getDragButton(): DragButton {
		return this.dragButton;
	}
	public mirror() {
		this.isMirror = !this.isMirror;
	}
	public update(paint: Painter) {
		this.draw(paint)
	}
	draw(paint: Painter): void {
		this.drawImage(paint);
	}
	onSelect(): void {

	}
	private drawImage(paint: Painter): void {
		paint.beginPath();
		paint.save();
		paint.translate(this.rect.position.x, this.rect.position.y);
		paint.rotate(this.rect.getAngle);
		if (this.isMirror) paint.scale(-1, 1)
		paint.drawImage(this.image, this.rect.position.x, this.rect.position.y, this.rect.size.width,
			this.rect.size.height);
		// paint.fillRect(-this.rect.size.width / 2, -this.rect.size.height / 2, this.rect.size.width,
		// 	this.rect.size.height);
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
		//this.rect.vertex.drawPoints(paint);
		paint.closePath();
	}
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

		if (this.selected) {
			const len = Vector.mag(rect.size.toVector());
			this.funcButton.forEach((button: Button) => {
				const angle=this.rect.getAngle+button.oldAngle;
				const newx = Math.cos(angle) * (len >> 1)+x;
				const newy = Math.sin(angle) * (len >> 1)+y;
				const vector = new Vector(~~newx, ~~newy);
				button.updatePosition(vector);
				button.update(paint);
				//paint.fillRect(newx-this.rect.position.x,newy-this.rect.position.y,button.radius,10)
			});

			//this.dragButton.updatePosition(vector);
		}
		//this.dragButton.update(paint);
	}
	/**
	 * @description
	 * 
	 * 检测 @ImageBox 的4个顶点是否被点击到
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
		//	console.log(button.rect.position, eventPosition, this.rect.position);
			return CatchPointUtil.checkInsideArc(button.rect.position, eventPosition, button
				.radius);
		});
		console.log("拿到对象",button);
		if (button) {
			return button;
		}
		return false;
		// const button: DragButton = this.dragButton;
		// /**
		//  * 选中拖拽按钮直接返回拖拽按钮
		//  */
		// const isSelectDragButton: boolean = CatchPointUtil.checkInsideArc(button.rect.position, eventPosition, button
		// 	.radius);

		// //在被锁定时，
		// if (isSelectDragButton && !this.isLock) return button;

		// /**
		//  * 没有选中拖拽按钮判断点击了哪个功能按钮
		//  */
		// const vertexs: Point[] = this.getVertex();
		// const checkPoint = (): number => {
		// 	const len = vertexs.length;
		// 	for (let i = 0; i < len; i++) {
		// 		const point = vertexs[i];
		// 		if (CatchPointUtil.checkInsideArc(point, eventPosition, button.radius)) return i;
		// 	}
		// 	return -1;
		// }
		// const selectedPointNdx: number = checkPoint();

		// if (selectedPointNdx == -1) return false;


		// switch (selectedPointNdx) {
		// 	case 0:
		// 		break;
		// 	case 1: {
		// 		//隐藏，没有删除
		// 		this.hide();
		// 	}
		// 		break;
		// 	case 2: {
		// 		//解锁
		// 		this.deblock();
		// 	}; break;
		// 	case 3: {
		// 		//镜像反转
		// 		this.isMirror = !this.isMirror;
		// 	}
		// 		break;
		// }
		// return true;
		//	const isSelectDragButton:boolean
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
		//console.log("up",this.rect.position)
		/*在抬起鼠标时，ImageBox还没有被Calcel，为再次聚焦万向按钮做刷新数据*/
		this.onChanged();
	}
	public enlarge() {
		this.scale = 1;
		this.scale += .1;
		this.doScale();
	}
	public narrow() {
		this.scale = 1;
		this.scale -= .1;
		this.doScale();
	}
	doScale() {
		this.rect.size.width *= this.scale;
		this.rect.size.height *= this.scale;
		this.onChanged();
	}
	/*每次改变大小后都需要刷新按钮的数据*/
	public onChanged() {
		this.funcButton.forEach((item:Button)=>{
			item.setMaster(this);
		})
	}
}


export default ImageBox;