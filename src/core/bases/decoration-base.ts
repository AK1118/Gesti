import { BoxDecorationOption, DecorationOption } from "@/types/graphics";
import Serializable from "../interfaces/Serialization";
import Painter from "../lib/painter";
import Rect from "../lib/rect";
import { ExportXImage } from "Serialization";

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
  public async export(): Promise<O> {
    if (this.option?.backgroundImage) {
      const ximageExport: ExportXImage =
        await this.option?.backgroundImage.export();
      this.option.backgroundImage = ximageExport as any;
    }
    return Promise.resolve(this.option);
  }
  public render(paint: Painter, rect: Rect): void {}
  protected performRender(paint: Painter, rect: Rect): void {}
}

export default DecorationBase;
