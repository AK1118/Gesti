import Button from "../abstract/button";
import ViewObject, { toJSONInterface } from "../abstract/view-object";
import canvasConfig from "../config/canvasConfig";
import GestiConfig from "../config/gestiConfig";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../image-toolkit";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";

type TextSingle = {
  text: string;
  width: number;
  height: number;
  color: string;
  index: number;
  backgroundColor: string;
};

abstract class TextBoxBase extends ViewObject {
  protected fixedText: string;
  protected fixedOption: TextOptions;
  protected paint: Painter;
  protected texts: Array<TextSingle> = [];
  protected maxWidth: number = 300;
  updateText(text: string, options?: TextOptions): Promise<void> {
    return Promise.resolve();
  }
  /**
   * @description 计算文字大小
   * @returns
   */
  computeTextSingle(): Array<TextSingle> {
    //设置字体大小
    this.paint.font = 10 + "px " + this.fixedOption.fontFamily;
    //This viewObject rect size
    const size: Size = { width: 0, height: 0 };
    const splitTexts: Array<string> = this.handleSplitText(this.fixedText); // this.fixedText.split(/([\s]|[A-Za-z]+|[\u4e00-\u9fa5]+)/).filter(Boolean);;
    this.texts = splitTexts.map((text, index) => {
      const measureText = this.paint.measureText(text);
      const textSingle: TextSingle = {
        text,
        index,
        width: measureText.width,
        height: measureText.fontBoundingBoxAscent,
        backgroundColor: "#ffffff",
        color: "red",
      };
      size.height = Math.max(textSingle.height, size.height);
      size.width += textSingle.width;
      size.width = Math.min(this.maxWidth, size.width);
      return textSingle;
    }) as unknown as Array<TextSingle>;
    this.updateRectSize(size);
    return this.texts;
  }
  private handleSplitText(text: string): Array<string> {
    const result = [];
    const regex = /[\s]+|[\u4e00-\u9fa5]|[A-Za-z]+/g;
    let match: Array<string> = [];
    while ((match = regex.exec(text)) !== null) {
      result.push(match[0]);
    }
    return result;
  }
  private computeDrawPoint(texts: Array<TextSingle>): Array<Vector> {
    const points: Array<Vector|null> = [];
    let startX: number = -this.size.width * 0.5;
    let x = startX; // 初始 x 位置
    let y = texts[0].height * 0.1; // 初始 y 位置
    let maxX = 0;
    texts.forEach((textData, ndx) => {
      // 如果文本宽度超出矩形宽度，需要换行。换行符不需要另外换行，有特殊处理
      if (
        x + textData.width > this.size.width * 0.5 &&
        !/\n/.test(textData.text)
      ) {
        x = startX; // 换行后 x 重置
        y += textData.height;
      } else if (/\n/.test(textData.text)) {
        //换行符
        x = startX; // 换行后 x 重置
        y += textData.height;
        return points.push(null);
      }
      //空格不会出现在文本最前方
      if (x === startX && textData.text === " ") return points.push(null);
      //渲染时Y轴偏移量
      const offsetY = 0;
      const drawX = x; // 将文本绘制在字符中心
      const drawY = y + offsetY; // y 位置根据行高设置
      points.push(new Vector(drawX,drawY));
      // paint.fillText(textData.text, drawX, drawY);
      x += textData.width; // 更新 x 位置
      maxX = Math.max(maxX, x);
      
    });
    const size: Size = this.computeViewObjectSize(
        this.size.width,
        y + this.texts[0].height
      );
    this.updateRectSize(size);
    return points;
  }
  protected drawText(paint: Painter): void {
    if (this.texts.length === 0) return;
    const points = this.computeDrawPoint(this.texts);
    paint.fillStyle = "#ccc";
    paint.fillRect(
      this.size.width * -0.5,
      this.size.height * -0.5,
      this.size.width,
      this.size.height
    );
    paint.fillStyle = "red";
    paint.textBaseLine = "middle";
    this.texts.forEach((textData, ndx) => {
      const point=points[ndx];
      if(!point)return;
      const offsetY =this.size.height * -0.5 + textData.height * 0.5
      const text = this.texts[ndx].text;
      paint.fillText(text, point.x, point.y+offsetY);
    });
  }
  private updateRectSize(size:Size):void{
    this.setSize(size);
  }
  //根据文字计算矩形大小
  private computeViewObjectSize(x: number, y: number): Size {
    return { width: x, height: y };
  }
}

