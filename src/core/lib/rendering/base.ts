import { BorderRadius, BorderRadiusAll } from "Graphics";
import Painter from "../painter";
import Rect from "../rect";
/**
 * 基础结构，
 * coloredBox赋值渲染
 * clipRect负责裁剪
 * 都会调用自己的子对象，context?  
 */
abstract class RenderWidgetBase {
  protected child: RenderWidgetBase;
  constructor(child?: RenderWidgetBase) {
    this.child = child;
  }
  public abstract render(paint: Painter, rect: Rect): void;
}

class RenderColoredRRect extends RenderWidgetBase {
  private readonly borderRadius: BorderRadiusAll | BorderRadius;
  constructor(option?: {
    borderRadius: BorderRadiusAll | BorderRadius;
    child?: RenderWidgetBase;
  }) {
    super(option.child);
    this.borderRadius = option.borderRadius;
  }
  public render(paint: Painter, rect: Rect): void {
    const { width, height } = rect.size;
    this.renderRoundRect(paint, width, height);
  }
  private renderRoundRect(paint: Painter, width: number, height: number): void {
    const borderRadius = this.borderRadius;
    let radiusArr = [];
    if (typeof borderRadius === "number") {
      radiusArr = new Array(4).fill(borderRadius as BorderRadiusAll);
    } else if (typeof borderRadius === "object") {
      const { topLeft, topRight, bottomLeft, bottomRight } =
        borderRadius as BorderRadius;
      radiusArr = [
        topLeft ?? 0,
        topRight ?? 0,
        bottomRight ?? 0,
        bottomLeft ?? 0,
      ];
    }
    paint.roundRect(width * -0.5, height * -0.5, width, height, radiusArr);
  }
}

class RenderColoredRect extends RenderWidgetBase {
  public render(paint: Painter, rect: Rect): void {
    const { width, height } = rect.size;
    paint.fillRect(width * -0.5, height * -0.5, width, height);
  }
}

abstract class Clip extends RenderWidgetBase {
  protected clip(paint: Painter) {
    paint.clip();
  }
}

class ClipRect extends Clip {
  public render(paint: Painter, rect: Rect): void {
    this.child.render(paint, rect);
  }
}

class ClipRRect extends Clip {
  public render(paint: Painter, rect: Rect): void {}
}

export { RenderWidgetBase, RenderColoredRRect };
