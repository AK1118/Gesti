import Painter from "@/core/lib/painter";
import TextViewBase, { TextBoxBase } from "./text-base";
import { Size } from "@/core/lib/rect";
import Vector from "@/core/lib/vector";
import {
  Reverse,
  ViewObjectExportEntity,
  ViewObjectExportTextBox,
} from "Serialization";
import { ViewObject } from "@/types/index";

/**
 * 1.改变大小时文字大小不会发生变化，只会被挤压拉伸
 * 2.改变大小时不会换行，只会被挤压拉伸
 * 3.渲染时会换行
 * 4.新加入文本时不会主动换行，回车键后才主动换行
 */
abstract class TextBase extends TextViewBase {
  protected beforeRenderTextAndLines(paint: Painter): void {
    paint.save();
    paint.scale(this.scaleWidth, this.scaleHeight);
  }
  get renderTextOffsetX(): number {
    return (this.width * -0.5) / this.scaleWidth + this.width * 0.5;
  }
  get renderTextOffsetY(): number {
    return (this.height * -0.5) / this.scaleHeight + this.height * 0.5;
  }
  get textWrap(): boolean {
    return false;
  }
  get isChangeFontSizeWithHeight(): boolean {
    return false;
  }
  protected afterRenderTextAndLines(paint: Painter): void {
    paint.restore();
  }
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
    //一行的最大宽度
    let thatMaxRowWidth: number = 0;
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
        // handleSorting(textData);
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
      /**
       * 时刻等于最大宽度
       * 最大宽度等于
       */
      thatMaxRowWidth = Math.max(checkOffset.offsetX, thatMaxRowWidth);
    });

    //在最后需要多加一行的高度给Rect
    checkOffset.offsetY +=
      this.textOptions.fontSize * this.textOptions.lineHeight;

    /**
     * 根据文字自适应大小
     */
    return this.autoFixedSize(
      checkOffset,
      isInitialization,
      thatMaxRowWidth,
      thatMaxWordWidth,
      rectSize,
      points
    );
  }

  private autoFixedSize(
    checkOffset: Offset,
    isInitialization: boolean,
    thatMaxRowWidth: number,
    thatMaxWordWidth: number,
    rectSize: Size,
    points
  ): Array<Vector | null | Array<Vector>> {
    if (
      checkOffset.offsetY * this.scaleHeight > this.height &&
      !isInitialization
    ) {
      const size: Size = new Size(
        this.width,
        checkOffset.offsetY * this.scaleHeight
      );
      this.resetRectSizeAndOthers(size);
      return points;
    }
    if (
      (this.height - checkOffset.offsetY * this.scaleHeight) /
        this.textOptions.lineHeight >=
        this.fixedOption.fontSize &&
      !isInitialization
    ) {
      const size: Size = new Size(
        this.width,
        checkOffset.offsetY * this.scaleHeight - this.fixedOption.fontSize
      );
      this.resetRectSizeAndOthers(size);
      return points;
    }

    /**
     * 宽度始终等于最大行宽
     */
    const currentOffsetWidth: number = thatMaxRowWidth * 2;
    if (currentOffsetWidth > rectSize.width && !isInitialization) {
      const size: Size = new Size(currentOffsetWidth, this.height);
      this.resetRectSizeAndOthers(size);
      return points;
    }

    if (
      rectSize.width - currentOffsetWidth > this.fixedOption.fontSize &&
      !isInitialization
    ) {
      const size: Size = new Size(
        rectSize.width - this.fixedOption.fontSize,
        this.height
      );
      this.resetRectSizeAndOthers(size);
      return points;
    }
    if (isInitialization) {
      const size: Size = new Size(
        Math.max(rectSize.width, thatMaxWordWidth), //thatMaxWordWidth 是某个文字最大宽度，比如一个单词最大宽度，防止矩形宽度小于单词宽度
        checkOffset.offsetY
      );
      this.updateRectSize(size);
    }
    return points;
  }

  private resetRectSizeAndOthers(size: Size) {
    const preScaleWidth = this.scaleWidth,
      preScaleHeight = this.scaleHeight;
    //设置大小
    this.updateRectSize(size);
    this.setFixedSize(
      new Size(
        this.width / (this.absoluteScale * preScaleWidth),
        this.height / (this.absoluteScale * preScaleHeight)
      )
    );
    this.setScaleWidth(preScaleWidth);
    this.setScaleHeight(preScaleHeight);
    this.computeTextSingle();
  }
  protected onInput(value: string): void {
    this.computeTextSingle();
    this.doCache();
    this.forceUpdate();
  }
}

class TextBox extends TextBase {
  public static async reverse(
    entity: ViewObjectExportTextBox
  ): Promise<TextBox> {
    return new TextBox(entity.text, entity.option);
  }
  export(painter?: Painter): Promise<ViewObjectExportTextBox> {
    const entity: ViewObjectExportTextBox = {
      type: "text",
      text: this.fixedText,
      option: this.textOptions,
      base: this.getBaseInfo(),
    };
    return Promise.resolve(entity);
  }
  exportWeChat(painter?: Painter, canvas?: any): Promise<ViewObjectExportEntity> {
      return this.export();
  }
}

export default TextBox;
