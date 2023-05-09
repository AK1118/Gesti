import ImageToolkit from "../image-toolkit";

class CanvasConfig {
  private kit: ImageToolkit;
  public init(kit: ImageToolkit) {
    this.kit = kit;
  }
  public get rect(){return this.kit.getCanvasRect};
  //所有图层对象
  public get views(){return this.kit.getViewObjects};
}

export default new CanvasConfig();
