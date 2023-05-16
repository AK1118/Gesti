### 主要特性

- Typescript开发，JavaScript,TypeScript都支持
- 支持 ESM & AMD ,支持 TS
- 基于原生Canvas，兼容主流浏览器，PC端以及移动端,兼容微信小程序，Uniapp App 端。
- 极简操作，更多功能，持续更新。

# 效果图

<img src="https://new.ivypha.com/static/uploads/2023/2/14/c3e00b72dc487661cdc63f03853215aa.gif"/>

# Gesti

![](https://img.shields.io/github/stars/AK1118/Gesti.svg)

**目录 (Table of Contents)**

- [保存](#保存)
- [在 微信小程序 | uniapp 端使用](#在-微信小程序--uniapp-端使用)
- [可能会遇到的问题](#可能会遇到的问题)
- [示例](#示例)
			- [HTML](#html)
			- [JavaScript 或 Typescript](#javascript-或-typescript)


### 安装

	npm install gesti

### 引入使用

	import Gesti from "gesti";

### 初始化

	const gesti=new Gesti();
	//h5端适用，其他端请参考API自行添加
	gesti.init(canvas);

### 加入图片

	//image 类型详情请参考API,传入一个 <img>也适用
	 gesti.addImage(gesti.createImage(image));

# API

## Gesti

| 方法名      | 返回值类型  |  所属    |    参数    |   说明   |
| :----:      |   :----: | :----:   |  :----:   | :----:      | 
| init      |    void      |     Gesti   |    (canvas?: HTMLCanvasElement, paint?: CanvasRenderingContext2D, rect?:rectParam)   |     初始化 Gesti 时调用，共3个可选参数。canvas 和 paint 必须二选一，且没有传入canvas时，必须传入paint 和 rect.       |
| setConfig      |    void      |     Gesti   |   (config?: gesticonfig)   |     修改或设置配置，修改后会自动调用GestiController.update函数       |


| 属性名      | 返回值类型  |  所属    |    参数    |   说明   |
| :----:      |   :----: | :----:   |  :----:   | :----: | 
|  constructor | Gesti    |  Gesti |    config?: gesticonfig    |     构造函数,传入配置参数，当前只有两个可选参数  auxiliary?:boolean 控制辅助线开关和dashedLine?:boolean 控制包裹对象的虚线     |
|  static XImage | XImage  |  Gesti |    -    |     暴露给外部声明Ximage对象类型     |
|  controller | GestiController  |  Gesti |    -    |     控制器，获取控制器，详情请查看下方  GestiController   |
|  static config | GestiConfig  |  Gesti |    -    |     Gesti全局配置对象   |


#### init

	init(canvas?: HTMLCanvasElement, paint?: CanvasRenderingContext2D, rect?: {
        x?: number;
        y?: number;
        width: number;
        height: number;
    }): void;

- 初始化 Gesti 时调用，共3个可选参数
- canvas 和 paint 必须二选一，且没有传入canvas时，必须传入paint 和 rect.

***在H5端，推荐您直接传入一个canvas即可***

## GestiController

| 方法名      | 返回值类型              |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| addText    | Promise\<boolean\>|      GestiController     |    text: string, options?: textOptions ) |    新增文字图层到画布内    |
| updateText  | void              |    GestiController  |       (text: string, options?:textOptions )     |      更新被选中的文字图层的文字内容，或者文字属性   |
| layerLower  | void             |      GestiController     |    -      |    图层向下移动一层    |
| layerRise  | void             |      GestiController     |     -     |    图层向上移动一层    |
| layerTop  | void             |      GestiController     |     -     |    图层置于最顶层    |
| layerBottom  | void             |      GestiController     |    -      |    图层置于最底层    |
| lock    | void             |      GestiController     |     -     |    锁定当前选中图层    |
| deLock    | void             |      GestiController     |     -     |    解锁当前选中图层    |
| cancel    | void             |      GestiController     |      -    |    取消当前被聚焦对象    |
| cancelAll    | void             |      GestiController     |     -     |    取消所有被聚焦对象    |
| fallback(暂未全局兼容)    | void             |      GestiController     |     -     |    撤销    |
| cancelFallback(暂未全局兼容)    | void             |      GestiController     |    -      |    取消上次撤销    |
| down    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指点击事件时调用    |
| up    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指抬起事件时调用    |
| move    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指移动事件时调用    |
| wheel    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标滚轮事件时调用    |
| addListener    | void  |   GestiController |    (listenType:"onSelect"\|"onHide"\|"onCancel",callback:ListenerCallback)     |   监听图层操作，目前支持监听选中、取消选中和隐藏    |
| rotate    | Promise\<void\>  |   GestiController |    angle: number     |   旋转被选中对象,传入弧度。可传入  角度*Math.PI/180     |
| upward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向上移动距离 1     |
| downward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向下移动距离 1     |
| leftward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向左移动距离 1     |
| rightward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向右移动距离 1     |
| update    | void  |   GestiController |    -    |   调用后会重绘canvas,一般在改变数据后画布未刷新时使用     |
| importAll(试行)    | Promise\<void\>  |   GestiController |    (json: string)   |   以json形式导入对象集合 |
| exportAll(试行)   | Promise\<void\>  |   GestiController |    -   |   以json形式导出对象集合, 小图片支持base64导出，大型图片会溢base64    |
| center   | void  |   GestiController |   (axis?: "vertical" \| "horizon")   |  垂直居中或者水平居中，不填写参数水平垂直居中    |
| addImage   | 	Promise\<boolean\>  |   GestiController |   (ximage: XImage \| Promise<XImage>)   |  添加一张图片到画布内    |
| createImage   | 	Promise\<XImage\>  |   GestiController |   (image: HTMLImageElement \| SVGImageElement \| HTMLVideoElement \| HTMLCanvasElement \| Blob \| ImageData \| ImageBitmap \| OffscreenCanvas, options?: createImageOptions)   |  传入图片数据，返回一个Ximage对象,详细使用方法参考Demo    |
| cancelEvent   | void  |   GestiController |   -   |  取消Gesti自带的鼠标手指时间监听。使用该函数后需要自行调用鼠标各个事件，请参考上方  down,up,move  ,使用详情参考Demo    |
| addWrite   | 	void  |   GestiController |   (options: {type: "circle" \| "write" \| "line" \| "rect" \| "none";lineWidth?: number;color?: string;isFill?: boolean;})   |  添加涂鸦功能，调用该函数且传入options.type不为"none"时，下一次在canvas内滑动会触发生成对应的涂鸦对象,直到再次调用该函数且options.type为"none"时停止    |


| 属性名      | 返回值类型         |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| currentViewObject| Promise\<ViewObject\> | GestiController | - | 获取当前选中对象|


## ViewObject
- 画布内的可操作对象，每一张图片对象或者文字对象或者其他都是它在画布上的映射。
- 获取它的途径一般来自于controller.currentViewObject , 或者controller.addListener的回调

| 方法名      | 返回值类型              |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| getBaseInfo    | Object |      ViewObject     |    -   |    获取对象的位置，大小，旋转，镜像，锁定值    |
| value    | any |      ViewObject     |    -   |    获取对象的值，比如一个文字对象内的文字    |

| 属性名      | 返回值类型         |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| rect    | Rect |      ViewObject     |    -   |    获取对象的位置，大小，旋转值    |


# Hooks
- 对于React和Vue3开发者来说,组合式Api无疑是干净的

### 创建对象系列
| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|createGesti | Gesti |     (config?: gesticonfig)    |    创建一个Gesti实例      |
|useController | GestiController |    (target?: Gesti)    |  得到一个Gesti实例的控制器    |

### 监听系列
| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|onSelected  |   -    |    (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    选中对象时回调      |
|onHover | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    是的，就像CSS3的Hover一样      |
|onLeave | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    离开对象时调用      |
|onCancel | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    取消选中时      |
|onHide | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    隐藏可操作对象时      |
|onUpdate | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    刷新画布时      |
|onLoad | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    载入新的对象到画布内时      |

### 添加预设系列
| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|addVerticalLine | Promise\<ViewObject> |    -     |    新增预设垂直线到画布内      |
|addHorizonLine | Promise\<ViewObject> |    -     |    新增预设水平线到画布内      |
|addRect | Promise\<ViewObject> |    -     |    新增预设矩形到画布内      |
|addCircle | Promise\<ViewObject> |    -     |    新增预设圆形到画布内      |


### 创建ViewObject可操作对象系列
- 自己创建的对象，用着放心

| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|createTextBox | TextBox |   (text: string, options?: textOptions)     |    创建一个文本对象      |
|createXImage | XImage |   (option: {data,width:number,height:number})  |    创建一个XImage对象，注意，这个并不是你所看到的那个图片，可以理解为它是图片源，渲染由下面这个类做到      |
|createImageBox | ImageBox |   (xImage: XImage)     |    创建一个图片对象      |
|createDragButton | Button | (view: ViewObject)    |    创建一个拖拽按钮      |
|createHorizonButton | Button | (view: ViewObject)    |    创建一个水平拖拽按钮      |
|createVerticalButton | Button | (view: ViewObject)    |    创建一个垂直拖拽按钮      |
|createRotateButton | Button | (view: ViewObject)    |    创建一个旋转按钮      |
|createLockButton | Button | (view: ViewObject)    |    创建一个上锁按钮      |
|createUnlockButton | Button | (view: ViewObject)    |    创建一个解锁按钮      |
|installButton | - | (view: ViewObject, button: Button \| Array<Button>)    |    安装按钮到ViewObject上      |
|unInstallButton | - | (view: ViewObject, button: Button \| Array<Button>)   |    卸载ViewObject上的按钮   |
|loadToGesti | - |    (view: ViewObject, target?: Gesti)    |    以防万一，这个放这里更显眼。加入一个ViewObject对象到画布内,以上的类都是继承于ViewObjet      |


### Use系列
| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|useGraffitiRect | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，矩形     |
|useGraffitiCircle | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，圆形     |
|useGraffitiLine | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，线条     |
|useGraffitiWrite | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，手写板     |
|useCloseGraffiti | - |    (option?: {...}, target?: Gesti    | 关闭涂鸦功能    |
|useTextHandler | - |    (option?: {...}, target?: Gesti    | 得到一个TextBox实例控制器，用于控制它的参数    |
|useReader | Promise<ViewObject> |    (json: string)    | 传入特定格式的json，返回一个ViewObject对象    |





# 保存

- 该库只是为您提供了canvas的代理操作，并没有改变canvas的任何原有API，所以您可以使用canvas自带的API进行存储。

# 在 微信小程序 | uniapp 端使用
- 微信小程序端我无法监听屏幕事件，但是您可以使用我提供的  [GestiController](#gesticontroller-1)  实现自定义事件。为canvas提供事件并在方法里面调用 [GestiController](#gesticontroller-1) 的各个方法。
- 如果您的uniapp运行在H5端，那您无需担心任何问题，如果您在其他端，请参考以上微信小程序方案
- 详细操作请参考Demo:  https://ext.dcloud.net.cn/plugin?id=10867
# 可能会遇到的问题
- 在执行操作方法后可能会出现画布为刷新问题，为您提供了controller.update方法手动刷新。
- Demo下载地址:  https://ext.dcloud.net.cn/plugin?id=10867 

# 示例

***用它，没有多麻烦。***

####  HTML

	<canvas id="canvas" width="300" height="300"></canvas>
    <img  id="img" src=""/>

#### JavaScript 或 Typescript

	const canvas: HTMLCanvasElement = document.querySelector("canvas");
	const gesti = new Gesti();
	const img: HTMLImageElement = document.querySelector("#img");
	gesti.init(canvas);
	gesti.controller.addImage(gesti.createImage(img))


***不是吗？***