import OperationObserver from "../abstract/operation-observer";
import ViewObject from "../abstract/view-object";
import Painter from "../painter";

/**
 * 实现逻辑
 * 新建一个 canvas等宽高的矩阵,锁定它，
 * 
 */
class WriteViewObj extends ViewObject {
    private points: Array<Vector> = [];
    private _scale: number = 1;
    private color:string="";
    constructor(points: Array<Vector>,color:string) {
        super();
        this.points = points;
        this.color=color;
    }
    drawImage(paint: Painter): void {
        paint.strokeStyle=this.color;
        const len = this.points.length;
        paint.beginPath();
        
        for (let i = 1; i < len; i++) {
            const currentPoint = this.points[i];
            const beforePoint = this.points[i - 1];
            paint.lineCap = "round";
            let prex = beforePoint.x, prey = beforePoint.y;
            let curx = currentPoint.x, cury = currentPoint.y;
            let cx = (prex + curx) * .5;
            let cy = (prey + cury) * .5;
            //  paint.moveTo(prex * this._scale, prey * this._scale);
            //  paint.lineTo(curx * this._scale, cury * this._scale);
             paint.quadraticCurveTo(prex* this._scale,prey* this._scale,cx* this._scale,cy* this._scale);
        }
        paint.lineWidth = 3;
        paint.stroke();
        paint.closePath();
    }
    public didChangeScale(scale: number): void {
        this._scale = this.rect.size.width / this.relativeRect.size.width;
    }
}

export default WriteViewObj;