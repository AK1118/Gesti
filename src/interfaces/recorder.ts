import Rect from "../rect";

interface RecorderInterface{
  fallback():Promise<Rect>;
  cancelFallback():Promise<Rect>;
  push(rect:Rect):void;
  commit():void;
  cache:Rect;
  setNow(rect:Rect):void;
  setCache(rect:Rect):void;
}

export default RecorderInterface;
