import Painter from "@/core/lib/painter";
import TextViewBase, { TextBoxBase } from "./text-base";
import { Size } from "@/core/lib/rect";

/**
 * 1.改变大小时文字大小不会发生变化，只会被挤压拉伸
 * 2.改变大小时不会换行，只会被挤压拉伸
 * 3.渲染时会换行
 */
abstract class TextBase extends TextViewBase {
  protected beforeRenderTextAndLines(paint: Painter): void {
    paint.save();
    paint.scale(this.scaleWidth, 1);
  }
  get renderTextOffsetX(): number {
    return (this.width * -0.5) / this.scaleWidth + this.width * 0.5;
  }
  get textWrap(): boolean {
    return false;
  }
  protected afterRenderTextAndLines(paint: Painter): void {
    paint.restore();
  }
}

class TextBox extends TextBase {}

export default TextBox;
