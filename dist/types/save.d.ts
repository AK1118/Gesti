import Painter from "./painter";
declare class Save {
    /**
     * @description 只有在浏览器端生效
     * @param {Object} paint
     * @param {Object} size
     * @return Promise<ImageData >
     */
    private onBrowser;
    /**
     * @description Uniapp端生效
     * @param {string} canvasId
     * @param {Object} size
     */
    private onUniapp;
    save(params: {
        canvasId: string;
        paint?: Painter;
        width: number;
        height: number;
    }): Promise<any>;
    private getImageData;
    /**
     * @description 只有在浏览器端生效
     * @param {Object} paint
     * @param {Object} size
     * @return Promise<ImageData >
     */
    private getImageDataOnBrowser;
    /**
     * @description Uniapp端生效
     * @param {string} canvasId
     * @param {Object} size
     */
    private getImageDataOnUniapp;
}
export default Save;
//# sourceMappingURL=save.d.ts.map