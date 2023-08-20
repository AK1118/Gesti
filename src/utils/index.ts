export const base64Head = "data:image/jpeg;base64,";

/**
 * @deprecated
 * img标签转换base64
 * @returns
 */
export function imageHtmltoBase64(_img: HTMLImageElement): Promise<string> {
  return new Promise(async (r, j) => {
    try {
      const img = new Image();
      img.src = _img.src;
      const res = await fetch(img.src, {
        method: "GET",
      });
      const stream: ReadableStream = res.body;
      
      const read = await stream.getReader().read();
      const arr8: Uint8Array = read.value as Uint8Array;
      r(base64Head + window?.btoa(String.fromCharCode(...arr8)));
    } catch (error) {
      j(error);
    }
  });
}
/**
 * @description 文件图片转换成base64
 * @returns
 */
export function fileToBase64(file: any): Promise<string> {
  return new Promise((r, j) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arr8: Uint8Array = new Uint8Array(e.target.result as ArrayBuffer);
        r(base64Head + window?.btoa(String.fromCharCode(...arr8)));
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      j(error);
    }
  });
}

export function dataURLtoBlob(dataurl:string, filename:string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * @description 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export const isType = (val: any) => {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else
    return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
};

export function classIs(clazzObj: Object, clazzName: string): boolean {
  return clazzObj.constructor.name == clazzName;
}
