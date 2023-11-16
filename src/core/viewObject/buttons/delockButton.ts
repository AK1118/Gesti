import { ButtonLocation, FuncButtonTrigger } from "../../enums";

import BaseButton, { ButtonOption } from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Icon } from "@/core/lib/icon";
import { UnLockIcon } from "@/composite/icons";


class UnLockButton extends BaseButton {
    constructor(option?:ButtonOption){
        super(option);
        this.free=true;
        this.disabled=true;
    }
    onSelected(): void {
        
    }
    protected icon: Icon=new UnLockIcon();
    protected buttonLocation:ButtonLocation=ButtonLocation.RT;
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
        this.master.unLock();
    }

}

export default UnLockButton;