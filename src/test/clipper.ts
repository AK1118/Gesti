import ViewObject from "@/core/abstract/view-object";
import { ViewObjectFamily } from "@/core/enums";
import ImageToolkitAdapterController from "@/core/lib/image-tool-kit/adpater";
import Painter from "@/core/lib/painter";
import Rect from "@/core/lib/rect";
import Vector from "@/core/lib/vector";
import XImage from "@/core/lib/ximage";
import RectCrop from "@/core/viewObject/crop/rect-crop";
import RectClipMask from "@/core/viewObject/mask/rect-clip-mask";
import {
  RectClipMaskOption,
  RectCropOption,
  RectCropValue,
} from "@/types/gesti";

class Clipper extends RectCrop {
  private _position: Vector;
  protected xImage: XImage;
  private imageRect: Rect = null;
  private dragOffset: Vector = Vector.zero;
  //在裁剪时是否显示全图，为true时不会显示全图
  private isClip: boolean = false;
  //是否已经裁剪，为true时表示未进行裁剪
  private clipping: boolean = false;
  private clipTimer: any = null;
  private offset: Vector = Vector.zero;
  public clipRotate: number = 170;
  family: ViewObjectFamily;
  private oldLayer: number;
  constructor(
    option: RectCropOption & {
      image: XImage;
    }
  ) {
    super(option);
    this.xImage = option.image;
  }
  protected onMounted(): void {
    super.onMounted();
    this.performInit();
  }
  protected performInit() {
    this.rect.disableDragPosition = this.clipping;
    this.rect.beforeDrag = (rect, position) => {
      this._position = rect.position;
    };
    this.rect.onDrag = (rect, position) => {
      this.setPosition(this._position.x, this._position.y);

      const cosAngle = Math.cos(-this.rect.angle - this.clipRotate); // 使用反方向角度进行矫正
      const sinAngle = Math.sin(-this.rect.angle - this.clipRotate); // 使用反方向角度进行矫正

      this.imageRect.position = Vector.add(position.copy(), this.dragOffset);
    };
    if (this.imageRect === null) {
      this.imageRect = this.rect.copy();
      this.imageRect.position = Vector.zero;
    }
    this.markNeedsReBuild();
  }
  protected didChangePosition(position: Vector): void {
    super.didChangePosition(position);
    if (this.offset.equals(Vector.zero)) {
      this.imageRect.position = this.position.copy();
    }
    this.rect.updateVertex();
  }
  protected _didChangeDeltaScale(scale: number): void {
    if (this.clipping) return;
    this.imageRect.setDeltaScale(scale);
    this.offset.mult(new Vector(scale, scale));
    this.imageRect.position = Vector.sub(this.position, this.offset);
  }
  onDown(e: Vector | Vector[]): void {
    super.onDown(e);
    if (Array.isArray(e)) return;
    if (!this.dragOffset) this.dragOffset = Vector.zero;
    this.dragOffset.setXY(
      this.imageRect.position.x - this.position.x,
      this.imageRect.position.y - this.position.y
    );
  }
  protected didChangeSize(size: Size): void {
    this.handleChangeImageSize();
    if (!this.clipping) {
      // this.scale
    }
  }

