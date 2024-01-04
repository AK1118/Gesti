import BuildContext from "./buildContext";
import ElementNode, { MultiChildRenderObjectElement } from "./element";
import RenderObjectBase from "./object";
import { RenderFlex } from "./renderbox";
import Widget, { MultiChildRenderObjectWidget } from "./widget";

class Flex extends MultiChildRenderObjectWidget {
  constructor(children: Widget[]) {
    super(children);
  }
  createRenderObject(context: BuildContext): RenderObjectBase {
    return new RenderFlex();
  }
  createElement(): ElementNode {
    return new MultiChildRenderObjectElement(this);
  }
}

interface RowOption {
  children: Widget[];
}
class Row extends Flex {
  constructor(option: RowOption) {
    super(option.children);
  }
}
export default Flex;
export { Row };
