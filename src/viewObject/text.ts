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
          fontSize: this._fontSize,
          color: this._color,
          spacing: this._spacing,
          fontFamily: this._fontFamily,
          linesMarks: this.linesMarks,
          lineWidth: this.lineWidth,
          lineColor: this.lineColor,
        },
        ...this.getBaseInfo(),
      },
    };
    console.log(json);
    return json;
  }
  private _text: string = "";
  private _fontSize: number = 36;
  private _painter: Painter;
  private _fontFamily = "微软雅黑";
  private _spacing: number = 0;
  private _spacing_scale: number = 0;
  private _color: string = "black";
  //划线从 奇数画到偶数，所以一般成对出现
  private linesMarks: Array<number> = [];
  //下划线宽度
  private lineWidth: number = 3;
  //下划线在Y轴上的偏移量
  private lineOffsetY: number = 0;
  private lineColor: string = "black";
  private _options: textOptions;
  private lineOneHotMark: Array<number> = [];
  /**
   * 行最大宽度
   */
  private maxWidth:number=300;
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
      fontSize = this._fontSize,
      spacing = this._spacing,
      color = this._color,
      linesMarks = this.linesMarks,
      lineWidth = this.lineWidth,
      lineColor = this.lineColor,
      lineOffsetY = this.lineOffsetY,
    } = options ?? {};
    this._fontFamily = fontFamily;
    this._fontSize = fontSize;
    this._spacing = spacing;
    this._color = color;
    (this.linesMarks = linesMarks),
      (this.lineWidth = lineWidth),
      (this.lineColor = lineColor),
      (this.lineOffsetY = lineOffsetY);
    //计算出行距与字体大小的比例
    this._spacing_scale = this._fontSize / this._spacing;
    this._painter.font = this._fontSize + "px " + this._fontFamily;
    this.rect = new Rect({
      width: this.getWidthSize(),
      height: this._fontSize,
      x: this.rect?.position.x || 0,
      y: this.rect?.position.y || 0,
    });
    this.init();

    //初始化划线标记独热数组，用内存换运行速度
    this.lineOneHotMark = new Array(this._text.length).fill(0);
    for (let ndx = 0; ndx < this.lineOneHotMark.length; ndx++) {
      const markNdx = this.linesMarks.findIndex((mark) => mark - 1 == ndx);
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
        this._fontSize * this._text.length + this._spacing * this._text.length
      );
    return metrics.width + this._spacing * this._text.length;
  }
  //@Override
  public drawImage(paint: Painter): void {
    /**
     * 只用这个宽就行了，因为初始化时已经做好宽度处理，放大缩小是等比例方法缩小。
     */
    const width: number = this.relativeRect.size.width;
    //设置字体大小与风格
    this._painter.font = this._fontSize + "px " + this._fontFamily;
    //渲染文本的偏移量
    const height = this._fontSize * 0.4;
    paint.fillStyle = this._color;
    const textList: Array<string> = this._text.split("");

    const len = textList.length;
    let currentWidth = 0;
    textList.forEach((text: string, ndx: number) => {
      const text_width = ~~this._painter.measureText(text).width;
      const spacing = this._fontSize / this._spacing_scale;
      const x = text_width + spacing;
      const drawX = width * -0.5 + currentWidth,
        drawY = height;
      paint.fillText(text, drawX, drawY);
      this.drawLine(x, ndx + 1, drawX, drawY, paint);
      currentWidth += x;
    });
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
    paint: Painter
  ) {
    const lineY: number = drawY + this._fontSize * 0.2 + this.lineOffsetY;
    //使用标记，1是起始点，2是终点
    const code = this.lineOneHotMark[ndx - 1];
    paint.strokeStyle = this.lineColor;
    if (code != 0) {
      if (code == 1) {
         paint.moveTo(drawX, lineY);
      }
      if (code == 2) {
        paint.lineTo(drawX, lineY);
      }
      if (ndx == this._text.length){
        paint.lineTo(this.rect.size.width * 0.5, lineY);
      }  
    }
    paint.closePath();
    paint.stroke();
  }
  //@Override
  public didDrag(value: { size: Size; angle: number }): void {
    this.setData();
  }

  //@Override
  public didChangeScale(scale: number): void {
    this.setData();
  }

  //更新文字内容
  public updateText(text: string, options?: textOptions) {
    this.initPrototypes(text, options);
  }

  public didFallback(): void {
    this.setData();
  }

  private setData() {
    const { size } = this.rect;
    this._fontSize = size.height;
    this.relativeRect.size.width = size.width;
    this.relativeRect.size.height = size.height;
  }
}

export default TextBox;
