import ImageBox from "../core/viewObject/image";
import TextBox from "../core/viewObject/text";
import XImage from "../core/lib/ximage";

function createTextBoxView(text: string, options?: TextOptions): TextBox {
  const textBox = new TextBox(text, options);
  new TextBox(text, options);
  return textBox;
}

function createImageBoxView(ximage: XImage): ImageBox {
  const imageBox = new ImageBox(ximage);
  return imageBox;
}

function createXImageFun(args:XImageOptions){
    const xImage=new XImage(args);
    return xImage;
}



export { createTextBoxView,createImageBoxView,createXImageFun};
