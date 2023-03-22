//按钮功能触发方式
enum FuncButtonTrigger{
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
enum OperationTypeEmum{
    //大小
    size,
    //位置
    position,
    //角度
    angle,
    //镜像
    mirror
    //
}

export {
    FuncButtonTrigger,
    OperationTypeEmum
}