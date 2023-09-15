
/**
 * @description uint8Array 序列化
 * @param arr 
 * @returns 
 */
const uint8ArrayConvert=(arr:Uint8ClampedArray)=>{
    const pako=require("pako");
    return pako.gzip(arr);
}
/**
 * @description 字符串转换为 UintArray
 * @param string 
 * @returns 
 */
const parseUint8Array=(string:string):Uint8Array=>{
    const pako=require("pako");
    return pako.inflate(string); 
}

export {
    uint8ArrayConvert,
    parseUint8Array
}