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
  constructor(master: ViewObject) {
    super(master);
  }
  draw(paint: Painter): void {
    this.drawButton(this.relativeRect.position,this.master.rect.size,this.radius,paint);
  }
  drawButton(position: Vector, size: Size, radius: number, paint: Painter): void {
    this.setAxis("horizontal");
    this.init({ percentage: [0.55, 0] });
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
