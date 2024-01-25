import RenderObject from "../interfaces/render-object";
import Painter from "../lib/painter";
import Rect, { Size } from "../lib/rect";
import Vector from "../lib/vector";
import { Point } from "../lib/vertex";
import Button, { BaseButton } from "./baseButton";
import OperationObserver from "./operation-observer";
import AuxiliaryLine from "../../tools/auxiliary-lines";
import GestiConfig from "../../config/gestiConfig";
import { ViewObjectFamily } from "../enums";
import ImageToolkit from "../lib/image-toolkit";
import { Delta } from "../../utils/event/event";
import BaseViewObject from "./view-object-base";
import {
  ExportButton,
  FetchXImageForImportCallback,
  ViewObjectExportBaseInfo,
  ViewObjectExportImageBox,
  ViewObjectImportBaseInfo,
  ViewObjectImportImageBox,
} from "@/types/serialization";
import Platform from "../viewObject/tools/platform";
import BoxDecoration from "../lib/rendering/decorations/box-decoration";
import { BoxDecorationOption } from "Graphics";
import { CenterAxis } from "@/types/controller";
/**
 *
 * 缓存要做到 数据层缓存，渲染层缓存
 * 如果没有缓存 =》 新建缓存  =》渲染缓存
 * 如果有缓存 =》 渲染缓存
 *
 * 缓存包括数据有   rect,渲染层图片
 *
 *
 */
abstract class ViewObject extends BaseViewObject implements RenderObject {
  //辅助线
  private auxiliary: AuxiliaryLine;
  public originFamily: ViewObjectFamily;

  constructor() {
    super();
  }

  //获取对象值
  abstract get value(): any;

  public initialization(kit: ImageToolkit): void {
    this.kit = kit;
    //初始化一些数据，准备挂载
    this.ready(kit);
    //添加监听
    this.addObserver(this.renderBox);
    //初始化矩阵点
    this.rect.updateVertex();
    //挂载
    this.mount();
    this.setFixedSize(this.size.toObject());
  }
  //卸载按钮
  public unInstallButton(buttons: Array<Button>) {
    this.funcButton = this.funcButton.filter((item) => {
      //是否在卸载队列内
      const include: boolean = buttons.includes(item);
      if (include) item.unMount();
      return !include;
    });
  }
  //安装按钮
  public installButton(button: Button) {
    button.initialization(this);
    this.funcButton.push(button);
  }
  //安装多个按钮
  public installMultipleButtons(buttons: Array<Button>): void {
    if (!Array.isArray(buttons))
      throw new Error("Must be a class Button Array.");
    buttons.forEach((_) => _.initialization(this));
    this.funcButton.push(...buttons);
  }
  public mirror(): boolean {
    this.isMirror = !this.isMirror;
    return this.isMirror;
  }

