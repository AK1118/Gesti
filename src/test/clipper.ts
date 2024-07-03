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
import Drag from "@/utils/event/drag";

class Clipper extends RectCrop {
  private _position: Vector;
  private image: XImage;
  private imageRect: Rect = null;
  private dragOffset: Vector = Vector.zero;
  //在裁剪时是否显示全图，为true时不会显示全图
  private isClip: boolean = false;
  //是否已经裁剪，为true时表示未进行裁剪
  private clipped: boolean = false;
  private clipTimer: any = null;
  private clippedValue: any;
  constructor(
    option: RectCropOption & {
      image: XImage;
    }
  ) {
    super(option);
    this.image = option.image;
  }
  public initialization(kit: ImageToolkitAdapterController): void {
    super.initialization(kit);
    this.rect.disableDragPosition = !this.clipped;
    this.rect.beforeDrag = (rect, position) => {
      this._position = rect.position;
    };
    this.rect.onDrag = (rect, position) => {
      if (this.clipped) return;
      this.setPosition(this._position.x, this._position.y);
      this.imageRect.setPosition(Vector.add(position.copy(), this.dragOffset));
    };
  }
  protected didChangePosition(position: Vector): void {
    super.didChangePosition(position);
    if (this.imageRect === null) {
      this.imageRect = this.rect.copy();
      this.imageRect.setPosition(new Vector(position.x, position.y));
    }
  }
  protected didDrag(value: { size: Size; angle: number }): void {
    super.didDrag(value);
    this.setPosition(this._position.x, this._position.y);
  }
  public render(paint: Painter, isCache?: boolean): void {
    if (!this.imageRect) return;
    if (this.clipped) {
      this.handleRenderClipped(paint);
    } else {
      this.handleRenderClipping(paint);
    }
    if (!this.clipped) super.render(paint, false);
  }
  private handleRenderClipped(paint: Painter) {
    const { data } = this.image;
    const {
      srcX,
      srcY,
      srcWidth,
      srcHeight, // 源图像的裁剪区域
      destX,
      destY,
      drawWidth,
      drawHeight,
    } = this.clippedValue; // 目标绘制区域}=this.value;
    paint.deepDrawImage(
      data,
      srcX,
      srcY,
      srcWidth,
      srcHeight, // 源图像的裁剪区域
      this.position.x - this.halfWidth,
      this.position.y - this.halfHeight,
      this.width,
      this.height // 目标绘制区域
    );
  }
  /**
   * 裁剪时渲染图片
   * @param paint
   */
  private handleRenderClipping(paint: Painter) {
    const { data } = this.image;
    const { width, height } = this.imageRect.size;
    paint.save();
    if (this.isClip) {
      paint.rect(
        this.position.x - this.width * 0.5,
        this.position.y - this.height * 0.5,
        this.width,
        this.height
      );
      paint.clip();
    }
    paint.deepDrawImage(
      data,
      this.imageRect.position.x - width * 0.5,
      this.imageRect.position.y - height * 0.5,
      width,
      height
    );
    paint.restore();
  }
  public onSelected(): void {
    super.onSelected();
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
  }
  protected didChangeDeltaScale(deltaScale: number): void {
    this.handleChangeImageSize();
  }
  handleChangeImageSize() {
    const imgWidth = this.imageRect.size.height,
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
    this.value;
  }
  onMove(e: Vector | Vector[]): void {
    this.isClip = false;
    if (!this.clipped) super.showCrossLine();
  }
  private markNeedClip() {
    if (this.clipTimer) clearTimeout(this.clipTimer);
    this.clipTimer = setTimeout(() => {
      this.isClip = true;
      super.hiddenCrossLine();
      this.markNeedsRePaint();
    }, 500);
  }
  private markClipped() {
    this.clipped = true;
    this.markNeedsRePaint();
  }
  private markNeedClipping() {
    this.clipped = false;
    this.markNeedsRePaint();
  }
  public clipStart() {
    this.rect.disableDragPosition = true;
    this.markNeedClip();
    this.markNeedClipping();
  }
  public clipStop() {
    this.rect.disableDragPosition = false;
    this.clippedValue = this.value;
    this.markClipped();
  }
  get value(): any {
    const OX = Math.max(
      0,
      this.imageRect.position.x - this.imageRect.size.width * 0.5
    );
    const OY = Math.max(
      0,
      this.imageRect.position.y - this.imageRect.size.height * 0.5
    );
    const imgPo = new Vector(OX, OY);

    const CX = this.position.x - this.width * 0.5;
    const CY = this.position.y - this.height * 0.5;
    const clipPo = new Vector(CX, CY);

    const offset = Vector.sub(clipPo, imgPo);

    const imgDataOfImgRectScaleWidth =
      this.image.data.width / this.imageRect.size.width;
    const imgDataOfImgRectScaleHeight =
      this.image.data.height / this.imageRect.size.height;
    return {
      srcX: offset.x * imgDataOfImgRectScaleWidth,
      srcY: offset.y * imgDataOfImgRectScaleHeight,
      srcWidth: this.width * imgDataOfImgRectScaleWidth,
      srcHeight: this.height * imgDataOfImgRectScaleHeight, // 源图像的裁剪区域
      destX: this.position.x,
      destY: this.position.y,
      drawWidth: this.width,
      drawHeight: this.height,
    };
  }
}

export default Clipper;
