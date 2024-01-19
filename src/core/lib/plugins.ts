import { PluginKeys } from "@/types/gesti";





class Plugins{
    private static plugins:Record<PluginKeys,any>={
        "pako":null,
        "offScreenBuilder":null,
    };
    public static getPluginByKey<T=any>(key:PluginKeys){
        return this.plugins[key] as T;
    }
    public static installPlugin(key:PluginKeys,plugin:any){
        this.plugins[key]=plugin;
    }
}





export default Plugins;