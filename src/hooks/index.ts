import Button from "../abstract/button";
import ViewObject from "../abstract/view-object";
import { DragButton, RotateButton } from "../buttons";
import UnLockButton from "../buttons/delockButton";
import HorizonButton from "../buttons/horizonButton";
import LockButton from "../buttons/lockbutton";
import VerticalButton from "../buttons/verticalButton";
import { gesticonfig } from "../config/gestiConfig";
import Gesti from "../gesti";
import GestiReader from "../reader/reader";
import Vertex from "../vertex";
import TextBox from "../viewObject/text";
import Widgets from "../widgets";
import XImage from "../ximage";
import {
  createImageBoxView,
  createTextBoxView,
  createXImageFun,
} from "./create";

let currentInstance: Gesti = null;

const error = (msg: string) => {
  console.error(msg);
};
const warn = (msg: string) => {
  console.warn(msg);
};

const getCurrentInstance = () => currentInstance;
const setCurrentInstance = (instance: Gesti) => {
  currentInstance = instance;
};
const getCurrentController = () => useController();
const createGesti = (config?: gesticonfig) => {
  const gesti: Gesti = new Gesti(config);
  setCurrentInstance(gesti);
  return currentInstance;
};

function injectHook(
  type: GestiControllerListenerTypes,
  hook: (_args: any) => {},
  target: Gesti = currentInstance,
  prepend: boolean = false
) {
  if (!target) return error("Target is empty");
  setCurrentInstance(target);
  const controller = getCurrentController();
  controller.addListener(type, hook, prepend);
}

/**
 * @description 创建Hooks
 * @param type
 * @returns
 */
const createHook =
  (type: GestiControllerListenerTypes) =>
  (
    hook: (_args: any) => any,
    target: Gesti = currentInstance,
    prepend: boolean = false
  ) => {
    return injectHook(type, (...args) => hook(...args), target, prepend);
  };

/**
 * Hook 分发
 */
const onSelected = createHook("onSelect");
const onHover = createHook("onHover");
const onLeave = createHook("onLeave");
const onCancel = createHook("onCancel");
const onHide = createHook("onHide");
const onUpdate = createHook("onUpdate");
const onLoad = createHook("onLoad"); //载入一个可操作对象完毕

const useController = (target: Gesti = currentInstance) => {
  if (!target) return null;
  return currentInstance.controller;
};

/**
 * @description 预设对象加载,本质上调用importAll
 * @param type
 * @returns
 */
function createPresets(
  type: "rect" | "circle" | "verticalLine" | "horizonLine"
) {
  return (target: Gesti = currentInstance): Promise<ViewObject> => {
    if (!target) {
      error("Target is empty");
      return Promise.reject("Target is empty");
    }
    setCurrentInstance(target);
    const controller = getCurrentController();
    const map = {
      rect: Widgets.rect,
      circle: Widgets.circle,
      verticalLine: Widgets.verticalLine,
      horizonLine: Widgets.horizonLine,
    };
    const shape: string = map[type];
    if (!shape) {
      warn("Preset object not found");
      return Promise.reject("Preset object not found");
    }
    return useReader(shape);
  };
}

/**
 * 添加预设图形
 */
const addVerticalLine = createPresets("verticalLine");
const addHorizonLine = createPresets("horizonLine");
const addRect = createPresets("rect");
const addCircle = createPresets("circle");

/**
 * 创建可操作对象
 */
const createTextBox = (text: string, options?: textOptions) =>
  createTextBoxView(text, options);
const createImageBox = (xImage: XImage) => createImageBoxView(xImage);
/**
 * @description 踩踩踩
 * @param option
 * @returns
 */
const createXImage = (option: {
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
}) => createXImageFun(option);

/**
 * @description 文字控制
 * @param text
 * @param textBox
 * @param options
 * @param target
 * @returns
 */
