//按钮功能触发方式
enum FuncButtonTrigger {
  //拖拽
  drag,
  //点击
  click,
  //长按
  longpress,
  //双击
  dbclick,
}

//撤销重做种类枚举
enum OperationTypeEmum {
  //大小
  size,
  //位置
  position,
  //角度
  angle,
  //镜像
  mirror,
  //
}
enum ViewObjectFamily {
  image,
  write,
  line,
  circle,
  rect,
  text,
  group,
  graphicsRectangle,
  graphicsPolygon,
}

// enum Alignment {
//   topLeft,
//   topCenter,
//   topRight,
//   centerLeft,
//   center,
//   centerRight,
//   bottomLeft,
//   bottomCenter,
//   bottomRight,
//   outTopLeft,
//   outTopCenter,
//   outTopRight,
//   outCenterLeft,
//   outCenter,
//   outCenterRight,
//   outBottomLeft,
//   outBottomCenter,
//   outBottomRight,
// }

/**
 * @deprecated
 */
enum ButtonLocation {
  LT,
  LB,
  RT,
  RB,
  RC,
  BC,
  LC,
  TC,
  OutBC,
  OutTC,
  OutRC,
  OutLC,
  OutLT,
  OutLB,
  OutRT,
  OutRB,
}

export {
  FuncButtonTrigger,
  OperationTypeEmum,
  ViewObjectFamily,
  // ButtonLocation,
  // Alignment
};
