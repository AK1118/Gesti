import { GestiConfigOption } from "../config/gestiConfig";
import Gesti from "../core/lib/gesti";
import GestiReader from "../core/bases/deserializer-base";
import TextBox from "../core/viewObject/text/text";
import Widgets from "../static/widgets";
import XImage from "../core/lib/ximage";
import {
  createImageBoxView,
  createTextBoxView,
  createXImageFun,
} from "./create";
import DragButton from "../core/viewObject/buttons/dragbutton";
import CloseButton from "../core/viewObject/buttons/closeButton";
import RotateButton from "../core/viewObject/buttons/rotateButton";
import MirrorButton from "../core/viewObject/buttons/mirrorbutton";
import BaseButton from "../core/abstract/baseButton";
import ViewObject from "../core/abstract/view-object";
import UnLockButton from "../core/viewObject/buttons/delockButton";
import HorizonButton from "../core/viewObject/buttons/horizonButton";
import LockButton from "../core/viewObject/buttons/lockbutton";
import VerticalButton from "../core/viewObject/buttons/verticalButton";
import {
  GraffitiCloser,
  ImportAllInterceptor,
  TextOptions,
} from "@/types/gesti";
import { CenterAxis, GestiControllerListenerTypes, GraffitiType } from "@/types/controller";

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
const createGesti = (config?: GestiConfigOption) => {
  const gesti: Gesti = new Gesti(config);
  setCurrentInstance(gesti);
  return currentInstance;
};

