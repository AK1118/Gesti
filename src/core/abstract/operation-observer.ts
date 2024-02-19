import RenderObject from "../interfaces/render-object";
import { Debounce, Throttle } from "../../utils/utils";
import RenderBox from "../lib/rendering/renderbox";

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
  addPosition: Vector;
  drag: { angle: number; size: Size };
  sizeScaleWidth: number;
  sizeScaleHeight: number;
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
  private parent: OperationObserver;
  constructor(parent: OperationObserver) {
    this.parent = parent;
  }
  report(value: any, type: keyof OperationType): void {
    this.parent.report(value, type);
  }
  beforeReport(value: any, type: keyof OperationType): void {
    this.parent.beforeReport(value, type);
  }
}

abstract class OperationObserver {
  abstract renderBox:RenderBox;
  onHide(): void {}
  private observeRenderBox: RenderBox;
  /**
   * 添加被观察者
   * @param obj
   */
  public addObserver(observeRenderBox: RenderBox): void {
    this.observeRenderBox = observeRenderBox;
    this.observeRenderBox.rect.addObserver(new Observer(this));
  }
  /**
   * @description 改变前
   * @param value
   * @param type
   */
  beforeReport(value: any, type: keyof OperationType): void {
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
      case "addPosition":
        this.beforeAddPosition(value);
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
    switch (type) {
      case "size":
        {
          this._didChangeSize(value);
          this.didChangeSize(value);
        }

        break;
      case "angle":
        this.didChangeAngle(value);
        break;

      case "scale":
        {
          this._didChangeDeltaScale(value);
          this.didChangeDeltaScale(value);
        }
        break;

      case "position":
        {
          this._didChangePosition(value);
          this.didChangePosition(value);
        }
        break;
      case "drag":
        this.didDrag(value);
        {
          this._didChangePosition(value);
          this.didChangePosition(value);
        }
        break;
      case "addPosition":
        {
          this._didAddPosition(value);
          this.didAddPosition(value);
        }
        break;
      default: {
      }
    }
    this._didChangedAll();
  }
  //移除观察者
  public removeObserver() {
    this.observeRenderBox.rect.removeObserver();
  }
  //改变角度
  protected didChangeAngle(angle: number) {}
  protected beforeChangeAngle(angle: number): void {}
  //改变大小
  protected _didChangeSize(size: Size): void {}
  protected didChangeSize(size: Size): void {}
  protected beforeChangeSize(size: Size): void {}
  //改变定位
  protected didChangePosition(position: Vector): void {}
  protected _didChangePosition(position: Vector): void {}
  protected beforeChangePosition(position: Vector): void {}
  //改变缩放
  protected didChangeDeltaScale(deltaScale: number): void {}
  protected _didChangeDeltaScale(deltaScale: number): void {}
  //拖拽
  protected didDrag(value: { size: Size; angle: number }): void {}
  //通过增加改变位置
  protected didAddPosition(delta: Vector): void {}
  protected beforeAddPosition(delta: Vector): void {}
  protected _didAddPosition(delta: Vector): void {}
  //改变任意数据时
  protected _didChangedAll(): void {}

  protected didChangeScaleWidth(): void {}

  protected didChangeScaleHeight(): void {}

  protected _didChangeScaleWidth(): void {}

  protected _didChangeScaleHeight(): void {}
}

export default OperationObserver;
export { ObserverObj, OperationType };
