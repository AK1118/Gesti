/*
 * @Author: AK1118 
 * @Date: 2023-11-03 18:14:02 
 * @Last Modified by: AK1118
 * @Last Modified time: 2023-11-06 09:16:00
 */
import SizeButton from "./core/viewObject/buttons/sizeButton";
import { ButtonLocation, ViewObjectFamily } from "./core/enums";
import Gesti from "./core/lib/gesti";

import {
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
  createCloseButton,
  createMirrorButton,
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
  currentViewObject,
  doCancel,
  driveMove,
  driveUp,
  driveDown,
  driveWheel,
  doCancelEvent,
  doCancelAll,
  removeListener,
  onDestroy,
  onBeforeDestroy,
  doDestroyGesti,
  doCleanAll,
  exportAllWithWeChat,
  importAllWithWeChat,
  doPosition,
  useReaderH5,
  useReaderWeChat,
  useGetViewObjectById,
} from "./hooks/index";
import {
  parseUint8Array,
  uint8ArrayConvert,
  uint8ArrayToChunks,
  inToPx, mmToIn, ptToPx
} from "./utils/utils"
import Group from "./core/viewObject/group";
import ImageBox from "./core/viewObject/image";
import TextBox from "./core/viewObject/text/text";
import WriteViewObj from "./core/viewObject/write";
import XImage from "./core/lib/ximage";
import CloseButton from "./core/viewObject/buttons/closeButton";
import DragButton from "./core/viewObject/buttons/dragbutton";
import MirrorButton from "./core/viewObject/buttons/mirrorbutton";
import RotateButton from "./core/viewObject/buttons/rotateButton";
import LockButton from "./core/viewObject/buttons/lockbutton";
import UnLockButton from "./core/viewObject/buttons/delockButton";
import VerticalButton from "./core/viewObject/buttons/verticalButton";
import HorizonButton from "./core/viewObject/buttons/horizonButton";

//按钮
export {
  CloseButton,
  DragButton,
  MirrorButton,
  RotateButton,
  LockButton,
  UnLockButton,
  VerticalButton,
  HorizonButton,
  SizeButton,
  ButtonLocation,
};
export { ImageBox, XImage, TextBox, WriteViewObj };
//枚举
export { ViewObjectFamily };
//Hooks
export {
  createGesti /**创建Gesti实例 */,
  onSelected /*监听选中Hook */,
  useController /*获取Gesti控制器 */,
  onHover /*鼠标悬浮到可操作对象上方时 */,
  onLeave /**鼠标离开可操作对象时 */,
  onCancel /*取消选中时 */,
  onHide /*隐藏可操作对象时 */,
  onUpdate /*刷新画布时 */,
  onDestroy /*销毁实例回调 */,
  onBeforeDestroy /*销毁实例前回调 */,
  doDestroyGesti /*销毁实例 */,
  onLoad /**载入新的对象到画布内时 */,
  addVerticalLine /**新增预设垂直线到画布内 */,
  addHorizonLine /**新增预设水平线到画布内 */,
  addRect /**新增预设矩形到画布内 */,
  addCircle /**新增预设圆形到画布内 */,
  createTextBox /**创建文字对象 */,
  createXImage /**创建一个XImage对象 */,
  createImageBox /**创建一个ImageBox对象 */,
  useGraffitiRect /**使用涂鸦 矩形 */,
  useGraffitiCircle /**使用涂鸦 圆形*/,
  useGraffitiLine /**使用涂鸦 线 */,
  useGraffitiWrite /**使用涂鸦 书写 */,
  useCloseGraffiti /**关闭涂鸦输入 */,
  useTextHandler /**得到一个可操控文字对象控制器 */,
  loadToGesti /**加载某个可操作对象到画布内 */,
  importAll,
  exportAll,
  exportAllWithWeChat,
  importAllWithWeChat,
  createDragButton,
  createHorizonButton,
  createVerticalButton,
  createCloseButton,
  createRotateButton,
  createLockButton,
  createUnlockButton,
  createMirrorButton,
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
  doCancelEvent,
  doCancelAll,
  useReader,
  currentViewObject,
  doCancel,
  doCleanAll,
  driveMove,
  driveUp,
  driveDown,
  driveWheel,
  removeListener,
  inToPx,
  mmToIn,
  ptToPx,
  doPosition,
  useReaderWeChat,
  useReaderH5,
  useGetViewObjectById,
  parseUint8Array,
  uint8ArrayConvert,
  uint8ArrayToChunks,
};
export default Gesti;
