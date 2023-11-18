import ViewObject from "../../abstract/view-object";
import { ViewObjectFamily } from "../../enums";
import ImageToolkit from "../../lib/image-toolkit";
import Painter from "../../lib/painter";
import Rect, { Size } from "../../lib/rect";
import { TextHandler } from "../../../types/index";
import Vector from "../../lib/vector";
import { Point } from "../../lib/vertex";
import Platform from "../tools/platform";
import { FetchXImageForImportCallback, ViewObjectExportEntity, ViewObjectExportImageBox, ViewObjectImportBaseInfo, ViewObjectImportImageBox } from "@/types/serialization";
/**
 * 普通模式，矩形根据文字而定
 * 拖拽模式，文字根据缩放倍数而定
 */
export abstract class TextBoxBase extends ViewObject {
  protected fixedText: string;
  private readonly defaultLineColor: string = "black";
  private readonly defaultLineWidth: number = 2;
  protected textOptions: TextOptions = {
    fontSize: 20,
    color: "black",
    spacing: 0,
    lineHeight: 1.5,
    bold: false,
    italic: false,
    maxWidth: 300,
  };
  get textWrap(): boolean {
    return true;
  }
  protected paint: Painter;
  protected texts: Array<TextSingle> = [];
  private rowsCount: number = 1;
  protected readonly fixedOption: FixedOption = {
    fontSize: 20,
    maxWidth: 300,
  };
  /**
   * @deprecated
   * @param text
   * @param options
   * @returns
   */
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
  private setFontDecorations(paint: Painter) {
    //设置字体大小
    paint.font = this.getFont();
  }
  /**
   * @override
   */
  public mount(): void {
      this.computeTextSingle(true);
      this.setMount(true);
      // this.onMounted();
  }
  protected computeTextSingle(
    isInitialization: boolean = false
  ): Array<TextSingle> {
    if (isInitialization) this.setFixedOption();
    this.setFontDecorations(this.paint);
    //This viewObject rect size
    const size: Size = Size.zero;
    const splitTexts: Array<string> = this.handleSplitText(this.fixedText);
    const getTextSingles = (texts: Array<string>): Array<TextSingle> => {
      return texts.map((text) => {
        const textSingle = this.getTextSingle(text);
        //设置rect的大小
        size.setHeight(Math.max(textSingle.height, size.height));
        size.setWidth(size.width + textSingle.width);
        size.setWidth(Math.min(this.fixedOption.maxWidth, size.width));
        if (text.length != 1) textSingle.texts = getTextSingles(text.split(""));
        return textSingle;
      }) as unknown as Array<TextSingle>;
    };
    this.texts = getTextSingles(splitTexts);

    this.computeDrawPoint(
      this.texts,
      isInitialization ? size : this.size,
      isInitialization
    );

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
      /[\s]+|[\u4e00-\u9fa5]|[A-Za-z]+|\d|[!\"#\$%&'\(\)\*\+,\-\./:;<=>\?@\[\\\]\^_`{\|}~]|[！？｡。，；：…“”‘’（）&#8203;``【】``&#8203;〔〕｛｝《》〈〉『』「」]|[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u26FF\u2700-\u27BF]/g;
    let match: Array<string> = [];
    while ((match = regex.exec(text)) !== null) {
      result.push(match[0]);
    }

    return result;
  }
  get spacing(): number {
    return (
      this.textOptions.spacing *
      (this.textOptions.fontSize / this.fixedOption.fontSize)
    );
  }
  /**
   * 渲染坐标来自上次计算
   * 计算由width+spacing得出，换行由x得出，但是x在换行之下
   * 1.(如果是字符串多个)优先计算text+width宽度
   * @param texts
   * @returns
   */
  protected computeDrawPoint(
    texts: Array<TextSingle>,
    rectSize: Size,
    isInitialization: boolean = false
  ): Array<Vector | null | Array<Vector>> {
    const points: Array<Vector | null | Array<Vector>> = [];
    let startX: number = rectSize.width * -0.5;
    //做判断换行坐标
    const checkOffset: Offset = {
      offsetX: startX,
      offsetY: 0,
    };
    //做为实际渲染坐标
    const realOffset: Offset = {
      offsetX: startX,
      offsetY: 0,
    };
    //thatMaxWordWidth 最长单词宽度
    let thatMaxWordWidth: number = 0;
    //Rect宽度，用户检测文字是否超出
    const checkRectSizeWidth: number = rectSize.width * 0.5;
    //获取realX变量每次增加的Δ x
    const computedDeltaX = (textWidth: number) => {
      return textWidth + this.spacing;
    };
    //获取x变量每次增加的Δ x
    const computedCheckDeltaX = (textWidth: number) => {
      if (this.textWrap) return textWidth + this.spacing;
      return (textWidth + this.spacing) * this.scaleWidth;
    };
    this.addRows(true);
    //处理换行
    const handleSorting = (textData: TextSingle) => {
      checkOffset.offsetX = startX; // 换行后 x 重置
      realOffset.offsetX = startX;
      checkOffset.offsetY += textData.height;
      this.addRows();
    };
    texts.forEach((textData) => {
      /**预先获取宽度，判断是否超出rect宽度*/
      const width: number = this.getTextWidth(
        textData.texts || textData,
        this.spacing
      );
      //最大单词宽度
      thatMaxWordWidth = Math.max(width, thatMaxWordWidth);
      const currentX: number = checkOffset.offsetX + width;
      // 如果文本宽度超出矩形宽度，需要换行。换行符不需要另外换行，有特殊处理
      if (currentX > checkRectSizeWidth && !this.isEnter(textData)) {
        handleSorting(textData);
      } else if (/\n/.test(textData.text)) {
        //换行符触发换行
        handleSorting(textData);
        return points.push(null);
      }
      //空格不会出现在文本最前方
      if (checkOffset.offsetX === startX && textData.text === " ")
        return points.push(null);

      if (textData?.texts) {
        //复合字符串
        const childPoint = textData.texts.map((text) => {
          const textWidth: number = text.width;
          const point = new Vector(realOffset.offsetX, checkOffset.offsetY);
          realOffset.offsetX += computedDeltaX(textWidth);
          //检测宽度会随着矩形比例而变化
          checkOffset.offsetX += computedCheckDeltaX(textWidth);
          return point;
        });
        points.push(childPoint);
      } else {
        //单字符
        points.push(new Vector(realOffset.offsetX, checkOffset.offsetY));
        const textWidth: number = textData.width;
        realOffset.offsetX += computedDeltaX(textWidth);
        checkOffset.offsetX += computedCheckDeltaX(textWidth);
      }
    });
    //在最后需要多加一行的高度给Rect
    checkOffset.offsetY +=
      this.textOptions.fontSize * this.textOptions.lineHeight;
    if (isInitialization) {
      const size: Size = new Size(
        //thatMaxWordWidth 是某个文字最大宽度，比如一个单词最大宽度，防止矩形宽度小于单词宽度
        Math.max(rectSize.width, thatMaxWordWidth),
        checkOffset.offsetY
      );
      this.updateRectSize(size);
    }
    return points;
  }

  //单个文字或者多个文字的宽度
  protected getTextWidth = (
    texts: Array<TextSingle> | TextSingle,
    spacing: number
  ): number => {
    let width: number = 0;
    if (Array.isArray(texts)) {
      texts.forEach((_) => {
        width += _.width + spacing;
      });
      width -= spacing;
    } else width = texts.width;
    //如果不换行，就触发文字宽度弹性机制
    if (!this.textWrap) return width * (this.scaleWidth - 0.01);
    return width;
  };
  /**
   * @description 增加行数
   * @param reset  是否复位
   */
  protected addRows(reset?: boolean): void {
    if (reset) {
      this.rowsCount = 1;
      return;
    }
    this.rowsCount += 1;
  }
  /**是否是换行符 */
  protected isEnter(textData: Array<TextSingle> | TextSingle): boolean {
    if (Array.isArray(textData)) {
      for (let i = 0; i < textData.length; i++) {
        if (/\n/.test(textData[i].text)) return true;
      }
      return false;
    }
    return /\n/.test(textData.text);
  }

  protected renderText(paint: Painter): void {
    if (this.texts.length === 0) return;
    const color: string = this.textOptions.color;
    const backgroundColor: string = this.textOptions.backgroundColor;
    const points = this.computeDrawPoint(this.texts, this.size);
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
      const textHeight = textData.height;
      const offsetY =
        this.size.height * -0.5 +
        textData.height * 0.5 +
        this.textOptions.fontSize * 0.1;
      renderTexts(point, textData.text, offsetY, textData.width);
      if (this.textOptions?.lineThrough) {
        renderLine(point, textData.width, offsetY);
      }
      if (this.textOptions?.underLine) {
        renderLine(point, textData.width, this.height * -0.5 + textHeight);
      }
      if (this.textOptions?.overLine) {
        renderLine(
          point,
          textData.width,
          -textHeight + this.height * -0.5 + textHeight
        );
      }
    };
    const renderLine = (point: Point, width: number, offsetY: number) => {
      const lineOffsetY = offsetY + this.renderTextOffsetY;
      paint.moveTo(point.x + this.renderTextOffsetX, point.y + lineOffsetY);
      let lineX = point.x + width + spacing + this.renderTextOffsetX;
      if (lineX > this.size.width * 0.5) lineX -= spacing;
      paint.lineTo(lineX, point.y + lineOffsetY);
    };
    const renderTexts = (
      point: Point,
      text: string,
      offsetY: number,
      textWidth: number
    ) => {
      paint.fillText(
        text,
        point.x + this.renderTextOffsetX,
        (point.y + offsetY) + this.renderTextOffsetY
      );
    };
    paint.save();
    this.beforeRenderTextAndLines(paint);
    this.renderTextAndLines(points, render);
    this.afterRenderTextAndLines(paint);
    paint.strokeStyle = this.textOptions?.lineColor ?? this.defaultLineColor;
    paint.lineWidth =
      (this.textOptions?.lineWidth ?? this.defaultLineWidth) *
      this.scaleHeight *
      0.5;
    paint.stroke();
    paint.closePath();
    paint.restore();
  }
  //渲染文本时X轴偏移量
  get renderTextOffsetX(): number {
    return 0;
  }
  //渲染文本时Y轴偏移量
  get renderTextOffsetY(): number {
    return 0;
  }
  //是否根据矩形高度自适应文字大小
  get isChangeFontSizeWithHeight(): boolean {
    return true;
  }
  //渲染文字前
  protected beforeRenderTextAndLines(paint: Painter) {}
  protected afterRenderTextAndLines(paint: Painter) {}
  //渲染文字后
  protected renderTextAndLines(points, render): void {
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
  }
  protected updateRectSize(size: Size): void {
    //拖拽时设置scale 等于设置大小，松开时再设置大小就会判断一样的值
    this.setSize(size);
  }
  protected didChangeDeltaScale(scale: number): void {
    this.isDirty = true;
    this.extendDidChangeDeltaScale(scale);
    this.updateFontSizeByRectSizeHeight();
  }
  /**
   * 扩展给扩展类类用
   * @param scale
   */
  protected extendDidChangeDeltaScale(scale: number): void {}
  protected didChangeSize(size: Size): void {
    this.extendDidChangeSize(size);
  }
  protected extendDidChangeSize(size: Size): void {}
  /**
   * @description 根据高度计算文字大小
   * @returns
   */
  protected updateFontSizeByRectSizeHeight(): void {
    const rectHeight: number = this.height;
    const lineHeight = this.textOptions.lineHeight;
    const columnHeight = rectHeight / this.rowsCount;
    const newFontSize: number = columnHeight / lineHeight;
    this.textOptions.fontSize = newFontSize / this.scaleHeight;
    this.computeTextSingle();
  }

