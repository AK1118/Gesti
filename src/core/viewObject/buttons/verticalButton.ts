import ViewObject from "../../abstract/view-object";
import Painter from "../../lib/painter";
import Widgets from "../../../static/widgets";
import DragButton from "./dragbutton";

class VerticalButton extends DragButton {
  protected percentage: [x: number, y: number]=[0.55, 0];
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

export default VerticalButton;