/**
 * 文字
 */
class TextBox extends TextBoxBase {
  constructor(text: string, option?: TextOptions) {
    super();
    this.fixedText = text;
    this.fixedOption = option;
  }
  public ready(kit: ImageToolkit): void {
    this.paint = kit.getPainter();
    console.log(this.computeTextSingle());
  }
  family: ViewObjectFamily = ViewObjectFamily.text;
  get value(): any {
    throw new Error("Method not implemented.");
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    
    this.drawText(paint);
  }

  export(painter?: Painter): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
    throw new Error("Method not implemented.");
  }
}

export default TextBox;

// /**
//  * 文字
//  */
// class TextBox extends ViewObject {
//   family: ViewObjectFamily = ViewObjectFamily.text;
//   async export(): Promise<Object> {
//     const json: toJSONInterface = {
//       viewObjType: "text",
//       options: {
//         text: this._text,
//         options: {
//           fontSize: this.fontsize,
//           color: this._color,
//           spacing: this._spacing,
//           fontFamily: this._fontFamily,
//           // linesMarks: this.linesMarks,
//           line: this._line,
//           lineWidth: this.lineWidth,
//           lineColor: this.lineColor,
//           lineOffsetY: this.lineOffsetY,
//           lineHeight: this.lineHeight,

//           width: this.width,
//           height: this.height,
//         },
//         ...this.getBaseInfo(),
//       },
//     };
//     return json;
//   }
//   exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
//     return this.export();
//   }
//   public originFamily: ViewObjectFamily = ViewObjectFamily.text;
//   private _text: string = "";
//   private fontsize: number = 36;
//   private _painter: Painter;
//   private _fontFamily = "微软雅黑";
//   private _spacing: number = 0;
//   private _spacing_scale: number = 0;
//   private _line: boolean = false;
//   private _color: string = "black";
//   //划线从 奇数画到偶数，所以一般成对出现
//   private linesMarks: Array<number> = [];
//   //下划线宽度
//   private lineWidth: number = 1;
//   //文字间距高度
//   private lineHeight: number = 0;
//   //下划线在Y轴上的偏移量
//   private lineOffsetY: number = 0;
//   private lineColor: string = "black";
//   private _options: textOptions;
//   private lineOneHotMark: Array<number> = [];
//   //行？
//   private column: number = 0;
//   //初始化默认传入高度
//   private height: number = 0;
//   private width: number = 0;
//   //划线状态，1是从起点开始中 2是已经画完上一个线段了，等待下一次

//   private currentLineState: 1 | 2 | 3 | 4 | 0 | 5 = 0;
//   //随着选框的变化而改变字体大小
//   private resetFontSizeWithRect: boolean = false;
//   //字体大小最大值
//   private maxFontSize: number = 9999;

//   constructor(text: string, options?: textOptions) {
//     super();
//     this._painter = canvasConfig.globalPaint;
//     this._options = options;
//     this.initPrototypes(text, options);
//     this.initColumns();

//     //自定义操作
//     this.custom();
//   }

//   //@Override
//   public custom(): void {
//     //默认生成在画布中心
//     this.center(canvasConfig.rect.size);
//   }

//   //重写被选中后的样式
//   public drawSelected(paint: Painter): void {
//     const width = this.rect.size.width,
//       height = this.rect.size.height;
//     paint.fillStyle = GestiConfig.theme.textSelectedMaskBgColor;
//     paint.fillRect(-width >> 1, -height >> 1, width, height);
//     paint.fill();
//   }
//   private async initPrototypes(text: string, options: textOptions) {
//     this._text = text;
//     const {
//       fontFamily = this._fontFamily,
//       fontSize = this.fontsize,
//       spacing = this._spacing,
//       color = this._color,
//       lineWidth = this.lineWidth,
//       lineColor = this.lineColor,
//       lineOffsetY = this.lineOffsetY,
//       lineHeight = this.lineHeight,
//       line = this._line,
//       height,
//       width,
//       maxFontSize,
//       resetFontSizeWithRect,
//     } = options ?? {};

