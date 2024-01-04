import Painter from "../painter";
import Alignment from "../painting/alignment";
import Vector from "../vector";
import BuildContext from "./buildContext";
import Constraints, { BoxConstraints } from "./constraints";
import ElementNode, {
  MultiChildRenderObjectElement,
  RenderViewElement,
  SingleChildRenderObjectElement,
  StatelessElement,
} from "./element";
import RenderObjectBase, { PaintingContext } from "./object";
import RenderBox, {
  RenderColoredBox,
  RenderConstrainedBox,
  RenderViewBox,
} from "./renderbox";

abstract class Widget {
  protected constraints: BoxConstraints;
  abstract createElement(): ElementNode;
}

abstract class RenderObjectWidget extends Widget {
  abstract createRenderObject(context: BuildContext): RenderObjectBase;
}

abstract class SingleChildRenderObjectWidget extends RenderObjectWidget {
  public child: Widget;
  constructor(child: Widget) {
    super();
    this.child = child;
  }
  build(context: BuildContext): Widget {
    return this.child;
  }
  createElement(): ElementNode {
    return new SingleChildRenderObjectElement(this);
  }
}

abstract class MultiChildRenderObjectWidget extends RenderObjectWidget {
  public children: Array<Widget> = [];
  constructor(children: Widget[]) {
    super();
    this.children = children;
  }
  createElement(): ElementNode {
    return new MultiChildRenderObjectElement(this);
  }
}

class ColoredBox extends SingleChildRenderObjectWidget {
  private readonly color: string;
  constructor(color: string, child?: Widget) {
    super(child);
    this.color = color;
  }
  createRenderObject(context: BuildContext): RenderObjectBase {
    return new RenderColoredBox(this.color);
  }
}

class ConstrainedBox extends SingleChildRenderObjectWidget {
  private width: number;
  private height: number;
  // private child: Widget;
  constructor(option: { width: number; height: number; child?: Widget }) {
    super(option.child);
    this.width = option.width;
    this.height = option.height;
  }
  createRenderObject(context: BuildContext): RenderObjectBase {
    return new RenderConstrainedBox({
      // child: this.child,
      additionalConstraints: new BoxConstraints({
        minHeight: this.height,
        minWidth: this.width,
        maxHeight: this.height,
        maxWidth: this.width,
      }),
    });
  }
}

abstract class StatelessWidget extends Widget {
  constructor() {
    super();
  }
  /**
   * @protected
   * @param context
   */
  abstract build(context: BuildContext): Widget;
  public createElement(): StatelessElement {
    return new StatelessElement(this);
  }
}

interface ContainerWidgetOption {
  child?: Widget;
  width?: number;
  height?: number;
  color?: string;
  constraints?: BoxConstraints;
  alignment?: Alignment;
}

/**
 * 
 * ### 基础局部盒子
 * - 传入参数
 * ```
 * interface ContainerWidgetOption {
    child?: Widget;
    width?: number;
    height?: number;
    color?: string;
    constraints?: BoxConstraints;
    alignment?: Alignment;
  }
 * ```
 */
class Container extends StatelessWidget {
  protected constraints: BoxConstraints;
  child?: Widget;
  color?: string;
  width: number;
  height: number;
  constructor(option?: ContainerWidgetOption) {
    super();
    if (!option) return;
    this.child = option?.child;
    this.color = option?.color;
    this.width = option.width;
    this.height = option.height;
    const constraints = option?.constraints;
    this.constraints =
      this.width != null || this.height != null
        ? constraints?.tighten(this.width, this.height) ??
          BoxConstraints.tightFor(this.width, this.height)
        : constraints;

    console.log(this.constraints);
  }
  build(context: BuildContext): Widget {
    let current: Widget = this.child;
    current = new ColoredBox(this.color, current);
    current = new ConstrainedBox({
      child: current,
      width: this.width,
      height: this.height,
    });
    return current;
  }
}

class RenderViewWidget extends SingleChildRenderObjectWidget {
  private readonly width: number;
  private readonly height: number;
  constructor(child: Widget, width?: number, height?: number) {
    super(child);
    this.width = width;
    this.height = height;
  }
  public createElement(): ElementNode {
    return new RenderViewElement(this);
  }
  createRenderObject(context: BuildContext): RenderObjectBase {
    return new RenderViewBox(this.width, this.height);
  }
  public mount() {
    const element = this.createElement();
    element.mount();
    const renderObject = element.findRenderObject();
    renderObject.performLayout();
    renderObject.paintWithContext(new PaintingContext(), Vector.zero);
    console.log(renderObject);
  }
}

export default Widget;
export {
  StatelessWidget,
  RenderObjectWidget,
  Container,
  SingleChildRenderObjectWidget,
  RenderViewWidget,
  MultiChildRenderObjectWidget,
};
