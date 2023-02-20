import Painter from "./painter";
import Rect from "./rect";
import Vector from "./vector";

class Point extends Vector {
    constructor(x: number, y: number) {
        super(x, y);
    }
    public toArray(): Array<number> {
        return [this.x, this.y];
    }
}
export {Point};
/**
 * 包裹图片Rect的矩阵点，通常为4个点
 */
class Vertex {
    private points: Array<Point> = new Array<Point>();
    constructor(points: Array<Array<number>>) {
        this.points = points.map((item: Array<number>): Point => {
            const [x,y]=item;
            return new Point(x, y);
        });
    }

    public setPoints(points: Array<Point>) {
        this.points = points;
    }
    public getPoints(){
        return this.points;
    }
    /**
     * @description 根据传入角度，旋转该类的顶点
     * @param angle 
     * @param rect 
     */
    public rotate(angle: number, rect: Rect) {
        const cos_: number = Math.cos(angle),
            sin_: number = Math.sin(angle);
        const rotateAngle = (point: Point): Array<number> => {
            const x: number = point.x * cos_ - point.y * sin_;
            const y: number = point.x * sin_ + point.y * cos_;
            return [x, y];
            // const mf = [
		// 	[cos_, (sin_*-1) , 0],
		// 	[sin_, cos_, 0],
		// 	[0, 0, 1]
		// ];
        }
        const len=this.points.length;
        for(let i=0;i<len;i++){
            const point:Point=this.points[i];
            const [x,y]=rotateAngle(point);
            point.x=x+rect.position.x;
            point.y=y+rect.position.y;
        }
    }
    /**
     * @description 矫正位置
     * @param rect 
     */
    public correctPosition(rect:Rect){
         const len=this.points.length;
        for(let i=0;i<len;i++){
            const point:Point=this.points[i];
            point.x+=rect.position.x;
            point.y+=rect.position.y;
        }
    }
    public drawPoints(paint:Painter){
        this.points.forEach((point:Point)=>{
            paint.fillRect(point.x,point.y,3,3);
        })
    }
}
export default Vertex;