  public render(paint: Painter, isCache?: boolean) {
    if (!this.mounted) return;
    /*更新顶点数据*/
    if (this.didChanged) {
      this.rect.updateVertex();
      this.reBuild();
    }
    //执行缓存画布生成
    if (this.isUseRenderCache && !this.offScreenCreated) {
      this.performCache();
    }
    this.draw(paint, isCache);
  }
  protected performCache() {
    //生成画布会返回布尔值判断是否生成成功，生成失败关闭缓存功能
    const created = this.generateOffScreenCanvas();
    //创建离屏失败，关闭缓存渲染
    if (!created) this.unUseCache();
    this.draw(this.offScreenPainter, true);
    this.offScreenPainter.save();
    this.offScreenPainter.translate(this.width * 0.5, this.height * 0.5);
    this.decoration?.render(this.offScreenPainter, this.rect);
    this.drawImage(this.offScreenPainter);
    this.offScreenPainter.restore();
  }
  /**
   * @description 实时渲染或者渲染缓存
   * @param paint
   */
  private renderImageOrCache(paint: Painter) {
    if (this.canRenderCache) {
      //渲染缓存
      paint.drawImage(this.offScreenCanvas, 0, 0, this.width, this.height);
    } else {
      this.decoration?.render(paint, this.rect);
      this.drawImage(paint);
    }
  }
  public draw(paint: Painter, isCache?: boolean): void {
    //渲染缓存不需要设置或渲染其他属性
    paint.beginPath();
    paint.save();
    //缓存不需要这两个
    if (!isCache) {
      paint.translate(this.positionX, this.positionY);
      paint.rotate(this.rect.getAngle);
    }
    if (this.isMirror) paint.scale(-1, 1);
    paint.globalAlpha = this.opacity;
    this.renderImageOrCache(paint);
    if (this.selected) {
      //边框
      this.drawSelectedBorder(paint, this.size);

      /**
       * ### 在kit.render方法中使用了scale全局，这里需要矫正回来
       */
      paint.save();
      if (this.isMirror) paint.scale(-1, 1);
      //按钮
      this.updateFuncButton(paint);
      paint.restore();
    }
    paint.restore();
    paint.closePath();
  }
  /**
   * 该方法需要子类实现
   * @param paint
   */
  abstract drawImage(paint: Painter): void;
  /**
   * 被选中后外边框
   * @param paint
   */
  private readonly borderColor: string = "#b2ccff";
  public drawSelectedBorder(paint: Painter, size: Size): void {
    const padding = 3;
    paint.beginPath();
    paint.lineWidth = 1;
    paint.strokeStyle = this.borderColor;
    paint.strokeRect(
      (~~this.width + padding) * -0.5,
      (~~this.height + padding) * -0.5,
      ~~this.width + padding,
      ~~this.height + padding
    );
    paint.closePath();
    paint.stroke();
  }
  /**
   * 镜像翻转
   */
  public setMirror(isMirror: boolean) {
    this.isMirror = isMirror;
  }
  /**
   * @description 刷新按钮
   * @param paint
   */
  private updateFuncButton(paint: Painter): void {
    const rect: Rect = this.rect;
    const x: number = rect.position.x,
      y: number = rect.position.y;
    this.funcButton.forEach((button: Button) => {
      const len: number = button.getOriginDistance();
      if (button.disabled) return;
      const angle = this.rect.getAngle + button.oldAngle;
      const newx = Math.cos(angle) * len + x;
      const newy = Math.sin(angle) * len + y;
      const vector = new Vector(~~newx, ~~newy);
      button.updatePosition(vector);
      //运动时不显示按钮
      if (this.delta.isZero) button.render(paint);
    });
  }
  /**
   * @description 按钮是否被点击
   * @param eventPosition
   * @returns
   */
  public checkFuncButton(eventPosition: Vector): Button | boolean {
    /**
     * 遍历功能键
     * 传入的时global位置，转换为相对位置判断是否点击到按钮
     */
    const event: Vector = Vector.sub(eventPosition, this.rect.position);
    const button: Button = this.funcButton.find((button: Button) => {
      if (button.disabled) return false;
      const angle = button.oldAngle + this.rect.getAngle;
      const x = Math.cos(angle) * button.originDistance;
      const y = Math.sin(angle) * button.originDistance;
      const buttonPosi: Vector = new Vector(x, y);
      return button.isInArea(event, buttonPosi);
    });
    return button;
  }
  public hide() {
    this.disabled = true;
    this.onHide();
    this.cancel();
  }
  public getVertex(): Point[] {
    return this.rect.vertex?.getPoints();
  }
  public onSelected() {
    //被选中过后对所有图层点进行备份，不需要每次渲染都获取一次
    this.auxiliary?.createReferencePoint(this.key.toString());
    this.selected = true;
  }
  public cancel() {
    this.selected = false;
  }
  /*每次改变大小后都需要刷新按钮的数据*/
  public onChanged() {
    this.funcButton.forEach((item: BaseButton) => {
      // item.setMaster(this);
      item.reset();
    });
    //在下次运动前，delta应该置于0
    this.delta.cleanCurrentAndBefore();
  }
  //
  public onUpWithInner(paint: Painter) {
    /*在抬起鼠标时，ViewObject还没有被Calcel，为再次聚焦万向按钮做刷新数据*/
    this.onChanged();
    this.didEventUpWithInner();
  }
  public onUpWithOuter(paint: Painter): void {
    this.didEventUpWithOuter();
  }
  private readonly enlargeScale: number = 1.1;
  private readonly narrowScale: number = 1 / 1.1;
  public enlarge() {
    this.deltaScale = this.enlargeScale;
    this.rect.setDeltaScale(this.deltaScale);
    this.doScale();
  }
  public narrow() {
    this.deltaScale = this.narrowScale;
    this.rect.setDeltaScale(this.deltaScale);
    this.doScale();
  }
  private doScale() {
    if (this.isLock) return;
    this.onChanged();
  }
  /**
   * @description 瞬时缩放
   * @param deltaScale
   */
  public setDeltaScale(deltaScale: number) {
    this.delta.update(this.position);
    this.deltaScale = deltaScale;
    this.rect.setDeltaScale(deltaScale);
  }