function textHandler(
  text: string,
  textBox: TextBox,
  options?: textOptions,
  target: Gesti = currentInstance
) {
  textBox.updateText(text, options);
  if (!target) {
    error("Target is empty");
    return Promise.reject("Target is empty");
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  controller.update();
}

/**
 * @description 使用文字控制Hook
 * @param textBox
 * @param target
 * @returns
 */
const useTextHandler =
  (textBox: TextBox, target: Gesti = currentInstance) =>
  (text: string, options?: textOptions) => {
    if (!textBox || textBox.family != Gesti.Family.text) {
      return error("Not a TextBox object");
    }
    return textHandler(text, textBox, options, currentInstance);
  };

/**
 * @description 将可操作对象载入到画布内
 * @param view
 * @param target
 * @returns
 */
const loadToGesti = (view: ViewObject, target: Gesti = currentInstance) => {
  if (!target) {
    error("Target is empty");
    return;
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  controller.load(view);
};

/**
 * @description 创建涂鸦hook
 * @param type
 * @returns
 */
const createGraffiti =
  (type: GraffitiType) =>
  (
    option?: { lineWidth?: number; color?: string; isFill?: boolean },
    target: Gesti = currentInstance
  ): void => {
    if (!target) {
      error("Target is empty");
      return;
    }
    setCurrentInstance(target);
    const controller = getCurrentController();
    controller.addWrite({ type: type, ...option });
  };

const useGraffitiRect = createGraffiti("rect");
const useGraffitiCircle = createGraffiti("circle");
const useGraffitiLine = createGraffiti("line");
const useGraffitiWrite = createGraffiti("write");
const useCloseGraffiti = createGraffiti("none");

/**
 * @description 导入json到画布内,该json数据格式必须由 exportAll Hook导出
 * @param json
 * @param target
 * @returns
 */
const importAll = (
  json: string,
  target: Gesti = currentInstance
): Promise<void> => {
  if (!target) {
    error("Target is empty");
    return Promise.reject("Target is empty");
  }
  if (!json) {
    warn("Json is empty");
    return Promise.reject("json is empty");
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  return controller.importAll(json);
};

/**
 * @description 导出可操作对象为json，不建议导出图片
 * @param target
 * @returns
 */
const exportAll = (target: Gesti = currentInstance): Promise<string> => {
  if (!target) {
    error("Target is empty");
    return Promise.reject("Target is empty");
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  return controller.exportAll();
};

const createDragButton = (view: ViewObject): Button => new DragButton(view);
const createHorizonButton = (view: ViewObject): Button =>
  new HorizonButton(view);
const createRotateButton = (view: ViewObject): Button => new RotateButton(view);
const createLockButton = (view: ViewObject): Button => new LockButton(view);
const createUnlockButton = (view: ViewObject): Button => new UnLockButton(view);
const createVerticalButton = (view: ViewObject): Button =>
  new VerticalButton(view);

/**
 * @description 给某个可操作对象安装按钮
 * @param view
 * @param button
 */
const installButton = (view: ViewObject, button: Button | Array<Button>) => {
  if (Array.isArray(button)) {
    button.forEach((item) => view.installButton(item));
  } else {
    view.installButton(button);
  }
};

const unInstallButton = (view: ViewObject, button: Button | Array<Button>) => {
  if (Array.isArray(button)) {
    view.unInstallButton(button);
  } else {
    view.unInstallButton([button]);
  }
};

/**Do Hook */
const doSomething =
  (
    type:
      | "select"
      | "layerLower"
      | "layerBottom"
      | "layerRise"
      | "layerTop"
      | "unLock"
      | "lock"
      | "upward"
      | "downward"
      | "leftward"
      | "rightward"
      | "rotate"
      | "update"
  ) =>
  (view?: ViewObject, target: Gesti = currentInstance) => {
    if (!target) {
      error("Target is empty");
      return;
    }
    setCurrentInstance(target);
    const controller = getCurrentController();
    switch (type) {
      case "select":
        controller.select(view);
        break;
      case "layerLower":
        controller.layerLower(view);
        break;
      case "layerBottom":
        controller.layerBottom(view);
        break;
      case "layerRise":
        controller.layerRise(view);
        break;
      case "layerTop":
        controller.layerTop(view);
        break;
      case "unLock":
        controller.unLock(view);
        break;
      case "lock":
        controller.lock(view);
        break;
      case "upward":
        controller.upward(view);
        break;
      case "downward":
        controller.downward(view);
        break;
      case "leftward":
        controller.leftward(view);
        break;
      case "rightward":
        controller.rightward(view);
        break;
      case "update":
        controller.update();
        break;
      default:
    }
  };

const doSelect = doSomething("select");
const doLayerLower = doSomething("layerLower");
const doLayerBottom = doSomething("layerBottom");
const doLayerTop = doSomething("layerTop");
const doLayerRise = doSomething("layerRise");
const doLock = doSomething("lock");
const doUnLock = doSomething("unLock");
const doUpward = doSomething("upward");
const doDownward = doSomething("downward");
const doLeftward = doSomething("leftward");
const doRightward = doSomething("rightward");
const doUpdate = doSomething("update");
const doCenter = (view?: ViewObject,axis?: CenterAxis, target: Gesti = currentInstance)=>{
  //不安全的做法
  target.controller.center(axis,view)
}
const doRotate = (
  angle: number,
  existing?: boolean,
  view?: ViewObject,
  target: Gesti = currentInstance
) => {
   //不安全的做法
  target.controller.rotate(angle, existing, view);
};

/**
 * 转换json成可读取对象
 * @param json
 * @returns
 */
const useReader = (json: string): Promise<ViewObject> => {
  const reader = new GestiReader();
  return reader.getObjectByJson(json);
};



export {
  createGesti /**创建Gesti实例 */,
  onSelected /*监听选中Hook */,
  useController /*获取Gesti控制器 */,
  onHover /*鼠标悬浮到可操作对象上方时 */,
  onLeave /**鼠标离开可操作对象时 */,
  onCancel /*取消选中时 */,
  onHide /*隐藏可操作对象时 */,
  onUpdate /*刷新画布时 */,
  onLoad /**载入新的对象到画布内时 */,
  addVerticalLine /**新增预设垂直线到画布内 */,
  addHorizonLine /**新增预设水平线到画布内 */,
  addRect /**新增预设矩形到画布内 */,
  addCircle /**新增预设圆形到画布内 */,
  useTextHandler /**得到一个可操控文字对象控制器 */,
  createTextBox /**创建文字对象 */,
  loadToGesti /**加载某个可操作对象到画布内 */,
  createXImage /**创建一个XImage对象 */,
  createImageBox /**创建一个ImageBox对象 */,
  useGraffitiRect /**使用涂鸦 矩形 */,
  useGraffitiCircle /**使用涂鸦 圆形*/,
  useGraffitiLine /**使用涂鸦 线 */,
  useGraffitiWrite /**使用涂鸦 书写 */,
  useCloseGraffiti /**关闭涂鸦输入 */,
  importAll,
  exportAll,
  createDragButton,
  createHorizonButton,
  createVerticalButton,
  createRotateButton,
  createLockButton,
  createUnlockButton,
  installButton /**安装按钮*/,
  unInstallButton /**卸载按钮 */,
  doSelect,
  doRotate,
  doLayerLower,
  doLayerBottom,
  doLayerTop,
  doLayerRise,
  doLock,
  doUnLock,
  doUpward,
  doDownward,
  doLeftward,
  doRightward,
  doCenter,
  doUpdate,
  useReader,
};
