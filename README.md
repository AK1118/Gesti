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
- [Gesti\[方法\]](#gesti方法)
    - [init](#init)
    - [addImage](#addimage)
    - [createImage](#createimage)
- [Gesti\[属性\]](#gesti属性)
    - [Gesti.debug](#gestidebug)
    - [Gesti.XImage](#gestiximage)
- [保存](#保存)


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

#API

# Gesti[方法]

### init
- 初始化 Gesti 时调用，共3个可选参数
- canvas 和 paint 必须二选一，且没有传入canvas时，必须传入paint 和 rect.


	init(canvas?: HTMLCanvasElement, paint?: CanvasRenderingContext2D, rect?: {
        x?: number;
        y?: number;
        width: number;
        height: number;
    }): void;

*** 在H5端，推荐您直接传入一个canvas即可***

### addImage
- 添加一张图片到canvas里面


	addImage(ximage: XImage | Promise<XImage>): 	Promise<boolean>;

### createImage
- 传入图片，创建一个XImage,并返回一个Promise<XImage>


	createImage(image: HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement | Blob | ImageData | ImageBitmap | OffscreenCanvas, options?: createImageOptions): Promise<XImage>;


# Gesti[属性]

### Gesti.debug
- 值为true时开启


	static debug:boolean


### Gesti.XImage
- 传入到Gesti里面的类型


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

# 保存

- 该库只是为您提供了canvas的代理操作，并没有改变canvas的任何原有API，所以您可以使用canvas自带的API进行存储。
