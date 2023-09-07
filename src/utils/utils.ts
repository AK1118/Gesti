const pako=require("pako");
/**
 * @description uint8Array 序列化
 * @param arr 
 * @returns 
 */
const uint8ArrayConvert=(arr:Uint8ClampedArray)=>{
    return pako.gzip(arr);
}
/**
 * @description 字符串转换为 UintArray
 * @param string 
 * @returns 
 */
const parseUint8Array=(string:string):Uint8Array=>{
    return pako.inflate(string); 
}

export {
    uint8ArrayConvert,
    parseUint8Array
}