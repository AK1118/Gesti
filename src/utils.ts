type DebounceCallback = (args: any) => void;


//防抖
export const Debounce = (fun: DebounceCallback, delay: number) => {
    let timer = null;
    return (args: any) => {
        if (timer != null) clearTimeout(timer);
        timer = setTimeout(() => {
            fun(args);
        }, delay);
    }
}

//节流
export const Throttle = (fun: DebounceCallback, delay: number) => {
    let lastTime: number = 0;
    return (args: any) => {
        let nowTime = new Date().getTime();
        if (nowTime - lastTime < delay) return;
        fun(args);
        lastTime = nowTime;
    }

}