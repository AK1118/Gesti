import Rect from "../rect";

interface RecorderInterface{
    //回退指针下标
   // index:number;
    //历史操作栈
    history:Array<Rect>;
    fallback():Promise<Rect>;
    cancelFallback():Promise<Rect>;
    setBefore(rect:Rect):void;
    setNow(rect:Rect):void;
    commit():void;
}

export default RecorderInterface;
