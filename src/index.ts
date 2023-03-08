import Gesti from "./gesti";
import GestiController from "./interfaces/gesticontroller";

export default Gesti;

const canvas: HTMLCanvasElement = document.querySelector("canvas");
const gesti = new Gesti();
const img: HTMLImageElement = document.querySelector("#dog");
gesti.init(canvas);
gesti.addImage(gesti.createImage(img,{
    scale:.5,
}))
gesti.addImage(gesti.createImage(img,{
    scale:.5,
    width:90,
    height:90,
}))
gesti.addImage(gesti.createImage(img,{
    scale:.5,
    width:100,
    height:10,
}))
const controller:GestiController=gesti.controller;


window.addEventListener('touchstart',(e)=>{
    controller.down(e);
})
window.addEventListener('touchmove',(e)=>{
    controller.move(e);
})
window.addEventListener('touchend',(e)=>{
    controller.up(e);
})

window.addEventListener('mousedown',(e)=>{
    controller.down(e);
})
window.addEventListener('mousemove',(e)=>{
    controller.move(e);
})
window.addEventListener('mouseup',(e)=>{
    controller.up(e);
})
window.addEventListener('wheel',(e)=>{
    controller.wheel(e);
})
