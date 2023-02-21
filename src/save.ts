import Painter from "./painter";
import Rect from "./rect";

class Save{
	/**
	 * @description 只有在浏览器端生效
	 * @param {Object} paint
	 * @param {Object} size
	 * @return Promise<ImageData >
	 */
	private onBrowser(canvasId:string,size:Size):Promise<string>{
		const {width,height}=size;
		return new Promise((resolve,reject)=>{
			try{
				if(document){
					const canvas:HTMLCanvasElement=document.querySelector(canvasId);
					const data=canvas.toDataURL();
					resolve(data);
				}else {
					resolve(null)
				}
				
			}catch(e){
				reject(e);
			}
		})
	}
	
	/**
	 * @description Uniapp端生效
	 * @param {string} canvasId
	 * @param {Object} size
	 */
	private onUniapp(canvasId:string,size:Size):Promise<any>{
		const {width,height}=size;
		return new Promise((resolve,reject)=>{
			try{
				uni.canvasToTempFilePath({
				  canvasId: canvasId,
				  x: 0,
				  y: 0,
				  width: width,
				  height: height,
				  destWidth:width,
				  destHeight:height,
				  success(res) {
					  resolve(res);
				  },
				  fail(e){
					  reject(e);
				  }
				});
			}catch(e){
				reject(e);
			}
		})
	}
	public save(params:{canvasId:string,paint?:Painter,width:number,height:number}):Promise<any>{
		const {canvasId,paint,width,height}=params;
		if(typeof(uni)!="undefined")return this.onUniapp(canvasId,{width,height})
		if(typeof(window)!="undefined")return this.onBrowser(canvasId,{width,height});
		
	}
	private getImageData(params:{canvasId:string,paint:Painter,width:number,height:number}):Promise<any>{
		const {canvasId,paint,width,height}=params; 
		if(typeof(uni)!="undefined")return this.getImageDataOnUniapp(canvasId,{width,height})
		if(typeof(window)!="undefined")return this.getImageDataOnBrowser(paint,{width,height});
	}
	/**
	 * @description 只有在浏览器端生效
	 * @param {Object} paint
	 * @param {Object} size
	 * @return Promise<ImageData >
	 */
    private getImageDataOnBrowser(paint:Painter,size:Size):Promise<ImageData>{
		const {width,height}=size;
		return new Promise((resolve,reject)=>{
			try{
				const imageData=paint.getImageData(0,0,width,height);
				resolve(imageData);
			}catch(e){
				reject(e);
			}
		})
	}
	
	/**
	 * @description Uniapp端生效
	 * @param {string} canvasId
	 * @param {Object} size
	 */
	getImageDataOnUniapp(canvasId:string,size:Size){
		const {width,height}=size;
		return new Promise((resolve,reject)=>{
			try{
				uni.canvasGetImageData({
				  canvasId: canvasId,
				  x: 0,
				  y: 0,
				  width: width,
				  height: height,
				  success(res) {
					  resolve(res);
				  },
				  fail(e){
					  reject(e);
				  }
				});
			}catch(e){
				reject(e);
			}
		})
	}
}

export default Save;