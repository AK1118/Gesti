import Painter from "../../painter";
import { ImageChunk } from "../../types/index";
import XImage from "../lib/ximage";

interface CutterInterface {
  painter: Painter;
  getChunks(chunkSize: number, ximage: XImage): Promise<ImageChunk[]>;
  merge(
    width: number,
    height: number,
    chunks: ImageChunk[],
    canvas?: any
  ): Promise<ImageData>;
}

export default CutterInterface;
