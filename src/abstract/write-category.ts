import Painter from "../painter";
import Rect from "../rect";
import ImageBox from "../viewObject/image";
import WriteViewObj from "../viewObject/write";
import XImage from "../ximage";
import ViewObject from "./view-object";

/**
 * 绘制类别
 */
abstract class WriteBase {
    public paint: Painter;
    //是否禁止除了本类以外的对象重绘
    public disableCanvasUpdate: boolean = false;
    public color:string="orange";
    /**
     * 收集在绘制过程中的最大点和最小点，以便于得到最终的矩形高宽
     */
    private maxX: number = 0;
    private maxY: number = 0;
    private minX: number = 9999;
    private minY: number = 9999;

    constructor(paint: Painter) {
        this.paint = paint;
    }
    reset(){
        this.maxX=0;
        this.maxY=0;
        this.minX=9999;
        this.minY=9999;
    }
    onDown(position: Vector | Vector[]) {
        if (!Array.isArray(position)) {

            this.draw(position);
        }
        this.paint.save();
    }
    onUp(position: Vector | Vector[]) {
        if (!Array.isArray(position)) this.draw(position);
    }
    onMove(position: Vector | Vector[]) {
        if (!Array.isArray(position)) {
            this.draw(position);
            const [x, y] = position.toArray();
            this.maxX = Math.max(x, this.maxX);
            this.maxY = Math.max(y, this.maxY);
            this.minY = Math.min(y, this.minY);
            this.minX = Math.min(x, this.minX);
        
        }
    }
    getRect():Rect{
        const width = this.maxX - this.minX;
        const height = this.maxY - this.minY;
        const rect: Rect = new Rect(
            { width, height, x: this.minX + width / 2, y: this.minY + height / 2 },
        );
        return rect;
    }
    abstract draw(position: Vector);
    /**
     * 获取刚刚画的部分
     * @returns 
     */
    abstract  getWriteViewObject(): Promise<ViewObject>;
}


export default WriteBase;