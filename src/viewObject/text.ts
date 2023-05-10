import ViewObject, { toJSONInterface } from "../abstract/view-object";
import Painter from "../painter";
import Rect from "../rect";
/**
 * 文字
 */
class TextBox extends ViewObject {
  async export(): Promise<Object> {
    const json: toJSONInterface = {
      viewObjType: "text",
      options: {
        text: this._text,
        options: {
          fontSize: this.fontsize,
          color: this._color,
          spacing: this._spacing,
          fontFamily: this._fontFamily,
          linesMarks: this.linesMarks,
          lineWidth: this.lineWidth,
          lineColor: this.lineColor,
          lineOffsetY: this.lineOffsetY,
        },
        ...this.getBaseInfo(),
      },
    };
    return json;
  }
  private _text: string = "";
  private fontsize: number = 36;
  private _painter: Painter;
  private _fontFamily = "微软雅黑";
  private _spacing: number = 0;
  private _spacing_scale: number = 0;
  private _color: string = "black";
  //划线从 奇数画到偶数，所以一般成对出现
  private linesMarks: Array<number> = [];
  //下划线宽度
  private lineWidth: number = 1;
  //下划线在Y轴上的偏移量
  private lineOffsetY: number = 0;
  private lineColor: string = "black";
  private _options: textOptions;
  private lineOneHotMark: Array<number> = [];
  //行？
  private column: number = 1;
  //划线状态，1是从起点开始中 2是已经画完上一个线段了，等待下一次
  private currentLineState: 1 | 2 | 3 | 4 | 0 | 5 = 0;
  constructor(text: string, painter: Painter, options?: textOptions) {
    super();
    this._painter = painter;
    this._options = options;
    this.initPrototypes(text, options);
  }

