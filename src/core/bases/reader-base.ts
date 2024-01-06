import ViewObject from "../abstract/view-object";
import Rect from "../lib/rect";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text/text";
import WriteViewObj from "../viewObject/write";
import Button, { BaseButton } from "../abstract/baseButton";
import Group from "../viewObject/group";
import * as Buttons from "@/composite/buttons";
import {
  ExportButton,
  ViewObjectExportEntity,
  ViewObjectExportGraffiti,
  ViewObjectExportGraphics,
  ViewObjectExportImageBox,
  ViewObjectExportTextBox,
  ViewObjectExportTypes,
  ViewObjectImportBaseInfo,
  ViewObjectImportEntity,
} from "@/types/serialization";
import GraphicsBase from "./graphics-base";
import Alignment from "../lib/painting/alignment";
import Rectangle from "../viewObject/graphics/rectangle";
import { GenerateCircleOption, GenerateRectAngleOption } from "Graphics";
import Circle from "../viewObject/graphics/circle";

type ViewObjectHandler<T> = (entity: ViewObjectImportEntity) => T;

abstract class ReaderBase {
  constructor() {}
  private readonly buttonMap = {
    DragButton: Buttons.DragButton,
    MirrorButton: Buttons.MirrorButton,
    CloseButton: Buttons.CloseButton,
    RotateButton: Buttons.RotateButton,
    UnLockButton: Buttons.UnLockButton,
    HorizonButton: Buttons.HorizonButton,
    LockButton: Buttons.LockButton,
    SizeButton: Buttons.SizeButton,
    VerticalButton: Buttons.VerticalButton,
  };

  //entity转换为对应实体ViewObject对象映射器
  private readonly typeHandlers: Record<
    ViewObjectExportTypes,
    ViewObjectHandler<Promise<ViewObject>>
  > = {
    image: (entity) => {
      const imgEntity = this.formatEntity<ViewObjectExportImageBox>(entity);
      return ImageBox.reverse(imgEntity);
    },
    text: (entity) => {
      const textEntity = this.formatEntity<ViewObjectExportTextBox>(entity);
      return TextBox.reverse(textEntity);
    },
    write: (entity) => {
      const textWrite = this.formatEntity<ViewObjectExportGraffiti>(entity);
      return WriteViewObj.reserve(textWrite);
    },
    graphicsRectangle: (entity) => {
      const graphics =
        this.formatEntity<ViewObjectExportGraphics<GenerateRectAngleOption>>(
          entity
        );
      return Rectangle.reserve(graphics);
    },
    graphicsCircle: (entity) => {
      const graphics =
        this.formatEntity<ViewObjectExportGraphics<GenerateCircleOption>>(
          entity
        );
      return Circle.reserve(graphics);
    },
    group: (entity) => {
      throw Error("Method has not implemented.");
    },
  };

  protected getViewObjectByEntity(
    entity: ViewObjectImportEntity
  ): Promise<ViewObject> {
    const type: ViewObjectExportTypes = entity.type;
    const handler = this.typeHandlers[type];

    if (handler) {
      return handler(entity);
    }

    return null;
  }

  private formatEntity<T extends ViewObjectImportEntity>(
    entity: ViewObjectExportEntity
  ): T {
    return entity as T;
  }

  public async getObjectByJson(importEntity: ViewObjectImportEntity) {
    const base: ViewObjectImportBaseInfo = importEntity.base;
    const rect: Rect = Rect.format(base.rect);
    const relativeRect: Rect = Rect.format(base.relativeRect);
    const buttons: ExportButton[] = base.buttons;

    //根据实体获取对象
    const view: ViewObject = await this.getViewObjectByEntity(importEntity);

    //设置对象属性
    view.rect = rect;
    view.relativeRect = relativeRect;
    view.setId(base.id);
    view.setLayer(base.layer);
    base.isBackground && view.toBackground();
    view.relativeRect.setAngle(relativeRect.getAngle);
    view.custom();
    base.locked && view.lock();
    base.mirror && view.mirror();
    view.setFixedSize(base.fixedSize);
    view.setScaleWidth(base.sizeScale.scaleWidth);
    view.setScaleHeight(base.sizeScale.scaleHeight);
    this.installButton(view, buttons);
    return view;
  }

  //安装按钮
  private installButton(viewObject: ViewObject, buttons: ExportButton[]) {
    buttons.forEach((item: ExportButton) => {
      const buttonConstructor = this.buttonMap[item.type];
      if (!buttonConstructor)
        return console.error(
          `This buttonConstructor can not construct button.`,
          buttonConstructor,
          this.buttonMap[item.type]
        );
      const button: BaseButton = new buttonConstructor();

      button.setSenseRadius(item.radius);
      button.setBackgroundColor(item.backgroundColor);
      button.setIconColor(item.iconColor);

      viewObject.installButton(button);
      const location: { x: number; y: number } = item.location as any;
      button.setLocation(Alignment.format(location.x, location.y));
    });
  }
}

export default ReaderBase;
