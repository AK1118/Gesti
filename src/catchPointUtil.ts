import CheckInside from "./checkInside";
import ImageBox from "./imageBox";
import Rect from "./rect";
import Vector from "./vector";
import { Point } from "./vertex";

class CatchPointUtil{
    static _checkInside:CheckInside=new CheckInside;
    /**
     * 
     * @param imageBox 
     * @param event 
     * @returns 
     */
    static catchImageBox(imageBoxList:ImageBox[],position:any):ImageBox{
        const len:number=imageBoxList.length-1;
        for(let i=len;i>=0;i--){
            const item:ImageBox=imageBoxList[i];
            if(CatchPointUtil.inArea(item.rect,position)){
                return item;
            }
        }
        return null;
    }
    static inArea(rect:Rect,position:Vector):boolean{
        const points:Point[]=rect.vertex.getPoints();
        const point:Point=new Point(
            position.x,
            position.y
        );
        return !!CatchPointUtil._checkInside.checkInside(points,4,point);
    }
    /**
	 * @param {Vector} p1
	 * @param {Vector} p2
	 * @param {Object} radius
	 */
	static checkInsideArc(p1:Vector, p2:Vector, radius:number) :boolean{
		return Vector.dist(p1, p2) < radius;
	}
}

export default CatchPointUtil;