import { createImageOptions } from "./index";

class XImage{
    data:any;
    width:number=0;
    height:number=0;
    x:number=0;
    y:number=0;
    scale:number=1;
    constructor(params:createImageOptions){
        const {data,width,height,scale}=params;
        if(!data||!width||!height)throw Error("宽或高不能为0");
        this.data=data;
        this.width=width;
        this.height=height;
        this.scale=scale||1;
    }
    toJson():rectparams{
		return {
			x:this.x,
			y:this.y,
			width:this.width,
			height:this.height,
		}
	}
}   
export default XImage;