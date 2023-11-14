import GestiConfig from "../config/gestiConfig";
import Painter from "../core/lib/painter";

/*使用Canvas渲染一些小部件*/
class Widgets {
    /**
     * @description 拖拽按钮
     * @param {Object} paint
     * @param {Vector} offset
     */
    public static drawGrag(paint: Painter, offset: Offset): void {
        const scale = .08;
        const {
            offsetX,
            offsetY
        } = offset;
        // 填充三角形
        paint.beginPath();
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.fillStyle = GestiConfig.theme.buttonIconColor;
        paint.moveTo(25 * scale + offsetX, 25 * scale + offsetY);
        paint.lineTo(105 * scale + offsetX, 25 * scale + offsetY);
        paint.lineTo(25 * scale + offsetX, 105 * scale + offsetY);
        paint.fill();
        paint.moveTo(125 * scale + offsetX, 125 * scale + offsetY);
        paint.lineTo(125 * scale + offsetX, 45 * scale + offsetY);
        paint.lineTo(45 * scale + offsetX, 125 * scale + offsetY);
        paint.closePath();
        paint.fill();
    }
    /**
         * @description 拖拽按钮
         * @param {Object} paint
         * @param {Vector} offset
         */
    public static drawRotate(paint: Painter, offset: Offset): void {
        const scale = .08;
        paint.lineWidth=1;
        const {
            offsetX,
            offsetY
        } = offset;
        // 填充三角形
        paint.beginPath();
        paint.fillStyle = GestiConfig.theme.buttonIconColor;
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.arc(offsetX,offsetY,4,0,Math.PI*.6);
        paint.stroke();
        paint.closePath();
        paint.beginPath();
        paint.fillStyle = GestiConfig.theme.buttonIconColor;
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.arc(offsetX,offsetY,4,Math.PI,Math.PI*1.6);
        paint.stroke();
        paint.closePath();
    }
    /**
     * 
     * 图像为一个ICON,想要图像居中,就需要知道图像的宽高
     * 
     * @description 镜像翻转
     * @param paint 
     * @param offset 
     */
    public static drawMirror(paint: Painter, offset: Offset): void {
        const scale = 1;
        const {
            offsetX,
            offsetY
        } = offset;
        const width:number=30,height:number=30;
        paint.beginPath();
        paint.fillStyle = GestiConfig.theme.buttonIconColor;
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.moveTo(10 * scale + offsetX, 5 * scale + offsetY);
        paint.lineTo(0 * scale + offsetX, 15 * scale + offsetY);
        paint.lineTo(10 * scale + offsetX, 25 * scale + offsetY);

        paint.moveTo(30 * scale + offsetX, 5 * scale + offsetY);
        paint.lineTo(40 * scale + offsetX, 15 * scale + offsetY);
        paint.lineTo(30 * scale + offsetX, 25 * scale + offsetY);


        paint.moveTo(17 * scale + offsetX, 0 * scale + offsetY);
        paint.lineTo(23 * scale + offsetX, 0 * scale + offsetY);
        paint.lineTo(23 * scale + offsetX, 30 * scale + offsetY);
        paint.lineTo(17 * scale + offsetX, 30 * scale + offsetY);
        paint.closePath();
        paint.fill();
    }


    /**
     * @description 删除
     * @param paint 
     * @param offset 
     */
    public static drawClose(paint: Painter, offset: Offset): void {
        const scale = .7;
        const {
            offsetX,
            offsetY
        } = offset;

        paint.beginPath();
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.lineWidth = 1;
        paint.moveTo(0 * scale + offsetX, 0 * scale + offsetY);
        paint.lineTo(10 * scale + offsetX, 10 * scale + offsetY);
        paint.moveTo(10 * scale + offsetX, 0 * scale + offsetY);
        paint.lineTo(0 * scale + offsetX, 10 * scale + offsetY);
        paint.stroke();
        paint.closePath();
    }


