import {
  Button,
  ImageChunk,
  TextBox,
  TextOptions,
  ViewObject,
  XImage,
  GestiConfigOption,
} from "./gesti";
import GestiController from "./controller";
import Gesti from "./index";

export const createGesti: (config?: GestiConfigOption) => Gesti;

export const onSelected: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onHover: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onLeave: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onCancel: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onHide: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onUpdate: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const onLoad: (
  hook: (_args: any) => any,
  target?: Gesti,
  prepend?: boolean
) => any;
export const removeListener: (
  type: GestiControllerListenerTypes,
  hook: (_args: any) => any,
  target?: Gesti
) => void;
export const useController: (target?: Gesti) => GestiController;
/**
 * 添加预设图形
 */
export const addVerticalLine: (target?: Gesti) => Promise<ViewObject>;
export const addHorizonLine: (target?: Gesti) => Promise<ViewObject>;
export const addRect: (target?: Gesti) => Promise<ViewObject>;
export const addCircle: (target?: Gesti) => Promise<ViewObject>;
/**
 * 创建可操作对象
 */
export const createTextBox: (text: string, options?: TextOptions) => TextBox;
export const createImageBox: (xImage: XImage) => XImage;
/**
 * @description 踩踩踩
 * @param option
 * @returns
 */
export const createXImage: (option: {
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
export const useTextHandler: (
  textBox: TextBox,
  target?: Gesti
) => (text: string, options?: TextOptions) => void | Promise<never>;
/**
 * @description 将可操作对象载入到画布内
 * @param view
 * @param target
 * @returns
 */
export const loadToGesti: (view: ViewObject, target?: Gesti) => void;
export const useGraffitiRect: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export const useGraffitiCircle: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export const useGraffitiLine: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export const useGraffitiWrite: (
  option?: {
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  },
  target?: Gesti
) => void;
export const useCloseGraffiti: (
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
export const importAll: (json: string, target?: Gesti) => Promise<void>;
/**
 * @description 导出可操作对象为json，不建议导出图片
 * @param target
 * @returns
 */
export const exportAll: (target?: Gesti) => Promise<string>;
export const createDragButton: (view: ViewObject) => Button;
export const createHorizonButton: (view: ViewObject) => Button;
export const createRotateButton: (view: ViewObject) => Button;
export const createLockButton: (view: ViewObject) => Button;
export const createUnlockButton: (view: ViewObject) => Button;
export const createCloseButton: (view: ViewObject) => Button;
export const createVerticalButton: (view: ViewObject) => Button;
export const createMirrorButton: (view: ViewObject) => Button;
/**
 * @description 给某个可操作对象安装按钮
 * @param view
 * @param button
 */
export const installButton: (
  view: ViewObject,
  button: Button | Array<Button>
) => void;
export const unInstallButton: (
  view: ViewObject,
  button: Button | Array<Button>
) => void;
export const doSelect: (view?: ViewObject, target?: Gesti) => void;
export const doLayerLower: (view?: ViewObject, target?: Gesti) => void;
export const doLayerBottom: (view?: ViewObject, target?: Gesti) => void;
export const doLayerTop: (view?: ViewObject, target?: Gesti) => void;
export const doLayerRise: (view?: ViewObject, target?: Gesti) => void;
export const doLock: (view?: ViewObject, target?: Gesti) => void;
export const doUnLock: (view?: ViewObject, target?: Gesti) => void;
export const doUpward: (view?: ViewObject, target?: Gesti) => void;
export const doDownward: (view?: ViewObject, target?: Gesti) => void;
export const doLeftward: (view?: ViewObject, target?: Gesti) => void;
export const doRightward: (view?: ViewObject, target?: Gesti) => void;
export const doCancel: (view?: ViewObject, target?: Gesti) => void;
export const doUpdate: (view?: ViewObject, target?: Gesti) => void;
export const doCancelAll: (view?: ViewObject, target?: Gesti) => void;
export const doCancelEvent: (view?: ViewObject, target?: Gesti) => void;
export const doCenter: (
  view?: ViewObject,
  axis?: CenterAxis,
  target?: Gesti
) => void;
export const doRotate: (
  angle: number,
  existing?: boolean,
  view?: ViewObject,
  target?: Gesti
) => void;
export const currentViewObject: (target?: Gesti) => ViewObject;
export const useReader: (json: string) => Promise<ViewObject>;
export const driveMove: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export const driveDown: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export const driveUp: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;
export const driveWheel: (
  e: MouseEvent | Event | EventHandle,
  target?: Gesti
) => void;

/**
 * @description 毫米转换为英寸
 */
export const mmToIn: (mm: number) => number;

/**
 * @description 英寸转换为像素
 */
export const inToPx: (inch: number) => number;

/**
 * @description 榜转换为像素
 */
export const ptToPx: (pt: number) => number;
