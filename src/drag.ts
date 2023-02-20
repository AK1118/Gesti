import Rect from "./rect";
import Vector from "./vector";

class Drag {
    rect: Rect = null;
    offset: Offset;
    catchImageBox(rect: Rect, position: Vector|any): void {
        this.rect = rect;
        this.offset = {
            offsetx: this.rect.position.x - position.x,
            offsety: this.rect.position.y - position.y,
        }
    }
    cancel(): void {
        this.rect = null;
    }
    update(position: Vector|any): void {
        if (this.rect == null) return;
        this.rect.position.setXY(
            ~~(position.x + this.offset.offsetx),
            ~~(position.y + this.offset.offsety)
        );
        if(this.rect.onDrag!=null)this.rect.onDrag(this.rect);
    }
}

export default Drag;