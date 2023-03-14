import RecorderInterface from "../interfaces/recorder";
import RenderObject from "../interfaces/render-object";
import Recorder from "../recorder";
import Rect from "../rect";


interface OperationObserverType {
    report(value: any, type: "size" | "angle" | "scale" | "position"): void;
    beforeReport(value: any, type: "size" | "angle" | "scale" | "position"):void;
    didChangeAngle(angle: number): void;
    didChangeSize(size: Size): void;
    didChangePosition(position: Vector): void;
    didChangeScale(scale: number): void;
}

/**
 * 被观察者应该实现的抽象类
 */
abstract class ObserverObj{
    observer:Observer=null;
    addObserver(observer:Observer):void{
        this.observer=observer;
    }
    removeObserver():void{
        this.observer=null;
    }
}

class Observer {
    private master: OperationObserver;
    constructor(master: OperationObserver) {
        this.master = master;
    }
    report(value: any, type: "size" | "angle" | "scale" | "position"): void {
        this.master.report(value,type);
    }
    beforeReport(value: any, type: "size" | "angle" | "scale" | "position"): void {
        this.master.beforeReport(value,type);
    }
}

/**
 * 如果需要撤销操作，组件必须继承该抽象类实现
 */
abstract class OperationObserver implements OperationObserverType {
    private obj: RenderObject;
    private recorder: RecorderInterface = Recorder.getInstance();
    /**
     * 添加被观察者
     * @param obj 
     */
    public addObserver(obj: RenderObject): void {
        this.obj = obj;
        this.obj.rect.addObserver(new Observer(this));
    }
    /**
     * 记录,先粗略copy对象存储，后如需优化可以转json存储
     */
    public record(){
        // this.recorder.setBefore(this.obj.rect);
         this.recorder.setNow(this.obj.rect);
        console.log("记录")
    }
    beforeReport(value: any, type: "size" | "angle" | "scale" | "position"): void {
        this.recorder.setCache(this.obj.rect);
    }
    /**
     * 汇报观察情况，调用对应函数
     * @param value 
     * @param type 
     */
    report(value: any, type: "size" | "angle" | "scale" | "position"): void {
        this.record();
        switch (type) {
            case "size":
                this.didChangeSize(value);
                break;
            case "angle":
                this.didChangeAngle(value);
                break;

            case "scale":
                this.didChangeScale(value);
                break;

            case "position":
                this.didChangePosition(value);
                break;

            default:
                break;
        }
    }
    //移除观察者
    public removeObserver() {
        this.obj.rect.removeObserver();
    }
    //改变角度
    public didChangeAngle(angle: number) {}
    public didChangeSize(size: Size): void {}
    public didChangePosition(position: Vector): void {}
    public didChangeScale(scale: number): void {}
}


export default OperationObserver;
export {
    ObserverObj,
};
