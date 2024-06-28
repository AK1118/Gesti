
import { Alignment, Icon, ImageBox, Rectangle, TextBox } from "./gesti";

type ButtonOption = {
  alignment?: Alignment;
  icon?: Icon;
};

declare abstract class BaseButton {
  constructor(option?: ButtonOption);
}

declare abstract class Button extends BaseButton {
  get btnLocation(): Alignment;
  public setLocation(location: Alignment): void;
  public setBackgroundColor(color: string): void;
  public hideBackground(): void;
  public setIconColor(color: string): void;
  public setSenseRadius(senseRadius: number): void;
  public setId(id: string): void;
  get id(): string;
}

export class CloseButton extends Button {}
interface DragButtonInterface extends ButtonOption {
  angleDisabled: boolean;
}
export class DragButton extends Button {
  constructor(options?: DragButtonInterface);
}
export class MirrorButton extends Button {}
export class LockButton extends Button {}
export class RotateButton extends Button {}

export interface EventButtonOption extends ButtonOption {
  onClick: VoidFunction;
  child: TextBox | ImageBox | Rectangle;
}
/**
 * ### 创建一个自定义按钮对象
 * - 按钮可以自定义child和点击事件，但是点击事件不能被导出
 */
export class CustomButton extends Button {
  constructor(eventButtonOption?: Partial<EventButtonOption>);
}
export interface ARButtonOption extends ButtonOption {
  alignment: Alignment;
}
export class SizeButton extends Button {
  constructor(option?: ARButtonOption);
}
/**
 * 创建一个等比例缩放按钮
 */
export class ARButton extends SizeButton {}
/**
 * 创建一个自定义事件按钮
 */
export class EventButton extends CustomButton {}
export class UnLockButton extends Button {
  constructor(option?: ButtonOption);
}
type VerticalAlignmentType = "top" | "bottom";
interface VerticalButtonOption extends ARButtonOption {
  location?: VerticalAlignmentType;
}
export class VerticalButton extends Button {
  constructor(location?: VerticalAlignmentType, option?: ButtonOption);
}

type HorizonAlignmentType = "left" | "right";
interface HorizonButtonOption extends ARButtonOption {
  location?: HorizonAlignmentType;
}
export class HorizonButton extends Button {
  constructor(option?: HorizonButtonOption);
}

export class DeleteButton extends CloseButton {}
