import ImageBox from "../viewObject/image";
import TextBox from "../viewObject/text";
import XImage from "../ximage";

function createTextBoxView(text: string, options?: textOptions): TextBox {
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
