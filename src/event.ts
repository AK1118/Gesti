import ImageToolkit from "./image-toolkit";
import Vector from "./vector";


type wheelParams=(e:WheelEvent)=>void;

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
        if (typeof (window) != "undefined") {
            const isMobile = /Mobile/.test(navigator.userAgent);
            if (isMobile) return new GestiTouchEvent(kit);
            return new GestiMouseEvent(kit);
        } else if (typeof (wx) != "undefined") {
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
        window.addEventListener('touchstart', (_e: TouchEvent) => {
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
        window.addEventListener('touchend', (_e) => {
            if (this.disabled) return;
            const e: Touch = _e.changedTouches[0];
            const vector = new Vector(e.clientX, e.clientY);
            up.bind(this.kit)(vector);
        });
        return this;
    }
    move(move: GestiEventFunction): GestiEvent {
        window.addEventListener('touchmove', (_e: TouchEvent) => {
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
       this.disabled=true;
    }
    twoFingers(touches: TouchList): Vector[] {
        return [];
    }
    down(down: GestiEventFunction): GestiEvent {
        window.addEventListener('mousedown', (e: MouseEvent) => {
            const vector = new Vector(e.clientX, e.clientY);
            if (this.disabled) return;
            down.bind(this.kit)(vector);
        });
        return this;
    }
    up(up: GestiEventFunction): GestiEvent {
        window.addEventListener('mouseup', (e: MouseEvent) => {
            const vector = new Vector(e.clientX, e.clientY);
            if (this.disabled) return;
            up.bind(this.kit)(vector);
        });
        return this;
    }
    move(move: GestiEventFunction): GestiEvent {
        window.addEventListener('mousemove', (e: MouseEvent) => {
            const vector = new Vector(e.clientX, e.clientY);
            if (this.disabled) return;
            move.bind(this.kit)(vector);
        });
        return this;
    }
    wheel(wheel:wheelParams) {
        window.addEventListener('wheel',(e:WheelEvent)=>{
            wheel.bind(this.kit)(e);
        });
    }
    kit: ImageToolkit;
}

export { GestiEvent };
export default GestiEventManager;