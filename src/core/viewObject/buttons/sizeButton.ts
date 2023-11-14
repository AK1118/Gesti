/**
 * 改变大小按钮
 */

import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Widgets from "../../../static/widgets";
import DragButton from "./dragbutton";
import { ButtonLocation } from "../../enums";
import Vector from "@/core/lib/vector";

class SizeButton extends DragButton {
  protected buttonLocation:ButtonLocation=ButtonLocation.RT;
  private selfLocation:ButtonLocation;
  constructor(location:ButtonLocation){
    super();
    this.selfLocation=location;
    this.buttonLocation=location;
    this.beforeMounted(location);
  }
  /**
   * @description 在按钮挂载前设置位置
   * @param location 
   */
  protected beforeMounted(location:ButtonLocation): void {
    //按钮功能原因.按钮必须设置枚举位置,不允许设置position位置,这是强制的.
    this.setLocationByEnum(location);   
  }
  
  private manipulateDelta(delta:Vector):void{
    switch(this.selfLocation){
      case ButtonLocation.LT:{
        delta.y*=-1;
        delta.x*=-1;
      };break;
      case ButtonLocation.LB:{
        delta.x*=-1;
      };break;
      case ButtonLocation.RT:{
        delta.y*=-1;
      };break;
      case ButtonLocation.RB:{
       
      };break;
      case ButtonLocation.RC:{
        delta.y=0;
      };break
      case ButtonLocation.BC:{
        delta.x=0;
      };break
      case ButtonLocation.LC:{
        delta.x*=-1;
        delta.y=0;
      };break;
      case ButtonLocation.TC:{
        delta.x=0;
        delta.y*=-1;
      };break;
    }
  }

  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    const preMasterSize: Size = this.master.size.copy();
    if (this.preMag === -1) {
      this.preMag = mag;
      return;
    }
    const deltaScale: number = mag / this.preMag;
    const rScale: number = deltaScale + (1 - deltaScale) / 2;
    this.master.setDeltaScale(rScale);
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
  draw(paint: Painter): void {
    this.drawButton(this.relativeRect.position,this.master.rect.size,this.radius,paint);
  }
  drawButton(position: Vector, size: Size, radius: number, paint: Painter): void {
    this.setAxis("horizontal");
    //按钮渲染样式
    this.draw = function (paint) {
      const { x, y } = this.relativeRect.position;
      Widgets.drawChangeSizeAlone(paint, {
        offsetX: x,
        offsetY: y,
      });
    };
  }
}


export default SizeButton;