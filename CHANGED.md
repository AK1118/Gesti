# 1.3.67 更新日志

### 废弃

- 废弃预设，废弃 useReader
- 废弃 LocationButton 枚举，建议使用 Alignment

### 新增

- 新增屏幕适配,可根据设置设计稿大小适配屏幕
- 新增导入/导出拦截函数
- 新增 BoxDecoration
- 新增 Graphics 系列，Rectangle,Polygon 图形
- 新增 Alignment 类，替换 LocationButton
- 新增 ViewObject 的 makeFixed 和 maxUnFixed 方法
- 新增插件插槽 OffScreenBuilder,用于自定义离屏画布生成 key = "offScreenBuilder"
- 新增 CustomButton 自定义按钮点击事件
- 新增 ViewObject 的 getButtonById方法，用于通过id获取某个按钮

### 修复

- 修复导出图片为 url 时强制为 base64 问题
- 修复对象未选择时按钮会被执行bug
- 修复uniapp个别版本带来的二指缩放无效bug

### 优化

- 优化 TextBox 缓存,优化涂鸦概率性缺角 bug
- 优化声明文件
- 导出格式变化
- 按钮和选中框始终显示在最上层

  旧格式:

  ```Typescript
         {
           options:Array<ViewObject>
         }
  ```

  新格式:

  ```Typescript
   {
       entities:Array<ViewObject>,
       info:{
           platform?:"string",
           screen?:ScreenUtilsOption
       }
   }
  ```
