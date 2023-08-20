import ViewObject from "./abstract/view-object";
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
} from "./hooks/index";
import Painter from "./painter";
import GestiReader from "./reader/reader";
import { ImageChunk } from "./types/index";
import { inToPx, mmToIn, ptToPx } from "./utils";
import Cutter from "./utils/cutter";
import ImageChunkConverter from "./utils/image-chunk-converter";
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
  driveMove,
  driveUp,
  driveDown,
  driveWheel,
  removeListener,
  inToPx,
  mmToIn,
  ptToPx,
};
export default Gesti;


const canvas: HTMLCanvasElement = document.querySelector("canvas");

const img: HTMLImageElement = document.querySelector("#dog");
canvas.width = 1080;
canvas.height = 2244;
const g = canvas.getContext("2d");
const painter: Painter = new Painter(g);
const gesti = createGesti({
  dashedLine: true,
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
installButton(imageBox, [
  lockButton,
  unLockButton,
  createDragButton(imageBox),
]);
doCenter(null, imageBox);
 loadToGesti(imageBox);


doUpdate();



const reader: GestiReader = new GestiReader();


const cutter = new Cutter();
const coverter = new ImageChunkConverter();

// exportAll().then(str=>{
//   console.log(str);
//  importAll(str)
// })



imageBox.export().then((e:any)=>{
   const json=JSON.stringify(e);
  console.log(json)
  // const c:ImageData=cutter.merge(ximage.fixedWidth,ximage.fixedHeight,e.options.options.data);
  // console.log(c.data)
  // painter.putImageData(c,0,0)
  reader.getObjectByJson(json).then((view:ImageBox)=>{
    console.log("得到",view.getXImage().data)
     loadToGesti(view);
      
  });
});
// const chunks = coverter.coverAllImageChunkToBase64(cutter.getChunks(100, ximage));
// console.log(chunks)
// const data: ImageData=cutter.merge(ximage.fixedWidth,ximage.fixedHeight,chunks);
// // console.log(data)
// painter.putImageData(data,0, 0);

// let i = 0;
// const t: ImageData = new ImageData(ximage.fixedWidth, ximage.fixedHeight, {
//   colorSpace: "srgb"
// })

// let ndx=0;
// chunks.forEach((item:ImageChunk)=>{
//     console.log(item);
//     item.imageData.data.forEach(item=>{
//         t.data[ndx++]=item;
//     })
//     // t.data.set([...item.imageData.data]);
//   });
//   painter.putImageData(t,0,0)
//   console.log("合并完成",t.data);
// setInterval(() => {
//   if (i >= chunks.length) return;
//   const chunk = chunks[i];
//   console.log(chunk.imageData.data)
//   painter.putImageData(chunk.imageData, chunk.x, chunk.y);
 
//   i += 1;
// }, 100);

// console.log(ximage.fixedWidth,ximage.fixedHeight)
// console.log(chunks)
// painter.clearRect(0,0,1000,1000)
// // chunks.forEach((item:ImageChunk)=>{
// //     console.log(item);
// //     painter.putImageData(item.imageData,item.x,400+item.y);
// //   });
// const coverterd=coverter.coverAllImageChunkToBase64(chunks);
// console.log(coverter.coverAllImageChunkBase64ToChunk((coverterd)));



// coverter.coverAllImageChunkBase64ToChunk((coverterd)).forEach((item:ImageChunk)=>{
//   painter.putImageData(item.imageData,item.x,100+item.y);
// });
