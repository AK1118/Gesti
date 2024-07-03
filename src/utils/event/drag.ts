import Rect from "../../core/lib/rect";
import Vector from "../../core/lib/vector";

class Drag {
  private rect: Rect = null;
  private offset: Vector;
  get busy(): boolean {
    return this.rect !== null;
  }
  public catchViewObject(rect: Rect, position: Vector | any): void {
    this.rect = rect;
    this.offset
      ? this.offset.setXY(
          this.rect.position.x - position.x,
          this.rect.position.y - position.y
        )
      : (this.offset = new Vector(
          this.rect.position.x - position.x,
          this.rect.position.y - position.y
        ));
  }
  public cancel(): void {
    this.rect = null;
  }
  public update(position: Vector | any): void {
    if (!this.rect) return;
    this.rect.beforeDrag?.(this.rect,position);
    position.add(this.offset);
    if (!this.rect.disableDragPosition) {
      this.rect.setPositionXY(position.x, position.y);
    }
    this.rect.onDrag?.(this.rect,position);
  }
}

export default Drag;
