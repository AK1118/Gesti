import GraphicsBase from "@/core/bases/graphics-base";
import Painter from "@/core/lib/painter";
import Vector from "@/core/lib/vector";
import { ViewObjectFamily } from "@/index";
import {
  GeneratePolygonOption,
  GenerateRectAngleOption,
} from "@/types/graphics";
import { ViewObjectExportEntity } from "Serialization";

class Polygon extends GraphicsBase<GeneratePolygonOption> {
  private points: Array<Vector> = [];
  constructor(option: GeneratePolygonOption) {
    super(option);
    this.generatePoints();
  }

  private generatePoints(): void {
    const { count, radius } = this.option;
    if (count < 3 || radius <= 0) {
      throw new Error("Invalid parameters for generating a polygon.");
    }
    this.points = [];

    const angleIncrement = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const x = radius * Math.cos(i * angleIncrement);
      const y = radius * Math.sin(i * angleIncrement);
      this.points.push(new Vector(x, y));
    }
  }

  protected renderGraphicsBorder(paint: Painter): void {
    // Implement border rendering logic here
  }

  protected renderGraphics(paint: Painter): void {
    // Implement main graphics rendering logic here
  }

  get value(): any {
    // Implement the getter logic for value
    return this.points; // Or return any other relevant value
  }

  drawImage(paint: Painter): void {
    this.renderGraphics(paint);
  }

  family: ViewObjectFamily = ViewObjectFamily.graphicsPolygon;

  export(painter?: Painter): Promise<ViewObjectExportEntity> {
    // Implement export logic
    return null;
  }

  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    // Implement WeChat export logic
    return null;
  }
}

export { Polygon as default };
