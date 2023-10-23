import Rect from "./rect";
import Vector from "./vector";

class Drag {
  private rect: Rect = null;
  private offset: Vector;
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
    if (this.rect.beforeDrag != null) this.rect.beforeDrag(this.rect);
    position.add(this.offset);
    this.rect.position.setXY(position.x, position.y);
    this.rect.onDrag?.(this.rect);
  }
}

export default Drag;
