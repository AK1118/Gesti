import GestiConfig, { gesticonfig } from "../../config/gestiConfig";
import GesteControllerImpl from "./controller";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "./image-toolkit";
import GestiController from "../interfaces/gesticontroller";
import XImage from "./ximage";
import { InitializationOption } from "@/types/index";

class Gesti {
  private kit: ImageToolkit;
  public static XImage = XImage;
  public static config: GestiConfig;
  constructor(config?: gesticonfig) {
    Gesti.config = new GestiConfig(config);
  }
  private _controller: GestiController;
  get controller(): GestiController {
    return (
      this._controller || (this._controller = new GesteControllerImpl(this.kit))
    );
  }

  set debug(value: boolean) {
    if (this.kit) this.kit.isDebug = value;
  }

  public static mount(option: InitializationOption): [Gesti, GestiController] {
    const gesti = new Gesti();
    const controller = gesti.initialization(option);
    return [gesti, controller];
  }

  public initialization(option: InitializationOption): GestiController {
    if (!option) throw Error("The option is should not undefined.");
    if (!option.renderContext)
      throw Error("RenderContext must not be undefined.");
    this._controller && this.dispose();
    if (option.rect) this.kit = new ImageToolkit(option);
    return this.controller;
  }

  /**
   * @deprecated 次方法已废弃，请使用 initialization
   * @description 初始化
   * @param canvas
   * @param paint
   * @param rect
   * @returns
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
    throw Error(
      "This method has been deprecated,please run method gesti.initialization(options) to initialization gesti."
    );
  }
  /**
   * @description 设置配置，跟构造函数一样
   * @param config
   */
  public setConfig(config?: gesticonfig): void {
    Gesti.config.setParams(config);
    this.kit.render();
  }
  /**
   * @deprecated
   * @description 建议使用 dispose
   */
  public destroy(): void {
    this.controller?.destroyGesti();
    this._controller = null;
    this.kit = null;
  }
  public dispose(): void {
    this.controller?.destroyGesti();
    this._controller = null;
    this.kit = null;
  }

  static Family = ViewObjectFamily;
}

export default Gesti;
