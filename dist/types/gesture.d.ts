import ImageBox from "./imageBox";
import Vector from "./vector";
declare class Gesture {
    private imageBox;
    private oldRect;
    private start;
    private end;
    private oldDist;
    private oldAngle;
    isTwoFingers(touches: Vector | Vector[]): boolean;
    onStart(imageBox: ImageBox, start: Vector[]): void;
    cancel(): void;
    update(positions: Vector[]): void;
}
export default Gesture;
//# sourceMappingURL=gesture.d.ts.map