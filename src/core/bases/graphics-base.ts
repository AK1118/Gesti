import {
  BorderDecoration,
  BoxDecoration,
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

/**
 *
 */
abstract class GraphicsBase<
  T extends GenerateGraphicsOption
> extends ViewObject {
  constructor(option: T) {
    super();
    this.option = option;
    this.decoration = option?.decoration;

    //如果使用渐变，默认使用缓存
    if (this.option.decoration.gradient) {
      this.useCache();
    }
    // this.borderDecoration = option?.borderDecoration;
  }
  protected option: T;
  //主题装饰
  protected decoration: BoxDecoration;
  //边框装饰
  protected borderDecoration: BorderDecoration;
  //渲染边框
  protected abstract renderGraphicsBorder(paint: Painter): void;
  protected abstract renderGraphics(paint: Painter): void;
  protected mountDecoration(paint: Painter): void {}
  protected mountBorderDecoration(paint: Painter): void {}
  
  
}

export default GraphicsBase;
