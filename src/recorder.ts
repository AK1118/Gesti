import { RecordNode } from "./abstract/operation-observer";
import RecorderInterface from "./interfaces/recorder";

//操作记录
class Recorder implements RecorderInterface {
    //上一步状态
    cache: RecordNode = null;
    //现在的状态
    now: RecordNode = null;
    //单例模式
    private static _recorder: RecorderInterface = new Recorder();
    public static getInstance(): RecorderInterface {
        return Recorder._recorder;
    }
    //左栈
    stack: Array<RecordNode> = [];
    //右栈
    undoStack: Array<RecordNode> = [];
    //最大历史记录栈长度
    maxLength: number = 30;
    //目前状态
    currentValue: RecordNode = null;
    get len(): number {
        return this.stack.length;
    }
    get undoLen(): number {
        return this.undoStack.length;
    }
    last(): RecordNode {
        return this.stack[this.len - 1];
    }
    undoLast(): RecordNode {
        return this.undoLast[this.undoLen - 1];
    }
    get isFull(): boolean {
        return this.len > this.maxLength;
    }
    setCache(node: RecordNode): void {
        //不为空时赋值，或者不是同一个时

        if (this.cache != null) {
            return;
        }
        this.cache = node;
    }
    setNow(node: RecordNode): void {
        this.now = node;
    }
    push(node: RecordNode) {
        if(node==null)return;
        this.stack.push(node);
        this.undoStack = [];
        this.currentValue = node;
        if (this.isFull) this.stack.shift();
    }
    public fallback(): Promise<RecordNode> {
        if (this.len <=1) return Promise.resolve(null);
        const rect = this.stack.pop();
        this.undoStack.push(rect);
        this.currentValue = this.last();
        //以key为判断，如果相邻的Node不同master key，说明换了master,需要掐头
        if (rect.key != this.currentValue.key) {
            const rect = this.stack.pop();
            this.undoStack.push(rect);
            this.currentValue = this.last();
        }
        return Promise.resolve(this.currentValue);
    }
    public cancelFallback(): Promise<RecordNode> {
        if (this.undoLen == 0) return Promise.resolve(null);
        if (this.undoLen > 0) {
            //以key为判断，如果相邻的Node不同master key，说明换了master,需要掐头
            if (this.undoStack[this.undoLen - 1].key != this.currentValue.key) {
                const rect = this.undoStack.pop();
                this.stack.push(rect);
                this.currentValue = this.last();
            }
        }
        const rect = this.undoStack.pop();
        this.stack.push(rect);
        this.currentValue = this.last();

        return Promise.resolve(this.currentValue);
    }
    commit(): void {
        if (this.cache == null) return;
        //当栈为0,需要存左端的，或者前与后key不一致,或者前后操作不一致
        const notOne = this.stack.length != 0 ? (this.cache.key != this.last().key) || (this.cache.type != this.last().type) : false;
        if (this.stack.length == 0 || notOne) this.push(this.cache)
        this.push(this.now);
        this.cache = null
      //  console.log(this.stack);
    }
}

export default Recorder;