  protected didChangeDeltaScale(deltaScale: number): void {
    this.handleChangeImageSize();
  }
  handleChangeImageSize() {
    if (!this.clipping) return;
    const imgWidth = this.imageRect.size.width,
      imgHeight = this.imageRect.size.height;
    if (this.width > imgWidth || this.height > imgHeight) {
      const widthScale = this.width / imgWidth;
      const heightScale = this.height / imgHeight;
      const scale = Math.max(widthScale, heightScale);
      this.imageRect.setSize(imgWidth * scale, imgHeight * scale);
    }

    const { position } = this.imageRect;
    let currentPositionX = position.x,
      currentPositionY = position.y;
    if (position.x > this.position.x + (imgWidth - this.width) * 0.5) {
      currentPositionX = this.position.x + (imgWidth - this.width) * 0.5;
    }
    if (position.y > this.position.y + (imgHeight - this.height) * 0.5) {
      currentPositionY = this.position.y + (imgHeight - this.height) * 0.5;
    }
    if (position.x < this.position.x - (imgWidth - this.width) * 0.5) {
      currentPositionX = this.position.x - (imgWidth - this.width) * 0.5;
    }
    if (position.y < this.position.y - (imgHeight - this.height) * 0.5) {
      currentPositionY = this.position.y - (imgHeight - this.height) * 0.5;
    }
    this.imageRect.setPosition(new Vector(currentPositionX, currentPositionY));
  }
  onUp(e: Vector | Vector[]): void {
    super.onUp(e);
    this.handleChangeImageSize();
    this.dragOffset = null;
    this.markNeedClip();
  }
  onMove(e: Vector | Vector[]): void {
    if (!this.clipping) return;
    this.isClip = false;
    if (this.clipping) super.showCrossLine();
  }
  private markNeedClip() {
    if (this.clipTimer) clearTimeout(this.clipTimer);
    this.clipTimer = setTimeout(() => {
      this.isClip = true;
      super.hiddenCrossLine();
      this.markNeedsRePaint();
    }, 200);
  }
  get value(): any {
    throw new Error("Method not implemented.");
  }
  protected replaceXImage(xImage: XImage) {
    this.offset = Vector.zero;
    this.clipRotate = 0;
    this.isClip = false;
    this.clipping = false;
    this.imageRect === null;
    this.xImage = xImage;
    const { width, height } = xImage.toJson();
    const oldPosition: Vector = this.rect.position.copy();
    this.rect.setPosition(oldPosition);
    this.rect.setSize(width * this.absoluteScale, height * this.absoluteScale);
    this.imageRect = this.rect.copy();
    this.performInit();
    this.markNeedsRePaint();
  }
  render(paint: Painter): void {
    this.renderImageWidthClipping(paint);
    if (this.clipping) super.render(paint, false);
  }

  private renderImageWidthClipping(paint: Painter) {
    if (this.isClip) {
      paint.save();
      paint.translate(this.positionX, this.positionY);
      paint.rotate(this.rect.angle);
      paint.rect(
        -this.width * 0.5,
        -this.height * 0.5,
        this.width,
        this.height
      );
      paint.clip();
      this.drawClipImage(paint);
      paint.restore();
    } else {
      paint.save();
      paint.translate(this.positionX, this.positionY);
      paint.rotate(this.rect.angle);
      this.drawClipImage(paint);
      paint.restore();
    }
    // this.drawClipImage(paint);
  }
  private drawClipImage(paint: Painter) {
    const { data } = this.xImage;
    const { width, height } = this.imageRect.size;
    const angle = this.rect.angle;

    // 计算图像相对于旋转中心 (this.position) 的偏移量
    const offsetX = this.imageRect.position.x - this.position.x;
    const offsetY = this.imageRect.position.y - this.position.y;

    paint.save(); // 保存当前绘图状态
    paint.beginPath();

    // 平移到旋转中心位置
    // paint.translate(this.position.x, this.position.y);

    // 进行旋转
    paint.rotate(this.clipRotate);

    // 平移图像到相对于旋转中心的偏移位置
    paint.translate(offsetX, offsetY);

    // 绘制图像
    const imgX = -width * 0.5;
    const imgY = -height * 0.5;
    paint.deepDrawImage(data, imgX, imgY, width, height);

    paint.restore(); // 恢复绘图状态
  }

  public clipStart() {
    if (this.clipping) return;
    this.rect.disableDragPosition = true;
    this.clipping = true;
    this.isClip = true;
    this.imageRect.position = Vector.sub(this.position, this.offset);
    this.oldLayer = this.getLayer();
    this.getKit().setLayer(200, this);
    this.markNeedClip();
    this.markNeedsRePaint();
  }
  public clipStop() {
    if (!this.clipping) return;
    this.clipping = false;
    this.isClip = false;
    this.rect.disableDragPosition = false;
    this.offset = Vector.sub(this.position, this.imageRect.position);
    this.getKit().setLayer(this.oldLayer, this);
    this.markNeedsRePaint();
  }
  public updateClipImageRotate(rotate: number) {
    if (!this.clipping) return;
    this.clipRotate = (Math.PI / 180) * rotate;
    this.markNeedsRePaint();
  }
}
export default Clipper;
