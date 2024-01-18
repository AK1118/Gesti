import BuildContext from "./buildContext";
import RenderObjectBase, { FlexBoxParentData } from "./object";
import RenderBox, { ContainerRenderObject } from "./renderbox";
import Widget, {
  MultiChildRenderObjectWidget,
  RenderObjectWidget,
  SingleChildRenderObjectWidget,
  StatelessWidget,
} from "./widget";

abstract class ElementNode implements BuildContext {
  protected child?: ElementNode;
  public parent: ElementNode;
  constructor(widget: Widget) {
    this._widget = widget;
  }
  protected slot: Object;
  private _dirty: boolean = true;
  get dirty(): boolean {
    return this._dirty;
  }
  get size(): Size {
    return (this.renderObject as RenderBox)?.size;
  }
  private _widget: Widget;
  get widget(): Widget {
    return this._widget;
  }
  get mounted(): boolean {
    return this.widget != null;
  }
  public findRenderObject(): RenderObjectBase {
    return this.renderObject;
  }
  protected renderObject: RenderObjectBase;
  public mount(parent?: ElementNode, newSlot?: Object): void {
    this.parent = parent;
    this.slot = newSlot;
  }
  protected unMount(): void {
    this._widget = null;
  }
  protected rebuild(): void {
    this.performRebuild();
  }
  public update(newWidget: Widget): void {
    this._widget = newWidget;
  }

  protected updateChild(child?: ElementNode, newWidget?: Widget) {
    if (newWidget === null) {
      return null;
    }
    let newChild: ElementNode;
    if (newWidget != null && child == null) {
      newChild = newWidget.createElement();
    }
    return newChild;
  }

  protected visitChildren(visitor: (element: ElementNode) => void): void {}

  protected performRebuild(): void {}

  protected abstract insertRenderObjectChild(
    child: RenderObjectBase,
    slot?: any
  );
  protected inflateWidget(newWidget: Widget, newSlot?: any): ElementNode {
    if (!newWidget) {
      return null;
    }
    let newChild: ElementNode;
    newChild = newWidget.createElement();
    if (newChild) {
      newChild.mount(this, newSlot);
    }
    return newChild;
  }
}

/**
 * 可渲染对象节点
 */
abstract class RenderObjectElement extends ElementNode {
  public ancestorRenderObjectElement: RenderObjectElement;
  /**
   * @description 查找祖节点
   * - 祖节点必须是 [RenderObjectElement]
   */
  private findAncestorRenderObjectElement(): RenderObjectElement {
    let ancestor = this.parent;
    while (ancestor != null && !(ancestor instanceof RenderObjectElement)) {
      ancestor = ancestor.parent;
    }
    return ancestor as RenderObjectElement;
  }
  public mount(parent?: ElementNode, newSlot?: Object): void {
    super.mount(parent, newSlot);
    this.renderObject = (this.widget as RenderObjectWidget).createRenderObject(
      this
    );
    this.attachRenderObject(newSlot);
  }
  protected insertRenderObjectChild(child: RenderObjectBase, newSlot?: any) {
    this.renderObject.child = child;
  }
  protected attachRenderObject(newSlot?: Object): void {
    const ancestor: RenderObjectElement =
      this.findAncestorRenderObjectElement();
    if (ancestor == null) return;
    this.ancestorRenderObjectElement = ancestor;
    this.ancestorRenderObjectElement.insertRenderObjectChild(
      this.renderObject,
      newSlot
    );
  }
}

class MultiChildRenderObjectElement extends RenderObjectElement {
  private children: Array<ElementNode> = [];
  constructor(widget: MultiChildRenderObjectWidget) {
    super(widget);
  }
  protected inflateWidget(newWidget: Widget, newSlot?: any): ElementNode {
    return super.inflateWidget(newWidget, newSlot);
  }
  public mount(parent?: ElementNode, newSlot?: Object): void {
    super.mount(parent, newSlot);
    const multiChildRenderObjectWidget: MultiChildRenderObjectWidget = this
      .widget as MultiChildRenderObjectWidget;
    const children: Array<ElementNode> = [];
    let preChild: ElementNode;
    for (
      let index = 0;
      index < multiChildRenderObjectWidget.children.length;
      index++
    ) {
      const childWidget = multiChildRenderObjectWidget.children[index];
      const child = this.inflateWidget(childWidget, preChild); //this.updateChild(null, childWidget);
      preChild = child;
      children.push(child);
    }
    this.children = children;
  }
  protected insertRenderObjectChild(child: RenderObjectBase, newSlot?: any) {
    super.insertRenderObjectChild(child, newSlot);
    const renderObject = this.renderObject as ContainerRenderObject;
    console.log("哦哦", this.children);
  }
}

class SingleChildRenderObjectElement extends RenderObjectElement {
  constructor(widget: SingleChildRenderObjectWidget) {
    super(widget);
  }
  public mount(parent?: ElementNode, newSlot?: Object): void {
    super.mount(parent, newSlot);
    this.rebuild();
  }
  protected insertRenderObjectChild(child: RenderObjectBase, newSlot?: any) {
    this.renderObject.child = child;
  }
  protected performRebuild(): void {
    this.child = this.inflateWidget(
      (this.widget as SingleChildRenderObjectWidget).child
    );
    // this.child = this.updateChild(
    //   this.child,
    //   (this.widget as SingleChildRenderObjectWidget).child
    // );
    // if (this.child) {
    //   this.child.mount(this);
    // }
  }
  protected visitChildren(visitor: (element: ElementNode) => void): void {
    visitor(this.child);
  }
}

class RenderViewElement extends SingleChildRenderObjectElement {
  constructor(widget: SingleChildRenderObjectWidget) {
    super(widget);
  }
}

abstract class ComponentElement extends ElementNode {
  constructor(widget: Widget) {
    super(widget);
  }
  public mount(parent?: ElementNode, newSlot?: Object): void {
    super.mount(parent, newSlot);
    this.firstBuild();
  }
  protected firstBuild(): void {
    this.rebuild();
  }
  protected performRebuild(): void {
    const built: Widget = this.build();

    this.child = this.inflateWidget(built);
    // this.child = this.updateChild(null, built);
    // if (this.child) {
    //   this.child.mount(this);
    // }
  }
  protected insertRenderObjectChild(child: RenderObjectBase, slot?: any) {}
  protected abstract build(): Widget;
}

class StatelessElement extends ComponentElement {
  constructor(widget: Widget) {
    super(widget);
  }
  protected build(): Widget {
    return (this.widget as StatelessWidget).build(this);
  }
}

export default ElementNode;
export {
  StatelessElement,
  RenderObjectElement,
  SingleChildRenderObjectElement,
  RenderViewElement,
  MultiChildRenderObjectElement,
};
