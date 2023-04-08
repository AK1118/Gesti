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

/**
 * 返回某个实例化对象是否等于某个类
 * @param obj 实例化对象 
 * @param obj2 类名
 * @returns 
 */
export const classTypeIs=(obj:any,obj2:any)=>{
    const clazzName1=obj?.constructor.name;
    return clazzName1==obj2?.name;
}