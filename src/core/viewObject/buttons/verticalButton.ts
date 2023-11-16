import Painter from "../../lib/painter";
import Widgets from "../../../static/widgets";
import SizeButton from "./sizeButton";
import { ButtonLocation } from "../../enums";
import DragButton from "./dragbutton";
import Rect from "@/core/lib/rect";
import { Icon } from "@/core/lib/icon";
import { DefaultIcon } from "@/composite/icons";

class VerticalButton extends DragButton {
  protected buttonLocation:ButtonLocation=ButtonLocation.BC;
  protected icon: Icon=new DefaultIcon();
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
}

export default VerticalButton;