    /**
     * @description 上锁中
     * @param paint 
     * @param offset 
     */
    public static drawLock(paint: Painter, offset: Offset) {
        const scale = .7;
        const {
            offsetX,
            offsetY
        } = offset;

        paint.beginPath();
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.lineWidth = 1;
        paint.arc(5 + offsetX, offsetY + 3, 3, Math.PI, 0);
        paint.strokeRect(offsetX, offsetY + 4, 10, 6);
        paint.strokeRect(offsetX + 4, offsetY + 6, 2, 2);
        paint.stroke();
        paint.closePath();
    }


    /**
     * @description 解锁状态
     * @param paint 
     * @param offset 
     */
    public static drawDeLock(paint: Painter, offset: Offset) {
        const scale = .7;
        const {
            offsetX,
            offsetY
        } = offset;
        paint.beginPath();
        paint.strokeStyle = GestiConfig.theme.buttonIconColor;
        paint.lineWidth = 1;
        paint.arc(5 + offsetX, offsetY + 2, 3, Math.PI, 0);
        paint.strokeRect(offsetX, offsetY + 6, 10, 6);
        paint.strokeRect(offsetX + 4, offsetY + 7, 2, 2);
        paint.stroke();
        paint.closePath();
    }

    /**
     * @description 改变宽度或者高度，不是等比例缩放
     * @param paint 
     * @param offset 
     */
    public static drawChangeSizeAlone(paint: Painter, offset: Offset){
        const {
            offsetX:x,
            offsetY:y
        } = offset;
        paint.beginPath();
        paint.fillStyle=GestiConfig.theme.buttonIconColor;
        // paint.fillRect(x-5,y-5,10,10);
        paint.arc(x,y,5,0,Math.PI*2);
        paint.fill();
        paint.closePath();
    }

    //预设竖线，后使用importAll导入即可
    public static verticalLine='{"viewObjType":"write","options":{"config":{"type":"line","lineWidth":3,"color":"black","isFill":false,"scaleX":1,"scaleY":1},"points":[{"x":-175,"y":0},{"x":175,"y":0}],"rect":{"x":275,"y":298,"width":351,"height":30,"angle":-1.576494270827876},"relativeRect":{"x":0,"y":0,"width":351,"height":30,"angle":-1.576494270827876},"mirror":false,"locked":false}}';

    //预设横线
    public static horizonLine='{"viewObjType":"write","options":{"config":{"type":"line","lineWidth":3,"color":"black","isFill":false,"scaleX":1,"scaleY":1},"points":[{"x":-144,"y":0},{"x":144,"y":0}],"rect":{"x":244,"y":549,"width":289,"height":30,"angle":-0.006920304750240513},"relativeRect":{"x":0,"y":0,"width":289,"height":30,"angle":-0.006920304750240513},"mirror":false,"locked":false}}';

    //预设矩形
    public static rect='{"viewObjType":"write","options":{"config":{"type":"rect","color":"black","lineWidth":1,"isFill":false,"scaleX":1,"scaleY":1},"points":[{"x":-115,"y":-74},{"x":115,"y":-74},{"x":115,"y":74},{"x":-115,"y":74}],"rect":{"x":299,"y":355,"width":231,"height":148,"angle":0},"relativeRect":{"x":0,"y":0,"width":231,"height":148,"angle":0},"mirror":false,"locked":false}}';

    //预设源泉
    public static circle='{"viewObjType":"write","options":{"config":{"type":"circle","color":"black","lineWidth":1,"isFill":false,"scaleX":1,"scaleY":1},"points":[{"x":-78,"y":-57},{"x":78,"y":57}],"rect":{"x":297,"y":342,"width":157,"height":114,"angle":0},"relativeRect":{"x":0,"y":0,"width":157,"height":114,"angle":0},"mirror":false,"locked":false}}';
}
export default Widgets;
