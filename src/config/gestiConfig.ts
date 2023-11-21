export interface gesticonfig{
    auxiliary?: boolean,
    dashedLine?:boolean,
}
class GestiConfig{
    public static DPR:number=1;
    //开启辅助参考线
    static auxiliary:boolean=true;
    static dashedLine:boolean=true;
    constructor(config?:gesticonfig){
        if(!config)return;
        //默认开启辅助参考线
        GestiConfig.auxiliary=config?.auxiliary??true;
        GestiConfig.dashedLine=config?.dashedLine??true;
    }
    public setParams(config?:gesticonfig){
        if(!config)return;
        //默认开启辅助参考线
        GestiConfig.auxiliary=config?.auxiliary??true;
        GestiConfig.dashedLine=config?.dashedLine??true;
    }
    //Gesti 颜色配置
    static theme={
        //被选中后边框的颜色
        selectedBorderColor:"#ffffff",
        //按钮背景颜色
        buttonsBgColor:"#ffffff",
        //按钮图标颜色
        buttonIconColor:"#c1c1c1",
        //文字被选中后蒙版颜色
        textSelectedMaskBgColor:"rgba(0,0,0,.1)",
        //辅助线颜色
        auxiliaryDashedLineColor:"#999",
        //包裹对象虚线颜色
        dashedLineColor:"#999",
    }
}
export default GestiConfig;