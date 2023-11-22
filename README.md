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

  ```
  npm install gesti
  ```

### 引入使用

  ```
  import Gesti from "gesti";
  ```

### 初始化

  ```
  const gesti=new Gesti();
      //h5端适用，其他端请参考API自行添加
  const controller=gesti.initialization({
    renderContext:g,
    rect:{
       canvasWidth:canvas.width,
       canvasHeight:canvas.height
     }
  });
  ```

### 加入文字

  ```
    controller.load(new TextBox('New Text'));
  ```

# API

## Gesti

| 方法名      | 返回值类型  |  所属    |    参数    |   说明   |
| :----:      |   :----: | :----:   |  :----:   | :----:      | 
| ~~init~~      |    void      |     Gesti   |    (canvas?: HTMLCanvasElement, paint?: CanvasRenderingContext2D, rect?:rectParam)   |     初始化 Gesti 时调用，共3个可选参数。canvas 和 paint 必须二选一，且没有传入canvas时，必须传入paint 和 rect.       |
| ~~setConfig~~      |    void      |     Gesti   |   (config?: gesticonfig)   |     修改或设置配置，修改后会自动调用GestiController.update函数       |
| initialization      |    GestiController      |     Gesti   |   (options:InitializationOption)   |     初始化gesti，返回控制器       |
| static mount      |    [Gesti,GestiController]      |     Gesti   |   (options:InitializationOption)   |     通过静态方法初始化gesti, 返回gesti实例和它的控制器      |
| static installPlugin      |    void      |     Gesti   |   (key:PluginsKey,plugin:any)   |     安装预设插件，使用某功能时再安装对应插件      |

## GestiController

| 方法名      | 返回值类型              |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| updateText  | void              |    GestiController  |       (text: string, options?:TextOptions )     |      更新被选中的文字图层的文字内容，或者文字属性   |
| layerLower  | void             |      GestiController     |    -      |    图层向下移动一层    |
| layerRise  | void             |      GestiController     |     -     |    图层向上移动一层    |
| layerTop  | void             |      GestiController     |     -     |    图层置于最顶层    |
| layerBottom  | void             |      GestiController     |    -      |    图层置于最底层    |
| lock    | void             |      GestiController     |     -     |    锁定当前选中图层    |
| deLock    | void             |      GestiController     |     -     |    解锁当前选中图层    |
| cancel    | void             |      GestiController     |      -    |    取消当前被聚焦对象    |
| cancelAll    | void             |      GestiController     |     -     |    取消所有被聚焦对象    |
| down    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指点击事件时调用    |
| up    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指抬起事件时调用    |
| move    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标\|手指移动事件时调用    |
| wheel    | void             |      GestiController     |     (e: MouseEvent \| Event \| EventHandle)     |    鼠标滚轮事件时调用    |
| addListener    | any  |   GestiController |    (listenType:"onSelect"\|"onHide"\|"onCancel",callback:ListenerCallback)     |   监听图层操作，目前支持监听选中、取消选中和隐藏    |
| removeListener    | void  |   GestiController |    (listenType:GestiControllerListenerTypes,hook:ListenerCallback)     |   根据addListener返回值，移除监听函数    |
| rotate    | Promise\<void\>  |   GestiController |    angle: number     |   旋转被选中对象,传入弧度。可传入  角度*Math.PI/180     |
| upward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向上移动距离 1     |
| downward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向下移动距离 1     |
| leftward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向左移动距离 1     |
| rightward    | number  |   GestiController |    (viewObject?: ViewObject)     |   被选中对象微调，向右移动距离 1     |
| update    | void  |   GestiController |    -    |   调用后会重绘canvas,一般在改变数据后画布未刷新时使用     |
| importAll    | Promise\<void\>  |   GestiController |    (json: string)   |   以json形式导入对象集合 H5 |
| exportAll  | Promise\<string\>  |   GestiController |    -   |   以json形式导出对象集合 H5    |
| center   | void  |   GestiController |   (axis?: "vertical" \| "horizon")   |  垂直居中或者水平居中，不填写参数水平垂直居中    |
| cancelEvent   | void  |   GestiController |   -   |  取消Gesti自带的鼠标手指时间监听。使用该函数后需要自行调用鼠标各个事件，请参考上方  down,up,move  ,使用详情参考Demo    |
| addWrite   | 	void  |   GestiController |   (options: {type: "circle" \| "write" \| "line" \| "rect" \| "none";lineWidth?: number;color?: string;isFill?: boolean;})   |  添加涂鸦功能，调用该函数且传入options.type不为"none"时，下一次在canvas内滑动会触发生成对应的涂鸦对象,直到再次调用该函数且options.type为"none"时停止    |
| getViewObjectById  | Promise\<ViewObject\>  |   GestiController |    (id:string)   |  通过id获取ViewObject对象    |


| 属性名      | 返回值类型         |  所属    |    参数    |   说明   |
| :---       |    :----:         |  :----:   |    :----:   |   :----: |
| currentViewObject| ViewObject | GestiController | - | 获取当前选中对象|