  protected setFixedOption() {
    this.fixedOption.fontSize = this.textOptions.fontSize;
    this.fixedOption.maxWidth = this.textOptions.maxWidth;
  }
  /**
   * 缓存画布
   */
  private _renderCache: boolean = false;
  protected flushCache(): void {
    this._renderCache = false;
  }
  protected updateCache(): void {
    this._renderCache = true;
  }
  get isRenderCache(): boolean {
    return this._renderCache;
  }
  protected cacheCanvas: HTMLCanvasElement | OffscreenCanvas;
  protected isDirty: boolean = true;
  private isUseCache:boolean=true;
  /**
   * @description 使用缓存
   * @test
   */
  public useCache(){
    this.isUseCache=true;
  }
  public unUseCache(){
    this.isUseCache=false;
  }
  public didEventUpWithInner(): void {
    this.doCache();
  }
  public didEventUpWithOuter(): void {
    this.doCache();
  }
  protected doCache(): void {
    //是否使用缓存
    if(!this.isUseCache)return;
    //没变过大小就不缓存
    if (!this.isDirty) return;
    // this.updateFontSizeByRectSizeHeight();
    this.flushCache();
    this.cache();
    this.updateCache();
    //重置没改过大小
    this.isDirty = false;
  }
  private cache(): void {
    const painter: Painter = this.getCacheCanvasPainter();
    this.setFontDecorations(painter);
    painter.clearRect(0, 0, this.width, this.height);
    painter.translate(this.width * 0.5, this.height * 0.5);
    this.render(painter, true);
    painter.translate(-this.width * 0.5, -this.height * 0.5);
  }
  /**
   * @description 获取平台的离屏画布
   * @test
   * @returns 
   */
  private getCacheCanvasByPlatform():any{
    if(this.cacheCanvas)return this.cacheCanvas;
    if(Platform.isBrowser)return new OffscreenCanvas(this.width, this.height);
    if(Platform.isWeChatMiniProgram)return wx.createOffscreenCanvas(this.width,this.height);
    //当前只支持浏览器和微信小程序离屏缓存
    if(!Platform.isBrowser&&!Platform.isWeChatMiniProgram){
      throw new Error("Your platform does not support OffscreenCanvas in [Gesti]. Please run textBox.unUseCache() to resolve this error.");
    }
    return this.cacheCanvas;
  }
  //创建时,刷新缓存时调用
  private createCacheCanvas(): HTMLCanvasElement | OffscreenCanvas {
    this.cacheCanvas =
     this.getCacheCanvasByPlatform();
    this.cacheCanvas.width = this.width;
    this.cacheCanvas.height = this.height;

    return this.cacheCanvas;
  }
  //渲染时调用
  private getCacheCanvas() {
    return this.createCacheCanvas();
  }
  //获取画笔
  private getCacheCanvasPainter(): Painter {
    const cacheCanvas = this.getCacheCanvas();
    return new Painter(cacheCanvas.getContext("2d") as any);
  }
  protected onInput(value: string): void {}
}

