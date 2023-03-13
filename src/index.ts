import Gesti from "./gesti";
import GestiController from "./interfaces/gesticontroller";
import Recorder from "./recorder";
import { Debounce, Throttle } from "./utils";

export default Gesti;

const canvas: HTMLCanvasElement = document.querySelector("canvas");
const gesti = new Gesti();
const img: HTMLImageElement = document.querySelector("#dog");
gesti.init(canvas);
gesti.addImage(gesti.createImage(img,{
    scale:.1,
}))
// gesti.addImage(gesti.createImage(img,{
//     scale:.5,
//     width:90,
//     height:90,
// }))
// gesti.addImage(gesti.createImage(img,{
//     scale:.5,
//     width:100,
//     height:30,
// }))
const controller:GestiController=gesti.controller;

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
const debounce=Debounce((arg)=>{console.log("卧槽",arg)},1000);
const throttle=Throttle((arg)=>{console.log("卧槽",arg)},1000);

// document.querySelector("#save").addEventListener("click",(e)=>{
//     //controller.lock();
//    // throttle(new Date());
//    controller.fallback();
// })
window.onkeydown=(e)=>{
    // console.log(e.keyCode);
  if(e.keyCode==90)controller.fallback();
  if(e.keyCode==88)controller.cancelFallback();
}