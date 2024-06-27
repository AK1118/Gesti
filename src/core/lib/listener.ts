import { GestiControllerListenerTypes } from "@/types/controller";
import ViewObject from "../abstract/view-object";


  
 export type ListenerHook = (viewObject: ViewObject) => void;
  
  /**
   * 监听类
   */
  class Listeners {
    hooks: any = {};
    addHook(
      hookType: GestiControllerListenerTypes,
      hook: any,
      prepend: boolean = false
    ) {
      const hooks: Array<ListenerHook> =
        this.hooks[hookType] || (this.hooks[hookType] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (arg) => hook(arg));
      //优先级
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
    callHooks(hookType: GestiControllerListenerTypes, arg: ViewObject) {
      const hooks = this.hooks[hookType] || [];
      hooks.forEach((hook: ListenerHook) => hook(arg));
    }
    cleanHook(hookType?:GestiControllerListenerTypes){
      if(hookType){
        this.hooks[hookType] = [];
      }else{
        this.hooks = {};
      }
    }
    removeHook(hookType: GestiControllerListenerTypes, hook: ListenerHook) {
      const hooks: Array<ListenerHook> = this.hooks[hookType] || [];
      const ndx: number = hooks.indexOf(hook);
      hooks.splice(ndx, 1);
    }
  }
  

  export default Listeners;