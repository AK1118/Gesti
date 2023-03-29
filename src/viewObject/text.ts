import ViewObject from "../abstract/view-object";
import Painter from "../painter";
import Rect from "../rect";

/**
 * 文字
 */
class TextBox extends ViewObject {
    private _text: string = "";
    private _fontSize: number = 36;
    private _painter: Painter;
    private _fontFamily = "微软雅黑";
    private _spacing:number=10;
    constructor(text: string, painter: Painter, options?: {
        fontFamily?: string,
        fontSize?: number,
    }) {
        super();

        this._painter = painter;
        this._text = text;
        const { fontFamily = this._fontFamily, fontSize = this._fontSize, } = options ?? {};
        this._fontFamily = fontFamily;
        this._fontSize = fontSize;

        this._painter.font = this._fontSize + "px " + this._fontFamily;
        this.rect = new Rect(
            {
                width: this.getWidthSize(),
                height: this._fontSize,
                x: 200,
                y: 200,
            }
        );
        this.init();
    }
    /**
     * 一个汉字占2个字母或者数字
     */
    private getWidthSize(): number {
        const metrics = this._painter.measureText(this._text);
        return metrics.width;
    }
    //@Override
    public drawImage(paint: Painter): void {
        /**
         * 只用这个宽就行了，因为初始化时已经做好宽度处理，放大缩小是等比例方法缩小。
         */
        const width: number = this.relativeRect.size.width;
        //设置字体大小与风格
        paint.font = this._fontSize + "px 隶书";
        //渲染文本的偏移量
        const height=this._fontSize * .4;
        paint.fillStyle = "red";
        // const textList:Array<string>=this._text.split('');
        // console.log(textList)
        paint.fillText(this._text, width * -.5,
            this._fontSize * .4,width);
    }

    //@Override
    public didDrag(value: { size: Size; angle: number; }): void {
        const { size } = value;
        this._fontSize = size.height;
        this.relativeRect.size.width = size.width;
        this.relativeRect.size.height = size.height;
    }
    //@Override
    public didChangePosition(position: Vector): void {

    }
    //新增文字
    public updateText(text: string) {

    }
}

export default TextBox;