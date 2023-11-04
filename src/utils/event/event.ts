import ImageToolkit from "../../core/lib/image-toolkit";
import Vector from "../../core/lib/vector";

type wheelParams = (e: WheelEvent) => void;

class Delta implements Delta {
  private _deltaX: number;
  private _deltaY: number;
  private beforeVector: Vector = Vector.zero;
  constructor(deltaX: number, deltaY: number) {
    this._deltaX = deltaX;
    this._deltaY = deltaY;
  }
  update(vector: Vector) {
    //初始化时before 和 vector 坐标相等
    if(this.beforeVector.x===0&&this.beforeVector.y===0){
      this.beforeVector = vector;
    }
    [this._deltaX, this._deltaY] = Vector.sub(
      vector,
      this.beforeVector
    ).toArray();
    this.beforeVector = vector;
  }
  get deltaX(): number {
    return this._deltaX;
  }
  get deltaY(): number {
    return this._deltaY;
  }
  get delta():[deltaX:number,deltaY:number]{
    return [this._deltaX,this._deltaY];
  }
  get deltaVector():Vector{
    return new Vector(this._deltaX,this._deltaY);
  }
  public clean(){
    this._deltaX=this._deltaY=0;
  }
  public cleanCurrentAndBefore(){
    this.clean();
    this.beforeVector.toZero();
  }
}

interface GestiEvent {
  kit: ImageToolkit;
  disabled: boolean;
  disable(): void;
  twoFingers(touches: TouchList): Array<Vector>;
  down(callback: GestiEventFunction): GestiEvent;
  up(callback: GestiEventFunction): GestiEvent;
  move(callback: GestiEventFunction): GestiEvent;
  wheel(callback: wheelParams): void;
}

class GestiEventManager {
  getEvent(kit: ImageToolkit): GestiEvent {
    if (typeof window != "undefined") {
      const isMobile = /Mobile/.test(navigator.userAgent);
      if (isMobile) return new GestiTouchEvent(kit);
      return new GestiMouseEvent(kit);
    } else if (typeof wx != "undefined") {
      return null;
    }
    return new GestiTouchEvent(kit);
  }
}

class GestiTouchEvent implements GestiEvent {
  kit: ImageToolkit;
  constructor(kit: ImageToolkit) {
    this.kit = kit;
  }
  disabled: boolean = false;
  disable(): void {
    this.disabled = true;
  }
  twoFingers(touches: TouchList): Vector[] {
    const e1 = touches[0];
    const e2 = touches[1];
    const vector1 = new Vector(e1.clientX, e1.clientY);
    const vector2 = new Vector(e2.clientX, e2.clientY);
    return [vector1, vector2];
  }
  down(down: GestiEventFunction): GestiEvent {
    window.addEventListener("touchstart", (_e: TouchEvent) => {
      if (this.disabled) return;
      const touches: TouchList = _e.targetTouches;
      if (touches.length >= 2) {
        down.bind(this.kit)(this.twoFingers(touches));
      } else {
        const e: Touch = touches[0];
        const vector = new Vector(e.clientX, e.clientY);
        down.bind(this.kit)(vector);
      }
    });
    return this;
  }
  up(up: GestiEventFunction): GestiEvent {
    window.addEventListener("touchend", (_e) => {
      if (this.disabled) return;
      const e: Touch = _e.changedTouches[0];
      const vector = new Vector(e.clientX, e.clientY);
      up.bind(this.kit)(vector);
    });
    return this;
  }
  move(move: GestiEventFunction): GestiEvent {
    window.addEventListener("touchmove", (_e: TouchEvent) => {
      if (this.disabled) return;
      const touches: TouchList = _e.targetTouches;
      if (touches.length >= 2) {
        move.bind(this.kit)(this.twoFingers(touches));
      } else {
        const e: Touch = touches[0];
        const vector = new Vector(e.clientX, e.clientY);
        move.bind(this.kit)(vector);
      }
    });
    return this;
  }
  wheel(whell) {
    //手机端不用适配
  }
}

class GestiMouseEvent implements GestiEvent {
  constructor(kit: ImageToolkit) {
    this.kit = kit;
  }
  disabled: boolean = false;
  disable(): void {
    this.disabled = true;
  }
  twoFingers(touches: TouchList): Vector[] {
    return [];
  }
  down(down: GestiEventFunction): GestiEvent {
    window.addEventListener("mousedown", (e: MouseEvent) => {
      const vector = new Vector(e.clientX, e.clientY);
      if (this.disabled) return;
      down.bind(this.kit)(vector);
    });
    return this;
  }
  up(up: GestiEventFunction): GestiEvent {
    window.addEventListener("mouseup", (e: MouseEvent) => {
      const vector = new Vector(e.clientX, e.clientY);
      if (this.disabled) return;
      up.bind(this.kit)(vector);
    });
    return this;
  }
  move(move: GestiEventFunction): GestiEvent {
    window.addEventListener("mousemove", (e: MouseEvent) => {
      const vector = new Vector(e.clientX, e.clientY);
      if (this.disabled) return;
      move.bind(this.kit)(vector);
    });
    return this;
  }
  wheel(wheel: wheelParams) {
    window.addEventListener("wheel", (e: WheelEvent) => {
      wheel.bind(this.kit)(e);
    });
  }
  kit: ImageToolkit;
}

export { GestiEvent, Delta };
export default GestiEventManager;
