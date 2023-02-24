### 主要特性

- Typescript开发，打包jsdk,灵活安装使用，不再为臃肿的操作烦恼。
- 基于原生Canvas，兼容主流浏览器，PC端以及移动端,兼容微信小程序。
- 拖拽缩放，移动端二指缩放，PC端鼠标缩放，点击即选中，可镜像操作等。

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
			- [down](#down)
			- [up](#up)
			- [move](#move)
			- [wheel](#wheel)
- [保存](#保存)
- [在 微信小程序 | uniapp 端使用](#在-微信小程序--uniapp-端使用)
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

## Gesti[方法]

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

#### addImage

	addImage(ximage: XImage | Promise<XImage>): 	Promise<boolean>;

- 添加一张图片到canvas里面

#### createImage


	createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage>;

- 传入图片，创建一个XImage,并返回一个Promise <XImage>


#### update

	update():void;

- 手动刷新画布

## Gesti[属性]

#### debug

	debug:boolean

- 值为true时开启
	
#### Gesti.XImage

	declare class XImage {
		data: any;
		width: number;
		height: number;
		x: number;
		y: number;
		scale: number;
		constructor(params: createImageOptions);
		toJson(): {
			x:number,
			y:number,
			width:number,
			height:number,
		};
	}

- 传入到Gesti里面的类型

#### Gesti.controller

	get controller:GestiController;

- 自定义鼠标|手指事件时使用
- 详情请查看 - [controller](#GestiController)

## GestiController

#### down

	down(e: MouseEvent | Event | EventHandle): void;

- 鼠标|手指点击事件时调用

#### up

	up(e: MouseEvent | Event | EventHandle): void;

- 鼠标|手指抬起事件时调用

#### move

	move(e: MouseEvent | Event | EventHandle): void;

- 鼠标|手指移动事件时调用

#### wheel

	wheel(e: MouseEvent | Event | EventHandle): void;

- 鼠标滚轮事件时调用



# 保存

- 该库只是为您提供了canvas的代理操作，并没有改变canvas的任何原有API，所以您可以使用canvas自带的API进行存储。

# 在 微信小程序 | uniapp 端使用
- 微信小程序端我无法监听屏幕事件，但是您可以使用我提供的  [GestiController](#gesticontroller-1)  实现自定义事件。为canvas提供事件并在方法里面调用 [GestiController](#gesticontroller-1) 的各个方法。
- 如果您的uniapp运行在H5端，那您无需担心任何问题，如果您在其他端，请参考以上微信小程序方案


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
	gesti.addImage(gesti.createImage(img))


***不是吗？***