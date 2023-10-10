import {
  CloseButton,
  DragButton,
  MirrorButton,
  RotateButton,
  LockButton,
  UnLockButton,
  VerticalButton,
  HorizonButton,
} from "./buttons";
import { ViewObjectFamily } from "./enums";
import Gesti from "./gesti";

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
  useGetViewObjectById
} from "./hooks/index";
import { inToPx, mmToIn, ptToPx } from "./utils";
import { parseUint8Array, uint8ArrayConvert } from "./utils/utils";
import Group from "./viewObject/group";
import ImageBox from "./viewObject/image";
import TextBox from "./viewObject/text";
import WriteViewObj from "./viewObject/write";
import XImage from "./ximage";

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
  onDestroy,/*销毁实例回调 */
  onBeforeDestroy,/*销毁实例前回调 */
  doDestroyGesti,/*销毁实例 */
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
};
export default Gesti;


const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const offScreenCanvas:HTMLCanvasElement=document.querySelector("#offScreenCanvas");
const img: HTMLImageElement = document.querySelector("#dog");
canvas.width = 500;
canvas.height = 500;
offScreenCanvas.width=10000;
offScreenCanvas.height=500;
const g = canvas.getContext("2d");
const offScreenPainter=offScreenCanvas.getContext("2d");
const gesti = createGesti({
  dashedLine: false,
  auxiliary:false,
});
gesti.init(canvas);

const controller = useController();

const ximage = createXImage({
  data: img,
  width: img.width,
  height: img.height,
  scale: 1,
});

const imageBox = createImageBox(ximage);
const lockButton = new LockButton(imageBox);
const unLockButton = new UnLockButton(imageBox);
imageBox.id="tup1";
controller.getViewObjectById("tup1")



const group:Group=new Group();
group.add(imageBox);
loadToGesti(imageBox);
loadToGesti(group);

doCenter(null,group);

installButton(group, [
  lockButton,
  unLockButton,
  createDragButton(imageBox),
]);
// imageBox.toBackground();
// imageBox.unBackground();
// doCenter(null, imageBox);
// // loadToGesti(imageBox);
  const textBox=createTextBox("新建文本",{
    resetFontSizeWithRect:true,
  });
//   textBox.installButton(createDragButton(textBox));
//   textBox.updateText(textBox.value,{
//     color:"red",
//     fontFamily:"隶书"
//   });
//   textBox.id="wenz";
  loadToGesti(textBox);
   group.add(textBox)
// doUpdate();



document.getElementById("import").addEventListener("click",()=>{
  console.log("导入")
  importAll(window.localStorage.getItem("aa")).then(e=>{
    console.log("导入成功")
  })
})

document.getElementById("export").addEventListener("click",()=>{
  console.log("导出")
  exportAll(offScreenPainter).then(json=>{
   window.localStorage.setItem("aa",json);
   console.log("导出成功");
  })
});

