import OperationObserver from "@/core/abstract/operation-observer";
import Rect, { Size } from "../rect";
import RenderObjectBase, { FlexBoxParentData, PaintingContext } from "./object";
import Constraints, { BoxConstraints } from "./constraints";
import Painter from "../painter";
import Flex from "./flex";

abstract class RenderBox extends RenderObjectBase {
  protected constraints: BoxConstraints = BoxConstraints.zero;
  //描述对象在二维坐标中的平面信息数据
  private _rect: Rect = Rect.zero;
  //相对于自身描述对象在二维坐标中的平面信息数据
  private _relativeRect: Rect = Rect.zero;
  set rect(value: Rect) {
    this._rect = value;
    this.relativeRect = value;
  }
  get rect(): Rect {
    return this._rect;
  }
  get absoluteScale(): number {
    return this.rect.absoluteScale;
  }
  set relativeRect(value: Rect) {
    this._relativeRect = value;
  }
  get relativeRect(): Rect {
    return this._relativeRect;
  }
  get size(): Size {
    return this.rect.size;
  }
  set size(size: Size) {
    this.rect.setSize(size.width, size.height);
  }
  public get position(): Vector {
    return this.rect.position;
  }
  get width(): number {
    return this.size.width;
  }
  get height(): number {
    return this.size.height;
  }
  get positionX(): number {
    return this.position.x;
  }
  get positionY(): number {
    return this.position.y;
  }
  public get halfWidth(): number {
    return this.rect.halfWidth;
  }
  public get halfHeight(): number {
    return this.rect.halfHeight;
  }
  public setScaleWidth(scale: number) {
    this.rect.setScaleWidth(scale);
  }
  public setScaleHeight(scale: number) {
    this.rect.setScaleHeight(scale);
  }
  public setPosition(x: number, y: number): void {
    this.rect.setPosition(new Vector(x, y));
  }
  public addPosition(deltaX: number, deltaY: number) {
    this.rect.addPosition(new Vector(deltaX, deltaY));
  }
  public setAngle(angle: number) {
    this.rect.setAngle(angle);
  }
  public setSize(size: Size) {
    this.rect.setSize(size.width, size.height);
  }
  get hasSize(): boolean {
    return this.size != null;
  }
  public performLayout(): void {
    this.size = this.constraints.constrain(Size.zero);
    this.child?.layout(this.constraints, true);
  }
  protected performResize(): void {}
  public layout(constraints: Constraints, parentUseSize?: boolean): void {
    //如果父传过来的约束盒子宽高为null,那子就等于自己，不需要被约束
    super.layout(constraints, parentUseSize);
  }
}

class RenderProxyBox extends RenderBox {
  public child: RenderBox;
  constructor(child?: RenderBox) {
    super();
    this.child = child;
  }
  public layout(constraints: Constraints, parentUseSize?: boolean): void {
    if (this.child) {
      this.child.layout(constraints, true);
      this.size = this.child?.size;
    } else {
      this.size = (constraints as BoxConstraints).constrain(Size.zero);
    }
    super.layout(constraints);
  }
}

/**
 * 父盒子只约束子盒子的最大宽高，不约束最小宽高
 * 父盒子为null时子盒子撑开父盒子   p.w==null?c.w=c.w:c.w=p.w
 * 盒子a [0,0,f,f]  盒子b [100,100,100,100]
 * a.layout  enforce
 */
class RenderConstrainedBox extends RenderProxyBox {
  private _additionalConstraints: BoxConstraints;
  constructor(option: {
    child?: RenderBox;
    additionalConstraints: BoxConstraints;
  }) {
    super(option?.child);
    this._additionalConstraints = option.additionalConstraints;
    this.child = option?.child;
  }
  get additionalConstraints(): BoxConstraints {
    return this._additionalConstraints;
  }
  public performLayout(): void {
    const constraints: BoxConstraints = this.constraints as BoxConstraints;
    if (this.child != null) {
      this.child.layout(this._additionalConstraints.enforce(constraints), true);
      this.size = this.child.size;
    } else {
      this.size = this._additionalConstraints
        .enforce(constraints)
        .constrain(Size.zero);
    }
  }
}

class RenderColoredBox extends RenderProxyBox {
  private readonly color: string = "black";
  constructor(color: string) {
    super();
    this.color = color;
  }
  public layout(constraints: Constraints, parentUseSize?: boolean): void {
    if (parentUseSize) {
      const boxConstraints = constraints as BoxConstraints;
      this.size = boxConstraints.constrain(Size.zero);
    }
    super.layout(constraints);
  }
  protected paint(context: PaintingContext, offset: Vector): void {
    const paint: Painter = context.paint;
    paint.fillStyle = this.color;
    paint.fillRect(offset.x, offset.y, this.width, this.height);
    if (this.child != null) {
      context.paintChild(this.child, offset);
    }
  }
}

class RenderViewBox extends RenderProxyBox {
  constructor(width?: number, height?: number) {
    super();
    this.constraints = BoxConstraints.tightFor(width, height);
  }
  public layout(constraints: Constraints, parentUseSize?: boolean): void {
    if (parentUseSize) {
      const boxConstraints = constraints as BoxConstraints;
      this.size = boxConstraints.constrain(Size.zero);
      if (this.child != null) {
        // this.child.layout()
      }
    }
    // super.layout(constraints);
  }
  public performLayout(): void {
    if (this.child != null) {
      this.child.layout(this.constraints);
    }
  }
}

class ContainerRenderObject extends RenderBox {
  public parentData: FlexBoxParentData = new FlexBoxParentData();
  private childCount: number = 0;
  private firstChild: RenderBox;
  private lastChild: RenderBox;
  public insert(renderObject: RenderBox, after?: RenderBox): void {
    this.insertIntoChildList(renderObject, after);
  }
  private insertIntoChildList(child: RenderBox, after?: RenderBox): void {
    const childParentData: FlexBoxParentData =
      child?.parentData as FlexBoxParentData;
    if (
      childParentData.nextSibling != null ||
      childParentData.preSibling != null
    )
      return;
    this.childCount += 1;
    if (after == null) {
      childParentData.nextSibling = this.firstChild;
      if (this.firstChild != null) {
        const firstChildParentData = this.firstChild
          .parentData as FlexBoxParentData;
        firstChildParentData.preSibling = child;
      }
      this.firstChild = child;
      this.lastChild = child;
    } else {
      const afterParentData: FlexBoxParentData =
        after?.parentData as FlexBoxParentData;
      if (afterParentData.nextSibling == null) {
        childParentData.preSibling = after;
        afterParentData.nextSibling = child;
        this.lastChild = child;
      } else {
        childParentData.nextSibling = afterParentData.nextSibling;
        childParentData.preSibling = after;
        const childPreSiblingParentData: FlexBoxParentData = childParentData
          .preSibling.parentData as FlexBoxParentData;
        const childNextSiblingParentData: FlexBoxParentData = childParentData
          .nextSibling.parentData as FlexBoxParentData;
        childPreSiblingParentData.nextSibling = child;
        childNextSiblingParentData.preSibling = child;
      }
    }
    console.log("插入");
  }
}

class RenderFlex extends ContainerRenderObject {
  constructor(children?: RenderBox[]) {
    super();
  }
  public performLayout(): void {}
}
export default RenderBox;
export {
  RenderColoredBox,
  RenderConstrainedBox,
  RenderViewBox,
  RenderFlex,
  ContainerRenderObject,
};
