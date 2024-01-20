import { Button, GestiController, ImageChunk, TextBox, TextOptions, ViewObject, XImage, GestiConfigOption } from "./gesti";
import Gesti from "./index";

declare module "GestiHooks" {
  export const createGesti: (config?: GestiConfigOption) => Gesti;
  /**
   * Hook 分发
   */
  const onSelected: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onHover: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onLeave: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onCancel: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onHide: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onUpdate: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const onLoad: (
    hook: (_args: any) => any,
    target?: Gesti,
    prepend?: boolean
  ) => any;
  const removeListener: (
    type: GestiControllerListenerTypes,
    hook: (_args: any) => any,
    target?: Gesti
  ) => void;
  const useController: (target?: Gesti) => GestiController;
  /**
   * 添加预设图形
   */
  const addVerticalLine: (target?: Gesti) => Promise<ViewObject>;
  const addHorizonLine: (target?: Gesti) => Promise<ViewObject>;
  const addRect: (target?: Gesti) => Promise<ViewObject>;
  const addCircle: (target?: Gesti) => Promise<ViewObject>;
  /**
   * 创建可操作对象
   */
  const createTextBox: (text: string, options?: TextOptions) => TextBox;
  const createImageBox: (xImage: XImage) => XImage;
  /**
   * @description 踩踩踩
   * @param option
   * @returns
   */
  const createXImage: (option: {
    data:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | Blob
      | ImageData
      | ImageBitmap
      | OffscreenCanvas;
    originData?: any;
    width: number;
    height: number;
    scale?: number;
    maxScale?: number;
    minScale?: number;
  }) => XImage;
  /**
   * @description 使用文字控制Hook
   * @param textBox
   * @param target
   * @returns
   */
  const useTextHandler: (
    textBox: TextBox,
    target?: Gesti
  ) => (text: string, options?: TextOptions) => void | Promise<never>;
  /**
   * @description 将可操作对象载入到画布内
   * @param view
   * @param target
   * @returns
   */
  const loadToGesti: (view: ViewObject, target?: Gesti) => void;
  const useGraffitiRect: (
    option?: {
      lineWidth?: number;
      color?: string;
      isFill?: boolean;
    },
    target?: Gesti
  ) => void;
  const useGraffitiCircle: (
    option?: {
      lineWidth?: number;
      color?: string;
      isFill?: boolean;
    },
    target?: Gesti
  ) => void;
  const useGraffitiLine: (
    option?: {
      lineWidth?: number;
      color?: string;
      isFill?: boolean;
    },
    target?: Gesti
  ) => void;
  const useGraffitiWrite: (
    option?: {
      lineWidth?: number;
      color?: string;
      isFill?: boolean;
    },
    target?: Gesti
  ) => void;
  const useCloseGraffiti: (
    option?: {
      lineWidth?: number;
      color?: string;
      isFill?: boolean;
    },
    target?: Gesti
  ) => void;
  /**
   * @description 导入json到画布内,该json数据格式必须由 exportAll Hook导出
   * @param json
   * @param target
   * @returns
   */
  const importAll: (json: string, target?: Gesti) => Promise<void>;
  /**
   * @description 导出可操作对象为json，不建议导出图片
   * @param target
   * @returns
   */
  const exportAll: (target?: Gesti) => Promise<string>;
  const createDragButton: (view: ViewObject) => Button;
  const createHorizonButton: (view: ViewObject) => Button;
  const createRotateButton: (view: ViewObject) => Button;
  const createLockButton: (view: ViewObject) => Button;
  const createUnlockButton: (view: ViewObject) => Button;
  const createCloseButton: (view: ViewObject) => Button;
  const createVerticalButton: (view: ViewObject) => Button;
  const createMirrorButton: (view: ViewObject) => Button;
  /**
   * @description 给某个可操作对象安装按钮
   * @param view
   * @param button
   */
  const installButton: (
    view: ViewObject,
    button: Button | Array<Button>
  ) => void;
  const unInstallButton: (
    view: ViewObject,
    button: Button | Array<Button>
  ) => void;
  const doSelect: (view?: ViewObject, target?: Gesti) => void;
  const doLayerLower: (view?: ViewObject, target?: Gesti) => void;
  const doLayerBottom: (view?: ViewObject, target?: Gesti) => void;
  const doLayerTop: (view?: ViewObject, target?: Gesti) => void;
  const doLayerRise: (view?: ViewObject, target?: Gesti) => void;
  const doLock: (view?: ViewObject, target?: Gesti) => void;
  const doUnLock: (view?: ViewObject, target?: Gesti) => void;
  const doUpward: (view?: ViewObject, target?: Gesti) => void;
  const doDownward: (view?: ViewObject, target?: Gesti) => void;
  const doLeftward: (view?: ViewObject, target?: Gesti) => void;
  const doRightward: (view?: ViewObject, target?: Gesti) => void;
  const doCancel: (view?: ViewObject, target?: Gesti) => void;
  const doUpdate: (view?: ViewObject, target?: Gesti) => void;
  const doCancelAll: (view?: ViewObject, target?: Gesti) => void;
  const doCancelEvent: (view?: ViewObject, target?: Gesti) => void;
  const doCenter: (
    view?: ViewObject,
    axis?: CenterAxis,
    target?: Gesti
  ) => void;
  const doRotate: (
    angle: number,
    existing?: boolean,
    view?: ViewObject,
    target?: Gesti
  ) => void;
  const currentViewObject: (target?: Gesti) => ViewObject;
  const useReader: (json: string) => Promise<ViewObject>;
  const driveMove: (
    e: MouseEvent | Event | EventHandle,
    target?: Gesti
  ) => void;
  const driveDown: (
    e: MouseEvent | Event | EventHandle,
    target?: Gesti
  ) => void;
  const driveUp: (e: MouseEvent | Event | EventHandle, target?: Gesti) => void;
  const driveWheel: (
    e: MouseEvent | Event | EventHandle,
    target?: Gesti
  ) => void;

  /**
   * @description 毫米转换为英寸
   */
  const mmToIn: (mm: number) => number;

  /**
   * @description 英寸转换为像素
   */
  const inToPx: (inch: number) => number;

  /**
   * @description 榜转换为像素
   */
  const ptToPx: (pt: number) => number;

  /**
   * @description 将Uint8Array数组分割成小切片(压缩后的)
   */
  const uint8ArrayToChunks: (
    uint8Array: Uint8Array,
    width: number,
    height: number,
    chunkSize: number
  ) => ImageChunk[];
}
