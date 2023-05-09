export interface gesticonfig{
    auxiliary?: boolean,
}
class GestiConfig{
    //开启辅助参考线
    static auxiliary:boolean=true;
    constructor(config?:gesticonfig){
        if(!config)return;
        //默认开启辅助参考线
        GestiConfig.auxiliary=config?.auxiliary??true;
    }
}
export default GestiConfig;