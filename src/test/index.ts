import { ImageIcon, LockIcon } from "@/composite/icons";
import ViewObject from "@/core/abstract/view-object";
import LineGradientDecoration from "@/core/lib/graphics/gradients/lineGradientDecoration";
import Painter from "@/core/lib/painter";
import Alignment from "@/core/lib/painting/alignment";
import Plugins from "@/core/lib/plugins";
import OffScreenCanvasGenerator from "@/core/lib/plugins/offScreenCanvasGenerator";
import { RenderViewElement } from "@/core/lib/rendering/element";
import { Row } from "@/core/lib/rendering/flex";
import { Container, RenderViewWidget } from "@/core/lib/rendering/widget";
import DragButton from "@/core/viewObject/buttons/dragbutton";
import RotateButton from "@/core/viewObject/buttons/rotateButton";
import SizeButton from "@/core/viewObject/buttons/sizeButton";
import Circle from "@/core/viewObject/graphics/circle";
import Rectangle from "@/core/viewObject/graphics/rectangle";
import Group from "@/core/viewObject/group";
import TextArea from "@/core/viewObject/text/text-area";
import WriteRect from "@/core/viewObject/write/rect";
import {
  createGesti,
  importAll,
  exportAll,
  doCenter,
  loadToGesti,
} from "@/hooks/index";
import Gesti, {
  CloseButton,
  HorizonButton,
  ImageBox,
  LockButton,
  MirrorButton,
  TextBox,
  UnLockButton,
  VerticalButton,
  XImage,
} from "@/index";

// Gesti.installPlugin("pako", require("pako"));

const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const offScreenCanvas: HTMLCanvasElement =
  document.querySelector("#offScreenCanvas");
const img2: HTMLImageElement = document.querySelector("#bg");
canvas.width = Math.min(window.innerWidth, 500);
canvas.height = 500;
offScreenCanvas.width = 10000;
offScreenCanvas.height = 500;

const g = canvas.getContext("2d", {
  willReadFrequently: true,
});

Gesti.installPlugin(
  "offScreenBuilder",
  new OffScreenCanvasGenerator({
    offScreenCanvasBuilder: (width, height) => {
      const a = new OffscreenCanvas(width, height);
      return a;
    },
    offScreenContextBuilder: (offScreenCanvas) => {
      return offScreenCanvas.getContext("2d");
    },
    paintBuilder: () => {
      return new Painter(g);
    },
  })
);

// (Plugins.getPluginByKey("offScreenBuilder") as OffScreenCanvasGenerator).buildPaintContext().fillRect(0,0,100,100);
/**
 * Widget -> createElement -> element.mount -> createRenderObject
 */
// const container = new Container({
//   width: 100,
//   height: 100,
//   color: "red",
//   child: new Row({
//     children: [
//       new Container({
//         width: 10,
//         height: 10,
//         color: "orange",
//       }),
//     ],
//   }),
// });

// const renderView = new RenderViewWidget(container);
// renderView.mount();
// renderView.mount();

// console.log(renderView.findChildRenderObject().performLayout());
// renderView.firstPerformLayout();
// console.log(renderView);
// const offScreenPainter = offScreenCanvas.getContext("2d");
const gesti = createGesti({
  dashedLine: false,
  auxiliary: false,
});
console.log(canvas.width, canvas.height);
gesti.initialization({
  renderContext: g,
  rect: {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  },
});
// gesti.debug=true;
const controller = gesti.controller;
const img: HTMLImageElement = document.querySelector("#dog");

const ximage = new XImage({
  data: img2,
  width: img2.width,
  height: img2.height,
  scale: 0.5,
  url: img2.src,
});

for (let i = 0; i < 1; i++) {
  const imageBox = new ImageBox(ximage);
  imageBox.installMultipleButtons([
    new HorizonButton("right"),
    new VerticalButton("top"),
    new DragButton(),
    new CloseButton(),
  ]);
  doCenter(imageBox);
  loadToGesti(imageBox);
}
const str = `你好，这是一篇英语短文1234567890 😄 ⚪ Redux
 maintainer Mark Erikson appeared on the "Learn with Jason" show
 to explain how we recommend using Redux today. The show includes
  a live-coded example app that shows how to use Redux Toolkit and
  React-Redux hooks with TypeScript, as well as the new RTK Query data
   fetching APIs.你好，这是一篇英语短文1234567890 😄 ⚪ Redux maintainer
   Mark Erikson appeared on the "Learn with Jason" show to explain how we
   recommend using Redux today. The show includes a live-coded example
   app that shows how to use Redux Toolkit and React-Redux hooks with
   TypeScript, as well as the new RTK Query data fetching APIs.`;