/**
 * 文字
 */
class TextViewBase extends TextBoxBase implements TextHandler {
  constructor(text: string, option?: TextOptions) {
    super();
    this.fixedText = text;
    Object.assign(this.textOptions, option);
  }
  setText(text: string): void {
    this.fixedText = text;
    this.onInput(this.fixedText);
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
  get value(): string {
    return this.fixedText;
  }
  setDecoration(args: any): void {
    throw new Error("Method not implemented.");
  }
  drawImage(paint: Painter): void {
    //改过大小，且有缓存，渲染缓存
    if (this.isDirty && this.isRenderCache) {
      paint.drawImage(
        this.cacheCanvas,
        -this.width * 0.5,
        -this.height * 0.5,
        this.width,
        this.height
      );
    } else {
      this.renderText(paint);
      this.isDirty = true;
    }
  }
  export(painter?: Painter): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<ViewObjectExportEntity> {
    throw new Error("Method not implemented.");
  }
  setFontSize(fontSize: number): void {
    this.textOptions.fontSize = fontSize;
    this.rebuild();
  }
  private rebuild() {
    this.isDirty = false;
    this.computeTextSingle(false);
    //强制更新Gesti
    this.forceUpdate();
    //更新完毕后需要更新缓存
    this.doCache();
  }
}

export default TextViewBase;