## ViewObject（重要的阅读）
- 画布内的可操作对象，每一张图片对象或者文字对象或者其他都是它在画布上的映射。
- 获取它的途径一般来自于创建对象，它是一个基类，其子类还有TextBox , ImageBox ,WriteViewObj


| 方法名      |   返回值         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|getBaseInfo | Object |   -    |    获取对象的向量信息      |
|setName | void |  (name: string)    |    给对象设置名字      |
|lock | void |  -   |    锁住它，不让他被操作      |
|unLock | void |  -   |    解锁      |
|hide  | void |  -   |    隐藏它，不是删除，删除我还没实现      |
|show  | void |  -   |    显示      |
|installButton  | void | (button: Button)   |   Gesti内不是没有按钮，是需要自己new过后安装     |
|unInstallButton  | void | (buttons: Array<Button>)   |   卸载按钮     |
|setSize  | void | (size: { width?: number; height?: number })   |   设置大小     |
|setDecoration  | void | (args:any)   |  设置对象装饰，比如颜色，线条高度等，每个子类传入的参数不一     |
|setOpacity  | void | (opacity:number)   |  设置对象不透明度，取值 0.0~1.0     |
|toBackground  | void |  -   |  将该对象设置为背景,设置背景后可设置层级。所有事件将会被穿透   |


| 属性名      |   返回值         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|rect | Rect |   -    |  获取对象大小最为合适    |
|family | ViewObjectFamily |   -    |  获取对象类型,Gesti内可操作对象有多个家族，用来区分哪个对象是哪类    |
|name | string |   -    |  有时候对象可以拥有一个名字    |
|selected | boolean |   -    |  已经被选中了吗    |
|originFamily | ViewObjectFamily |   -    |  家族起源家族，比如write是起源家族，它下面有line,rect，circle等分支家族    |
|id | string |   -    |  设置该对象id    |



## Button 对象
- 控制ViewObject的功能按钮


| 方法名      |   返回值         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|drawButton | -  |   Function(position: Vector, size: Size,radius:number, paint: Painter)    |    可重写该方法实现自定义按钮样式      |


# Hooks 🚀
- 还挺好用

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
|onBeforeDestroy  | - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    销毁Gesti实例前执行      |
|onDestroy| - |     (hook: (_args: any) => any, target?: Gesti, prepend?: boolean)    |    销毁Gesti实例后执行      |
|removeListener | - | (type: GestiControllerListenerTypes,hook: (_args: any) => any, target?: Gesti)    |    根据addListener返回值，移除监听函数    |





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
|createTextBox | TextBox |   (text: string, options?: TextOptions)     |    创建一个文本对象      |
|createXImage | XImage |   (option: {data,width:number,height:number})  |    创建一个XImage对象，注意，这个并不是你所看到的那个图片，可以理解为它是图片源，渲染由下面这个类做到      |
|createImageBox | ImageBox |   (xImage: XImage)     |    创建一个图片对象      |
|createDragButton | Button | (view: ViewObject)    |    创建一个拖拽按钮      |
|createHorizonButton | Button | (view: ViewObject)    |    创建一个水平拖拽按钮      |
|createVerticalButton | Button | (view: ViewObject)    |    创建一个垂直拖拽按钮      |
|createRotateButton | Button | (view: ViewObject)    |    创建一个旋转按钮      |
|createLockButton | Button | (view: ViewObject)    |    创建一个上锁按钮      |
|createUnlockButton | Button | (view: ViewObject)    |    创建一个解锁按钮      |
|createMirrorButton  | Button | (view: ViewObject)    |    创建一个镜像翻转按钮      |
|createCloseButton  | Button | (view: ViewObject)    |    创建一个关闭按钮      |
|installButton | - | (view: ViewObject, button: Button \| Array<Button>)    |    安装按钮到ViewObject上      |
|unInstallButton | - | (view: ViewObject, button: Button \| Array<Button>)   |    卸载ViewObject上的按钮   |
|loadToGesti | - |    (view: ViewObject, target?: Gesti)    |   加入一个ViewObject对象到画布内,以上的类都是继承于ViewObjet      |



### use系列
- 涂鸦功能

| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|useGraffitiRect | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，矩形     |
|useGraffitiCircle | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，圆形     |
|useGraffitiLine | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，线条     |
|useGraffitiWrite | - |    (option?: {...}, target?: Gesti    | 开启涂鸦功能，手写板     |
|useCloseGraffiti | - |    (option?: {...}, target?: Gesti    | 关闭涂鸦功能    |
|useTextHandler | - |    (option?: {...}, target?: Gesti    | 得到一个TextBox实例控制器，用于控制它的参数    |
|~~useReader~~ | Promise<ViewObject> |    (json: string)    | 传入特定格式的json，返回一个ViewObject对象    |
|useReaderH5 | Promise<ViewObject> |    (json: string)    | 传入特定格式的json，返回一个ViewObject对象  H5    |
|useReaderWeChat | Promise<ViewObject> |    (json: string)    | 传入特定格式的json，返回一个ViewObject对象 微信小程序 canvas 2d   |
|useGetViewObject | Promise<ViewObject> |    (id: string)    |  通过id获取ViewObject对象    |


### do系列
- 需要做一些操作? 交给它们

| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|doSelect | - |    (view?: ViewObject, target?: Gesti)    |  选中传入对象  |
|doRotate | - |     (angle: number, existing?: boolean, view?: ViewObject, target?: Gesti)    |  旋转一个对象，不传入view默认当前选中对象  |
|doPosition | - |     (x: number, x: number, view?: ViewObject, target?: Gesti)    |  设置一个对象的位置，不传入view默认当前选中对象  |
|doCleanAll | - |    (view?: ViewObject, target?: Gesti)    |  画布内清空所有元素  |
|doLayerLower | - |    (view?: ViewObject, target?: Gesti)    |  所在图层向下一层  |
|doLayerRise | - |    (view?: ViewObject, target?: Gesti)    |  所在图层向上一层  |
|doLayerTop | - |    (view?: ViewObject, target?: Gesti)    |  置于顶层  |
|doLayerBottom | - |    (view?: ViewObject, target?: Gesti)    |  置于底层  |
|doLock | - |    (view?: ViewObject, target?: Gesti)    |  锁住对象  |
|doUnLock | - |    (view?: ViewObject, target?: Gesti)    |  解锁对象  |
|doUpward | - |    (view?: ViewObject, target?: Gesti)    |  位置微调，上一个单位  |
|doDownward | - |    (view?: ViewObject, target?: Gesti)    |  位置微调，下一个单位 |
|doLeftward | - |    (view?: ViewObject, target?: Gesti)    |   位置微调，左一个单位  |
|doRightward | - |    (view?: ViewObject, target?: Gesti)    |  位置微调，右一个单位  |
|doCenter | - |   (view?: ViewObject, axis?: CenterAxis, target?: Gesti)    |  居中，可选水平或者垂直，不填就垂直水平居中  |
|doCancel | - |    (view?: ViewObject, target?: Gesti)    |  取消选中单个/现在被选中的对象  |
|doCancelAll | - |    -    |  取消所有被选中对象  |
|doUpdate | - |    -    |  手动刷新画布  |
|doCancelEvent | - |    -    |  取消原有画布事件代理,调用该方法后需要自定调用drive系列Hook,否则Gesti无法监听到您的手指/鼠标的位置  |


### drive系列
- 自定义鼠标/手指事件代理

| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|driveMove | - |   (e:Event)    |  鼠标/手指移动时  |
|driveUp | - |   (e:Event)    |  鼠标/手指抬起时  |
|driveDown | - |   (e:Event)    |  鼠标/手指放下时  |
|driveWheel | - |   (e:Event)    |  鼠标滚轮时  |


### 尺寸适配
- 物理单位转换像素  此处dpi取96   
- 值得注意:Gesti内没有一个标准的单位，所有的单位都由您决定，比如画布创建设置大小时，图片创建传入时，字体设置大小时。总之，您输入多大，Gesti就为您显示多大（比如输入图片高宽为物理单位一厘米，那么在Gesti内您所看到的图片大小也会是一厘米高宽）
- 以下提供的方法仅供参考，如需更精准的方案您可以自己实现。

| Hook      | 返回值类型         |    参数    |   说明   |
| :---       |    :----:         |  :----:   |   :----: |
|mmToIn       | number          |   (mm:number)    |  毫米转换为英寸  |
|inToPx       |number            |  (inch:number)    | 英寸转换为像素  |
|ptToPx       | number             |   (pt:number)    | 英榜转换为像素（一般设置字体时用它）  |




# 保存

- 该库只是为您提供了canvas的代理操作，并没有改变canvas的任何原有API，所以您可以使用canvas自带的API进行存储。

# 可能会遇到的问题
- 图片导入不出现？数据变了图片没动？试试update方法刷新一下。
- hooks和普通模式有啥区别吗? 个人认为Hooks更适合FP爱好者，普通模式适合OOP爱好者。
- 图片 | 文字上没有可以直接操作的按钮吗？ 有,不过需要您自己new成按钮对象安装上去。
- 为什么路由切换后再返回页面会发生报错？重新init一下，记得controller也要重新赋值。
- 其他问题可以加下面QQ群
- Demo下载地址:  https://ext.dcloud.net.cn/plugin?id=10867 

# 示例

***用它，没有多麻烦。***

####  HTML

	<canvas id="canvas" width="300" height="300"></canvas>

#### JavaScript

    const canvas = document.querySelector("canvas");
    const renderContext= canvas.getContext("2d");
    const [gesti,controller]=Gesti.mount({
        renderContext,
        rect:{
          canvasWidth:canvas.width,
          canvasHeight:canvas.height
        }
    });
    controller.load(new Text(`New Text.
      新建文本`))



***不是吗？***


### 需要帮助？

- 添加QQ群聊(Gesti交流群),我们讨论一下问题  756829516 