import { ButtonLocation, FuncButtonTrigger } from "../../enums";

import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Icon } from "@/core/lib/icon";
import { LockIcon } from "@/composite/icons";



class LockButton extends BaseButton {
    protected icon: Icon=new LockIcon();
    protected buttonLocation:ButtonLocation=ButtonLocation.LT;
    trigger: FuncButtonTrigger = FuncButtonTrigger.click;
    radius: number = 10;

    updatePosition(vector: Vector): void {
        this.updateRelativePosition();
        this.setAbsolutePosition(vector);
    }
    setMaster(master: ViewObject): void {
        this.master = master;
    }
    effect(): void {
        this.master.lock();
    }
    onSelected(): void {

    }

}

export default LockButton;