const str1 = `你好你好，
这是一篇英语短文12
34567890`;
const textBox2 = new TextBox(str, {
  color: "red",
  fontSize: 10,
  // backgroundColor:'white',
  maxWidth: 300,
  weight: 100,
});
const textBox = new TextBox(str1, {
  color: "red",
  weight: 900,
  fontSize: 10,
  // backgroundColor:'white',
  maxWidth: 300,
  fontStyle: "italic",
  fontFamily: "楷体",
});

// loadToGesti(textBox2);
//loadToGesti(textBox);

// const group: Group = new Group();

// textBox2.setPosition(0, 0);
// doCenter(textBox2);
// doCenter(imageBox);
// textBox2.toBackground();
// controller.layerBottom(textBox2);
// controller.layerLower(textBox);
// group.add(imageBox);
// group.add(textBox2);
const rect: Rectangle = new Rectangle({
  width: canvas.width,
  height: canvas.height,
  decoration: {
    backgroundColor: "skyblue",
    // gradient: new LineGradientDecoration({
    //   colors: ["white", "black", "red"],
    //   begin: Alignment.topLeft,
    //   end: Alignment.bottomRight,
    // }),
  },
  // borderDecoration:{
  //   borderWidth:10,
  //   gradient:new LineGradientDecoration(
  //     {
  //       colors:["white",'black','red'],
  //       begin:Alignment.bottomLeft,
  //       end:Alignment.centerRight,
  //     }
  //   )
  // }
});
const circle = new Circle({
  radius: 10,
  decoration: {
    backgroundColor: "skyblue",
    // gradient: new LineGradientDecoration({
    //   colors: ["white", "black", "red"],
    //   begin: Alignment.topLeft,
    //   end: Alignment.bottomRight,
    // }),
  },
});

//loadToGesti(circle);
doCenter(circle);

console.log(rect);
doCenter(rect);
const drag = new DragButton({
  buttonOption: {
    alignment: Alignment.bottomRight,
  },
});
rect.installButton(drag);
// const align: Alignment = Alignment.bottomCenter.copyWithOffset({
//   offsetX: 0,
//   offsetY: 30,
// });
// rect.installButton(
//   new RotateButton({
//     alignment: align,
//   })
// );
rect.installMultipleButtons([
  new HorizonButton("left"),
  new VerticalButton("top"),
]);
console.log(drag);
//loadToGesti(rect);

// const [close, onAddition] = controller.addWrite({
//   type: "write",
// });
// close();
// onAddition((textBox2) => {
//   console.log(textBox2.installButton);
//   textBox2.installButton(new HorizonButton("left"));
//   textBox2.installButton(new HorizonButton("right"));
//   textBox2.installButton(new VerticalButton());
//   textBox2.installButton(new VerticalButton("bottom"));
//   textBox2.installButton(new SizeButton(Alignment.topLeft));
//   textBox2.installButton(
//     new MirrorButton({
//       location: Alignment.topLeft,
//     })
//   );
// });
// // setTimeout(()=>{
// //   closer();
// // },3000);
// // loadToGesti(group);
// textBox2.installButton(new HorizonButton("left"));
// textBox2.installButton(new HorizonButton("right"));
// textBox2.installButton(new VerticalButton());
// textBox2.installButton(new VerticalButton("bottom"));
// textBox2.installButton(new SizeButton(Alignment.topLeft));
// textBox2.installButton(
//   new MirrorButton({
//     location: Alignment.topLeft,
//   })
// );
// textBox2.installButton(
//   new LockButton({
//     location: Alignment.topRight,
//   })
// );
// imageBox.installButton(new DragButton());
// imageBox.installButton(new RotateButton());

// (document.querySelector("#input") as any).value = textBox2.value;
// (document.querySelector("#input") as HTMLElement).oninput = (e: any) => {
//   const value = e.target.value;
//   controller.updateText(value);
// };

// document.getElementById("import").addEventListener("click", () => {
//   console.log("导入");
//   const a = window.localStorage.getItem("aa");
//   importAll(a).then((e) => {
//     console.log("导入成功");
//   });
// });

// document.getElementById("export").addEventListener("click", () => {
//   console.log("导出");
//   exportAll(offScreenPainter).then((json) => {
//     window.localStorage.setItem("aa", json);
//     console.log("导出成功");
//   });
// });
