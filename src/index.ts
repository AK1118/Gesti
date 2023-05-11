
import Gesti from "./gesti";
import {
  onSelected,
  createGesti  
} from "./hooks/index";

export default Gesti; 

const canvas: HTMLCanvasElement = document.querySelector("canvas");
const gesti = new Gesti({
    dashedLine:true
});
const img: HTMLImageElement = document.querySelector("#dog");
canvas.width = 550;
canvas.height = 750;
gesti.init(canvas);
// gesti.addImage(gesti.createImage(img,{
//     scale:.1,
// }))
const controller = gesti.controller;
controller.addImage(controller.createImage(img,{
    scale:.5,
    width:90,
    height:90,
}))

// controller.addImage(controller.createImage(img))
// controller.addImage(
//     controller.createImage(img)
// )
// window.addEventListener('touchstart',(e)=>{
//     controller.down(e);
// })
// window.addEventListener('touchmove',(e)=>{
//     controller.move(e);
// })
// window.addEventListener('touchend',(e)=>{
//     controller.up(e);
// })

// window.addEventListener('mousedown',(e)=>{
//     controller.down(e);
// })
// window.addEventListener('mousemove',(e)=>{
//     controller.move(e);
// })
// window.addEventListener('mouseup',(e)=>{
//     controller.up(e);
// })
// window.addEventListener('wheel',(e)=>{
//     controller.wheel(e);
// })

// controller.addText("原价￥99.0",{
//     spacing:0,
//     fontFamily:'隶书',
//     color:"rgba(0,0,0,.1)",
// });
// window.onkeydown=(e)=>{
//   if(e.keyCode==90)controller.fallback();
//   if(e.keyCode==88)controller.cancelFallback();
// }
// controller.addText("周树泉女士/先生:", {
//   fontSize: 16,
//   color: "#000000",
//   linesMarks: [1, 4],
// });
controller.addText("可视化结果以Json的形式存", {
  fontSize: 20,
  color: "#52876c",
  linesMarks:[1,2],
  height:100,
}).then(res=>{
  
});
controller.addWrite({
  type: "circle",
  color: "black",
  lineWidth:1
});
let selected = null;
let s = 20;
const head = `[{"viewObjType":"text","options":{"text":"入职通知书","options":{"fontSize":26,"color":"#000000","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":289,"y":89,"width":132,"height":26,"angle":0},"relativeRect":{"x":0,"y":0,"width":132,"height":26,"angle":0},"mirror":false}},{"viewObjType":"text","options":{"text":"广东常青藤综合门诊有限公司","options":{"fontSize":26,"color":"#79a65e","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":340,"y":38,"width":338,"height":26,"angle":0},"relativeRect":{"x":0,"y":0,"width":338,"height":26,"angle":0},"mirror":false}},{"viewObjType":"text","options":{"text":"IVY 常青藤","options":{"fontSize":24,"color":"#52876c","spacing":0,"fontFamily":"微软雅黑","linesMarks":[],"lineWidth":3,"lineColor":"black"},"rect":{"x":107,"y":37,"width":116,"height":24,"angle":0},"relativeRect":{"x":0,"y":0,"width":116,"height":24,"angle":0},"mirror":false}},{"viewObjType":"write","options":{"config":{"type":"line","color":"black","lineWidth":3,"scaleX":0.9687781883574076,"scaleY":1},"points":[{"x":-237.92856070678022,"y":0},{"x":237.92856070678022,"y":0}],"rect":{"x":279.5,"y":57,"width":461,"height":30,"angle":0},"relativeRect":{"x":0,"y":0,"width":461,"height":30,"angle":0},"mirror":false}},{"viewObjType":"write","options":{"config":{"type":"line","color":"black","lineWidth":3,"scaleX":1,"scaleY":1},"points":[{"x":0,"y":0},{"x":0,"y":0}],"rect":{"x":230.5,"y":751,"width":0,"height":30,"angle":0},"relativeRect":{"x":0,"y":0,"width":0,"height":30,"angle":0},"mirror":false}}]`;
const input: HTMLInputElement = document.querySelector("#input");
input.addEventListener("input", () => {
  const text: string = input.value;
  controller.updateText(text);
});
document.querySelector("#import").addEventListener("click", (e) => {
  const json = localStorage.getItem("gesti");
  controller.importAll(json).then((v) => {
    console.log("导入完成");
  });
});
// const json = localStorage.getItem("gesti");
//   controller.importAll(json).then((v) => {
//     console.log("导入完成");
//   });
document.querySelector("#export").addEventListener("click", (e) => {
  controller.exportAll().then((v) => {
    console.log(v);
    localStorage.setItem("gesti", v);
  });
});
document.querySelector("#file").addEventListener("change", (a) => {
  const input = a.target as HTMLInputElement;
  const file = input.files[0];
  controller.addImage(controller.createImage(file));
});
// document.querySelector("#addSize").addEventListener("click",async (a) => {
//   controller.updateText("ddddddddddddddd" + s, {
//     fontSize: s++,
//     color: "rgba(0,0,0,." + s + ")",
//   });
// });
controller.addListener("onSelect", (obj) => {
  selected = obj;
  console.log(obj.family==Gesti.Family.image)
});
controller.addListener("onCancel",(obj)=>{
  console.log("取消");
})
let i=0;
window.addEventListener("keydown", (e) => {
  const key = e.keyCode;
  switch (key) {
    case 38:
      controller.upward();
      break;
    case 40:
      controller.downward();
      break;
    case 37:
      controller.leftward();
      break;
    case 39:
      controller.rightward();
      break;
  }
  controller.rotate( i++ * Math.PI / 180);
  controller.update();
});
