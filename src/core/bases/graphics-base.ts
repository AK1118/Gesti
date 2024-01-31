import {
  BoxDecorationOption,
  DecorationOption,
  GenerateGraphicsOption,
  GenerateRectAngleOption,
  GraphicsTypes,
} from "Graphics";
import ViewObject from "../abstract/view-object";
import Painter from "../lib/painter";
import {
  ViewObjectImportEntity,
  ViewObjectImportGraphics,
} from "Serialization";
import Rectangle from "../viewObject/graphics/rectangle";
import BoxDecoration from "../lib/rendering/decorations/box-decoration";
import DecorationBase from "./decoration-base";

/**
 *
 */
abstract class GraphicsBase<
  //生成图形参数
  G extends GenerateGraphicsOption,
  //修饰器类型参数
  D extends DecorationBase,
> extends ViewObject<D> {
  constructor(
    option: G,
    buildDecoration: (decorationOption?: DecorationOption) => D
  ) {
    super();
    this.option = option;
    if (option?.decoration)
      this.decoration = buildDecoration(option?.decoration);
    //如果使用渐变，默认使用缓存
    if (this.option.decoration.gradient) {
      //this.useCache();
    }
    // this.borderDecoration = option?.borderDecoration;
  }
  protected option: G;
  //边框装饰
  // protected borderDecoration: BorderDecoration;
  //渲染边框
  protected abstract renderGraphicsBorder(paint: Painter): void;
  protected abstract renderGraphics(paint: Painter): void;
  protected mountDecoration(paint: Painter): void {}
  protected mountBorderDecoration(paint: Painter): void {}
}

export default GraphicsBase;
