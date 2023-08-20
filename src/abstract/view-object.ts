import { CloseButton, MirrorButton, RotateButton } from "../buttons";
import UnLockButton from "../buttons/delockButton";
import DragButton from "../buttons/dragbutton";
import LockButton from "../buttons/lockbutton";

import RenderObject from "../interfaces/render-object";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import { Point } from "../vertex";
import Button from "./button";
import OperationObserver from "./operation-observer";
import AuxiliaryLine from "./tools/auxiliary-lines";
import GestiConfig from "../config/gestiConfig";
import canvasConfig from "../config/canvasConfig";
import VerticalButton from "../buttons/verticalButton";
import HorizonButton from "../buttons/horizonButton";
import { ViewObjectFamily } from "../enums";
//转换为json的类型
export type toJsonType = "image" | "text" | "write";

export interface toJSONInterface {
  viewObjType: toJsonType;
  options: Object;
}

/**
 * 凡是带有操作点的对象都是它，
 * 例如 图片、文字 等
 */
abstract class ViewObject extends OperationObserver implements RenderObject {
  public selected: boolean = false;
  //矩形缩放时用到
  private scale: number = 1;
  public key: string | number = +new Date();
  private isMirror: boolean = false;
  public disabled: boolean = false;
  public rect: Rect;
  public beforeRect: Rect;
  private layer: number = 0;
  private funcButton: Array<Button> = new Array<Button>();
  public relativeRect: Rect;
  //辅助线
  private auxiliary: AuxiliaryLine;
  /**
   * @description 是否冻结锁住，
   * 锁住过后可被选取，但是不能位移和改变大小
   */
  private _lock: boolean = false;
  public inited: boolean = false;
  public dragButton: DragButton;
  public verticalButton: VerticalButton;
  public horizonButton: HorizonButton;
  public mirrorButton: MirrorButton;
  public closeButton: CloseButton;
  public lockButton: LockButton;
  public delockButton: UnLockButton;
  public rotateButton: RotateButton;
  public name: string;
  abstract family: ViewObjectFamily;
  public originFamily:ViewObjectFamily;
  constructor() {
    super();
    //根据配置判断是否设置参考线
    GestiConfig.auxiliary && (this.auxiliary = new AuxiliaryLine());
  }
  //获取对象值
  abstract get value(): any;
  /**
   * @description 设置名字
   */
  public setName(name: string) {
    this.name = name;
  }
  public init() {
    //注册功能按钮
    /**
     * 如果需要某个图层对象自定义某个按钮是否显示或者其他自定义操作
     * 提供 @custom 方法使用
     */
    // this.dragButton = new DragButton(this);
    // this.verticalButton = new VerticalButton(this);
    // this.horizonButton = new HorizonButton(this);
    // this.mirrorButton = new MirrorButton(this);
    // this.closeButton = new CloseButton(this);
    // this.rotateButton = new RotateButton(this);
    // this.lockButton = new LockButton(this);
    // this.delockButton = new UnLockButton(this);

    // this.funcButton = [
    //   this.dragButton,
    //   this.verticalButton,
    //   this.horizonButton,
    //   this.mirrorButton,
    //   this.closeButton,
    //   this.rotateButton,
    //   this.lockButton,
    //   this.delockButton,
    // ];

    this.relativeRect = new Rect({
      x: 0,
      y: 0,
      width: this.rect.size.width,
      height: this.rect.size.height,
    });
    this.addObserver(this);
    this.inited = true;
  }
  //设置大小
  public setSize(size:{
    width?:number,
    height?:number,
  }){
    const {width,height}=size;
    this.rect.setSize(width??this.rect.size.width,height??this.rect.size.height);
  }
  //卸载按钮
  public unInstallButton(buttons: Array<Button>) {
    this.funcButton = this.funcButton.filter((item) => !buttons.includes(item));
  }
  //安装按钮
  public installButton(button: Button) {
    this.funcButton.push(button);
  }
  /**
   * 重置按钮
   */
  public resetButtons(excludeNames?: Array<string>) {
    const arr = excludeNames ?? [];
    this.funcButton.forEach((button: Button) => {
      if (!arr.includes(button.name) && !button.disabled) button.reset();
    });
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
  public unLock(): void {
    this._lock = false;
    this.onUnLock();
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
    if (!this.inited) return;
    this.draw(paint);
  }
  abstract setDecoration(args:any):void;
  public draw(paint: Painter): void {
    paint.beginPath();
    paint.save();
    paint.translate(this.rect.position.x, this.rect.position.y);
    paint.rotate(this.rect.getAngle);
    if (this.isMirror) paint.scale(-1, 1);
    this.drawImage(paint);
    if (this.isMirror) paint.scale(-1, 1);
    if (this.selected) {
      //边框
      this.drawSelected(paint);
      //按钮
      this.updateFuncButton(paint);
    } else {
      //根据配置开关虚线框
      if (GestiConfig.dashedLine) this.strokeDashBorder(paint);
    }

    paint.restore();
    paint.translate(0, 0);
    /*更新顶点数据*/
    this.rect.updateVertex();
    paint.closePath();
    if (this.selected) {
      //辅助线
      this.auxiliary?.draw(paint, this);
    }
  }
  //当被锁定时触发
  private onLock() {
    //锁定时，自由的按钮不会消失,反之会显示
    this.funcButton.forEach((button: Button) => {
      button.disabled = !button.isFree;
    });
  }
  //解锁时触发
  private onUnLock() {
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
  public drawSelected(paint: Painter): void {
    paint.beginPath();
    paint.lineWidth = 2;
    paint.strokeStyle = "#fff";
    paint.strokeRect(
      -this.rect.size.width >> 1,
      -this.rect.size.height >> 1,
      this.rect.size.width + 1,
      this.rect.size.height + 1
    );
    paint.closePath();
    paint.stroke();
  }
  /**
   * 对象渲染虚线框
   */
  public strokeDashBorder(paint: Painter): void {
    paint.closePath();
    paint.beginPath();
    paint.lineWidth = 1;
    paint.setlineDash([3, 3]);
    paint.strokeStyle = "#999";
    paint.strokeRect(
      -this.rect.size.width >> 1,
      -this.rect.size.height >> 1,
      this.rect.size.width + 1,
      this.rect.size.height + 1
    );
    paint.closePath();
    paint.stroke();
    paint.setlineDash([]);
  }
  /**
   * 镜像翻转
   */
  public setMirror(isMirror: boolean) {
    this.isMirror = isMirror;
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
   * @description 功能点是否被点击
   * @param eventPosition
   * @returns
   */
  public checkFuncButton(eventPosition: Vector): Button | boolean {
    /**
     * 遍历功能键
     * 传入的时global位置，转换为相对位置判断是否点击到按钮
     */
    const event: Vector = Vector.sub(eventPosition, this.rect.position);
    const button: Button = this.funcButton.find((button: Button) => {
      if (button.disabled) return false;
      const angle = button.oldAngle + this.rect.getAngle;
      const x = Math.cos(angle) * button.originDistance;
      const y = Math.sin(angle) * button.originDistance;
      const buttonPosi: Vector = new Vector(x, y);
      return button.isInArea(event, buttonPosi);
    });
    return button;
  }
  public hide() {
    this.disabled = true;
    this.onHide();
    this.cancel();
  }
  public getVertex(): Point[] {
    return this.rect.vertex?.getPoints();
  }
  public onSelected() {
    //被选中过后对所有图层点进行备份，不需要每次渲染都获取一次
    this.auxiliary?.createReferencePoint(this.key.toString());
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
    this.scale += 0.1;
    this.rect.setScale(this.scale);
    this.doScale();
  }
  public narrow() {
    this.scale = 1;
    this.scale -= 0.1;
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
    });
  }
  /**
   * 世界坐标居中
   */
  public center(canvasSize: Size, axis?: CenterAxis) {
    if (axis) {
      if (axis == "vertical")
        return (this.rect.position = new Vector(
          this.rect.position.x,
          canvasSize.height >> 1
        ));
      if (axis == "horizon")
        return (this.rect.position = new Vector(
          canvasSize.width >> 1,
          this.rect.position.y
        ));
    }
    const x = canvasSize.width >> 1,
      y = canvasSize.height >> 1;
    this.rect.position = new Vector(x, y);
  }
  /**
   * 撤销 | 取消撤销回调
   */
  public didFallback() {}
  //到处为JSON
  abstract export(): Promise<Object>;
  /**
   * @description 提供公用基础信息导出
   * @returns
   */
  public getBaseInfo(): Object {
    console.log("按钮集合",this.funcButton)
    return {
      rect: {
        x: ~~this.rect.position.x,
        y: ~~this.rect.position.y,
        width: ~~this.rect.size.width,
        height: ~~this.rect.size.height,
        angle: this.rect.getAngle,
      },
      relativeRect: {
        x: ~~this.relativeRect.position.x,
        y: ~~this.relativeRect.position.y,
        width: ~~this.relativeRect.size.width,
        height: ~~this.relativeRect.size.height,
        angle: this.rect.getAngle,
      },
      mirror: this.isMirror,
      locked: this.isLock,
      buttons:this.funcButton,
    };
  }
  /**
   * 自定义一些操作
   */
  public custom() {}
}

export default ViewObject;
