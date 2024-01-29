import GraphicsBase from "@/core/bases/graphics-base";
import Painter from "@/core/lib/painter";
import PolygonDecoration from "@/core/lib/rendering/decorations/polygon-decoration";
import Vector from "@/core/lib/vector";
import { ViewObjectFamily } from "@/index";
import {
  BoxDecorationOption,
  DecorationOption,
  GeneratePolygonOption,
  GenerateRectAngleOption,
  PolygonDecorationOption,
} from "@/types/graphics";
import {
  ViewObjectExportEntity,
  ViewObjectExportGraphics,
  ViewObjectImportGraphics,
} from "Serialization";

class Polygon extends GraphicsBase<GeneratePolygonOption, PolygonDecoration> {
  private points: Array<Vector> = [];
  constructor(option: GeneratePolygonOption) {
    super(option, (_option: PolygonDecorationOption) => {
      return new PolygonDecoration(_option);
    });
    const points: Array<Vector> = this.generatePoints(option);
    this.option.points = points;
    this.decoration.setPoints(points);
    const { radius } = option;
    this.setSize({
      width: radius,
      height: radius,
    });
    this.option.type = "polygon";
    //this.unUseCache();
  }
  protected didChangeDeltaScale(deltaScale: number): void {
    this.decoration?.updatePoint(deltaScale);
  }
  private generatePoints(option: GeneratePolygonOption): Array<Vector> {
    const { count, radius: _radius, points } = option;
    const radius = _radius * 0.5;
    if (count < 3 || radius <= 0) {
      throw new Error("Invalid parameters for generating a polygon.");
    }

    if (!points) {
      const _points = [];
      const angleIncrement = (2 * Math.PI) / count;
      const offset = Math.PI * -0.5;
      const offsetY = (radius / count) * 0.5;
      for (let i = 0; i < count; i++) {
        const x = radius * Math.cos(i * angleIncrement + offset);
        const y = radius * Math.sin(i * angleIncrement + offset) + offsetY;
        _points.push(new Vector(x, y));
      }
      return _points;
    } else {
      return points;
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

  public setDecoration(
    decoration: PolygonDecorationOption,
    extension?: boolean
  ): void {
    super.setDecoration(decoration, extension, "polygon");
  }
  export(painter?: Painter): Promise<ViewObjectExportGraphics> {
    // Implement export logic
    const exportEntity: ViewObjectExportGraphics<GeneratePolygonOption> = {
      option: this.option,
      base: this.getBaseInfo(),
      type: "graphicsPolygon",
    };
    return Promise.resolve(exportEntity);
  }

  exportWeChat(
    painter?: Painter,
    canvas?: any
  ): Promise<ViewObjectExportEntity> {
    // Implement WeChat export logic
    return null;
  }
  public static async reserve(
    entity: ViewObjectImportGraphics<GeneratePolygonOption>
  ): Promise<GraphicsBase<GeneratePolygonOption, PolygonDecoration>> {
    const option = entity.option;
    const polygon: Polygon = new Polygon(option);
    return Promise.resolve(polygon);
  }
}

export { Polygon as default };
