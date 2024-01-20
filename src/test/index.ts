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
// import Circle from "@/core/viewObject/graphics/circle";
import Rectangle, {
  InteractiveImage,
} from "@/core/viewObject/graphics/rectangle";
import Group from "@/core/viewObject/group";
import TextArea from "@/core/viewObject/text/text-area";
import WriteRect from "@/core/viewObject/write/rect";
import {
  createGesti,
  importAll,
  exportAll,
  doCenter,
  loadToGesti,
  useGraffitiWrite,
  doUpdate,
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
import ScreenUtils from "@/utils/screenUtils/ScreenUtils";

// Gesti.installPlugin("pako", require("pako"));

const canvas: HTMLCanvasElement = document.querySelector("#canvas");
const img2: HTMLImageElement = document.querySelector("#bg");
canvas.width = 300;
canvas.height = 300;

const g = canvas.getContext("2d", {
  willReadFrequently: true,
});

Gesti.installPlugin(
  "offScreenBuilder",
  new OffScreenCanvasGenerator({
    //离屏画布构造器
    offScreenCanvasBuilder: (width, height) => {
      const a = new OffscreenCanvas(width, height);
      return a;
    },
    //离屏画笔构造器
    offScreenContextBuilder: (offScreenCanvas) => {
      return offScreenCanvas.getContext("2d");
    },
    //图片构造器
    imageBuilder: (OffscreenCanvas: OffscreenCanvas, url: string) => {
      console.log("图片", url);
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      return img;
    },
  })
);

const gesti = createGesti({
  dashedLine: false,
  auxiliary: false,
});
Gesti.installPlugin("pako", require("pako"));
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
const screenUtil1 = controller.generateScreenUtils({
  canvasHeight: canvas.height,
  canvasWidth: canvas.width,
  designWidth: 750,
  designHeight: 750,
  // devicePixelRatio:2,
});
const img: HTMLImageElement = document.querySelector("#dog");
// controller.setScreenUtil();
const ximage = new XImage({
  data: img,
  width: img.width,
  height: img.height,
  scale: 1,
  url: img.src,
});

const imageBox = new ImageBox(ximage);

setTimeout(() => {
  const ximage2 = new XImage({
    data: img2,
    width: img2.width,
    height: img2.height,
    scale: 1,
    url: img2.src,
  });
  // imageBox.replaceXImage(ximage2);
  imageBox.setDecoration({
    // borderRadius: screenUtil1.setSp(10),
    gradient: new LineGradientDecoration({
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: ["red", "white", "yellow"],
    }),
  });
}, 3000);

doCenter(imageBox);
loadToGesti(imageBox);

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
  fontSize: screenUtil1.setSp(20),
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
textBox2.setDecoration({
  backgroundImage: ximage,
  gradient: new LineGradientDecoration({
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: ["orange", "white", "yellow"],
  }),
});
textBox2.setOpacity(0.1)
loadToGesti(textBox2);

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
const gradient = new LineGradientDecoration({
  colors: ["white", "black", "red"],
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
});
console.log("序列", JSON.stringify(gradient));

const rect: Rectangle = new Rectangle({
  width: screenUtil1.setWidth(300),
  height: screenUtil1.setWidth(300),
  decoration: {
    borderRadius: screenUtil1.setWidth(50),
    backgroundColor: "skyblue",
    gradient: gradient,
    backgroundImage: ximage,
  },
});
doCenter(rect, "horizon");
rect.setPosition(canvas.width / 2, rect.height / 2);
const drag = new DragButton({
  buttonOption: {
    alignment: Alignment.bottomRight,
  },
});
rect.installButton(drag);
rect.installMultipleButtons([
  new HorizonButton("left"),
  new VerticalButton("top"),
  new VerticalButton("bottom"),
  new HorizonButton("right"),
  new DragButton(),
  new CloseButton(),
  new SizeButton(Alignment.topLeft),
]);
loadToGesti(rect);

const aa = new InteractiveImage(ximage, {
  borderRadius: screenUtil1.setSp(90),
});
// loadToGesti(aa);
const canvas2: HTMLCanvasElement = document.querySelector("#canvas2");
const canvas3: HTMLCanvasElement = document.querySelector("#canvas3");
const g3 = canvas3.getContext("2d", {
  willReadFrequently: true,
});
const g2 = canvas2.getContext("2d", {
  willReadFrequently: true,
});

canvas2.width = 200;
canvas2.height = 200;
canvas3.width = 100;
canvas3.height = 100;
const gesti2 = createGesti();
const gesti3 = createGesti();
const screenUtil2 = new ScreenUtils({
  canvasHeight: canvas2.height,
  canvasWidth: canvas2.width,
});
const controller2 = gesti2.initialization({
  renderContext: g2,
  rect: {
    canvasWidth: canvas2.width,
    canvasHeight: canvas2.height,
  },
});
gesti3.initialization({
  renderContext: g3,
  rect: {
    canvasWidth: canvas3.width,
    canvasHeight: canvas3.height,
  },
});
// const offScreenBuilder =
// Plugins.getPluginByKey<OffScreenCanvasBuilder>("offScreenBuilder");
// const offScreenCanvas = offScreenBuilder.buildOffScreenCanvas(1000, 1000);
// const offPainter = offScreenBuilder.buildOffScreenContext(offScreenCanvas);
// controller2.cancelEvent();
document.getElementById("import").addEventListener("click", () => {
  console.log("导入");
  gesti2.controller.cleanAll();
  gesti3.controller.cleanAll();
  const a = window.localStorage.getItem("aa");
  importAll(
    a,
    async (arr) => {
      return new Promise((r) => {
        setTimeout(() => {
          r(arr);
        }, 100);
      });
    },
    gesti2
  ).then((e) => {
    console.log("导入成功");
  });
  // importAll(a,null, gesti3).then((e) => {
  //   console.log("导入成功");
  // });
});

document.getElementById("export").addEventListener("click", () => {
  console.log("导出");
  exportAll(gesti).then((json) => {
    console.log(json);
    window.localStorage.setItem("aa", json);
    console.log("导出成功");
  });
});

document.getElementById("input").addEventListener("input", (e: any) => {
  textBox2.setText(e.target?.value);
  console.log(e.target?.value);
});

// const box1 = new Rectangle({
//   width: screenUtil1.setWidth(300),
//   height: screenUtil1.setHeight(300),
//   decoration: {
//     backgroundColor: "skyblue",
//     borderRadius: screenUtil1.setSp(50),
//   },
// });
// box1.setId("box1");

// const box2 = new InteractiveImage(ximage, {
//   borderRadius: screenUtil1.setSp(50),
// });
// box2.setId("box2");

// loadToGesti(box1, gesti);
// loadToGesti(box2, gesti);

// const main = async () => {
//   const b1 = await controller2.getViewObjectById<Rectangle>("box1");
//   const b2 = await controller2.getViewObjectById<InteractiveImage>("box2");

//   b2.setSize(b1.size.copy());

//   b1.setPosition(100, 100);
//   b2.setPosition(100, 100);

//   doUpdate(null, gesti2);
// };
