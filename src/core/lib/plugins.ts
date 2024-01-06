import { PluginKeys } from "@/types/gesti";





class Plugins{
    private static plugins:Record<PluginKeys,any>={
        "pako":null,
        "offScreenBuilder":null,
    };
    public static getPluginByKey(key:PluginKeys){
        return this.plugins[key];
    }
    public static installPlugin(key:PluginKeys,plugin:any){
        this.plugins[key]=plugin;
    }
}





export default Plugins;