//     this._fontFamily = fontFamily||this._fontFamily;
//     this.fontsize = fontSize;
//     this._spacing = spacing;
//     this._color = color;
//     this._line = line;
//     this.lineWidth = lineWidth;
//     this.lineColor = lineColor;
//     this.lineOffsetY = lineOffsetY;
//     this.lineHeight = lineHeight;
//     this.width = width;
//     this.height = height;
//     this.resetFontSizeWithRect = resetFontSizeWithRect??this.resetFontSizeWithRect;
//     this.maxFontSize = maxFontSize ?? this.maxFontSize;
//     //限制字体大小
//     this.fontsize = Math.min(
//       this.maxFontSize === 9999 ? fontSize : this.maxFontSize,
//       fontSize
//     );
//     //计算出行距与字体大小的比例
//     this._spacing_scale = this.fontsize / this._spacing;
//     this._painter.font = this.fontsize + "px " + this._fontFamily;
//     if (this.rect == null)
//       this.rect = new Rect({
//         width: width ?? this.getWidthSize(),
//         height: height ?? this.fontsize,
//         x: 0,
//         y: 0,
//       });
//     this.init();
//   }
//   /**
//    * 获取文本长度
//    */
//   private getWidthSize(): number {
//     const metrics = this._painter.measureText(this._text);
//     if (!metrics)
//       return (
//         this.fontsize * this._text.length + this._spacing * this._text.length
//       );
//     return metrics.width + this._spacing * this._text.length;
//   }
//   //@Override
//   public drawImage(paint: Painter): void {
//     /**
//      * 只用这个宽就行了，因为初始化时已经做好宽度处理，放大缩小是等比例方法缩小。
//      */
//     const width: number = this.rect.size.width;
//     //渲染文本的高度，起始点
//     const height = (this.fontsize >> 1) + (this.lineHeight >> 1);
//     const textList: Array<string> = this._text.split("");
//     const len = textList.length;
//     //现在的宽度，渲染在currentWidth列
//     let currentWidth = 0;
//     this.column = 0;
//     let oldColumn = this.column;
//     paint.closePath();
//     paint.beginPath();
//     paint.textBaseLine = "bottom";
//     paint.fillStyle = this._color;
//     //设置字体大小与风格
//     paint.font = this.fontsize + "px " + this._fontFamily;
//     const text_len = textList.length;
//     for (let ndx = 0; ndx < text_len; ndx++) {
//       const text = textList[ndx];
//       const measureText = this._painter.measureText(text);
//       const text_width = ~~measureText.width;
//       const beforeText = this._text[ndx - 1];
//       const nextText = this._text[ndx + 1];
//       const spacing = this.fontsize / this._spacing_scale;
//       const x = text_width + spacing;
//       const rep = / &n/g;
//       const isAutoColumn = rep.test(beforeText + text + nextText);
//       /**
//        * 宽度不足一个字体，接下来要换行才行，还未换行
//        */
//       if (
//         width - currentWidth - x < text_width ||
//         (isAutoColumn && this.column == oldColumn)
//       ) {
//         //上一个为1,且马上要被替换的必须为0
//         if (
//           this.currentLineState == 1 &&
//           this.lineOneHotMark[ndx] == 0 &&
//           this.lineOneHotMark[ndx - 1] != 4
//         )
//           this.lineOneHotMark[ndx] = 4;
//       }

//       //字数达到宽度后需要换行   或者出发换行字符
//       if (currentWidth + x > width || isAutoColumn) {
//         this.column += 1;
//         currentWidth = 0;
//       }
//       const drawX = width * -0.5 + currentWidth;
//       const drawY =
//         (this.column == 0 ? height * 0 : height * (this.column * 2)) -
//         (this.rect.size.height >> 1);
//       if (!isAutoColumn) {
//         const offsetY = height + (this.fontsize >> 1) - this.fontsize * 0.1;
//         const offsetX = (x - text_width) >> 1;
//         if (this._line) {
//           paint.moveTo(drawX, drawY + offsetY + this.lineOffsetY);
//           paint.lineTo(
//             drawX + (text_width + this._spacing),
//             drawY + offsetY + this.lineOffsetY
//           );
//         }
//         paint.fillText(text, drawX + offsetX, drawY + offsetY);
//         currentWidth += x;
//       }
//       if (isAutoColumn) {
//         ndx += 1;
//         paint.stroke();
//         continue;
//       }
//     }
//     paint.strokeStyle = this.lineColor;
//     paint.lineWidth = this.lineWidth;
//     paint.stroke();
//     paint.closePath();
//     this.setData();
//   }

