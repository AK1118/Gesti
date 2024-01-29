// import { BorderRadius, BorderRadiusAll } from "Graphics";
// import Painter from "../painter";
// import Rect from "../rect";
// /**
//  * 基础结构，
//  * coloredBox赋值渲染
//  * clipRect负责裁剪
//  * 都会调用自己的子对象，context?
//  */
// interface RenderWidgetOptionBase {
//   child?: RenderWidgetBase;
// }
// abstract class RenderWidgetBase<O extends RenderWidgetOptionBase = {}> {
//   protected child: RenderWidgetBase;
//   protected option: O;
//   constructor(option?: O) {
//     this.option = option;
//   }
//   public render(paint: Painter, rect: Rect) {
//     paint.beginPath();
//     paint.save();
//     this.performRender(paint, rect);
//     paint.restore();
//     paint.closePath();
//     if (this.child) {
//       this.child.render(paint, rect);
//     }
//   }
//   protected abstract performRender(paint: Painter, rect: Rect): void;
// }

// interface RenderColoredRRectOption extends RenderWidgetOptionBase {
//   borderRadius: BorderRadiusAll | BorderRadius;
//   color?: string;
//   strokeColor?: string;
//   lineWidth?: number;
// }

// class RenderColoredRRect extends RenderWidgetBase<RenderColoredRRectOption> {
//   constructor(option?: RenderColoredRRectOption) {
//     super(option);
//   }
//   public performRender(paint: Painter, rect: Rect): void {
//     const { width, height } = rect.size;
//     this.renderRoundRect(paint, width, height);
//     if (this.child) {
//       this.child.render(paint, rect);
//     }
//   }
//   private renderRoundRect(paint: Painter, width: number, height: number): void {
//     const { borderRadius, color, strokeColor, lineWidth } = this.option;
//     let radiusArr = [];
//     if (typeof borderRadius === "number") {
//       radiusArr = new Array(4).fill(borderRadius as BorderRadiusAll);
//     } else if (typeof borderRadius === "object") {
//       const { topLeft, topRight, bottomLeft, bottomRight } =
//         borderRadius as BorderRadius;
//       radiusArr = [
//         topLeft ?? 0,
//         topRight ?? 0,
//         bottomRight ?? 0,
//         bottomLeft ?? 0,
//       ];
//     }
//     paint.lineWidth = lineWidth;
//     paint.fillStyle = color;
//     paint.strokeStyle = strokeColor;
//     paint.roundRect(width * -0.5, height * -0.5, width, height, radiusArr);
//     paint.fill();
//     paint.stroke();
//   }
// }

// class RenderColoredRect extends RenderWidgetBase {
//   public performRender(paint: Painter, rect: Rect): void {
//     const { width, height } = rect.size;
//     paint.fillRect(width * -0.5, height * -0.5, width, height);
//   }
// }

// abstract class Clip extends RenderWidgetBase {
//   protected performRender(paint: Painter, rect: Rect): void {}
// }

// class ClipRect extends Clip {
//   public performRender(paint: Painter, rect: Rect): void {
//     this.child.render(paint, rect);
//   }
// }

// class ClipRRect extends Clip {
//   public performRender(paint: Painter, rect: Rect): void {}
// }

// export { RenderWidgetBase, RenderColoredRRect, ClipRRect };