  private initPrototypes(text: string, options: textOptions) {
    this._text = text;
    const {
      fontFamily = this._fontFamily,
      fontSize = this.fontsize,
      spacing = this._spacing,
      color = this._color,
      linesMarks = this.linesMarks,
      lineWidth = this.lineWidth,
      lineColor = this.lineColor,
      lineOffsetY = this.lineOffsetY,
    } = options ?? {};
    this._fontFamily = fontFamily;
    this.fontsize = fontSize;
    this._spacing = spacing;
    this._color = color;
    this.linesMarks = linesMarks;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.lineOffsetY = lineOffsetY;
    //计算出行距与字体大小的比例
    this._spacing_scale = this.fontsize / this._spacing;
    this._painter.font = this.fontsize + "px " + this._fontFamily;
    if (this.rect == null)
      this.rect = new Rect({
        width: this.getWidthSize(),
        height: this.fontsize,
        x: this.rect?.position.x || 0,
        y: this.rect?.position.y || 0,
      });
    this.init();
    this.dragButton.setAxis("horizontal");
    this.initLine();
  }
  /**
   * 初始化划线
   */
  private initLine() {
    //初始化划线标记独热数组，用内存换运行速度
    this.lineOneHotMark = new Array(this._text.length).fill(0);
    for (let ndx = 0; ndx < this.lineOneHotMark.length; ndx++) {
      const markNdx = this.linesMarks.findIndex((mark) => mark == ndx);
      if (markNdx != -1) {
        this.lineOneHotMark[ndx] = (markNdx + 1) % 2 == 0 ? 2 : 1;
      }
    }
  }
  /**
   * 获取文本长度
   */
  private getWidthSize(): number {
    const metrics = this._painter.measureText(this._text);
    if (!metrics)
      return (
        this.fontsize * this._text.length + this._spacing * this._text.length
      );
    return metrics.width + this._spacing * this._text.length;
  }
  //@Override
  public drawImage(paint: Painter): void {
    /**
     * 只用这个宽就行了，因为初始化时已经做好宽度处理，放大缩小是等比例方法缩小。
     */
    const width: number = this.rect.size.width;
    //渲染文本的偏移量
    const height = this.fontsize >> 1;
    const textList: Array<string> = this._text.split("");
    const len = textList.length;
    //现在的宽度，渲染在currentWidth列
    let currentWidth = 0;
    this.column = 1;
    let oldColumn = this.column;
    paint.closePath();
    paint.beginPath();
    paint.fillStyle = this._color;
    //设置字体大小与风格
    paint.font = this.fontsize + "px " + this._fontFamily;
    const text_len = textList.length;
    for (let ndx = 0; ndx < text_len; ndx++) {
      const text = textList[ndx];
      const text_width = ~~this._painter.measureText(text).width;
      const beforeText = this._text[ndx - 1];
      const nextText = this._text[ndx + 1];
      const spacing = this.fontsize / this._spacing_scale;
      const x = text_width + spacing;
      const rep = / &n/g;
      const isAutoColumn = rep.test(beforeText + text + nextText);
      /**
       * 宽度不足一个字体，接下来要换行才行，还未换行
       */
      if (width - currentWidth - text_width < text_width || isAutoColumn&&this.column==oldColumn) {
        //上一个为1,且马上要被替换的必须为0
        if (this.currentLineState == 1 && this.lineOneHotMark[ndx] == 0&&this.lineOneHotMark[ndx-1]!=4)
          this.lineOneHotMark[ndx] = 4;
      }

      //字数达到宽度后需要换行   或者出发换行字符
      if (currentWidth + text_width > width || isAutoColumn) {
        this.column += 1;
        currentWidth = 0;
      }
      const drawX = width * -0.5 + currentWidth;
      const drawY =
        (this.column == 1 ? height * 2 : height * (this.column * 2)) -
        (this.rect.size.height >> 1);

      //换行后需要连接起始点不在同意行的线段
      if (this.currentLineState == 1 && this.column > oldColumn&&this.lineOneHotMark[ndx-1]==4&& this.lineOneHotMark[ndx]==0) {
        this.lineOneHotMark[ndx] = 3;
         this.drawLine(x, ndx, drawX, drawY, paint, width, height, text_width);
        oldColumn = this.column;
      }
      if (!isAutoColumn) {
       // paint.fillText(text, drawX, drawY);
        paint.fillText(""+this.lineOneHotMark[ndx], drawX, drawY);
        currentWidth += x;
      }
      this.drawLine(x, ndx, drawX, drawY, paint, width, height, text_width);
      if (isAutoColumn) {
        ndx += 1;
        paint.stroke();
        continue;
      }
    }
    paint.stroke();
    paint.closePath();
    this.setData();
  }
  /**
   * @description 添加下划线,[start,end,start,end]
   * 当遍历line的下表为2偶数时，转为 lineTo,奇数转为moveTo
   * @param wordWidth
   * @param ndx
   * @param drawX
   * @param drawY
   * @param paint
   */
  private drawLine(
    wordWidth: number,
    ndx: number,
    drawX: number,
    drawY: number,
    paint: Painter,
    width: number,
    height: number,
    textWidth: number
  ) {
    const lineY: number = drawY + this.fontsize * 0.2 + this.lineOffsetY;
    //使用标记，1是起始点，2是终点
    const code = this.lineOneHotMark[ndx];
    const beforeCode=this.lineOneHotMark[ndx-1];
    paint.strokeStyle = this.lineColor;
    paint.lineWidth = this.lineWidth;
    if (code == 1 || code == 2) this.currentLineState = code as 1 | 2;

    if (code == 1) return paint.moveTo(drawX - textWidth, lineY);
    if (code == 2&&beforeCode!=4) return paint.lineTo(drawX, lineY);
    if (code == 3) return paint.moveTo(drawX, lineY);
    if (code == 4&&beforeCode!=4&&beforeCode!=1) return paint.lineTo(drawX + textWidth, lineY);
  }

  //@Override
  public didChangeScale(scale: number): void {
    this.initLine();
    this.setData();
    this.drawImage(this._painter);
  }

  //更新文字内容
  public updateText(text: string, options?: textOptions): Promise<void> {
    return new Promise((r, j) => {
      //  console.log(text,options)
      this._text = text;
      this.initLine();
      this.initPrototypes(text, options);
      this.drawImage(this._painter);
      r();
    });
  }

  public didFallback(): void {
    this.setData();
  }
  /**
   * @description 宽不随文字变化，但文字随宽变化,高度随字体变化
   */
  private setData() {
    const { size } = this.rect;
    const newHeight = this.fontsize * this.column;
    this.rect.setSize(this.rect.size.width, newHeight);
    this.resetButtons(["rotate"]);
     this.dragButton.setAxis("horizontal");
    if (size.width <= this.fontsize)
      this.rect.setSize(this.fontsize, newHeight);
    //this.relativeRect.setSize(this.rect.size.width,newHeight);
  }
}

export default TextBox;
