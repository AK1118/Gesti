import { ImageChunk } from "../types/index";
const pako=require("pako");
/**
 * 解析器基类
 */
abstract class ImageChunkConverter {
    abstract  chunkToBase64(chunk: ImageChunk,canvas?:any): ImageChunk;
    abstract  base64ToChunk(chunk: ImageChunk,canvas?:any): ImageChunk;
    public coverAllImageChunkToBase64(chunks: ImageChunk[]): Array<ImageChunk> {
        const arr = chunks.map((item, ndx) => this.chunkToBase64(item));
        return arr;
    }
    /**
     * @description chunks必须是数组类型json
     * @param chunks 
     * @returns 
     */
    public coverAllImageChunkBase64ToChunk(chunks: Array<ImageChunk>): Array<ImageChunk> {
        const arr = chunks || [];
        return arr.map((item, ndx) => this.base64ToChunk(item));
    }

    public customBtoa(input):string{
        let result = '';
        let padding = 0;
        const base64Chars: string =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for (let i = 0; i < input.length; i += 3) {
            const a = input.charCodeAt(i);
            const b = input.charCodeAt(i + 1);
            const c = input.charCodeAt(i + 2);

            // Concatenate the bits of the three bytes into a single integer
            const combined = (a << 16) | (b << 8) | c;

            // Extract the base64 characters for each 6-bit chunk and add padding if needed
            result +=
                base64Chars[(combined >> 18) & 63] +
                base64Chars[(combined >> 12) & 63] +
                base64Chars[(combined >> 6) & 63] +
                base64Chars[combined & 63];

            // Keep track of how much padding is needed
            padding = input.length - i - 3;
        }

        // Add padding characters '=' based on how many bytes were in the original data
        if (padding === 1) {
            result = result.slice(0, -1) + '=';
        } else if (padding === 2) {
            result = result.slice(0, -2) + '==';
        }

        return result;
    }
    public customAtob(input) {
        const base64Chars: string =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let result = '';
        const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0;

        for (let i = 0; i < input.length; i += 4) {
            const chunk =
                (base64Chars.indexOf(input[i]) << 18) |
                (base64Chars.indexOf(input[i + 1]) << 12) |
                (base64Chars.indexOf(input[i + 2]) << 6) |
                base64Chars.indexOf(input[i + 3]);

            const bytes = [
                (chunk >> 16) & 0xff,
                (chunk >> 8) & 0xff,
                chunk & 0xff,
            ].slice(0, 3 - padding);

            result += String.fromCharCode(...bytes);
        }

        return result;
    }

}

export default ImageChunkConverter;