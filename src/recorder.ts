import RecorderInterface from "./interfaces/recorder";
import Rect from "./rect";
import { Debounce } from "./utils";

//记录操作
/**
 * 只需要一个栈
 * 在before前
 * 
 */
class Recorder implements RecorderInterface {
    cache: Rect = null;
    now: Rect = null;
    private static _recorder: RecorderInterface = new Recorder();
    public static getInstance(): RecorderInterface {
        return Recorder._recorder;
    }
    stack: Array<Rect> = [];
    undoStack: Array<Rect> = [];
    maxLength: number = 100;
    currentValue: Rect = null;
    get len(): number {
        return this.stack.length;
    }
    get undoLen(): number {
        return this.undoStack.length;
    }
    last(): Rect {
        return this.stack[this.len - 1];
    }
    get isFull(): boolean {
        return this.len > this.maxLength;
    }
    setCache(rect: Rect): void {
        if (this.cache != null) return;
        this.cache = rect.copy(rect.key);
    }
    setNow(rect: Rect): void {
        this.now = rect.copy(rect.key);
    }
    push(rect: Rect) {
        this.stack.push(rect.copy(rect.key));
        this.undoStack = [];
        this.currentValue = rect.copy(rect.key);
        if (this.isFull) this.stack.shift();
    }
    public fallback(): Promise<Rect> {
        if (this.len ==1) return Promise.resolve(null);
        const rect = this.stack.pop();
        this.undoStack.push(rect);
        this.currentValue = this.last();
        console.log("撤销", this.stack)
        return Promise.resolve(this.currentValue);
    }
    public cancelFallback(): Promise<Rect> {
        if (this.undoLen == 0) return Promise.resolve(null);
        const rect = this.undoStack.pop();
        this.stack.push(rect);
        this.currentValue = this.last();
        return Promise.resolve(this.currentValue);
    }
    commit(): void {
        if(this.len==0)this.push(this.cache);
        this.push(this.now);
        this.cache = null
    }
}

export default Recorder;