import { ViewObjectFamily } from "@/core/enums";
import {
  GestiController,
  InitializationOption,
  PluginKeys,
  XImage,
  GestiConfigOption,
} from "Gesti";

declare class Gesti {
  constructor(config?: GestiConfigOption);
  get controller(): GestiController;
  static Family: ViewObjectFamily;
  static XImage: XImage;
  /**
   * canvas必传，在h5端时paint可不传
   * 关于rect  width 和 height 对应的是canvas的高宽   而 x,y其实对应的是canvas在屏幕的位置，或者可以理解为偏移量
   * @param canvas
   * @param paint
   * @param rect
   * @deprecated
   */
  init(
    canvas: HTMLCanvasElement | null,
    paint?: CanvasRenderingContext2D | null,
    rect?: {
      x?: number;
      y?: number;
      width: number;
      height: number;
    }
  ): void;
  /**
   * @description 初始化Gesti
   * @param option 传入一个对象
   * 
   * ### 初始化Gesti
   * - 必须传入画布的高宽，即rect内的canvasWidth和canvasHeight
   * 
   * ```
   * InitializationOption {
      //画笔
      renderContext: CanvasRenderingContext2D | null;
      //画布矩形
      rect: {
        x?: number;
        y?: number;
        canvasWidth: number;
        canvasHeight: number;
      };
    }
   * ```
   */
  public initialization(option: InitializationOption): void;
  public static DPR: number;
  /**
   * @description 安装预设插件
   * @param key
   * @param plugin
   */
  public static installPlugin(key: PluginKeys, plugin: any);
}

