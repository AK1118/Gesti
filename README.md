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

- [效果图](#效果图)
- [Gesti](#gesti)
		- [安装](#安装)
		- [引入使用](#引入使用)
		- [初始化](#初始化)
		- [加入图片](#加入图片)
- [API](#api)
	- [Gesti\[方法\]](#gesti方法)
			- [init](#init)
			- [addImage](#addimage)
			- [createImage](#createimage)
			- [update](#update)
	- [Gesti\[属性\]](#gesti属性)
			- [debug](#debug)
			- [Gesti.XImage](#gestiximage)
			- [Gesti.controller](#gesticontroller)
	- [GestiController](#gesticontroller-1)
			- [addText](#addtext)
			- [updateText](#updatetext)
			- [layerLower](#layerlower)
			- [layerRise](#layerrise)
			- [layerTop](#layertop)
			- [layerBottom](#layerbottom)
			- [lock](#lock)
			- [deLock](#delock)
			- [cancel](#cancel)
			- [cancelAll](#cancelall)
			- [fallback](#fallback)
			- [cancelFallback](#cancelfallback)
			- [down](#down)
			- [up](#up)
			- [move](#move)
			- [wheel](#wheel)
			- [addListener](#addlistener)
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

| 属性名      | 返回值类型  |  所属    |    参数    |   说明   |
| :----:      |   :----: | :----:   |  :----:   | :----: | 
|  constructor | Gesti    |  Gesti |    config?: gesticonfig    |     构造函数,传入配置参数，当前只有一个可选参数  auxiliary?:boolean 控制辅助线开关     |
|  static XImage | XImage  |  Gesti |    -    |     暴露给外部声明Ximage对象类型     |
|  controller | GestiController  |  Gesti |    -    |     控制器，获取控制器，详情请查看下方  GestiController   |

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