import { getPaintContext } from "@/utils/canvas";
import Painter from "../painter";
import Constraints, { BoxConstraints } from "./constraints";
import BuildContext from "./buildContext";
import Vector from "../vector";
import RenderBox from "./renderbox";

abstract class ClipContext {
  abstract get paint(): Painter;
}

class PaintingContext extends ClipContext {
  private _paint: Painter;
  get paint(): Painter {
    if (!this._paint) this._paint = getPaintContext();
    return this._paint;
  }
  paintChild(child: RenderObjectBase, offset: Vector): void {
    child.paintWithContext(this, offset);
  }
}

class ParentData {}
class BoxParentData extends ParentData {
  public offset: Vector = Vector.zero;
}

class FlexBoxParentData<
  ChildType extends RenderBox = RenderBox
> extends BoxParentData {
  public preSibling: ChildType;
  public nextSibling: ChildType;
  parent: FlexBoxParentData<RenderBox>;
}

abstract class RenderObjectBase {
  private readonly key: string = Math.random().toString(16).substring(2);
  public parentData: ParentData = new ParentData();
  public child: RenderObjectBase;
  protected constraints: Constraints;
  public performLayout(): void {}
  public performReSize(): void {}
  public paintWithContext(context: PaintingContext, offset: Vector): void {
    this.paint(context, offset);
  }
  protected paint(context: PaintingContext, offset: Vector) {
    if (this.child != null) {
      context.paintChild(this.child, offset);
    }
  }
  public layout(
    constraints: Constraints,
    parentUseSize: boolean = false
  ): void {
    this.constraints = constraints;
    this.performLayout();
  }
  public setParentData<ParentDataType extends ParentData>(
    parentData: ParentDataType
  ) {
    this.parentData = parentData as ParentDataType;
  }
}






export { PaintingContext };
export { FlexBoxParentData };
export default RenderObjectBase;
