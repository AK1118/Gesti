import RecorderInterface from "./interfaces/recorder";
import Rect from "./rect";
import { Debounce } from "./utils";

//记录操作
class Recorder implements RecorderInterface {

    private static _recorder: RecorderInterface = new Recorder();
    private reHistory: Rect[] = new Array<Rect>();
    public history: Rect[] = new Array<Rect>();
    public cache: Rect = null;
    private before: Rect = null;
    private now: Rect = null;
    private hasFalled:boolean=false;
    private hasCancelFalled:boolean=false;
    public static getInstance(): RecorderInterface {
        return Recorder._recorder;
    }
    private get historyLen(): number {
        return this.history.length - 1;
    }
    setBefore(rect: Rect): void {
        if (this.before != null) return;
        //防止浅拷贝
        this.before = rect.copy(rect.key);
    }
    setNow(rect: Rect): void {
        this.now = rect.copy(rect.key);
    }
    fallback(): Promise<Rect> {
        if(this.history.length==0)return Promise.resolve(null);
        const rect=this.history.pop();
        this.reHistory.push(rect);
        return Promise.resolve(rect);
    }
    cancelFallback(): Promise<Rect> {
        if(this.reHistory.length==0)return Promise.resolve(null);
        const rect=this.reHistory.pop();
        this.history.push(rect);
        return Promise.resolve(rect);
    }
    //提交到历史记录
    commit(): void {
        if (this.before == null) return;
        this.history.push(this.before);
        this.reHistory=[];
        this.before=null;
        this.hasFalled=false;
    }

}

export default Recorder;