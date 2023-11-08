import { FuncButtonTrigger } from "../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import DragButton from "./dragbutton";

class HorizonButton extends DragButton {
  protected percentage: [x: number, y: number]=[0.5, 0];
  draw(paint: Painter): void {
    this.drawButton(this.relativeRect.position,this.master.rect.size,this.radius,paint);
  }
  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    if (this.preMag === -1) this.preMag = mag;
    const deltaScale: number = mag / this.preMag;
      const [offsetX,offsetY]=currentButtonRect.position.sub(this.master.position).toArray();
      this.master.setSize({
        width:this.master.width*deltaScale,
        height:this.master.height,
      });
    // this.master.setScale(deltaScale);
    this.preMag = mag;
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

export default HorizonButton;
