import { ImageIcon, LockIcon } from "@/composite/icons";
import { ButtonLocation } from "@/core/enums";
import Painter from "@/core/lib/painter";
import DragButton from "@/core/viewObject/buttons/dragbutton";
import RotateButton from "@/core/viewObject/buttons/rotateButton";
import SizeButton from "@/core/viewObject/buttons/sizeButton";
import Group from "@/core/viewObject/group";
import TextArea from "@/core/viewObject/text/text-area";
import { createGesti, createImageBox, createTextBox, createXImage, doCenter, exportAll, importAll, loadToGesti } from "@/hooks/index";
import { CloseButton, HorizonButton, LockButton, MirrorButton, TextBox, UnLockButton, VerticalButton } from "@/index";
import DragIcon from "@/static/icons/dragIcon";
import ScaleIcon from "@/static/icons/scaleIcon";

const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const offScreenCanvas: HTMLCanvasElement =
  document.querySelector("#offScreenCanvas");
const img2: HTMLImageElement = document.querySelector("#bg");
canvas.width = 500;
canvas.height = 500;
offScreenCanvas.width = 10000;
offScreenCanvas.height = 500;
const g = canvas.getContext("2d"); 
const offScreenPainter = offScreenCanvas.getContext("2d");
const gesti = createGesti({
  dashedLine: false,
  auxiliary: false,
});
gesti.initialization({
  canvas,
  renderContext:g,
});
// gesti.debug=true;
const controller=gesti.controller;
const img: HTMLImageElement = document.querySelector("#dog");
const ximage = createXImage({
  data: img2,
  width: img2.width,
  height: img2.height,
  scale: .5,
});
const imageBox = createImageBox(ximage);
const str=`你好，这是一篇英语短文1234567890 😄 ⚪ Redux
 maintainer Mark Erikson appeared on the "Learn with Jason" show 
 to explain how we recommend using Redux today. The show includes
  a live-coded example app that shows how to use Redux Toolkit and 
  React-Redux hooks with TypeScript, as well as the new RTK Query data
   fetching APIs.你好，这是一篇英语短文1234567890 😄 ⚪ Redux maintainer 
   Mark Erikson appeared on the "Learn with Jason" show to explain how we 
   recommend using Redux today. The show includes a live-coded example 
   app that shows how to use Redux Toolkit and React-Redux hooks with 
   TypeScript, as well as the new RTK Query data fetching APIs.`
const str1=`你好你好，
这是一篇英语短文12
34567890`;
const textBox2 = new TextBox(str1, {
  color:"red",
  fontSize:10,
  backgroundColor:'white',
  maxWidth:300,
});
// loadToGesti(imageBox);
 loadToGesti(textBox2);
const group: Group = new Group();
// group.add(textBox2);
 group.add(imageBox);

// textBox2.setPosition(100,100);

loadToGesti(group);

group.installButton(new HorizonButton(ButtonLocation.RC));
group.installButton(new HorizonButton(ButtonLocation.LC));
group.installButton(new VerticalButton(ButtonLocation.BC));
group.installButton(new VerticalButton(ButtonLocation.TC));
group.installButton(new SizeButton(ButtonLocation.LT));
group.installButton(new DragButton());


(document.querySelector("#input") as any).value=textBox2.value;
(document.querySelector("#input") as HTMLElement).oninput=(e:any)=>{
  const value=e.target.value;
  textBox2.setText(value);
}

document.getElementById("import").addEventListener("click", () => {
  console.log("导入");
  const a = window.localStorage.getItem("aa");
  importAll(a).then((e) => {
    console.log("导入成功");
  });
});

document.getElementById("export").addEventListener("click", () => {
  console.log("导出");
  exportAll(offScreenPainter).then((json) => {
    window.localStorage.setItem("aa", json);
    console.log("导出成功");
  });
});