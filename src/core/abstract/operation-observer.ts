import RecorderInterface from "../interfaces/recorder";
import RenderObject from "../interfaces/render-object";
import Recorder from "../../recorder";
import { Debounce, Throttle } from "../../utils";

//操作监听类型
/**
 * 值得注意的是，可能会有一些组合的指令
 * 比如  size+angle=拖拽
 * 需要另外声明出一个类型出来 drag
 */
interface OperationType {
  size: Size;
  angle: number;
  scale: number;
  position: Vector;
  drag: { angle: number; size: Size };
}


/**
 * 被观察者应该实现的抽象类
 */
abstract class ObserverObj {
  observer: Observer = null;
  addObserver(observer: Observer): void {
    this.observer = observer;
  }
  removeObserver(): void {
    this.observer = null;
  }
}

class Observer {
  private master: OperationObserver;
  constructor(master: OperationObserver) {
    this.master = master;
  }
  report(value: any, type: keyof OperationType): void {
    this.master.report(value, type);
  }
  beforeReport(value: any, type: keyof OperationType): void {
    this.master.beforeReport(value, type);
  }
}

/**
 * 操作监听节点
 * 监听栈节点
 * 每个节点都分为不同总类
 * 枚举
 * 根据枚举节点存储不同的数据
 */
class RecordNode {
  //master key
  public key: number | string;
  //节点的key
  private _key: string = Math.random().toString(12).substring(2);
  private _type: keyof OperationType;
  private _data: any;
  constructor(type: keyof OperationType) {
    this._type = type;
  }
  public setData<T>(data: T) {
    this._data = data;
  }
  get data(): typeof this._data {
    return this._data;
  }
  get type(): keyof OperationType {
    return this._type;
  }
}
/**
 * 存历史记录节点
 */
class Record {
  private recorder: RecorderInterface = Recorder.getInstance();
  private debounceNow: Function = Debounce(
    (args: { value: any; type: keyof OperationType; master: RenderObject }) => {
      const { value, type, master } = args;
      const now = this.getNode(value, type, master);
      this.recorder.setNow(now);
    },
    0
  );
  private debounceBefore: Function = Throttle(
    (args: { value: any; type: keyof OperationType; master: RenderObject }) => {
      const { value, type, master } = args;
      const before = this.getNode(value, type, master);
      this.recorder.setCache(before);
    },
    100
  );
  //记录现在的窗台
  public recordNow(
    value: any,
    type: keyof OperationType,
    master: RenderObject
  ) {
    this.debounceNow({ value, type, master });
  }
  //记录现在的窗台
  public recordBefore(
    value: any,
    type: keyof OperationType,
    master: RenderObject
  ) {
    this.debounceBefore({ value, type, master });
  }
  /**
   * 处理数据并得到一个记录节点，记录节点不处理什么深拷贝浅拷贝的，只负责存储
   * 在传过来调用这个函数之前务必处理好深浅拷贝，谁知道你传过来的是什么类型
   * @param value
   * @param type
   */
  private getNode(value: any, type: keyof OperationType, master: RenderObject) {
    const node = new RecordNode(type);
    node.setData<typeof value>(value);
    node.key = master.key;
    return node;
  }
}

/**
 * 如果需要撤销操作，组件必须继承该抽象类实现
 */
abstract class OperationObserver {
  onHide(): void {}
  private obj: RenderObject;
  private recordClazz: Record = new Record();
  /**
   * 添加被观察者
   * @param obj
   */
  public addObserver(obj: RenderObject): void {
    this.obj = obj;
    this.obj.rect.addObserver(new Observer(this));
  }
  /**
   * 改变后
   * 记录,先粗略copy对象存储，后如需优化可以转json存储
   */
  public record(value: any, type: keyof OperationType) {
    //设置现在的状态
    this.recordClazz.recordNow(value, type, this.obj);
  }
  /**
   * @description 改变前
   * @param value
   * @param type
   */
  beforeReport(value: any, type: keyof OperationType): void {
    //设置旧的状态
    this.recordClazz.recordBefore(value, type, this.obj);
    switch (type) {
      case "position":
        this.beforeChangePosition(value);
        break;
      case "angle":
        this.beforeChangeAngle(value);
        break;
      case "size":
        this.beforeChangeSize(value);
        break;
      default: {
      }
    }
  }
  /**
   * 汇报观察情况，调用对应函数
   * @param value
   * @param type
   */
  report(value: any, type: keyof OperationType): void {
    this.record(value, type);
    switch (type) {
      case "size":
        this.didChangeSize(value);
        break;
      case "angle":
        this.didChangeAngle(value);
        break;

      case "scale":
       {
        this.didChangeScale(value);
        this._didChangeScale(value);
       }
        break;

      case "position":
        {
          this.didChangePosition(value);
          this._didChangePosition(value);
        }
        break;
      case "drag":
        this.didDrag(value);
        break;
      default: {
      }
    }
  }
  //移除观察者
  public removeObserver() {
    this.obj.rect.removeObserver();
  }
  //改变角度
  protected didChangeAngle(angle: number) {}
  protected beforeChangeAngle(angle: number): void {}
  protected didChangeSize(size: Size): void {}
  protected beforeChangeSize(size: Size): void {}
  protected didChangePosition(position: Vector): void {}
  protected _didChangePosition(position: Vector): void {}
  protected beforeChangePosition(position: Vector): void {}
  protected didChangeScale(scale: number): void {}
  protected _didChangeScale(scale:number):void{}
  protected didDrag(value: { size: Size; angle: number }): void {}
  
}

export default OperationObserver;
export { ObserverObj, OperationType, RecordNode };
