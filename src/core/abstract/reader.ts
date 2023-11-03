import ViewObject from "./view-object";
import GesteControllerImpl from "../../controller";
import Rect from "../lib/rect";
import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text";
import WriteViewObj from "../viewObject/write";
import XImage from "../lib/ximage";
import {
  CloseButton,
  DragButton,
  MirrorButton,
  RotateButton,
  LockButton,
  UnLockButton,
  VerticalButton,
  HorizonButton,
} from "../../composite/buttons";
import Button from "./baseButton";
import CutterH5 from "../../utils/cutters/cutter-H5";
abstract class GestiReader {
  constructor() {}
  private buttonClazzList = {
    DragButton,
    MirrorButton,
    CloseButton,
    RotateButton,
    UnLockButton,
    HorizonButton,
    LockButton,
    VerticalButton,
  };
  public async getViewObject(type: string, options: any): Promise<ViewObject> {
    let viewObject: ViewObject;
    switch (type) {
      case "write":
        {
          viewObject = new WriteViewObj(
            options.points,
            options.config?.color ?? "red",
            options.config
          );
        }
        break;
      case "image":
        {
          const cutter = new CutterH5();
          const source: ImageData = await cutter.merge(
            options.fixedWidth,
            options.fixedHeight,
            options.options.data
          );
          const ximage: XImage = await new GesteControllerImpl(
            null
          ).createImage(source);
          viewObject = new ImageBox(ximage);
        }
        break;
      case "text":
        {
          viewObject = new TextBox(options.text, options.options);
        }
        break;
    }
    return viewObject;
  }

  public async getObjectByJson(str: string) {
    const json = JSON.parse(str);
    const { options } = json;
    const rect: Rect = this.getRectByRectJson(options.rect);
    const relativeRect: Rect = this.getRectByRectJson(options.relativeRect);
    let viewObject: ViewObject = await this.getViewObject(
      json.viewObjType,
      options
    );
    this.buildUp(viewObject, rect, relativeRect, options);
    return viewObject;
  }

  public buildUp(
    viewObject: ViewObject,
    rect: Rect,
    relativeRect: Rect,
    options: any
  ): ViewObject {
    if (!viewObject.rect) viewObject.rect = rect;
    if (!viewObject.relativeRect) viewObject.relativeRect = relativeRect;
    viewObject.setMirror(options.mirror);
    viewObject.rect.setSize(rect.size.width, rect.size.height);
    viewObject.rect.setAngle(options.rect.angle);
    viewObject.relativeRect.position = relativeRect.position;
    viewObject.relativeRect.setSize(
      relativeRect.size.width,
      relativeRect.size.height
    );
    viewObject.id=options.id;
    viewObject.setLayer(options?.layer||0);
    viewObject.relativeRect.setAngle(options.relativeRect.angle);
     //init包括生成按钮
    viewObject.init();
    viewObject.custom();
    viewObject.rect.setPosition(rect.position);
    //安装按钮
    this.installButton(viewObject, options.buttons);
    //设置成为背景
    options.isBackground&&viewObject.toBackground();
    //是否锁定
     options.locked && viewObject.lock();
    return viewObject;
  }

  //安装按钮
  private installButton(viewObject: ViewObject, buttons: Array<string>) {
    buttons.forEach((item) => {
      const buttonConstructor = this.buttonClazzList[item];
      if (!buttonConstructor)
        return console.error(
          "This buttonConstructor is not a constructor.",
          buttonConstructor,
          this.buttonClazzList[item]
        );
      const button: Button = new buttonConstructor(viewObject);
      viewObject.installButton(button);
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
