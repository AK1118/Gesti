import { ButtonLocation } from "@/core/enums";
import Painter from "@/core/lib/painter";
import DragButton from "@/core/viewObject/buttons/dragbutton";
import RotateButton from "@/core/viewObject/buttons/rotateButton";
import SizeButton from "@/core/viewObject/buttons/sizeButton";
import Group from "@/core/viewObject/group";
import TextArea from "@/core/viewObject/text/text-area";
import { createGesti, createImageBox, createTextBox, createXImage, doCenter, exportAll, importAll, loadToGesti } from "@/hooks/index";
import { HorizonButton, MirrorButton, TextBox, VerticalButton } from "@/index";

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
console.log(imageBox.size);
// const drawButton = new DragButton({
//   angleDisabled:false,
// });
doCenter(imageBox)
// const unLockButton = new UnLockButton(imageBox);
// imageBox.installButton(drawButton);
// imageBox.installButton(new SizeButton(ButtonLocation.LT));
// imageBox.installButton(new RotateButton());
// loadToGesti(imageBox)
// doUpdate();
 //Manipulator
const textBox = createTextBox("新建文本", {
  resetFontSizeWithRect: true,
});
const str=`你好，这是一篇英语短文1234567890 😄 ⚪ Redux maintainer Mark Erikson appeared on the "Learn with Jason" show to explain how we recommend using Redux today. The show includes a live-coded example app that shows how to use Redux Toolkit and React-Redux hooks with TypeScript, as well as the new RTK Query data fetching APIs.你好，这是一篇英语短文1234567890 😄 ⚪ Redux maintainer Mark Erikson appeared on the "Learn with Jason" show to explain how we recommend using Redux today. The show includes a live-coded example app that shows how to use Redux Toolkit and React-Redux hooks with TypeScript, as well as the new RTK Query data fetching APIs.`
const str1=`你好你好，
这是一篇英语短文12
34567890`;
const textBox2 = new TextBox(str1, {
  resetFontSizeWithRect: false,
  fontSize:10,
  spacing:0,
  lineHeight:1,
  color:"skyblue",
  underLine:true,
  backgroundColor:"white",

});

const group: Group = new Group();
// loadToGesti(group);

// man.installButton(new DragButton());
loadToGesti(textBox2)
doCenter(textBox2)
//loadToGesti(imageBox)
 //group.add(imageBox);
// group.add(textBox2);
// textBox2.installButton(new SizeButton(ButtonLocation.LT));
// textBox2.installButton(new SizeButton(ButtonLocation.LB));

// textBox2.installButton(new SizeButton(ButtonLocation.RT));
// textBox2.installButton(new SizeButton(ButtonLocation.BC));
// textBox2.installButton(new SizeButton(ButtonLocation.RC));
// textBox2.installButton(new SizeButton(ButtonLocation.RB));
// textBox2.installButton(new SizeButton(ButtonLocation.TC));
// textBox2.installButton(new SizeButton(ButtonLocation.LC));
// textBox2.installButton(new HorizonButton());
// textBox2.installButton(new VerticalButton());
textBox2.installButton(new MirrorButton(
  ButtonLocation.RT
));
// textBox2.installButton(new DragButton());
//loadToGesti(group)


// setInterval(()=>{
//   textBox2.setText(textBox2.value+(+new Date()));
// },1000)
// const man=new Manipulator<Group>(group);
// loadToGesti(man)
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