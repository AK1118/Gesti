import canvasConfig from "./config/canvasConfig";
import GestiConfig, { gesticonfig } from "./config/gestiConfig";
import GesteControllerImpl from "./controller";
import ImageToolkit from "./image-toolkit";
import GestiController from "./interfaces/gesticontroller";
import XImage from "./ximage";

/**
 * 初始化该 @Gesti 实例时，由于平台不确定，用户必须传入 @CanvasRenderingContext2D 画笔作为
 */
class Gesti {
  private kit: ImageToolkit;
  public static XImage = XImage;
  public static config: GestiConfig;
  constructor(config?: gesticonfig) {
    Gesti.config = new GestiConfig(config);
  }
  get controller(): GestiController {
    return new GesteControllerImpl(this.kit);
  }
  set debug(value: boolean) {
    this.kit.isDebug = true;
  }
  /*
   * @description 初始化 @Gesti 所代理的画布高宽，在h5端可直接传入 HTMLCanvasElement 自动解析高宽
   * @param @CanvasRenderingContext2D paint
   * @param rect
   */
  public init(
    canvas: HTMLCanvasElement | null,
    paint?: CanvasRenderingContext2D | null,
    rect?: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    }
  ) {
    if (!canvas && !rect) throw Error("未指定Canvas大小或Canvas节点");
    if (typeof document != "undefined" && canvas) {
      let canvasRect: DOMRect = canvas.getBoundingClientRect();
      //优先使用自定义的rect
      if (rect) canvasRect = rect as DOMRect;
      if (canvasRect) {
        const g = canvas.getContext("2d");
        g.imageSmoothingEnabled = true;
        g.imageSmoothingQuality = "high";
        this.kit = new ImageToolkit(g, canvasRect);
        canvasConfig.init(this.kit);
        return;
      }
    }
    if (rect) this.kit = new ImageToolkit(paint, rect);
    canvasConfig.init(this.kit);
  }
  /**
   * @description 设置配置，跟构造函数一样
   * @param config 
   */
  public setConfig(config?: gesticonfig):void{
    Gesti.config.setParams(config);
    this.kit.update();
  }
}

export default Gesti;
