import ViewObject, { toJSONInterface } from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../image-toolkit";
import Painter from "../painter";
import Rect from "../rect";
import { TextHandler } from "../types/index";
import { sp } from "../utils";
import Vector from "../vector";

interface TextSingle {
  text: string;
  texts?: Array<TextSingle>;
  width: number;
  height: number;
}
interface FixedOption {
  fontSize: number;
}
/**
 * 普通模式，矩形根据文字而定
 * 拖拽模式，文字根据缩放倍数而定
 */
abstract class TextBoxBase extends ViewObject {
  protected fixedText: string;
  protected textOptions: TextOptions = {
    fontSize: 20,
    color: "black",
    spacing: 0,
    lineHeight: 1,
    bold: false,
  };
  protected paint: Painter;
  protected texts: Array<TextSingle> = [];
  protected maxWidth: number = 300;
  private rowsCount: number = 1;
  private readonly fixedOption: FixedOption = {
    fontSize: 20,
  };
  updateText(text: string, options?: TextOptions): Promise<void> {
    return Promise.resolve();
  }
  private getTextSingle = (text: string): TextSingle => {
    const measureText = this.paint.measureText(text);
    //行高
    const lineHeight: number = this.textOptions.lineHeight || 1;
    const textSingle: TextSingle = {
      text,
      width: measureText.width,
      height: this.textOptions.fontSize * lineHeight,
    };
    return textSingle;
  };
  private getFont(): string {
    const bold = this.textOptions.bold ? "bold" : "";
    const italic =this.textOptions.italic?"italic":"";
    return `${bold} ${italic} ${this.textOptions.fontSize}px ${this.textOptions.fontFamily}`;
  }
  /**
   * @description 计算文字大小
   * @returns
   */
  protected computeTextSingle(
    isInitialization: boolean = false
  ): Array<TextSingle> {
    //设置字体大小
    this.paint.font = this.getFont();
    //This viewObject rect size
    const size: Size = { width: 0, height: 0 };
    const splitTexts: Array<string> = this.handleSplitText(this.fixedText);
    const getTextSingles = (texts: Array<string>): Array<TextSingle> => {
      return texts.map((text) => {
        const textSingle = this.getTextSingle(text);
        size.height = Math.max(textSingle.height, size.height);
        size.width += textSingle.width;
        size.width = Math.min(this.maxWidth, size.width);
        if (text.length != 1) textSingle.texts = getTextSingles(text.split(""));
        return textSingle;
      }) as unknown as Array<TextSingle>;
    };
    this.texts = getTextSingles(splitTexts);
    if (isInitialization) {
      this.updateRectSize(size);
      this.setFixedOption();
    }
    this.computeDrawPoint(this.texts, true);
    return this.texts;
  }
  private handleSplitText(text: string): Array<string> {
    const result = [];
    const regex =
      /[\s]+|[\u4e00-\u9fa5]|[A-Za-z]+|\d|[.,\/#!$%\^&\*;:{}=\-_`~()]|[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]/g;
    let match: Array<string> = [];
    while ((match = regex.exec(text)) !== null) {
      result.push(match[0]);
    }
    return result;
  }
  /**
   * 渲染坐标来自上次计算
   * 计算由width+spacing得出，换行由x得出，但是x在换行之下
   * 1.(如果是字符串多个)优先计算text+width宽度
   * @param texts
   * @returns
   */
  private computeDrawPoint(
    texts: Array<TextSingle>,
    isInitialization: boolean = false
  ): Array<Vector | null | Array<Vector>> {
    const points: Array<Vector | null | Array<Vector>> = [];
    let startX: number = this.size.width * -0.5;
    let x = startX; // 初始 x 位置
    let y = 0;
    /**
     * maxWordWidth 最长单词宽度
     */
    let maxWordWidth: number = 0;
    const spacing =
      this.textOptions.spacing *
      (this.textOptions.fontSize / this.fixedOption.fontSize);
    //Rect宽度，用户检测文字是否超出
    const checkRectSizeWidth: number = this.size.width * 0.5;
    //单个文字或者多个文字的宽度
    const getTextWidth = (texts: Array<TextSingle> | TextSingle): number => {
      let width: number = 0;
      if (Array.isArray(texts)) {
        texts.forEach((_) => {
          width += _.width + spacing;
        });
        width -= spacing;
      } else width = texts.width;
      return width;
    };
    /**是否是换行符 */
    const isEnter = (textData: Array<TextSingle> | TextSingle): boolean => {
      if (Array.isArray(textData)) {
        for (let i = 0; i < textData.length; i++) {
          if (/\n/.test(textData[i].text)) return true;
        }
        return false;
      }
      return /\n/.test(textData.text);
    };

    this.rowsCount = 1;
    texts.forEach((textData, ndx) => {
      const handleSorting = () => {
        x = startX; // 换行后 x 重置
        y += textData.height;
        this.rowsCount += 1;
      };
      /**预先获取宽度，判断是否超出rect宽度*/
      let width: number = getTextWidth(textData.texts || textData);
      maxWordWidth = Math.max(width, maxWordWidth);
      // 如果文本宽度超出矩形宽度，需要换行。换行符不需要另外换行，有特殊处理
      if (x + width > checkRectSizeWidth && !isEnter(textData)) {
        handleSorting();
      } else if (/\n/.test(textData.text)) {
        //换行符
        handleSorting();
        return points.push(null);
      }
      //空格不会出现在文本最前方
      if (x === startX && textData.text === " ") return points.push(null);
      const drawX = x; // 将文本绘制在字符中心
      const drawY = y;
      if (textData?.texts) {
        const childPoint: Array<Vector> = [];
        let _x = x;
        textData.texts.forEach((_) => {
          childPoint.push(new Vector(_x, drawY));
          _x += _.width + spacing;
        });
        points.push(childPoint);
        x = _x; // 更新 x 位置
      } else {
        points.push(new Vector(drawX, drawY));
        x += textData.width + spacing; // 更新 x 位置
      }
    });
    y += this.textOptions.fontSize * this.textOptions.lineHeight;
    if (isInitialization) {
      this.updateRectSize({
        width: Math.max(this.size.width, maxWordWidth),
        height: y,
      });
    }
    return points;
  }

  protected renderText(paint: Painter): void {
    if (this.texts.length === 0) return;
    const color: string = this.textOptions.color;
    const backgroundColor: string = this.textOptions.backgroundColor;
    const points = this.computeDrawPoint(this.texts);
    paint.beginPath();
    if (backgroundColor) {
      paint.fillStyle = backgroundColor;
      paint.fillRect(
        this.size.width * -0.5,
        this.size.height * -0.5,
        this.size.width,
        this.size.height
      );
    }
    paint.fillStyle = color;
    paint.textBaseLine = "middle";
    this.texts.forEach((textData, ndx) => {
      const point = points[ndx];
      if (!point) return;
      const offsetY = this.size.height * -0.5 + textData.height * 0.5;
      const text = textData.text;

      if (!Array.isArray(point))
        paint.fillText(text, point.x, point.y + offsetY);
      else {
        textData.texts.forEach((_, _ndx) => {
          const p = point[_ndx];
          paint.fillText(_.text, p.x, p.y + offsetY);
        });
      }
    });
    paint.closePath();
  }
  private updateRectSize(size: Size): void {
    this.setSize(size);
  }
  protected didChangeScale(scale: number): void {
    this.updateFontSizeByRectSizeHeight();
  }
  private updateFontSizeByRectSizeHeight(): void {
    const rectHeight: number = this.size.height;
    const lineHeight = this.textOptions.lineHeight;
    const columnHeight = rectHeight / this.rowsCount;
    const newFontSize: number = columnHeight / lineHeight;
    this.textOptions.fontSize = newFontSize;
    this.computeTextSingle();
  }
  protected setFixedOption() {
    this.fixedOption.fontSize = this.textOptions.fontSize;
  }
}

/**
 * 文字
 */
class TextBox extends TextBoxBase implements TextHandler {
  constructor(text: string, option?: TextOptions) {
    super();
    this.fixedText = text;
    Object.assign(this.textOptions, option);
  }
  setText(text: string): void {
    this.fixedText = text;
    this.rebuild();
  }
  setFontFamily(family: string): void {
    this.textOptions.fontFamily = family;
    this.rebuild();
  }
  setSpacing(value: number): void {
    this.textOptions.spacing = value;
    this.rebuild();
  }
  setColor(color: string): void {
    this.textOptions.color = color;
    this.rebuild();
  }
  public ready(kit: ImageToolkit): void {
    this.paint = kit.getPainter();
    this.computeTextSingle(true);
  }
  readonly family: ViewObjectFamily = ViewObjectFamily.text;
  get value(): any {
    return this.fixedText;
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    this.renderText(paint);
  }

  export(painter?: Painter): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<Object> {
    throw new Error("Method not implemented.");
  }
  setFontSize(fontSize: number): void {
    this.textOptions.fontSize = fontSize;
    this.rebuild();
  }
  private rebuild() {
    this.kit.update();
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
//       const isAutoColumn = rep.rowsCount(beforeText + text + nextText);
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
//       const isAutoColumn = rep.rowsCount(beforeText + text + nextText);
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
