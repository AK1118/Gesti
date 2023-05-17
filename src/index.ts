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
  
} from "./hooks/index";
import ImageBox from "./viewObject/image";
import TextBox from "./viewObject/text";
import XImage from "./ximage";
// module.exports={
//     CloseButton,
//   DragButton,
//   MirrorButton,
//   RotateButton,
//   LockButton,
//   UnLockButton,
//   VerticalButton,
//   HorizonButton,
// }
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
export { ImageBox, XImage, TextBox };
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
};
export default Gesti;



// const canvas: HTMLCanvasElement = document.querySelector("canvas");
// const gesti = createGesti({
//   dashedLine: true,
// });
// const img: HTMLImageElement = document.querySelector("#dog");
// canvas.width = 550;
// canvas.height = 750;
// gesti.init(canvas);
// // gesti.addImage(gesti.createImage(img,{
// //     scale:.1,
// // }))

// const controller = useController();
// // controller.addImage(controller.createImage(img,{
// //     scale:.5,
// //     width:90,
// //     height:90,
// // }))
// onLoad((res) => {
//   doUpdate();
// });
// const ximage = createXImage({
//   data: img,
//   width: img.width,
//   height: img.height,
//   scale:.2
// });
// const imageBox = createImageBox(ximage);
// doCenter(imageBox, "horizon");
// loadToGesti(imageBox);

// const textBox = createTextBox(
//   "可视化结果以Json的形式存在，用户可以编辑Json实现特殊化操作，如：数据formatter，文本变色,单元格改变背景等。具体请参考文档。",
//   {
//     fontSize: 10,
//   }
// );

// const horizonButton = createHorizonButton(textBox);
// const verticalButton = createVerticalButton(textBox);
// const lockButton = createLockButton(textBox);
// const rotateButton = createRotateButton(textBox);
// const unLuckButon = createUnlockButton(textBox);
// installButton(textBox, [
//   horizonButton,
//   verticalButton,
//   lockButton,
//   unLuckButon,
// ]);

// const handler = useTextHandler(textBox);
// handler(textBox.value, { fontSize: 20 });
// loadToGesti(textBox);
// console.log(doSelect(textBox));
// setTimeout(()=>{
//   doCancel();
// },3000)
// addHorizonLine().then((res) => {
//   installButton(res, [horizonButton, rotateButton]);
//   loadToGesti(res);
// });

// onLoad((view)=>{
//   console.log("选中")
// });
// useGraffitiWrite();
// // controller.addImage(controller.createImage(img))
// // controller.addImage(
// //     controller.createImage(img)
// // )
// // window.addEventListener('touchstart',(e)=>{
// //     controller.down(e);
// // })
// // window.addEventListener('touchmove',(e)=>{
// //     controller.move(e);
// // })
// // window.addEventListener('touchend',(e)=>{
// //     controller.up(e);
// // })

// // window.addEventListener('mousedown',(e)=>{
// //     controller.down(e);
// // })
// // window.addEventListener('mousemove',(e)=>{
// //     controller.move(e);
// // })
// // window.addEventListener('mouseup',(e)=>{
// //     controller.up(e);
// // })
// // window.addEventListener('wheel',(e)=>{
// //     controller.wheel(e);
// // })

// // controller.addText("原价￥99.0",{
// //     spacing:0,
// //     fontFamily:'隶书',
// //     color:"rgba(0,0,0,.1)",
// // });
// // window.onkeydown=(e)=>{
// //   if(e.keyCode==90)controller.fallback();
// //   if(e.keyCode==88)controller.cancelFallback();
// // }
// // controller.addText("周树泉女士/先生:", {
// //   fontSize: 16,
// //   color: "#000000",
// //   linesMarks: [1, 4],
// // });
// let selected = null;
// let s = 20;
// const head = `[{"viewObjType":"text","options":{"text":"入职通知书","options":{"fontSize":26,"color":"#000000","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":289,"y":89,"width":132,"height":26,"angle":0},"relativeRect":{"x":0,"y":0,"width":132,"height":26,"angle":0},"mirror":false}},{"viewObjType":"text","options":{"text":"广东常青藤综合门诊有限公司","options":{"fontSize":26,"color":"#79a65e","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":340,"y":38,"width":338,"height":26,"angle":0},"relativeRect":{"x":0,"y":0,"width":338,"height":26,"angle":0},"mirror":false}},{"viewObjType":"text","options":{"text":"IVY 常青藤","options":{"fontSize":24,"color":"#52876c","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":107,"y":37,"width":116,"height":24,"angle":0},"relativeRect":{"x":0,"y":0,"width":116,"height":24,"angle":0},"mirror":false}},{"viewObjType":"write","options":{"config":{"type":"line","color":"black","lineWidth":3,"scaleX":0.9687781883574076,"scaleY":1},"points":[{"x":-237.92856070678022,"y":0},{"x":237.92856070678022,"y":0}],"rect":{"x":279.5,"y":57,"width":461,"height":30,"angle":0},"relativeRect":{"x":0,"y":0,"width":461,"height":30,"angle":0},"mirror":false}},{"viewObjType":"write","options":{"config":{"type":"line","color":"black","lineWidth":3,"scaleX":1,"scaleY":1},"points":[{"x":0,"y":0},{"x":0,"y":0}],"rect":{"x":230.5,"y":751,"width":0,"height":30,"angle":0},"relativeRect":{"x":0,"y":0,"width":0,"height":30,"angle":0},"mirror":false}}]`;
// const input: HTMLInputElement = document.querySelector("#input");
// input.addEventListener("input", () => {
//   const text: string = input.value;
//   controller.updateText(text);
// });
// document.querySelector("#import").addEventListener("click", (e) => {
//   const json = localStorage.getItem("gesti");
//   controller.importAll(json).then((v) => {
//     console.log("导入完成");
//   });
// });
// // const json = localStorage.getItem("gesti");
// //   controller.importAll(json).then((v) => {
// //     console.log("导入完成");
// //   });
// document.querySelector("#export").addEventListener("click", (e) => {
//   controller.exportAll().then((v) => {
//     console.log(v);
//     localStorage.setItem("gesti", v);
//   });
// });
// document.querySelector("#file").addEventListener("change", (a) => {
//   const input = a.target as HTMLInputElement;
//   const file = input.files[0];
//   controller.addImage(controller.createImage(file));
// });
// // document.querySelector("#addSize").addEventListener("click",async (a) => {
// //   controller.updateText("ddddddddddddddd" + s, {
// //     fontSize: s++,
// //     color: "rgba(0,0,0,." + s + ")",
// //   });
// // });
// // controller.addListener("onSelect", (obj) => {
// //   selected = obj;
// //   console.log(obj.family==Gesti.Family.image)
// // });

// let i = 0;
// window.addEventListener("keydown", (e) => {
//   const key = e.keyCode;
//   switch (key) {
//     case 38:
//       controller.upward();
//       break;
//     case 40:
//       controller.downward();
//       break;
//     case 37:
//       controller.leftward();
//       break;
//     case 39:
//       controller.rightward();
//       break;
//   }
//   controller.rotate((i++ * Math.PI) / 180);
//   controller.update();
// });