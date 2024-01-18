// import GraphicsBase from "@/core/bases/graphics-base";
// import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
// import Painter from "@/core/lib/painter";
// import { ViewObjectFamily } from "@/index";
// import {
//   GenerateCircleOption,
//   GradientTypes,
//   LineGradientDecorationOption,
// } from "Graphics";
// import {
//   ViewObjectExportEntity,
//   ViewObjectExportGraphics,
//   ViewObjectImportGraphics,
// } from "Serialization";

// class Circle extends GraphicsBase<GenerateCircleOption> {
//   constructor(option: GenerateCircleOption) {
//     super(option);
//     this.option.type = "circle";
//     this.rect.setSize(option.radius * 2, option.radius * 2);
//   }
//   protected renderGraphicsBorder(paint: Painter): void {
//     throw new Error("Method not implemented.");
//   }
//   protected renderGraphics(paint: Painter): void {
//     // const radius: number = this.option.radius;
//     // const { backgroundColor, gradient } = this.decoration;
//     // paint.beginPath();
//     // paint.save();
//     // paint.fillStyle = backgroundColor ?? "black";
//     // if (this.canRenderCache) {
//     //   if (gradient) paint.fillStyle = gradient.getGradient(paint, this.size);
//     //   paint.scale((this.width / radius) * 0.5, (this.height / radius) * 0.5);
//     //   paint.arc(0, 0, this.option.radius, 0, Math.PI * 2);
//     // } else {
//     //   paint.scale((this.width / radius) * 0.5, (this.height / radius) * 0.5);
//     //   paint.arc(0, 0, this.option.radius, 0, Math.PI * 2);
//     // }
//     // paint.fill();
//     // paint.restore();
//     // paint.closePath();
//   }
//   get value(): any {
//     throw new Error("Method not implemented.");
//   }
//   setDecoration(args: any): void {
//     throw new Error("Method not implemented.");
//   }
//   drawImage(paint: Painter): void {
//     this.renderGraphics(paint);
//   }
//   family: ViewObjectFamily;
//   export(painter?: Painter): Promise<ViewObjectExportEntity> {
//     const exportEntity: ViewObjectExportGraphics<GenerateCircleOption> = {
//       option: this.option,
//       base: this.getBaseInfo(),
//       type: "graphicsCircle",
//     };
//     return Promise.resolve(exportEntity);
//   }
//   exportWeChat(
//     painter?: Painter,
//     canvas?: any
//   ): Promise<ViewObjectExportEntity> {
//     return this.export();
//   }
//   public static reserve(
//     entity: ViewObjectImportGraphics<GenerateCircleOption>
//   ): Promise<GraphicsBase<GenerateCircleOption>> {
//     const gradientType: GradientTypes = entity.option.decoration.gradient.type;
//     const option = entity.option;
//     if (option.decoration.gradient) {
//       if (gradientType == "lineGradient") {
//         option.decoration.gradient = LineGradientDecoration.format(
//           option.decoration.gradient as any as LineGradientDecorationOption
//         );
//       }
//     }
//     const circle: Circle = new Circle(option);
//     return Promise.resolve(circle);
//   }
// }

// export default Circle;
