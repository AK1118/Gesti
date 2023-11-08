import Painter from "../../lib/painter";
import Widgets from "../../../static/widgets";
import SizeButton from "./sizeButton";
import { SizeButtonLocation } from "../../enums";
import DragButton from "./dragbutton";
import Rect from "@/core/lib/rect";

class VerticalButton extends DragButton {
  protected percentage: [x: number, y: number]=[0,-.5];
  draw(paint: Painter): void {
    this.drawButton(this.relativeRect.position,this.master.rect.size,this.radius,paint);
  }
  effect(currentButtonRect?: Rect): void {
    const mag = this.getButtonWidthMasterMag(currentButtonRect);
    if (this.preMag === -1) this.preMag = mag;
    const deltaScale: number = mag / this.preMag;
      const [offsetX,offsetY]=currentButtonRect.position.sub(this.master.position).toArray();
      this.master.setSize({
        width:this.master.width,
        height:this.master.height*deltaScale,
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

export default VerticalButton;