  /**
   * 世界坐标居中
   */
  public center(canvasSize: Size, axis?: CenterAxis) {
    if (axis) {
      if (axis == "vertical")
        return (this.rect.position = new Vector(
          this.rect.position.x,
          canvasSize.height >> 1
        ));
      if (axis == "horizon")
        return (this.rect.position = new Vector(
          canvasSize.width >> 1,
          this.rect.position.y
        ));
    }
    const x = canvasSize.width >> 1,
      y = canvasSize.height >> 1;
    this.rect.position = new Vector(x, y);
  }

  public toCenter(axis?: CenterAxis): void {
    if (!this.mounted) return;
    this.kit.center(this, axis);
  }

  protected _didChangeSize(size: Size): void {
    this.computedRespectRatio();
  }

  protected _didChangeDeltaScale(scale: number): void {
    this.computedRespectRatio();
  }

  private computedRespectRatio(): void {
    /**
     目前宽高/绝对倍数=真实宽高
     真实宽高/固定宽高=真是增长倍数
   */
    const deltaWidth = this.width / this.absoluteScale,
      deltaHeight = this.height / this.absoluteScale;
    this.renderBox.setScaleWidth(deltaWidth / this.fixedSize.width);
    this.setScaleHeight(deltaHeight / this.fixedSize.height);
  }
  protected _didChangePosition(position: Vector): void {
    if (!this.delta) this.delta = new Delta(position.x, position.y);
    this.delta.update(position.copy());
  }
  protected _didChangeScaleWidth(): void {
    if (!this.sizeDelta)
      this.sizeDelta = new Delta(this.size.width, this.size.height);
    this.sizeDelta.update(this.size.toVector());
  }
  /**
   * 撤销 | 取消撤销回调
   */
  public didFallback() {}

  /**
   * @description 提供公用基础信息导出
   * @returns
   */

  public getBaseInfo(): ViewObjectExportBaseInfo {
    return {
      rect: {
        x: ~~this.rect.position.x,
        y: ~~this.rect.position.y,
        width: ~~this.width,
        height: ~~this.height,
        angle: this.rect.getAngle,
      },
      relativeRect: {
        x: ~~this.relativeRect.position.x,
        y: ~~this.relativeRect.position.y,
        width: ~~this.relativeRect.size.width,
        height: ~~this.relativeRect.size.height,
        angle: this.rect.getAngle,
      },
      fixedSize: this.fixedSize.toObject(),
      sizeScale: {
        scaleWidth: this.scaleWidth,
        scaleHeight: this.scaleHeight,
      },
      mirror: this.isMirror,
      locked: this.isLock,
      buttons: this.funcButton.map<ExportButton>((button: BaseButton) => {
        return {
          type: button.name,
          location: button.btnLocation,
          radius: button.senseRadius,
          backgroundColor: button.background,
          iconColor: button.iconColor,
          displayBackground: button.displayBackground,
        };
      }),
      id: this.id,
      layer: this.getLayer(),
      isBackground: this.isBackground,
      opacity: this.opacity,
      platform: Platform.platform,
      decoration: this.decoration,
    };
  }
  /**
   * 自定义一些操作
   */
  public custom() {}

  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }
}

export default ViewObject;
