import RenderObjectBase from "./object";
import RenderBox from "./renderbox";
import Widget from "./widget";

abstract class BuildContext {
  abstract get widget(): Widget;
  abstract get size(): Size;
  abstract get mounted():boolean;
  abstract findRenderObject():RenderObjectBase;
}

export default BuildContext;
