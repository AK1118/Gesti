import Painter from "../lib/painter";
import { ImageChunk } from "../../types/gesti";
import XImage from "../lib/ximage";

interface CutterInterface {
  painter: Painter;
  canvas:any;
  chunkSize:number;
  getChunks(ximage: XImage):Promise<ImageChunk[]>;
  merge(
    width: number,
    height: number,
    chunks: ImageChunk[],
    canvas?: any
  ): ImageData;
}

export default CutterInterface;
