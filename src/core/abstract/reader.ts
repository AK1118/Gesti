import ViewObject from "./view-object";
import Rect from "../lib/rect";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text/text";
import WriteViewObj from "../viewObject/write";
import Button, { BaseButton } from "./baseButton";
import Group from "../viewObject/group";
import * as Buttons from "@/composite/buttons"
import { ExportButton, FetchXImageForImportCallback, ViewObjectExportEntity, ViewObjectExportGraffiti, ViewObjectExportImageBox, ViewObjectExportTextBox, ViewObjectExportTypes, ViewObjectImportBaseInfo, ViewObjectImportEntity, ViewObjectImportGraffiti, ViewObjectImportImageBox, ViewObjectImportTextBox } from "@/types/serialization";
//import { ExportButton, FetchXImageForImportCallback, ViewObjectExportImageBox, ViewObjectExportTypes, ViewObjectImportBaseInfo, ViewObjectImportEntity, ViewObjectImportImageBox } from "Serialization";
abstract class GestiReader {
  constructor() {}
  private readonly buttonClazzList = {
    DragButton:Buttons.DragButton,
    MirrorButton:Buttons.MirrorButton,
    CloseButton:Buttons.CloseButton,
    RotateButton:Buttons.RotateButton,
    UnLockButton:Buttons.UnLockButton,
    HorizonButton:Buttons.HorizonButton,
    LockButton:Buttons.LockButton,
    SizeButton:Buttons.SizeButton,
    VerticalButton:Buttons.VerticalButton
  };
  
  // public async getViewObject(type: string, options: any): Promise<ViewObject> {
  //   let viewObject: ViewObject;
  //   switch (type) {
  //     // case "write":
  //     //   {
  //     //     viewObject = new WriteViewObj(
  //     //       options.points,
  //     //       options.config?.color ?? "red",
  //     //       options.config
  //     //     );
  //     //   }
  //     //   break;
  //     case "image":
  //       {
  //         const entity:ViewObjectImportImageBox=options;
  //         ImageBox.reverse(entity);

  //         const cutter = new CutterH5();
  //         const source: ImageData = await cutter.merge(
  //           options.fixedWidth,
  //           options.fixedHeight,
  //           options.options.data
  //         );
  //         const ximage: XImage = await new GesteControllerImpl(
  //           null
  //         ).createImage(source);
  //         viewObject = new ImageBox(ximage);
  //       }
  //       break;
  //     // case "text":
  //     //   {
  //     //     viewObject = new TextBox(options.text, options.options);
  //     //   }
  //     //   break;
  //   }
  //   return viewObject;
  // }


  private readonly viewObjectMap:Record<ViewObjectExportTypes,any>={
    "group":Group,
    "image":ImageBox,
    "text":TextBox,
    "write":WriteViewObj,
  };

  /**
   * @description 根据实体获取对象实体
   * @param entity 
   */
  protected getViewObjectByEntity(entity:ViewObjectImportEntity):Promise<ViewObject>{
    const type:ViewObjectExportTypes=entity.type;
    if(type=="image"){
      const imgEntity:ViewObjectImportImageBox=this.formatEntity<ViewObjectExportImageBox>(entity);
      return ImageBox.reverse(imgEntity);
    }else if(type=="text"){
      const textEntity:ViewObjectImportTextBox=this.formatEntity<ViewObjectExportTextBox>(entity);
      return TextBox.reverse(textEntity);
    }else if(type=="write"){
      const textWrite:ViewObjectImportGraffiti=this.formatEntity<ViewObjectExportGraffiti>(entity);
      return WriteViewObj.reserve(textWrite);
    }
    return null;
  }
  private formatEntity<T extends ViewObjectImportEntity>(entity:ViewObjectExportEntity):T{
    return entity as T;
  }
  public async getObjectByJson(importEntity:ViewObjectImportEntity) {
    const base: ViewObjectImportBaseInfo = importEntity.base;
    const rect: Rect = Rect.format(base.rect);
    const relativeRect: Rect = Rect.format(base.relativeRect);
    const buttons:ExportButton[]=base.buttons;

    //根据实体获取对象
    const view:ViewObject=await this.getViewObjectByEntity(importEntity);

    //设置对象属性
    view.rect=rect;
    view.relativeRect=relativeRect;
    view.setId(base.id);
    view.setLayer(base.layer);
    base.isBackground&&view.toBackground();
    view.relativeRect.setAngle(relativeRect.getAngle);
    view.custom();
    base.locked&&view.lock();
    base.mirror&&view.mirror();
    view.setFixedSize(base.fixedSize);
    view.setScaleWidth(base.sizeScale.scaleWidth);
    view.setScaleHeight(base.sizeScale.scaleHeight);
    this.installButton(view,buttons);
    return view;
  }

  //安装按钮
  private installButton(viewObject: ViewObject, buttons: ExportButton[]) {
    buttons.forEach((item:ExportButton) => {
      const buttonConstructor = this.buttonClazzList[item.type];
      if (!buttonConstructor)
        return console.error(
          "This buttonConstructor is not a constructor.",
          buttonConstructor,
          this.buttonClazzList[item.type]
        );
      const button: BaseButton = new buttonConstructor();
      
      button.setSenseRadius(item.radius);
      button.setBackgroundColor(item.backgroundColor);
      button.setIconColor(item.iconColor);


      viewObject.installButton(button);
     button.setLocation(item.location);
    });
  }

}

export default GestiReader;
