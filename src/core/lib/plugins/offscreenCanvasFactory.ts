import { OffScreenCanvasFactoryOption } from "@/types/index";
import Painter from "../painter";

class OffScreenCanvasFactory {
  private generateOffScreenCanvas: (width: number, height: number) => any;
  private generateOffScreenContext: (offScreenCanvas: any) => any;
  constructor(option: OffScreenCanvasFactoryOption) {
    this.generateOffScreenCanvas = option?.generateOffScreenCanvas||((width: number, height: number)=>null);
    this.generateOffScreenContext = option?.generateOffScreenContext||(()=>null);
  }
  public getOffScreenCanvas(width: number, height: number): any {
    return this.generateOffScreenCanvas?.(width, height);
  }

  public getOffScreenContext(offScreenCanvas): Painter {
    const paint = this.generateOffScreenContext?.(offScreenCanvas);
    if (!paint) return null;
    return new Painter(paint as any);
  }
}


export default OffScreenCanvasFactory;