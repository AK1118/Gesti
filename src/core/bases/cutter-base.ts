import { ImageChunk } from "@/types/gesti";
import CutterInterface from "../interfaces/cutter";
import Painter from "../lib/painter";
import XImage from "../lib/ximage";
import { getOffscreenCanvasContext, getOffscreenCanvasWidthPlatform } from "@/utils/canvas";

abstract class CutterBase implements CutterInterface{
    canvas: any;
    painter: Painter;
    chunkSize: number=200;
    constructor(){
        this.canvas=getOffscreenCanvasWidthPlatform(10000,500);
        this.painter=getOffscreenCanvasContext(this.canvas) as any;
    }
    getChunks(ximage: XImage): Promise<ImageChunk[]> {
        throw new Error("Method not implemented.");
    }
    merge(width: number, height: number, chunks: ImageChunk[], canvas?: any):ImageData {
        throw new Error("Method not implemented.");
    }
    
}

export default CutterBase;