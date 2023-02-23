import ImageToolkit from "./image-toolkit";
import Vector from "./vector";
type wheelParams = (e: WheelEvent) => void;
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
declare class GestiEventManager {
    getEvent(kit: ImageToolkit): GestiEvent;
}
export { GestiEvent };
export default GestiEventManager;
//# sourceMappingURL=event.d.ts.map