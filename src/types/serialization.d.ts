import Alignment from "@/core/lib/painting/alignment";
import { GraffitiTypes, TextOptions, ViewObject, XImage } from "./index";
import { GenerateGraphicsOption } from "Graphics";

declare module "Serialization" {
  type FetchXImageForImportCallback = (
    data: ViewObjectExportEntity
  ) => Promise<XImage>;

  interface ExportRect {
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
  }

  interface ExportButton {
    type: string;
    location?: Alignment;
    radius?: number;
    iconColor?: string;
    backgroundColor?: string;
    displayBackground?: boolean;
  }

  interface ViewObjectExportBaseInfo {
    rect: ExportRect;
    fixedSize: {
      width: number;
      height: number;
    };
    sizeScale: {
      scaleWidth: number;
      scaleHeight: number;
    };
    relativeRect: ExportRect;
    mirror: boolean;
    locked: boolean;
    buttons: Array<ExportButton>;
    id: string;
    layer: number;
    isBackground: boolean;
    opacity: number;
    platform: PlatformType;
  }

  type ViewObjectExportTypes =
    | "image"
    | "text"
    | "write"
    | "group"
    | "graphicsRectangle"
    | "graphicsCircle";

  interface ViewObjectExportEntity {
    base: ViewObjectExportBaseInfo;
    type: ViewObjectExportTypes;
  }
  /**
   * 图片导出需要baseInfo
   * 图片超链接
   */
  interface ViewObjectExportImageBox extends ViewObjectExportEntity {
    url?: string;
    data?: any;
    fixedWidth: number;
    fixedHeight: number;
  }
  interface ViewObjectExportTextBox extends ViewObjectExportEntity {
    text: string;
    option: TextOptions;
  }

  interface ViewObjectExportGraffiti extends ViewObjectExportEntity {
    config: {
      color?: string;
      lineWidth?: number;
      type: GraffitiTypes;
      isFill?: boolean;
    };
    points: Array<Vector>;
  }

  //图形导出
  interface ViewObjectExportGraphics<
    T extends GenerateGraphicsOption | any = {}
  > extends ViewObjectExportEntity {
    option: T;
  }

  interface ViewObjectImportBaseInfo extends ViewObjectExportBaseInfo {}

  interface ViewObjectImportEntity extends ViewObjectExportEntity {}

  interface ViewObjectImportImageBox extends ViewObjectExportImageBox {}

  interface ViewObjectImportTextBox extends ViewObjectExportTextBox {}

  interface ViewObjectImportGraffiti extends ViewObjectExportGraffiti {}

  interface ViewObjectImportGraphics<T> extends ViewObjectExportGraphics<T> {}
  interface Reverse<Entity extends ViewObjectExportEntity> {
    reverse(entity: Entity): Promise<ViewObject>;
  }
}
