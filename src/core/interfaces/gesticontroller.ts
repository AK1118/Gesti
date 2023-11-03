import ViewObject from "../abstract/view-object";
import { ViewObjectFamily } from "../enums";
import XImage from "../lib/ximage";
//图层控制器
interface LayerController {
  /**
   * 图层向下移动一位
   */
  layerLower(view?: ViewObject): void;
  /**
   * 图层向上移动一位
   */
  layerRise(view?: ViewObject): void;
  /**
   * 置于最顶层
   */
  layerTop(view?: ViewObject): void;
  /**
   * 置于最底层
   */
  layerBottom(view?: ViewObject): void;
  /**
   * 解锁图层
   */
  unLock(view?: ViewObject): void;
  /**
   * 锁定图层
   */
  lock(view?: ViewObject): void;
  /**
   * 取消所有被聚焦的对象
   */
  cancelAll(): void;
  /**
   * 取消当前被聚焦对象
   */
  cancel(view?: ViewObject): void;
  /**
   * 被选中对象居中画布
   */
  center(axis?: CenterAxis, view?: ViewObject): void;
  /**
     * 更新文字图层内容
     * @param text:String
     * 
     *  options {
            fontFamily?: string,
            fontSize?: number,
            spacing?:number,
            color?:string,
        }

     * 
     */
  updateText(text: string, options?: TextOptions): void;
  /**
   * @description 选中图册位移变化 向上移动一距离
   * @param viewObject
   */
  upward(viewObject?: ViewObject): number;
  /**
   * @description 选中图册位移变化 向下移动一距离
   * @param viewObject
   */
  downward(viewObject?: ViewObject): number;
  /**
   * @description 选中图册位移变化 向左移动一距离
   * @param viewObject
   */
  leftward(viewObject?: ViewObject): number;
  /**
   * @description 选中图册位移变化 向右移动一距离
   * @param viewObject
   */
  rightward(viewObject?: ViewObject): number;
  /**
   *  旋转已被选中对象  传入弧度  可使用公式【 angle++ * Math.PI / 180  】转换角度为弧度
   * @param angle
   * @param existing //是否在现有基础上旋转
   * @param view
   */
  rotate(angle: number, existing?: boolean, view?: ViewObject): Promise<void>;
  /**
   * 获取当前选中对象
   */
  get currentViewObject(): ViewObject;
  /**
   * 选中传入的可操作对象
   * @param select
   */
  select(select: ViewObject): Promise<void>;
  /**
   * 清空所有元素
   */
  cleanAll(): Promise<void>;

  position(x:number,y:number,view?:ViewObject):void;
  /**
   * @description 关闭某个图层
   * @param view 
   */
  close(view?:ViewObject):void;
  /**
   * @description 镜像
   * @param view 
   * @returns {boolean} 返回是否处于镜像
   */
  mirror(view?:ViewObject):boolean;

}

type ListenerCallback = (object: any) => void;

//画布控制器
interface ImageToolKitController {
  /**
   *
   * @param view 将可操作对象载入gesti内
   */
  load(view: ViewObject): void;
  /**
   * 回退操作
   * @deprecated 功能废弃
   */
  fallback(): void;
  /**
   * 取消刚刚的回退
   * @deprecated 功能废弃
   */
  cancelFallback(): void;
  /**
   * 刷新画布
   */
  update(): void;
  /**
   * 新增图片
   * @param @XImage
   */
  addImage(ximage: XImage | Promise<XImage>): Promise<ViewObject>;
  /**
     * @description 传入对应的值返回一个Promise<XImage>对象,option可传入 图片width、height、scale,maxScale,minScale,
     * @param image 
     * @param options 
     * 
    *   {
                data?: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions,
                width?: number,
                height?: number,
                scale?: number,
                maxScale?: number,
                minScale?: number,
            }
     */
  createImage(
    image:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | Blob
      | ImageData
      | ImageBitmap
      | OffscreenCanvas,
    options?: createImageOptions
  ): Promise<XImage>;
  /**
   * @description 添加文字
   * @param text
   * @param options
   */
  addText(text: string, options?: TextOptions): Promise<ViewObject>;
  addListener(
    listenType: GestiControllerListenerTypes,
    callback: ListenerCallback,
    prepend?: boolean
  ): any;
  removeListener(
    listenType: GestiControllerListenerTypes,
    hook: ListenerCallback
  ): void;
  addWrite(options: {
    type: GraffitiType;
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): void;
  /**
   * @description 导出所有对象成JSON字符串
   * @param offScreenPainter  离屏渲染对象
   */
  exportAll(offScreenPainter: CanvasRenderingContext2D): Promise<string>;
  /**
   * @description 导出所有对象成JSON字符串
   * @param offScreenPainter  离屏渲染对象
   */
  exportAllWithWeChat(offScreenPainter: CanvasRenderingContext2D): Promise<string>;
  /**
   * @description 导入Json字符串解析成canvas对象
   * @param json
   */
  importAll(json: string): Promise<void>;
  /**
   * 在微信小程序内导入
   * @param json 导入JSON
   * @param weChatCanvas 微信2d画布
   */
  importAllWithWeChat(json: string, weChatCanvas: any): Promise<void>;

  /**
   * @description 销毁Gesti对象
   */
  destroyGesti(): void;

  querySelector(select:string|ViewObjectFamily):Promise<ViewObject|ViewObject[]>;

  getViewObjectById<T extends ViewObject>(id:string):Promise<T>;
  
}
/**
 * 控制器类，提供接口供给用户使用
 */
interface GestiController extends LayerController, ImageToolKitController {
  /**
   * @description 鼠标/手指按下时调用
   * @param e
   */
  down(e: Event): void;
  /**
   * @description 鼠标/手指抬起时调用
   * @param e
   */
  up(e: Event): void;
  /**
   * @description 鼠标/手指移动时调用
   * @param e
   */
  move(e: Event): void;
  /**
   * @description 鼠标滚轮时调用
   * @param e
   */
  wheel(e: Event): void;
  /**
      * 取消原有事件控制权
      * 值得注意: 当调用该方法后，画布所有的手势监听都会消失。也就是说您不能再点击选取画布，除非您主动调用控制器的down/up/move/wheel方法恢复功能。
      * 栗子：
      * 
      *     window.addEventListener('touchstart',(e)=>{
                controller.down(e);
            })
            window.addEventListener('touchmove',(e)=>{
                controller.move(e);
            })
            window.addEventListener('touchend',(e)=>{
                controller.up(e);
            })
            
            //根据您的需求添加

            window.addEventListener('mousedown',(e)=>{
                controller.down(e);
            })
            window.addEventListener('mousemove',(e)=>{
                controller.move(e);
            })
            window.addEventListener('mouseup',(e)=>{
                controller.up(e);
            })
            window.addEventListener('wheel',(e)=>{
                controller.wheel(e);
            })
      */
  cancelEvent(): void;
}

export default GestiController;
