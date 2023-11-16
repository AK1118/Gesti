import { ButtonLocation, FuncButtonTrigger } from "../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import DragButton from "./dragbutton";
import { Icon } from "@/core/lib/icon";
import { DefaultIcon } from "@/composite/icons";

class HorizonButton extends DragButton {
  protected buttonLocation:ButtonLocation=ButtonLocation.RC;
  protected icon: Icon=new DefaultIcon();
  public onUpWithInner(): void {
      this.computeSelfLocation();
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
}

export default HorizonButton;
