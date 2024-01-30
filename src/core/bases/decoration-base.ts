import { BoxDecorationOption, DecorationOption } from "@/types/graphics";
import Serializable from "../interfaces/Serialization";
import Painter from "../lib/painter";
import Rect from "../lib/rect";

class DecorationBase<O extends DecorationOption = BoxDecorationOption>
  implements Serializable<O>
{
  protected option: O;
  constructor(option: O) {
    this.option = option;
  }
  toJSON(): O {
    return this.option;
  }
  update(option: O) {
    this.option = option;
  }
  public render(paint: Painter, rect: Rect): void {}
  protected performRender(paint: Painter, rect: Rect): void {}
}

export default DecorationBase;
