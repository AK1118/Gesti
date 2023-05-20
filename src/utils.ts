type DebounceCallback = (args: any) => void;

//防抖
export const Debounce = (fun: DebounceCallback, delay: number) => {
  let timer = null;
  return (args: any) => {
    if (timer != null) clearTimeout(timer);
    timer = setTimeout(() => {
      fun(args);
    }, delay);
  };
};

//节流
export const Throttle = (fun: DebounceCallback, delay: number) => {
  let lastTime: number = 0;
  return (args: any) => {
    let nowTime = new Date().getTime();
    if (nowTime - lastTime < delay) return;
    fun(args);
    lastTime = nowTime;
  };
};

/**
 * 返回某个实例化对象是否等于某个类
 * @param obj 实例化对象
 * @param obj2 类名
 * @returns
 */
export const classTypeIs = (obj: any, obj2: any) => {
  const clazzName1 = obj?.constructor.name;
  return clazzName1 == obj2?.name;
};
/**
 * @description 1inch=72pt
 * @param inch
 */
export const inToPx = (inch: number): number => {
  return ptToPx(inch * 72);
};
/**
 * @description 1inch=25.5 mm
 * @param mm
 * @returns
 */
export const mmToIn = (mm: number): number => {
  return (mm / 25.4);
};
/**
 * @description 1pt是一英镑=1/72(inch)英寸   取dpi=96
 * 得到    px=(pt/72)*96
 * @param pt
 */
export const ptToPx = (pt: number): number => {
  return Math.round((pt / 72) * 96);
};

export const sp = (pt: number): number => {
  return ptToPx(pt);
};

export const coverUnit = (value: number): number => {
  const type: "mm" | "pt" = "mm";
  if (type == "mm") return +inToPx(mmToIn(value)).toFixed(2);
  else if (type == "pt") return +ptToPx(value).toFixed(2);
};
