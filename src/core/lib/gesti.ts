import GestiConfig, { GestiConfigOption } from "../../config/gestiConfig";
import GestiController from "./controller";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "./image-toolkit";
import XImage from "./ximage";
import Plugins from "./plugins";
import { InitializationOption, PluginKeys } from "Gesti";
import GestiControllerInterface, {
  BindControllerInterface,
} from "../interfaces/gesticontroller";

class Gesti implements BindControllerInterface {
  private _kit: ImageToolkit;
  public static config: GestiConfig;
  constructor(config?: GestiConfigOption) {
    Gesti.config = new GestiConfig(config);
  }
  initialized: boolean = false;
  bindController(controller: GestiController): void {
    controller.bindGesti(this);
  }
  bindGesti(gesti: Gesti): void {
    throw new Error("Method not implemented.");
  }
  private _controller: GestiController;
  public get kit(): ImageToolkit {
    return this._kit;
  }
  get controller(): GestiController {
    return this._controller || (this._controller = new GestiController(this));
  }

  set debug(value: boolean) {
    if (this._kit) this._kit.isDebug = value;
  }

  public static mount(option: InitializationOption): [Gesti, GestiController] {
    const gesti = new Gesti();
    const controller = gesti.initialization(option);
    return [gesti, controller];
  }

  /**
   *
   * @param option
   * @returns
   */
  public initialization(option: InitializationOption): GestiController {
    if (!option) throw Error("The option is should not undefined.");
    if (!option.renderContext)
      throw Error("RenderContext must not be undefined.");
    if (option.rect.canvasWidth === 0 || option.rect.canvasHeight === 0)
      throw Error("Both 'canvasWidth' and 'canvasHeight' must be non-zero.");
    this._controller && this.dispose();
    if (option.rect) this._kit = new ImageToolkit(option);
    this.initialized = true;
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
  public setConfig(config?: GestiConfigOption): void {
    Gesti.config.setParams(config);
    this._kit.render();
  }
  /**
   * @deprecated
   * @description 建议使用 dispose
   */
  public destroy(): void {
    this.controller?.destroyGesti();
    this._controller = null;
    this._kit = null;
  }
  public dispose(): void {
    this.controller?.destroyGesti();
    this._controller = null;
    this._kit = null;
    this.initialized = false;
  }

  static Family = ViewObjectFamily;

  /**
   * @description 安装预设插件
   * @param key
   * @param plugin
   */
  public static installPlugin(key: PluginKeys, plugin: any): void {
    Plugins.installPlugin(key, plugin);
  }
}

export default Gesti;
