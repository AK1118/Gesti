import { ButtonLocation, FuncButtonTrigger } from "../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Icon } from "@/core/lib/icon";
import { CloseIcon } from "@/composite/icons";

class CloseButton extends BaseButton {
    readonly name: ButtonNames="CloseButton";
    protected icon: Icon=new CloseIcon();
    protected buttonLocation:ButtonLocation=ButtonLocation.RT;
    trigger: FuncButtonTrigger = FuncButtonTrigger.click;
    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    effect(): void {
        this.master.hide();
    }
    onSelected(): void {

    }
}


export default CloseButton;