//   private initColumns() {
//     /**
//      * 只用这个宽就行了，因为初始化时已经做好宽度处理，放大缩小是等比例方法缩小。
//      */
//     const width: number = this.rect.size.width;
//     //渲染文本的高度，起始点
//     const height = (this.fontsize >> 1) + (this.lineHeight >> 1);
//     const textList: Array<string> = this._text.split("");
//     const len = textList.length;
//     //现在的宽度，渲染在currentWidth列
//     let currentWidth = 0;
//     this.column = 0;
//     //设置字体大小与风格
//     this._painter.font = this.fontsize + "px " + this._fontFamily;
//     const text_len = textList.length;
//     for (let ndx = 0; ndx < text_len; ndx++) {
//       const text = textList[ndx];
//       const measureText = this._painter.measureText(text);
//       const text_width = ~~measureText.width;
//       const beforeText = this._text[ndx - 1];
//       const nextText = this._text[ndx + 1];
//       const spacing = this.fontsize / this._spacing_scale;
//       const x = text_width + spacing;
//       const rep = / &n/g;
//       const isAutoColumn = rep.test(beforeText + text + nextText);
//       //字数达到宽度后需要换行   或者出发换行字符
//       if (currentWidth + x > width || isAutoColumn) {
//         this.column += 1;
//         currentWidth = 0;
//       }

//       if (!isAutoColumn) {
//         currentWidth += x;
//       }
//       if (isAutoColumn) {
//         ndx += 1;
//         continue;
//       }
//     }
//     this.setData();
//     this.update(this._painter);
//   }

//   // - (textWidth + this._spacing)
//   //@Override
//   public didChangeScale(scale: number): void {
//     this.setData();
//     this.update(this._painter);
//   }

//   //更新文字内容
//   public updateText(text: string, options?: textOptions): Promise<void> {
//     return new Promise((r, j) => {
//       this._text = text;
//       if (options){
//        if( this.resetFontSizeWithRect)options.resetFontSizeWithRect = true;
//       }
//       this.initPrototypes(text, options);
//       this.update(this._painter);
//       this.setData();
//       r();
//     });
//   }

//   public setDecoration(options: textOptions): void {
//     this.initPrototypes(this._text, options);
//     this.update(this._painter);
//     this.setData();
//   }
//   public didFallback(): void {
//     this.setData();
//   }
//   /**
//    * @description 宽不随文字变化，但文字随宽变化,高度随字体变化
//    */
//   private async setData() {
//     //随着选框的变化改变字体大小
//     if (this.resetFontSizeWithRect) {
//       this.fontsize = Math.min(this.rect.size.height, this.maxFontSize);
//     } else {
//       //静态文本大小，文字会被选框束缚
//       const padding = 10;
//       const { size } = this.rect;
//       let newHeight = (this.fontsize + this.lineHeight) * (this.column + 1);
//       // if (newHeight < size.height) {
//       //   newHeight = size.height;
//       // }
//       let newWidth = this.rect.size.width;
//       if (newWidth >= canvasConfig.rect.size.width)
//         newWidth = canvasConfig.rect.size.width;
//       this.rect.setSize(newWidth, newHeight);
//       this.resetButtons(["rotate"]);
//       if (size.width <= this.fontsize + this._spacing)
//         this.rect.setSize(this.fontsize + this._spacing, newHeight);
//     }

//     return Promise.resolve();
//   }
//   get value(): any {
//     return this._text;
//   }
//   get fontColor(): string {
//     return this._color;
//   }
//   get fontSize(): number {
//     return this.fontsize;
//   }
// }

// export default TextBox;
