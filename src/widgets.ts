import Painter from "./painter";

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
            offsetx,
            offsety
        } = offset;
        // 填充三角形
        paint.beginPath();
        paint.fillStyle = "#c1c1c1";
        paint.moveTo(25 * scale + offsetx, 25 * scale + offsety);
        paint.lineTo(105 * scale + offsetx, 25 * scale + offsety);
        paint.lineTo(25 * scale + offsetx, 105 * scale + offsety);
        paint.fill();
        paint.moveTo(125 * scale + offsetx, 125 * scale + offsety);
        paint.lineTo(125 * scale + offsetx, 45 * scale + offsety);
        paint.lineTo(45 * scale + offsetx, 125 * scale + offsety);
        paint.closePath();
        paint.fill();
    }

    /**
     * @description 镜像翻转
     * @param paint 
     * @param offset 
     */
    public static drawMirror(paint: Painter, offset: Offset): void {
        const scale = .3;
        const {
            offsetx,
            offsety
        } = offset;

        paint.beginPath();
        paint.fillStyle = "#c1c1c1";
        paint.moveTo(10 * scale + offsetx, 5 * scale + offsety);
        paint.lineTo(0 * scale + offsetx, 15 * scale + offsety);
        paint.lineTo(10 * scale + offsetx, 25 * scale + offsety);

        paint.moveTo(30 * scale + offsetx, 5 * scale + offsety);
        paint.lineTo(40 * scale + offsetx, 15 * scale + offsety);
        paint.lineTo(30 * scale + offsetx, 25 * scale + offsety);


        paint.moveTo(17 * scale + offsetx, 0 * scale + offsety);
        paint.lineTo(23 * scale + offsetx, 0 * scale + offsety);
        paint.lineTo(23 * scale + offsetx, 30 * scale + offsety);
        paint.lineTo(17 * scale + offsetx, 30 * scale + offsety);
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
            offsetx,
            offsety
        } = offset;

        paint.beginPath();
        paint.strokeStyle = "#c1c1c1";
        paint.lineWidth = 2;
        paint.moveTo(0 * scale + offsetx, 0 * scale + offsety);
        paint.lineTo(10 * scale + offsetx, 10 * scale + offsety);
        paint.moveTo(10 * scale + offsetx, 0 * scale + offsety);
        paint.lineTo(0 * scale + offsetx, 10 * scale + offsety);
        paint.stroke();
        paint.lineWidth = 1;
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
            offsetx,
            offsety
        } = offset;

        paint.beginPath();
        paint.strokeStyle = "#c1c1c1";
        paint.lineWidth = 1;
        paint.arc(5+offsetx,offsety+3,3,Math.PI,0);
        paint.strokeRect(offsetx,offsety+4,10,6);
        paint.strokeRect(offsetx+4,offsety+6,2,2);
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
            offsetx,
            offsety
        } = offset;

        paint.beginPath();
        paint.strokeStyle = "#c1c1c1";
        paint.lineWidth = 1;
        paint.arc(5+offsetx,offsety+2,3,Math.PI,0);
        paint.strokeRect(offsetx,offsety+6,10,6);
        paint.strokeRect(offsetx+4,offsety+7,2,2);
        paint.stroke();
        paint.closePath();
    }
}
export default Widgets;
