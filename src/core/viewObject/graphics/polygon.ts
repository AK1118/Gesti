import GraphicsBase from "@/core/bases/graphics-base";
import { ViewObjectFamily } from "@/core/enums";
import Painter from "@/core/lib/painter";
import PolygonDecoration from "@/core/lib/rendering/decorations/polygon-decoration";
import Vector from "@/core/lib/vector";

import {
  BoxDecorationOption,
  GeneratePolygonOption,
  PolygonDecorationOption,
} from "@/types/graphics";
import {
  ViewObjectExportEntity,
  ViewObjectExportGraphics,
  ViewObjectImportGraphics,
} from "Serialization";

class Polygon extends GraphicsBase<GeneratePolygonOption, PolygonDecoration> {
  public originFamily: ViewObjectFamily=ViewObjectFamily.graphicsPolygon;
  
  private points: Array<Vector> = [];
  constructor(option: GeneratePolygonOption) {
    super(option, (_option: PolygonDecorationOption) => {
      return new PolygonDecoration(_option);
    });
    const { radius } = option;
    this.setCount(option.count);
    this.setSize({
      width: radius,
      height: radius,
    });
    this.option.type = "polygon";
    // this.useCache();
  }
  /**
   * ### 设置边的数量
   */
  public setCount(newCount: number) {
    this.option.count = newCount;
    const points: Array<Vector> = this.generatePoints();
    this.option.points = points;
    this.decoration.setPoints(points);
    this.forceUpdate();
  }
  protected didChangeDeltaScale(deltaScale: number): void {
    this.option.radius *= deltaScale;
    this.decoration?.updatePoint(deltaScale);
  }
  private generatePoints(
    option: GeneratePolygonOption = this.option
  ): Array<Vector> {
    const { count, radius: _radius } = option;
    const radius = _radius * 0.5;
    if (count < 3 || radius <= 0) {
      throw new Error("Invalid parameters for generating a polygon.");
    }

    const _points = [];
    const angleIncrement = (2 * Math.PI) / count;
    const offset = Math.PI * -0.5;
    const offsetY = count % 2 === 0 ? 0 : (radius / count) * 0.5;
    for (let i = 0; i < count; i++) {
      const x = radius * Math.cos(i * angleIncrement + offset);
      const y = radius * Math.sin(i * angleIncrement + offset) + offsetY;
      _points.push(new Vector(x, y));
    }

    return _points;
  }

  protected renderGraphicsBorder(paint: Painter): void {
    // Implement border rendering logic here
  }

  protected renderGraphics(paint: Painter): void {
    // Implement main graphics rendering logic here
  }

  get value(): number {
    // Implement the getter logic for value
    return this.option.count; // Or return any other relevant value
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
  async export(painter?: Painter): Promise<ViewObjectExportGraphics> {
    // Implement export logic
    const exportEntity: ViewObjectExportGraphics<GeneratePolygonOption> = {
      option: this.option,
      base: await this.getBaseInfo(),
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
