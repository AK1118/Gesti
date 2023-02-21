declare const uni: any;
declare const wx:any;

declare interface CanvasRenderingContext2D {
    draw(): void;
}
declare interface Offset{
    offsetx:number,
    offsety:number
}
declare interface rectparams{
    x:number,
    y:number,
    width:number,
    height:number,
}

declare class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(v: Vector): void;
    sub(v: Vector): this;
    mult(v: Vector): this;
    div(v: Vector): this;
    mag(): number;
    dist(v: Vector): number;
    normalize(): this;
    clamp(c: [max: number, min: number]): void;
    copy(): Vector;
    set(v: Vector): void;
    setXY(x: number, y: number): void;
    toJson():{x:number,y:number};
    toArray():number[];
    static dist(v1: Vector, v2: Vector): number;
    static mag(v: Vector): number;
    static sub(v1: Vector, v2: Vector): Vector;
}

declare interface createImageOptions{
    data?:HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|Blob|ImageData|ImageBitmap|OffscreenCanvas,options?:createImageOptions,
    width?:number,
    height?:number,
    scale?:number,
    maxScale?:number,
    minScale?:number,
}

declare interface GestiEventParams{v:Vector|Vector[],sub(v:Vector):Vector}

declare interface GestiEventFunction{
    (GestiEventParams):void;
}

// declare interface XImage{
//     data:any;
//     width:number;
//     height:number;
//     x:number;
//     y:number;
//     scale:number;
//     toJson():rect;
// }

// declare class Ximage{
//     data:any;
//     width:number;
//     height:number;
//     x:number;
//     y:number;
//     scale:number;
//     new(params:{data:any,width:number,height:number,scale:number}):XImage;
// }
