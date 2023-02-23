declare class Painter {
    paint: CanvasRenderingContext2D;
    constructor(paint: CanvasRenderingContext2D);
    get canvas(): HTMLCanvasElement;
    set fillStyle(style: string);
    set lineWidth(width: number);
    set strokeStyle(style: string);
    draw(): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    stroke(): void;
    clearRect(x: number, y: number, w: number, h: number): void;
    save(): void;
    rotate(angle: number): void;
    beginPath(): void;
    closePath(): void;
    restore(): void;
    translate(x: number, y: number): void;
    fill(): void;
    arc(x: number, y: number, radius: number, start: number, end: number): void;
    drawImage(image: HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas, x: number, y: number, width: number, height: number): void;
    scale(a: number, b: number): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    getImageData(x: number, y: number, w: number, h: number): ImageData;
    update(): void;
}
export default Painter;
//# sourceMappingURL=painter.d.ts.map