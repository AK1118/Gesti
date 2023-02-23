import XImage from "./ximage";
export interface createImageOptions {
    data?: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas;
    options?: createImageOptions;
    width?: number;
    height?: number;
    scale?: number;
    maxScale?: number;
    minScale?: number;
}
interface GestiController {
    down(e: Event): void;
    up(e: Event): void;
    move(e: Event): void;
    wheel(e: Event): void;
}
/**
 * 初始化该 @Gesti 实例时，由于平台不确定，用户必须传入 @CanvasRenderingContext2D 画笔作为
 */
declare class Gesti {
    controller: GestiController;
    private kit;
    static XImage: typeof XImage;
    static debug: boolean;
    init(canvas?: HTMLCanvasElement, paint?: CanvasRenderingContext2D, rect?: {
        x?: number;
        y?: number;
        width: number;
        height: number;
    }): void;
    addImage(ximage: XImage | Promise<XImage>): Promise<boolean>;
    createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage>;
}
export default Gesti;
//# sourceMappingURL=index.d.ts.map