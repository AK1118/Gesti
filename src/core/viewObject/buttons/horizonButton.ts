import { ButtonLocation, FuncButtonTrigger } from "../../enums";

import BaseButton, { ButtonOption } from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import DragButton from "./dragbutton";
import { Icon } from "@/core/lib/icon";
import { DefaultIcon } from "@/composite/icons";
import SizeButton from "./sizeButton";

class HorizonButton extends SizeButton {
  protected buttonLocation:ButtonLocation;
  protected icon: Icon=new DefaultIcon();
  constructor(location?:'left'|'right',option?:ButtonOption){
    const _location=location==="right"?ButtonLocation.RC:ButtonLocation.LC;
    super(_location||ButtonLocation.RC,option);
  }
  public onUpWithInner(): void {
      this.computeSelfLocation();
  }
  // effect(currentButtonRect?: Rect): void {
  //   const mag = this.getButtonWidthMasterMag(currentButtonRect);
  //   if (this.preMag === -1) this.preMag = mag;
  //   const deltaScale: number = mag / this.preMag;
  //     const [offsetX,offsetY]=currentButtonRect.position.sub(this.master.position).toArray();
  //     this.master.setSize({
  //       width:this.master.width*deltaScale,
  //       height:this.master.height,
  //     });
  //   // this.master.setScale(deltaScale);
  //   this.preMag = mag;
  // }
  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    const preMasterSize: Size = this.master.size.copy();
    if (this.preMag === -1) {
      this.preMag = mag;
      return;
    }
    const deltaScale: number = mag / this.preMag;
    const rScale: number = deltaScale + (1 - deltaScale) / 2;
    this.master.setSize({
      width:this.master.width*rScale,
    });
    const currentMasterSize: Size = this.master.size.copy();
    
    let delta = currentMasterSize
      .toVector()
      .sub(preMasterSize.toVector())
      .half();

    this.manipulateDelta(delta);
    
    //获取Widget对象的弧度制的角度
    const angleInRadians = this.master.rect.getAngle;
    
    // 假设 delta 是旧的 delta 向量
    const [x, y] = delta.toArray();
    
    /**
     * 使用矩阵旋转计算新的 delta.x 和 delta.y
     * R = | cos(angle)  -sin(angle) |
           | sin(angle)   cos(angle) |

        新速度向量 = R * 原速度向量
     */
    const newDeltaX =
      Math.cos(angleInRadians) * x - Math.sin(angleInRadians) * y;
    const newDeltaY =
      Math.sin(angleInRadians) * x + Math.cos(angleInRadians) * y;

    // 现在 newDelta 包含了根据给定角度 angle 重新计算的移动速度
    this.master.addPosition(newDeltaX,newDeltaY);
    this.preMag = deltaScale < 1 ? mag + delta.mag() : mag - delta.mag();
  }
}

export default HorizonButton;
