import ViewObject, { toJSONInterface } from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../lib/image-toolkit";
import Painter from "../lib/painter";
import Rect, { Size } from "../lib/rect";
import { TextHandler } from "../../types/index";
import Vector from "../lib/vector";
import { Point } from "../lib/vertex";

interface TextSingle {
  text: string;
  texts?: Array<TextSingle>;
  width: number;
  height: number;
}
interface FixedOption {
  fontSize: number;
  maxWidth: number;
}
/**
 * 普通模式，矩形根据文字而定
 * 拖拽模式，文字根据缩放倍数而定
 */
abstract class TextBoxBase extends ViewObject {
  protected fixedText: string;
  private readonly defaultLineColor: string = "black";
  private readonly defaultLineWidth: number = 2;
  protected textOptions: TextOptions = {
    fontSize: 20,
    color: "black",
    spacing: 10,
    lineHeight: 1.5,
    bold: false,
    italic: false,
    maxWidth: 300,
  };
  protected paint: Painter;
  protected texts: Array<TextSingle> = [];
  private rowsCount: number = 1;
  private readonly fixedOption: FixedOption = {
    fontSize: 20,
    maxWidth: 300,
  };
  private start: number;
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
    const italic = this.textOptions.italic ? "italic" : "";
    return `${bold} ${italic} ${this.textOptions.fontSize}px ${this.textOptions.fontFamily}`;
  }
  /**
   * @description 计算文字大小
   * @returns
   */
  protected computeTextSingle(
    isInitialization: boolean = false
  ): Array<TextSingle> {
    if (isInitialization) this.setFixedOption();
    this.start = performance.now();
    //设置字体大小
    this.paint.font = this.getFont();
    //This viewObject rect size
    const size: Size = Size.zero;
    const splitTexts: Array<string> = this.handleSplitText(this.fixedText);
    const getTextSingles = (texts: Array<string>): Array<TextSingle> => {
      return texts.map((text) => {
        const textSingle = this.getTextSingle(text);
        size.height = Math.max(textSingle.height, size.height);
        size.width += textSingle.width;
        size.width = Math.min(this.fixedOption.maxWidth, size.width);
        if (text.length != 1) textSingle.texts = getTextSingles(text.split(""));
        return textSingle;
      }) as unknown as Array<TextSingle>;
    };
    this.texts = getTextSingles(splitTexts);
    if (isInitialization) {
      this.updateRectSize(size);
    }
    this.computeDrawPoint(this.texts, true);

    return this.texts;
  }
  /**
   * @description 切割文本
   * @param text
   * @returns
   */
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
    const handleSorting = (textData: TextSingle) => {
      x = startX; // 换行后 x 重置
      y += textData.height;
      this.rowsCount += 1;
    };
    texts.forEach((textData, ndx) => {
      /**预先获取宽度，判断是否超出rect宽度*/
      let width: number = getTextWidth(textData.texts || textData);
      maxWordWidth = Math.max(width, maxWordWidth);
      // 如果文本宽度超出矩形宽度，需要换行。换行符不需要另外换行，有特殊处理
      if (x + width > checkRectSizeWidth && !isEnter(textData)) {
        handleSorting(textData);
      } else if (/\n/.test(textData.text)) {
        //换行符
        handleSorting(textData);
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
      this.updateRectSize(
        new Size(Math.max(this.size.width, maxWordWidth), y) //maxWordWidth 是某个文字最大宽度，比如一个单词最大宽度，防止矩形宽度小于单词宽度
      );
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
    const spacing =
      this.textOptions.spacing *
      (this.textOptions.fontSize / this.fixedOption.fontSize);

    const render = (point, textData: TextSingle) => {
      const offsetY =
        this.size.height * -0.5 +
        textData.height * 0.5 +
        this.textOptions.fontSize * 0.1;

      renderTexts(point, textData.text, offsetY);
      if (this.textOptions?.lineThrough) {
        renderLine(point, textData.width, offsetY);
      }
      if (this.textOptions?.underLine) {
        renderLine(point, textData.width, 0);
      }
      if (this.textOptions?.overLine) {
        const textHeight = textData.height;
        renderLine(point, textData.width, -textHeight);
      }
    };
    const renderLine = (point: Point, width: number, offsetY: number) => {
      this.paint.moveTo(point.x, point.y + offsetY);
      let lineX = point.x + width + spacing;
      if (lineX > this.size.width * 0.5) lineX -= spacing;
      this.paint.lineTo(lineX, point.y + offsetY);
    };
    const renderTexts = (point: Point, text: string, offsetY: number) => {
      paint.fillText(text, point.x, point.y + offsetY);
    };

    this.texts.forEach((textData, ndx) => {
      const point = points[ndx];
      if (!point) return;

      if (!Array.isArray(point)) {
        render(point, textData);
      } else {
        textData.texts.forEach((_, _ndx) => {
          const p = point[_ndx];
          render(p, _);
        });
      }
    });
    paint.strokeStyle = this.textOptions?.lineColor ?? this.defaultLineColor;
    if (paint.lineWidth !== this.textOptions?.lineWidth)
      paint.lineWidth = this.textOptions?.lineWidth ?? this.defaultLineWidth;
    paint.stroke();
    paint.closePath();
    const end = performance.now();
    // console.log(end-this.start);
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
    this.fixedOption.maxWidth = this.textOptions.maxWidth;
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
    this.kit.render();
  }
}

export default TextBox;