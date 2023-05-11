import Gesti from "../gesti";
import { onSelected } from "./listener";

const createGesti = (
  canvas: HTMLCanvasElement | null,
  paint?: CanvasRenderingContext2D | null,
  rect?: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }
) => {
  return createGestiApp(canvas, paint, rect);
};

const createHook = () => {};

function createGestiApp(
  canvas: HTMLCanvasElement | null,
  paint?: CanvasRenderingContext2D | null,
  rect?: {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }
) {
    const gesti=new Gesti();
    gesti.init(canvas,paint,rect);
    return gesti;
}

export { createGesti, onSelected };
