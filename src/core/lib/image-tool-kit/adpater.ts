import ImageToolkit from "./image-toolkit";
import Button, { BaseButton } from "../../abstract/baseButton";
import ViewObject from "../../abstract/view-object";
import CatchPointUtil from "../../../utils/event/catchPointUtil";
import Drag from "../../../utils/event/drag";
import { FuncButtonTrigger, ViewObjectFamily } from "../../enums";
import GestiEventManager, { GestiEvent } from "../../../utils/event/event";
import Gesture from "../../../utils/event/gesture";
import GestiController from "../../interfaces/gesticontroller";
import Painter from "../painter";
import Rect from "../rect";
import Vector from "../vector";
import ImageBox from "../../viewObject/image";
import TextBox from "../../viewObject/text/text";
import WriteFactory from "../../viewObject/write/write-factory";
import { Size, ViewObject as ViewObjectD, XImageOption } from "@/types/gesti";
import XImage from "../ximage";
import {
  ViewObjectExportEntity,
  ViewObjectExportWrapper,
  ViewObjectImportEntity,
} from "@/types/serialization";
import {
  ExportAllInterceptor,
  GraffitiCloser,
  ImportAllInterceptor,
  InitializationOption,
  TextOptions,
} from "@/types/gesti";
import WriteViewObj from "../../viewObject/write";
import ScreenUtils from "@/utils/screenUtils/ScreenUtils";
import { ScreenUtilOption } from "Gesti";
import Platform from "../../viewObject/tools/platform";
import Deserializer from "@/utils/deserializer/Deserializer";
import {
  CenterAxis,
  GestiControllerListenerTypes,
  GraffitiType,
} from "@/types/controller";
import { BoxDecorationOption } from "@/types/graphics";
import DecorationBase from "../../bases/decoration-base";
import ImageToolkitBase, { EventHandlerState } from "./image-toolkit-base";
import { LayerOperationType } from "./utils";
import { ListenerHook } from "../listener";
abstract class ImageToolkitAdapterController
  extends ImageToolkit
  implements GestiController
{
  constructor(option: InitializationOption) {
    console.log("VERSION DEBUG 626");
    super(option);
  }
  cleanListener(listenType?: GestiControllerListenerTypes): void {
    this.listen.cleanHook(listenType);
  }
  getCanvasSize(): Size {
    const { size } = this.canvasRect;
    return size;
  }
  setLayer(
    layer: number,
    view?: ViewObject<DecorationBase<BoxDecorationOption>>
  ): void {
    let _view = view || this.focusedViewObject;
    _view.setLayer(layer);
    this.tool.arrangeLayer(this.layers, _view, LayerOperationType.none);
    this.render();
  }

  hide(_view?: ViewObject): void {
    const view = _view ?? this.currentViewObject;
    if (view) {
      view.hide();
      this.callHook("onHide", view);
      this.render();
    }
  }
  show(_view?: ViewObject): void {
    const view = _view ?? this.currentViewObject;
    if (view) {
      view.show();
      this.callHook("onShow", view);
      this.render();
    }
  }
  forceRender(): void {
    this.layers.forEach((_) => _.forceUpdate());
    this.tool.arrangeLayer(this.layers, null, LayerOperationType.none);
  }
  cancelGesture(): void {
    this.gesture.disable();
  }
  getViewObjectByIdSync<T extends ViewObject>(id: string): T {
    const arr = this.layers;
    const obj: T | null = arr.find((item) => item.id === id) as T;
    return obj;
  }
  generateScreenUtils(option: ScreenUtilOption): ScreenUtils {
    //二次生成得时候需要重置缩放
    if (this.screenUtils) {
      this.paint.scale(this.screenUtils.devScale, this.screenUtils.devScale);
    }
    //只要生成了必须使用屏幕适配器
    this.screenUtils = new ScreenUtils(option);
    this.paint.scale(
      this.screenUtils.devicePixelRatio,
      this.screenUtils.devicePixelRatio
    );
    return this.screenUtils;
  }
  remove(view?: ViewObject): boolean {
    const _view = view || this.focusedViewObject;
    if (!_view) return false;
    this.cancel(_view);
    this.setlayers(this.layers.filter((_) => _.key != _view.key));
    this.callHook("onRemove", _view);
    this.render();
    return true;
  }
  getAllViewObjectSync(): ViewObject[] {
    return this.layers;
  }
  getAllViewObject(): Promise<ViewObject[]> {
    return Promise.resolve(this.layers);
  }
  mount(view: ViewObject): void {
    this.load(view);
  }
  unMount(view: ViewObject): void {
    const result: boolean = this.deleteViewObject(
      view || this.focusedViewObject
    );
    if (result) this.render();
  }
  //返回删除结果
  private deleteViewObject(view: ViewObject): boolean {
    if (!view) return false;
    const key: string | number = view.key;
    const newList: Array<ViewObject> = this.layers.filter((_) => _.key !== key);
    this.setlayers(newList);
    return false;
  }

  update(): void {
    this.render();
  }
  //隐藏某个对象
  close(view?: ViewObject): void {
    if (!view) this.focusedViewObject?.hide?.();
    view?.hide?.();
    this.render();
  }
  //镜像某个对象
  mirror(view?: ViewObject): boolean {
    if (!view) {
      const isMirror: boolean = this.focusedViewObject?.mirror?.();
      this.render();
      this.callHook("onMirror", isMirror);
      return isMirror;
    }
    const isMirror: boolean = view.mirror();
    this.render();
    this.callHook("onMirror", isMirror);
    return isMirror;
  }
  setBoundary(boundaryRect: Boundary): void {
    throw new Error("Method not implemented.");
  }
  querySelector(
    select: string | ViewObjectFamily
  ): Promise<ViewObject | ViewObject[]> {
    throw new Error("Method not implemented.");
  }
  getViewObjectById<T extends ViewObject>(id: string): Promise<T> {
    const arr = this.layers;
    const obj: T | null = arr.find((item) => item.id === id) as T;
    return Promise.resolve<T>(obj);
  }
  public getPainter(): Painter {
    return this.paint;
  }
  position(x: number, y: number, view?: ViewObject): void {
    if (view) {
      view.setPosition(x, y);
    }
    this.focusedViewObject?.setPosition(x, y);
    this.render();
  }
  /**
   * @description 清空所有元素
   * @returns
   */
  cleanAll(): Promise<void> {
    return new Promise((r, v) => {
      this.cleanlayers();
      this.render();
      r();
    });
  }
  destroyGesti(): void {
    this.callHook("onBeforeDestroy");
    this.cleanAll();
    this.eventHandler = null;
    this.tool = null;
    new Promise((v, r) => {
      this.callHook("onDestroy");
    }).then((e) => {
      this.listen = null;
    });
    //监听器最后销毁，因为要执行回调
  }

  load(view: ViewObject): void {
    this.addViewObject(view);
  }
  protected addViewObject(
    obj: ViewObject<DecorationBase<BoxDecorationOption>>
  ): void {
    this.layers.push(obj);
    obj.initialization(this);
    super.addViewObject(obj);
  }
  select(select: ViewObject): Promise<void> {
    //不允许二次选中,背景不允许被选中
    if (
      select &&
      select.onSelected &&
      select.key !== this.focusedViewObject?.key &&
      !select.isBackground
    ) {
      select.onSelected();
      this.focusedViewObject = select;
      this.callHook("onSelect", select);
      this.render();
      return Promise.resolve();
    }
    return Promise.resolve();
  }
  get currentViewObject(): ViewObject {
    return this.focusedViewObject;
  }
  async rotate(
    angle: number,
    existing?: boolean,
    view?: ViewObject
  ): Promise<void> {
    let obj = view || this.focusedViewObject;
    if (!obj) return Promise.resolve(null);
    let _angle = existing ? angle + obj.rect.getAngle : angle;
    obj.rect.setAngle(_angle);
    this.render();
    return Promise.resolve(null);
  }
  upward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.y -= 1;
      return viewObject.position.y;
    }
    if (!this.focusedViewObject) return null;
    this.focusedViewObject.position.y -= 1;
    return this.focusedViewObject.position.y;
  }
  downward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.y += 1;
      return viewObject.position.y;
    }
    if (!this.focusedViewObject) return null;
    this.focusedViewObject.position.y += 1;
    return this.focusedViewObject.position.y;
  }
  leftward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.x -= 1;
      return viewObject.position.x;
    }
    if (!this.focusedViewObject) return null;
    this.focusedViewObject.position.x -= 1;
    return this.focusedViewObject.position.x;
  }
  rightward(viewObject?: ViewObject): number {
    if (viewObject) {
      viewObject.position.x += 1;
      return viewObject.position.x;
    }
    if (!this.focusedViewObject) return null;
    this.focusedViewObject.position.x += 1;
    return this.focusedViewObject.position.x;
  }
  /**
   * @description 导入json解析成对象  H5
   * @param json
   * @returns
   */
  async importAll(
    json: string,
    interceptor: ImportAllInterceptor = (views: Array<any>) =>
      Promise.resolve(views as Array<ViewObjectD>)
  ): Promise<void> {
    return new Promise(async (r, j) => {
      try {
        if (!json)
          throw Error("Can not deserialization,because Json is empty.");
        const jsonObj = JSON.parse(json);
        const wrapperEntity: ViewObjectExportWrapper = jsonObj;
        const info = wrapperEntity.info;
        const entities: Array<ViewObjectExportEntity> = wrapperEntity.entities;
        if (info.screen) {
          //屏幕适配器大小需要变为自己的大小
          /**
           * - 双方设计稿大小必须一致
           * - 计算新的屏幕适配尺寸之前必须根据适配因子还原绝对大小
           * - dpr双方必须一致   收方dpr等于送方dpr
           *
           */

          if (this.screenUtils) {
            this.screenUtils = this.generateScreenUtils({
              ...info.screen,
              devicePixelRatio:
                this.screenUtils?.devicePixelRatio ??
                info.screen?.devicePixelRatio ??
                1,
              deviceCanvasRatio: this.screenUtils?.deviceCanvasRatio,
              canvasWidth: this.canvasRect.size.width,
              canvasHeight: this.canvasRect.size.height,
            });
          } else {
            this.screenUtils = this.generateScreenUtils({
              ...info.screen,
              canvasWidth: this.canvasRect.size.width,
              canvasHeight: this.canvasRect.size.height,
            });
          }
        }
        //还原另一端的屏幕适配器
        const otherScreenUtils = ScreenUtils.format(info.screen);
        //反序列化
        const deserializer = new Deserializer(this, otherScreenUtils);
        const temp: Array<ViewObject> = [];
        for await (const item of entities) {
          const importEntity: ViewObjectImportEntity = item;
          const obj: ViewObject = await deserializer.getObjectByJson(
            importEntity
          );
          if (obj) temp.push(obj);
        }
        //携所有解析数据调用拦截器
        await interceptor?.(temp as any);
        temp.forEach((_) => this.load(_));
        this.render();
        r();
      } catch (error) {
        j(error);
      }
    });
  }

  addListener(
    listenType: GestiControllerListenerTypes,
    hook: ListenerHook,
    prepend: boolean = false
  ): any {
    return this.listen.addHook(listenType, hook, prepend);
  }
  removeListener(
    listenType: GestiControllerListenerTypes,
    hook: (object: any) => void
  ): void {
    this.listen.removeHook(listenType, hook);
  }
  /**
   * @description 导出画布内所有对象成json字符串
   */
  exportAll(
    exportAllInterceptor: ExportAllInterceptor = (
      _: Array<ViewObjectExportEntity>
    ): Promise<Array<ViewObjectExportEntity>> => Promise.resolve(_)
  ): Promise<string> {
    return new Promise(async (r, j) => {
      try {
        const viewObjectList: Array<ViewObjectExportEntity> = [];
        for await (const item of this.layers) {
          if (item.disabled) continue;
          const exportEntity = await item.export();
          viewObjectList.push(exportEntity);
        }
        const exportWrapper: ViewObjectExportWrapper = {
          entities: await exportAllInterceptor?.(viewObjectList),
          info: {
            platform: Platform.platform,
            screen: this.screenUtils?.toJSON(),
          },
        };
        r(JSON.stringify(exportWrapper));
      } catch (error) {
        j(error);
      }
    });
  }
  updateText(text: string, options?: TextOptions): void {
    //const isTextBox = classTypeIs(this.focusedViewObject, TextBox);
    const isTextBox: boolean =
      this.focusedViewObject?.family === ViewObjectFamily.text;
    if (isTextBox) {
      const view: TextBox = this.focusedViewObject as TextBox;
      view.setTextStyle(options ?? {});
      view.setText(text);
      this.render();
      this.callHook("onUpdateText", view);
    }
  }
  center(view?: ViewObject, axis?: CenterAxis): void {
    if (view) view.center(this.canvasRect.size, axis);
    else this.focusedViewObject?.center(this.canvasRect.size, axis);
    this.render();
  }
  cancel(view?: ViewObject): void {
    super.blurViewObject(view);
  }
  cancelAll(): void {
    this.layers.forEach((item: ViewObject) => this.handleCancelView(item));
    this.render();
  }
  layerLower(view?: ViewObject): void {
    let _view = view || this.focusedViewObject;
    this.tool.arrangeLayer(this.layers, _view, LayerOperationType.lower);
    this.render();
  }
  layerRise(view?: ViewObject): void {
    let _view = view || this.focusedViewObject;
    this.tool.arrangeLayer(this.layers, _view, LayerOperationType.rise);
    this.render();
  }
  layerTop(view?: ViewObject): void {
    let _view = view || this.focusedViewObject;
    this.tool.arrangeLayer(this.layers, _view, LayerOperationType.top);
    this.render();
  }
  layerBottom(view?: ViewObject): void {
    let _view = view || this.focusedViewObject;
    this.tool.arrangeLayer(this.layers, _view, LayerOperationType.bottom);
    this.render();
  }
  unLock(view?: ViewObject): void {
    if (view) view?.unLock();
    else this.focusedViewObject?.unLock();
  }
  lock(view?: ViewObject): void {
    if (view) view?.lock();
    else this.focusedViewObject?.lock();
  }
  async fallback() {
    // const node: RecordNode = await this.recorder.fallback();
    // this.tool.fallbackViewObject(this.layers, node, this);
  }
  async cancelFallback() {
    // const node: RecordNode = await this.recorder.cancelFallback();
    // this.tool.fallbackViewObject(this.layers, node, this);
  }

  //无须实现
  down(e: Event): void {
    throw new Error("Method not implemented.");
  }
  //无须实现
  up(e: Event): void {
    throw new Error("Method not implemented.");
  }
  //无须实现
  move(e: Event): void {
    throw new Error("Method not implemented.");
  }
  //无须实现
  wheel(e: Event): void {
    throw new Error("Method not implemented.");
  }
  //无需实现
  createImage(
    image:
      | HTMLImageElement
      | SVGImageElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | Blob
      | ImageData
      | ImageBitmap
      | OffscreenCanvas,
    options?: XImageOption
  ): Promise<XImage> {
    throw new Error("Method not implemented.");
  }

  public cancelEvent(): void {
    if (this.eventHandler == null) return;
    this.eventHandler.disable();
  }

  /**
   * @description 新增图片
   * @param ximage
   * @returns
   */
  public addImage(ximage: XImage): Promise<ViewObject> {
    this.debug("Add a XImage");
    if (ximage.constructor.name != "XImage")
      throw Error("Invalid value,this value must be an instance of XImage");
    const image: XImage = ximage;
    const imageBox: ImageBox = new ImageBox(image);
    imageBox.center(this.canvasRect.size);
    this.addViewObject(imageBox);
    this.render();
    return Promise.resolve(imageBox);
  }
  /**
   * @description 新增文字
   * @param text
   * @param options
   * @returns
   */
  public addText(text: string, options?: TextOptions): Promise<ViewObject> {
    const textBox: TextBox = new TextBox(text, options);
    textBox.center(this.canvasRect.size);
    this.addViewObject(textBox);
    //测试
    // this.focusedViewObject=textBox;
    // this.focusedViewObject.onSelected()
    setTimeout(() => {
      this.render();
    }, 100);
    return Promise.resolve(textBox);
  }
  public addWrite(options: {
    type: "circle" | "write" | "line" | "rect" | "none";
    lineWidth?: number;
    color?: string;
    isFill?: boolean;
  }): GraffitiCloser {
    this.writeFactory.setConfig(options);
    return [
      () => {
        //关闭涂鸦
        this.writeFactory.close();
      },
      (callback) => {
        this.writeFactory.onCreateGraffiti.bind(this.writeFactory)(callback);
      },
    ];
  }
}

export class SimpleImageToolkitAdapterController extends ImageToolkitAdapterController {}
export default ImageToolkitAdapterController;
