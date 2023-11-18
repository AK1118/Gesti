import ViewObject from "./view-object";
import GesteControllerImpl from "../lib/controller";
import Rect from "../lib/rect";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text/text";
import WriteViewObj from "../viewObject/write";
import XImage from "../lib/ximage";
import Button, { BaseButton } from "./baseButton";
import Group from "../viewObject/group";
import * as Buttons from "@/composite/buttons"
import { ExportButton, FetchXImageForImportCallback, ViewObjectExportImageBox, ViewObjectExportTypes, ViewObjectImportBaseInfo, ViewObjectImportEntity, ViewObjectImportImageBox } from "@/types/serialization";
abstract class GestiReader {
  constructor() {

  }
  
  private buttonClazzList = {
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
      const imgEntity:ViewObjectExportImageBox=this.formatEntity<ViewObjectExportImageBox>(entity);
      return ImageBox.reverse(imgEntity);
    }else if(type=="text"){
      
    }
    return null;
  }
  private formatEntity<T>(entity:ViewObjectImportEntity):T{
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

    console.log(view)
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
      viewObject.installButton(button);
     button.setLocation(item.location);
    });
  }

  public getRectByRectJson(rectJson: any): Rect {
    const jsonObj: any = rectJson;
    const rect = new Rect({
      width: jsonObj.width,
      height: jsonObj.height,
      x: jsonObj.x,
      y: jsonObj.y,
    });
    return rect;
  }
}

export default GestiReader;
