import ViewObject from "../abstract/view-object";
import WriteBase from "../abstract/write-category";
import WriteInterface from "../abstract/write-category";
import Painter from "../painter";
import WriteCircle from "./circle";
import WriteLine from "./line";
import WriteRect from "./rect";
import Write from "./write";



export enum WriteType {
    None,
    Write,
    Rect,
    Circle,
    Line,
}



/**
 * down在已被选中图册上时不能绘制，
 * 当down图册上时  current=null,
 * 需要存储被选中绘制的类型
 * 每个类的生命周期为   down-move-up-诞生图册-长存
 * down需要做动作:判定是否在选定图册内,没有就new对象
 * 
 */
class WriteFactory {
    //当前画笔类型
    private currentType: WriteType = WriteType.None;
    public current: WriteBase;
    private paint: Painter;
    public listen:(obj:ViewObject)=>void;
    private config: {
        color?: string,
        lineWidth?: number,
        type: GraffitiType,
    };
    public setConfig(config: {
        color?: string,
        lineWidth?: number,
        type: GraffitiType,
    }) {
        this.config = config;
        this.setWriteType();
    }
    constructor(paint: Painter) {
        this.paint = paint;
    }
    private setWriteType() {
        if(this.config.type=="none")this.currentType = WriteType.None;
        if(this.config.type=="circle")this.currentType = WriteType.Circle;
        if(this.config.type=="write")this.currentType = WriteType.Write;
        if(this.config.type=="line")this.currentType = WriteType.Line;
        if(this.config.type=="rect")this.currentType = WriteType.Rect;
    }
    public onDraw() {
        switch (this.currentType) {
            case WriteType.Write: this.current = this.write(); break;
            case WriteType.Rect: this.current = this.rect(); break;
            case WriteType.Line: this.current = this.line(); break;
            case WriteType.Circle: this.current = this.circle(); break;
        }
        /**
         * 设置配置
         */
        this.current?.setConfig(this.config);
    }
    /**
     * 
     * @returns 普通的绘制类
     */
    private write(): Write {
        const write: Write = new Write(this.paint);
        write.disableCanvasUpdate = true;
        this.current = write;
        return write;
    }
    /**
       * 
       * @returns 矩形绘制类
       */
    private rect(): WriteRect {
        const writeRect: WriteRect = new WriteRect(this.paint);
        writeRect.disableCanvasUpdate = true;
        this.current = writeRect;
        return writeRect;
    }
    /**
       * 
       * @returns 线绘制类
       */
    private line(): WriteLine {
        const writeline: WriteLine = new WriteLine(this.paint);
        writeline.disableCanvasUpdate = true;
        this.current = writeline;
        return writeline;
    }
    /**
      * 
      * @returns 圆圈绘制类
      */
    private circle(): WriteCircle {
        const writecircle: WriteCircle = new WriteCircle(this.paint);
        writecircle.disableCanvasUpdate = true;
        this.current = writecircle;
        return writecircle;
    }
    //绘制完毕，返回一个可操作对象
    async done(): Promise<ViewObject> {
        if (!this.current) return;
        const obj = await this.current.getWriteViewObject();
        obj?.custom();
        this.current = null;
        return obj;
    }

    cancel(): void {
        this.current = null;
    }
}
export default WriteFactory;