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
import {
  BoxDecorationOption,
  Decoration,
  DecorationOption,
  GenerateCircleOption,
  GeneratePolygonOption,
  GenerateRectAngleOption,
  PolygonDecorationOption,
} from "Graphics";
// import Circle from "../viewObject/graphics/circle";
import ImageToolkit from "../lib/image-toolkit";
import ScreenUtils from "@/utils/screenUtils/ScreenUtils";
import { ImageChunk } from "Gesti";
import BoxDecoration from "../lib/rendering/decorations/box-decoration";
import DecorationBase from "./decoration-base";
import Polygon from "../viewObject/graphics/polygon";
import PolygonDecoration from "../lib/rendering/decorations/polygon-decoration";

type ViewObjectHandler<T> = (entity: ViewObjectImportEntity) => T;

abstract class DeserializerBase {
  protected readonly kit: ImageToolkit;
  protected readonly otherScreenUtils: ScreenUtils;
  protected readonly screenUtils: ScreenUtils;
  constructor(kit: ImageToolkit, otherScreenUtils: ScreenUtils) {
    this.kit = kit;
    this.otherScreenUtils = otherScreenUtils;
    this.screenUtils = this.kit.getScreenUtil();
  }
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
      const option = textEntity.option;
      if (option.fontSize)
        option.fontSize = this.adaptScreenFontSize(option.fontSize);
      if (option.spacing && option.spacing != 1)
        option.spacing = this.adaptScreenFontSize(option.spacing);
      if (option.lineWidth)
        option.lineWidth = this.adaptScreenFontSize(option.lineWidth);
      if (option.maxFontSize)
        option.maxFontSize = this.adaptScreenFontSize(option.maxFontSize);
      return TextBox.reverse(textEntity);
    },
    write: (entity: ViewObjectExportGraffiti) => {
      if (entity.points)
        entity.points = entity.points.map<Vector>((_) => {
          _.x = this.adaptScreenSizeWidth(_.x);
          _.y = this.adaptScreenSizeHeight(_.y);
          return _;
        });
      if (entity.config.lineWidth)
        entity.config.lineWidth = this.adaptScreenFontSize(
          entity.config.lineWidth
        );
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
    graphicsPolygon: (entity) => {
      const graphics =
        this.formatEntity<ViewObjectExportGraphics<GeneratePolygonOption>>(
          entity
        );
      graphics.option.points?.forEach((_) => {
        _.x = this.adaptScreenSizeWidth(_.x);
        _.y = this.adaptScreenSizeWidth(_.y);
      });
      return Polygon.reserve(graphics);
    },
    group: (entity) => {
      throw Error("Method has not implemented.");
    },
  };

  protected getViewObjectByEntity(
    entity: ViewObjectImportEntity,
    otherScreenUtils: ScreenUtils,
    screenUtil: ScreenUtils
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
  private adaptScreenSizeWidth(number: number): number {
    if (!this.screenUtils) return number;
    return this.screenUtils.setWidth(
      this.otherScreenUtils.restoreFromFactorWidthWidth(number)
    );
  }
  private adaptScreenSizeHeight(number: number): number {
    if (!this.screenUtils) return number;
    return this.screenUtils.setHeight(
      this.otherScreenUtils.restoreFromFactorWidthHeight(number)
    );
  }
  private adaptScreenFontSize(fontSize: number): number {
    if (!this.screenUtils) return fontSize;
    return this.screenUtils.setSp(
      this.otherScreenUtils.restoreFromFactorWidthText(fontSize)
    );
  }
  private adaptScreenSize(size: { width: number; height: number }): {
    width: number;
    height: number;
  } {
    return {
      width: this.adaptScreenSizeWidth(size.width),
      height: this.adaptScreenSizeHeight(size.height),
    };
  }
  public async getObjectByJson(importEntity: ViewObjectImportEntity) {
    const base: ViewObjectImportBaseInfo = importEntity.base;
    const rect: Rect = Rect.format(base.rect);
    const relativeRect: Rect = Rect.format(base.relativeRect);
    const buttons: ExportButton[] = base.buttons;

    //还原另一端的屏幕适配器
    const otherScreenUtils = this.otherScreenUtils;
    const screenUtil = this.kit.getScreenUtil();

    //根据实体获取对象
    let view: ViewObject = await this.getViewObjectByEntity(
      importEntity,
      otherScreenUtils,
      screenUtil
    );

    //设置对象属性
    view.rect = rect;
    view.relativeRect = relativeRect;
    view.setId(base.id);
    view.setLayer(base.layer);
    base.isBackground && view.toBackground();
    view.custom();
    base.locked && view.lock();
    base.mirror && view.mirror();
    view.setOpacity(base.opacity);
    //设置2D矢量数据
    this.setVectorData(view, base);
    //设置盒子装饰器
    view.setDecorationEntity(await this.formatBoxDecoration(base?.decoration));
    this.installButton(view, buttons);
    return view;
  }
  private setVectorData(view: ViewObject, base): void {
    //屏幕适配包括   宽高 坐标
    view.setPosition(
      this.adaptScreenSizeWidth(view.positionX),
      this.adaptScreenSizeHeight(view.positionY)
    );
    view.setFixedSize(this.adaptScreenSize(base.fixedSize));
    view.setScaleWidth(base.sizeScale.scaleWidth);
    view.setScaleHeight(base.sizeScale.scaleHeight);
    view.setSize(this.adaptScreenSize(view.size));
    view.relativeRect.setAngle(view.relativeRect.getAngle);
  }
  private async formatBoxDecoration(
    _decoration: DecorationOption
  ): Promise<DecorationBase> {
    if (_decoration.type === "box") {
      let decorationOption: BoxDecorationOption = _decoration;
      const decoration = new BoxDecoration();
      if (decorationOption.borderRadius) {
        decorationOption.borderRadius = this.adaptScreenFontSize(
          decorationOption.borderRadius as number
        );
      }
      return await decoration.format(decorationOption);
    }else if(_decoration.type==="polygon"){
      let d: PolygonDecorationOption = _decoration;
      d.points.forEach(_=>{
        _.x=this.adaptScreenSizeWidth(_.x);
        _.y=this.adaptScreenSizeWidth(_.y);
      });
      const decoration = new PolygonDecoration();
      return await decoration.format(d);
    }
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

export default DeserializerBase;
