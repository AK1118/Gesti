import { ButtonLocation } from "@/core/enums";
import {  XImage } from "./index";


 declare module 'Serialization' {
  
   interface ExportRect {
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
  }

  interface ExportButton {
    type: string;
    location?: ButtonLocation;
    radius?: number;
    iconColor?: string;
    backgroundColor?:string;
    displayBackground?:boolean;
  }

  interface ViewObjectExportBaseInfo {
    rect: ExportRect;
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

  type ViewObjectExportTypes = "image" | "text" | "write" | "group";

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

  interface ViewObjectImportImageBox extends ViewObjectExportImageBox {}

  interface ViewObjectImportEntity extends ViewObjectExportEntity {}

  interface ViewObjectImportBaseInfo extends ViewObjectExportBaseInfo {}

  type FetchXImageForImportCallback = (
    data: ViewObjectExportEntity
  ) => Promise<XImage>;
}
