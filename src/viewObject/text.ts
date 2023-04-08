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
    private _spacing:number=0;
    private _spacing_scale:number=0;
    private _color:string='black';
    constructor(text: string, painter: Painter, options?: textOptions) {
        super();
        this._painter = painter;
       this.initPrototypes(text,options);
    }

    private initPrototypes(text:string,options:textOptions){
        this._text = text;
        const { fontFamily = this._fontFamily, fontSize = this._fontSize,spacing=this._spacing,color=this._color} = options ?? {};
        this._fontFamily = fontFamily;
        this._fontSize = fontSize;
        this._spacing=spacing;
        this._color=color;
        //计算出行距与字体大小的比例
        this._spacing_scale=this._fontSize/this._spacing;
        this._painter.font = this._fontSize + "px " + this._fontFamily;
        this.rect = new Rect(
            {
                width: this.getWidthSize(),
                height: this._fontSize,
                x: this.rect?.position.x||0,
                y: this.rect?.position.y||0,
            }
        );
        this.init();
    }

    /**
     * 获取文本长度
     */
    private getWidthSize(): number {
        const metrics = this._painter.measureText(this._text);
        if(!metrics)return this._fontSize*this._text.length+(this._spacing*this._text.length);
        return metrics.width+this._spacing*this._text.length;
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
        const height=this._fontSize * .4;
        paint.fillStyle = this._color;
        const textList:Array<string>=this._text.split('');
        
        const len=textList.length;
        let currentWidth=0;
        textList.forEach((text:string,ndx:number)=>{
            const text_width = ~~this._painter.measureText(text).width;
            const spacing=(this._fontSize/this._spacing_scale);
            const x=(text_width+spacing);
            paint.fillText(text, width * -.5+currentWidth,
            height,);
            currentWidth+=x;
        });
    }

    //@Override
    public didDrag(value: { size: Size; angle: number; }): void {
      this.setData();
    }

    //@Override
    public didChangeScale(scale: number): void {
        this.setData();
    }

    //更新文字内容
    public updateText(text: string, options?: textOptions) {
        this.initPrototypes(text,options);
    }

    public didFallback(): void {
       this.setData();
    }

    private setData(){
        const { size } = this.rect;
        this._fontSize = size.height;
        this.relativeRect.size.width = size.width;
        this.relativeRect.size.height = size.height;
    }

}

export default TextBox;