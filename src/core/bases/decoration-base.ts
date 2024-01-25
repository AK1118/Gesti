import { DecorationOption } from "@/types/graphics";
import Serializable from "../interfaces/Serialization";
import { RenderWidgetBase } from "../lib/rendering/base";
import Painter from "../lib/painter";
import Rect from "../lib/rect";

abstract class DecorationBase<O extends DecorationOption = DecorationOption>
  extends RenderWidgetBase
  implements Serializable<O>
{
  protected option: O;
  constructor(option: O) {
    super();
    this.option = option;
  }
  toJSON(): O {
    return this.option;
  }
  abstract render(paint: Painter, rect: Rect): void;
  protected performRender(paint: Painter, rect: Rect): void {}
}

export default DecorationBase;
