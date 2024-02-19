import {  FuncButtonTrigger } from "../../enums";
import Alignment from "@/core/lib/painting/alignment";
import BaseButton from "../../abstract/baseButton";
import Painter from "../../lib/painter";
import Rect from "../../lib/rect";
import Vector from "../../lib/vector";
import Widgets from "../../../static/widgets";
import ViewObject from "../../abstract/view-object";
import GestiConfig from "../../../config/gestiConfig";
import { Icon } from "@/core/lib/icon";
import MirrorIcon from "@/static/icons/mirrorIcon";
import DelateIcon from "@/static/icons/delateIcon";
import LockIcon from "@/static/icons/lockIcon";
import UnLockIcon from "@/static/icons/unlockIcon";
import RotateIcon from "@/static/icons/rotateIcon";
import CloseIcon from "@/static/icons/closeIcon";

class MirrorButton extends BaseButton {
  readonly name: ButtonNames="MirrorButton";
  protected buttonAlignment: Alignment = Alignment.bottomLeft;
  protected icon:Icon=new MirrorIcon();

  trigger: FuncButtonTrigger = FuncButtonTrigger.click;
  radius: number = 10;
  /**
   * @description 相对坐标为以父对象为原点的定位
   * 绝对坐标是以canvas为原点的定位
   * 相对坐标用于渲染
   * 绝对坐标用于事件捕获
   * 相对坐标一般会直接以父对象为原点进行设置数据
   * 绝对坐标一般需要参考父对象进行设置数据  绝对坐标等于 = 父.绝对+ 相对
   * 绝对.x=父绝对+cos(θ+初始定位θ)*父半径
   * @param vector
   */
  updatePosition(vector: Vector): void {
    this.updateRelativePosition();
    this.setAbsolutePosition(vector);
  }
  setMaster(master: ViewObject): void {
    this.master = master;
  }
  effect(): void {
    this.master.mirror();
  }
  onSelected(): void {}
}

export default MirrorButton;
