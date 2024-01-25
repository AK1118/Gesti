import ViewObject from "@/core/abstract/view-object";
import WriteBase from "@/core/abstract/write-category";
import WriteInterface from "@/core/abstract/write-category";
import Painter from "../../lib/painter";
import WriteCircle from "./circle";
import WriteLine from "./line";
import WriteRect from "./rect";
import Write from "./write";
import WriteViewObj from "../write";
import { GraffitiType } from "@/types/controller";

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
  //是否正在等待涂鸦中
  public get watching():boolean{
    return this.config?.type != "none";
  }
  public listen: (obj: ViewObject) => void;
  private config: {
    color?: string;
    lineWidth?: number;
    type: GraffitiType;
  }={
    type:"none"
  };
  public setConfig(config: {
    color?: string;
    lineWidth?: number;
    type: GraffitiType;
  }) {
    this.config = config;
    this.setWriteType();
  }
  constructor(paint: Painter) {
    this.paint = paint;
  }
  private setWriteType() {
    if (this.config.type == "none") this.currentType = WriteType.None;
    if (this.config.type == "circle") this.currentType = WriteType.Circle;
    if (this.config.type == "write") this.currentType = WriteType.Write;
    if (this.config.type == "line") this.currentType = WriteType.Line;
    if (this.config.type == "rect") this.currentType = WriteType.Rect;
  }
  public close() {
    this.config.type = "none";
    this.currentType = WriteType.None;
  }
  public onDraw() {
    switch (this.currentType) {
      case WriteType.Write:
        this.current = this.write();
        break;
      case WriteType.Rect:
        this.current = this.rect();
        break;
      case WriteType.Line:
        this.current = this.line();
        break;
      case WriteType.Circle:
        this.current = this.circle();
        break;
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
    if (!this.current) return Promise.resolve(null);
    const obj = await this.current.getWriteViewObject();
    obj?.custom();
    if (obj?.rect) {
      //太小的不要
      const { width, height } = obj.rect.size;
      if (width <= 3 && height <= 3) return Promise.resolve(null);
    }
    this.current = null;
    if (obj) this.onAddition(obj);
    return obj;
  }

  cancel(): void {
    this.current = null;
  }
  private onAddition: (view: any) => void = (view: any) => {};
  /**
   * @description 创建涂鸦对象时回调
   * @param graffiti
   */
  public onCreateGraffiti(callback: (view: any) => void) {
    this.onAddition = callback;
  }
}
export default WriteFactory;