function injectHook(
  type: GestiControllerListenerTypes,
  hook: (_args: any) => {},
  target: Gesti = currentInstance,
  prepend: boolean = false
): (_args: any) => void {
  if (!target) {
    error("Target is empty");
    return;
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  return controller.addListener(type, hook, prepend);
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
const onDestroy = createHook("onDestroy");
const onBeforeDestroy = createHook("onBeforeDestroy");

const removeListener = (
  type: GestiControllerListenerTypes,
  hook: (_args: any) => any,
  target: Gesti = currentInstance
) => {
  if (!target) return error("Target is empty");
  setCurrentInstance(target);
  const controller = getCurrentController();
  controller.removeListener(type, hook);
};

const useController = (target: Gesti = currentInstance) => {
  if (!target) return null;
  return currentInstance.controller;
};

/**
 * 创建可操作对象
 */
const createTextBox = (text: string, options?: TextOptions) =>
  createTextBoxView(text, options);
const createImageBox = (xImage: XImage) => createImageBoxView(xImage);
/**
 * @description 踩踩踩
 * @param option
 * @returns
 */
const createXImage = (option: createImageOptions) => createXImageFun(option);
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
  options?: TextOptions,
  target: Gesti = currentInstance
) {
  //textBox.updateText(text, options);
  textBox.setText(text);
  textBox.setDecoration(options);
  if (!target) {
    error("Target is empty");
    return Promise.reject("Target is empty");
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  controller.render();
}

/**
 * @description 使用文字控制Hook
 * @param textBox
 * @param target
 * @returns
 */
const useTextHandler =
  (textBox: TextBox, target: Gesti = currentInstance) =>
  (text: string, options?: TextOptions) => {
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
  ): GraffitiCloser => {
    if (!target) {
      error("Target is empty");
      return;
    }
    setCurrentInstance(target);
    const controller = getCurrentController();
    return controller.addWrite({ type: type, ...option });
  };

const useGraffitiRect = createGraffiti("rect");
const useGraffitiCircle = createGraffiti("circle");
const useGraffitiLine = createGraffiti("line");
const useGraffitiWrite = createGraffiti("write");
const useCloseGraffiti = createGraffiti("none");

/**
 * @description H5专用,导入json到画布内,该json数据格式必须由 exportAll Hook导出
 * @param json
 * @param target
 * @returns
 */
const importAll = (
  json: string,
  interceptor: ImportAllInterceptor,
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
  return controller.importAll(json, interceptor);
};
/**
 * @description 导入json到画布内,该json数据格式必须由 exportAll Hook导出
 * @param json
 * @param weChatCanvas 微信小程序离屏画布
 * @param target
 * @returns
 */
// const importAllWithWeChat = (
//   json: string,
//   weChatCanvas: any,
//   target: Gesti = currentInstance
// ): Promise<void> => {
//   if (!target) {
//     error("Target is empty");
//     return Promise.reject("Target is empty");
//   }
//   if (!json) {
//     warn("Json is empty");
//     return Promise.reject("json is empty");
//   }
//   setCurrentInstance(target);
//   const controller = getCurrentController();
//   return controller.importAllWithWeChat(json, weChatCanvas);
// };

/**
 * @description H5专用,导出可操作对象为json格式的 Array\<Object\>
 * 注意: 功能使用离屏渲染
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

/**
 * @description 微信小程序专用,导出可操作对象为json格式的 Array\<Object\>
 * 注意: 功能使用离屏渲染
 * @param target
 * @returns
 */
// const exportAllWithWeChat = (
//   offscreenPainter: CanvasRenderingContext2D,
//   target: Gesti = currentInstance
// ): Promise<string> => {
//   if (!target) {
//     error("Target is empty");
//     return Promise.reject("Target is empty");
//   }
//   setCurrentInstance(target);
//   const controller = getCurrentController();
//   return controller.exportAllWithWeChat(offscreenPainter);
// };

const createDragButton = (view: ViewObject): BaseButton => new DragButton();
const createHorizonButton = (view: ViewObject): BaseButton =>
  new HorizonButton();
const createRotateButton = (view: ViewObject): BaseButton => new RotateButton();
const createLockButton = (view: ViewObject): BaseButton => new LockButton();
const createUnlockButton = (view: ViewObject): BaseButton => new UnLockButton();
const createCloseButton = (view: ViewObject): BaseButton => new CloseButton();
const createVerticalButton = (view: ViewObject): BaseButton =>
  new VerticalButton();
const createMirrorButton = (view: ViewObject): BaseButton => new MirrorButton();
/**
 * @description 给某个可操作对象安装按钮
 * @param view
 * @param button
 */
const installButton = (
  view: ViewObject,
  button: BaseButton | Array<BaseButton>
) => {
  if (Array.isArray(button)) {
    button.forEach((item) => view.installButton(item));
  } else {
    view.installButton(button);
  }
};

const unInstallButton = (
  view: ViewObject,
  button: BaseButton | Array<BaseButton>
) => {
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
      | "cancel"
      | "cancelEvent"
      | "cancelAll"
      | "destroyGesti"
      | "cleanAll"
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
      case "cancel":
        controller.cancel(view);
        break;
      case "cancelEvent":
        controller.cancelEvent();
        break;
      case "cancelAll":
        controller.cancelAll();
        break;
      case "destroyGesti": {
        currentInstance.dispose();
        setCurrentInstance(null);
        break;
      }
      case "cleanAll":
        controller.cleanAll();
        break;
      default:
    }
    setTimeout(() => controller.render(), 10);
  };

//选中某个元素
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
//更新画布
const doUpdate = doSomething("update");
//取消选中某个元素
const doCancel = doSomething("cancel");
//取消选中所有被选中元素
const doCancelAll = doSomething("cancelAll");
/**
 * @description 取消Gesti原有提供的手势监听，
 * 注意：取消后你会失去所有的跟Gesti内元素交互的事件，需要自己实现手势监听
 * 详情在文档内查看 drive 系列
 */
const doCancelEvent = doSomething("cancelEvent");
//销毁Gesti对象
const doDestroyGesti = doSomething("destroyGesti");
//清空画布内所有元素
const doCleanAll = doSomething("cleanAll");
const doCenter = (
  view?: ViewObject,
  axis?: CenterAxis,
  target: Gesti = currentInstance
) => {
  //不安全的做法
  target.controller.center(view, axis);
};
//设置坐标位置
const doPosition = (
  x: number,
  y: number,
  view?: ViewObject,
  target: Gesti = currentInstance
) => {
  //不安全的做法
  target.controller.position(x, y, view);
};
/**
 * @description 旋转某个元素
 * @param angle
 * @param existing
 * @param view
 * @param target
 */
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
 * @description 获取当前选中对象
 * @param target
 * @returns
 */
const currentViewObject = (target: Gesti = currentInstance): ViewObject => {
  if (!target) {
    error("Target is empty");
    return;
  }
  setCurrentInstance(target);
  const controller = getCurrentController();
  if (!controller) error("Gesti not registered");
  return controller.currentViewObject;
};

/**
 * @description 获取节点
 * @param type
 * @returns
 */
const useGetViewObjectById = (target: Gesti = currentInstance) => {
  setCurrentInstance(target);
  const controller = getCurrentController();
  return controller.getViewObjectById;
};

const drive = (type: "move" | "up" | "down" | "wheel") => {
  return (
    e: MouseEvent | Event | EventHandle,
    target: Gesti = currentInstance
  ) => {
    setCurrentInstance(target);
    const controller = getCurrentController();
    if (!controller) error("Gesti not registered");
    if (type == "move") controller.move(e as any);
    else if (type == "down") controller.down(e as any);
    else if (type == "up") controller.up(e as any);
    else if (type == "wheel") controller.wheel(e as any);
  };
};
const driveMove = drive("move");
const driveUp = drive("up");
const driveDown = drive("down");
const driveWheel = drive("wheel");

export {
  createGesti /**创建Gesti实例 */,
  onSelected /*监听选中Hook */,
  useController /*获取Gesti控制器 */,
  onHover /*鼠标悬浮到可操作对象上方时 */,
  onLeave /**鼠标离开可操作对象时 */,
  onCancel /*取消选中时 */,
  onHide /*隐藏可操作对象时 */,
  onUpdate /*刷新画布时 */,
  onDestroy /*销毁Gesti实例后调用 */,
  onBeforeDestroy /*销毁Gesti实例前调用 */,
  onLoad /**载入新的对象到画布内时 */,
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
  // importAllWithWeChat,
  // exportAllWithWeChat,
  createDragButton,
  createHorizonButton,
  createVerticalButton,
  createRotateButton,
  createLockButton,
  createUnlockButton,
  createMirrorButton,
  createCloseButton,
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
  doPosition /*设置对象位置*/,
  doRightward,
  doCenter,
  doUpdate,
  doDestroyGesti,
  currentViewObject,
  doCancel,
  driveMove,
  driveUp,
  driveDown,
  driveWheel,
  doCancelEvent,
  doCancelAll,
  doCleanAll,
  removeListener,
  // useReaderWeChat,
  useGetViewObjectById /* 通过id获取对象 */,
};
