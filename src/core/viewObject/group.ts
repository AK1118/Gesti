import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../lib/image-toolkit";
import Painter from "../lib/painter";
import Rect from "../lib/rect";
import Vector from "../lib/vector";

abstract class GroupBase extends ViewObject {
  private beforeAngle: number = 0;
  private views: Array<ViewObject> = [];
  
  public ready(kit: ImageToolkit): void {
    //将组合添加到最底层
    kit.layerBottom(this);
  }
  add(obj: ViewObject): number {
    if (!obj)
      throw Error("The addition object should be of the ViewObject type.");
    this.views.push(obj);
    this.onAddObj(obj);
    return this.views.length;
  }
  /**
   * @description 新增对象做某些事
   * @param obj
   */
  onAddObj(obj: ViewObject) {
    //设置对象为背景对象，不给选中
    if(this.mounted)obj.toBackground();
    //计算设置大小
    this.computeSize();
    //设置层级为最底层
    this.kit?.layerBottom?.(this);
  }
  public addAll(objs: Array<ViewObject>): number {
    if (!Array.isArray(objs))
      throw Error(
        "The addition variable should be of the Array<ViewObject> type."
      );
    objs.forEach((_) => this.add(_));
    return this.views.length;
  }
  public remove(obj: ViewObject) {
    const ndx: number = this.views.findIndex((_) => _.key === obj.key);
    if (ndx != -1) this.views.splice(ndx, 1);
  }
  public removeById(id: string) {
    const obj: ViewObject | undefined = this.views.find((_) => _.id === id);
    if (obj) this.remove(obj);
  }
  public didChangeAngle(angle: number): void {
    this.updateChildrenAngle();
  }
  /**
   * @description 根据子元素设置大小
   */
  protected computeSize(): void {
    //组合必须两个及两个以上
    if (this.views.length >= 2) {
      let maxX = -9999,
        maxY = -9999,
        minX = 9999,
        minY = 9999;
      const sum: Vector = new Vector(0, 0);
      this.views.forEach((item) => {
        const points = item.getVertex();
        points.forEach((_) => {
          maxX = Math.max(maxX, _.x);
          minX = Math.min(minX, _.x);
          maxY = Math.max(maxY, _.y);
          minY = Math.min(minY, _.y);
        });
      });
      const width = Math.floor(maxX - minX),
        height = Math.floor(maxY - minY);
      this.setSize({ width, height });
      const max = new Vector(maxX, maxY);
      const min = new Vector(minX, minY);
      //计算设置位置
      sum.add(max);
      sum.add(min);
      this.computePosition(sum);
    }
  }
  /**
   * @description 计算中心点
   */
  protected computePosition(sum: Vector): void {
    const len = 2;
    sum.div(new Vector(len, len));
    this.setPosition(sum.x, sum.y);
    this.delta.clean();
  }
  protected updateChildrenAngle(): void {
    const _angle = this.rect.getAngle - this.beforeAngle;
    const sp = this.rect.position;
    this.views.forEach((view) => {
      const ap = view.rect.position;
      const dv = Vector.sub(ap, sp);
      const newX = dv.x * Math.cos(_angle) - dv.y * Math.sin(_angle) + sp.x;
      const newY = dv.x * Math.sin(_angle) + dv.y * Math.cos(_angle) + sp.y;
      view.setPosition(newX, newY);
      view.setAngle(this.rect.getAngle);
    });
    this.beforeAngle = this.rect.getAngle;
  }
  public didChangeDeltaScale(scale: number): void {
    this.views.forEach((_: ViewObject) => {
      //获取两点偏移量
      const offset: Vector = Vector.sub(_.position, this.position);
      //偏移量乘以缩放因子
      const offsetDel: Vector = Vector.mult(offset, scale);
      //圆心点加上缩放因子
      const newPosition: Vector = Vector.add(offsetDel, this.position);
      // console.log("缩放",scale)
      _.setPosition(newPosition.x, newPosition.y);
      _.setDeltaScale(scale);
    });
  }
  /**
   * @description 更新子组件位置
   */
  protected updateChildrenLocation() {
    const [deltaX, deltaY] = this.delta.delta;
    this.views.forEach((_) => {
      _.addPosition(deltaX, deltaY);
    });
    this.delta.clean();
  }
  protected didChangePosition(position: Vector): void {
      this.updateChildrenLocation();
  }
  /**
   * @description 位置通过加法被改变
   * @param delta 
   */
  protected didAddPosition(delta: Vector): void {
    this.views.forEach((_) => {
      _.addPosition(delta.x, delta.y);
    });
    this.delta.update(this.position.copy())
  }
  /**
   * @description 释放子元素
   * 释放子元素后，自会对自己就行隐藏，不会被Unmount
   * 
   * 
   */
  public freeAll():void{
    this.views.forEach((_) => {
      _.unBackground();
    });
    this.hide();
  }
  protected onMount(): void {
    console.log("挂载")
      this.kit?.layerBottom?.(this);
  }
}

class Group extends GroupBase {
  constructor() {
    super();
  }
  family: ViewObjectFamily = ViewObjectFamily.group;
  get value(): any {
    return this.value;
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  public drawSelected(paint: Painter): void {}

  drawImage(paint: Painter): void {
    paint.fillStyle = "skyblue";
    paint.fillRect(
      this.rect.size.width * -0.5,
      this.rect.size.height * -0.5,
      this.rect.size.width,
      this.rect.size.height
    );
    paint.stroke();
    this.updateChildrenLocation();
  }
  export(painter?: Painter): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
    throw new Error("Method not implemented.");
  }
}

export default Group;
