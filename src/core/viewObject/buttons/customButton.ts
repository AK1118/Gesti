import BaseButton, { ButtonOption } from "@/core/abstract/baseButton";
import ViewObject from "@/core/abstract/view-object";
import { FuncButtonTrigger } from "@/core/enums";
import RenderObject from "@/core/interfaces/render-object";
import Painter from "@/core/lib/painter";
import Rect from "@/core/lib/rect";
import Vector from "@/core/lib/vector";
import { Alignment } from "@/index";
import { ExportButton } from "@/types/serialization";
import { ViewObjectExportEntity } from "@/types/serialization";

interface OO {
  child: ViewObjectExportEntity;
}

class CustomButton extends BaseButton {
  readonly name: ButtonNames = "CustomButton";
  protected buttonAlignment: Alignment;
  public onClick: VoidFunction;
  trigger: FuncButtonTrigger = FuncButtonTrigger.click;
  private child: ViewObject;
  constructor(option?: {
    child: ViewObject;
    onClick?: VoidFunction;
    option?: ButtonOption;
  }) {
    super(option?.option);
    option?.child.unUseCache();
    this.child = option?.child;
    this.onClick = option?.onClick;
  }
  setMaster(master: ViewObject): void {
    this.master = master;
  }
  protected afterMounted(...args: any[]): void {
    this.child?.initialization(this.master.getKit());
  }
  effect(): void {
    this.onClick?.();
  }
  public async export<OO>(): Promise<ExportButton<OO>> {
    const entity = await super.export<OO>();
    const childEntity = (await this.child.export()) as ViewObjectExportEntity;
    entity.option = {
      child: childEntity,
    } as OO;
    return Promise.resolve(entity);
  }
  updatePosition(vector: Vector): void {
    this.updateRelativePosition();
    this.setAbsolutePosition(vector);
  }
  protected drawButton(
    position: Vector,
    size: Size,
    radius: number,
    paint: Painter
  ): void {
    if (!this.child?.mounted) return;
    paint.save();
    paint.translate(position.x, position.y);
    this.child.render(paint);
    paint.restore();
  }
  onSelected(): void {
    throw new Error("Method not implemented.");
  }
}

export default CustomButton;
