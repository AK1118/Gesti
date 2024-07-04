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
import Drag from "@/utils/event/drag";
import { ViewObjectExportEntity } from "Serialization";

// class Clipper extends RectCrop {
//   private _position: Vector;
//   protected xImage: XImage;
//   private imageRect: Rect = null;
//   private dragOffset: Vector = Vector.zero;
//   //在裁剪时是否显示全图，为true时不会显示全图
//   private isClip: boolean = false;
//   //是否已经裁剪，为true时表示未进行裁剪
//   private clipping: boolean = false;
//   private clipTimer: any = null;
//   private clippedValue: any;
//   constructor(
//     option: RectCropOption & {
//       image: XImage;
//     }
//   ) {
//     super(option);
//     this.xImage = option.image;
//   }
//   public initialization(kit: ImageToolkitAdapterController): void {
//     super.initialization(kit);
//     this.performInit();
//   }
//   protected performInit() {
//     this.rect.disableDragPosition = !this.clipping;
//     this.rect.beforeDrag = (rect, position) => {
//       this._position = rect.position;
//     };
//     this.rect.onDrag = (rect, position) => {
//       if (this.clipping) return;
//       this.setPosition(this._position.x, this._position.y);
//       this.imageRect.setPosition(Vector.add(position.copy(), this.dragOffset));
//     };
//     this.markNeedsReBuild();
//   }
//   protected replaceXImage(xImage: XImage) {
//     this.imageRect = null;
//     this.performInit();

//   }
//   protected didChangePosition(position: Vector): void {
//     super.didChangePosition(position);
//     this.rect.updateVertex();
//   }
//   performRebuild(): void {
//     this.imageRect = this.rect.copy();
//     this.clipStop();
//     super.performRebuild();
//   }
//   protected didDrag(value: { size: Size; angle: number }): void {
//     super.didDrag(value);
//     this.setPosition(this._position.x, this._position.y);
//   }
//   public render(paint: Painter, isCache?: boolean): void {
//     if (!this.imageRect) return;
//     console.log("复制大小",this.imageRect.size)
//     if (this.clipping) {
//       this.handleRenderClipped(paint);
//     } else {
//       this.handleRenderClipping(paint);
//     }
//     if (!this.clipping) super.render(paint, false);
//   }
//   private handleRenderClipped(paint: Painter) {
//     const { data } = this.xImage;
//     if (!this.clippedValue) {
//       paint.deepDrawImage(
//         data,
//         0,
//         0,
//         this.imageRect.size.width >> 0,
//         this.imageRect.size.height >> 0,
//         this.position.x - this.width,
//         this.position.y - this.height,
//         this.rect.size.width >> 0,
//         this.rect.size.height >> 0
//       );
//       return;
//     }
//     const {
//       srcX,
//       srcY,
//       srcWidth,
//       srcHeight, // 源图像的裁剪区域
//       destX,
//       destY,
//       drawWidth,
//       drawHeight,
//     } = this.clippedValue; // 目标绘制区域}=this.value;
//     console.log("渲染", this.clippedValue);
//     paint.deepDrawImage(
//       data,
//       srcX,
//       srcY,
//       srcWidth,
//       srcHeight, // 源图像的裁剪区域
//       this.position.x - this.halfWidth,
//       this.position.y - this.halfHeight,
//       this.width,
//       this.height // 目标绘制区域
//     );
//   }
//   /**
//    * 裁剪时渲染图片
//    * @param paint
//    */
//   private handleRenderClipping(paint: Painter) {
//     const { data } = this.xImage;
//     const { width, height } = this.imageRect.size;
//     paint.save();
//     if (this.isClip) {
//       paint.rect(
//         this.position.x - this.width * 0.5,
//         this.position.y - this.height * 0.5,
//         this.width,
//         this.height
//       );
//       paint.clip();
//     }
//     console.log("裁剪渲染",this.size,this.imageRect.size);
//     paint.deepDrawImage(
//       data,
//       this.imageRect.position.x - width * 0.5,
//       this.imageRect.position.y - height * 0.5,
//       width,
//       height
//     );
//     paint.restore();
//   }
//   public onSelected(): void {
//     super.onSelected();
//   }
//   onDown(e: Vector | Vector[]): void {
//     super.onDown(e);
//     if (Array.isArray(e)) return;
//     if (!this.dragOffset) this.dragOffset = Vector.zero;
//     this.dragOffset.setXY(
//       this.imageRect.position.x - this.position.x,
//       this.imageRect.position.y - this.position.y
//     );
//   }
//   protected didChangeSize(size: Size): void {
//     this.handleChangeImageSize();
//   }
//   protected didChangeDeltaScale(deltaScale: number): void {
//     this.handleChangeImageSize();
//   }
//   handleChangeImageSize() {
//     const imgWidth = this.imageRect.size.height,
//       imgHeight = this.imageRect.size.height;

//     if (this.width > imgWidth || this.height > imgHeight) {
//       const widthScale = this.width / imgWidth;
//       const heightScale = this.height / imgHeight;
//       const scale = Math.max(widthScale, heightScale);
//       this.imageRect.setSize(imgWidth * scale, imgHeight * scale);
//     }
//     const { position } = this.imageRect;
//     let currentPositionX = position.x,
//       currentPositionY = position.y;
//     if (position.x > this.position.x + (imgWidth - this.width) * 0.5) {
//       currentPositionX = this.position.x + (imgWidth - this.width) * 0.5;
//     }
//     if (position.y > this.position.y + (imgHeight - this.height) * 0.5) {
//       currentPositionY = this.position.y + (imgHeight - this.height) * 0.5;
//     }
//     if (position.x < this.position.x - (imgWidth - this.width) * 0.5) {
//       currentPositionX = this.position.x - (imgWidth - this.width) * 0.5;
//     }
//     if (position.y < this.position.y - (imgHeight - this.height) * 0.5) {
//       currentPositionY = this.position.y - (imgHeight - this.height) * 0.5;
//     }
//     this.imageRect.setPosition(new Vector(currentPositionX, currentPositionY));
//   }
//   onUp(e: Vector | Vector[]): void {
//     super.onUp(e);
//     this.handleChangeImageSize();
//     this.dragOffset = null;
//     this.markNeedClip();
//   }
//   onMove(e: Vector | Vector[]): void {
//     this.isClip = false;
//     if (!this.clipping) super.showCrossLine();
//   }
//   private markNeedClip() {
//     if (this.clipTimer) clearTimeout(this.clipTimer);
//     this.clipTimer = setTimeout(() => {
//       this.isClip = true;
//       super.hiddenCrossLine();
//       this.markNeedsRePaint();
//     }, 500);
//   }
//   private markClipped() {
//     this.clipping = true;
//     this.markNeedsRePaint();
//   }
//   private markNeedClipping() {
//     this.clipping = false;
//     this.markNeedsRePaint();
//   }
//   public clipStart() {
//     if (!this.clipping) return;
//     this.rect.disableDragPosition = true;
//     this.imageRect.position = Vector.sub(
//       this.position,
//       this.clippedValue.offset
//     );

//     this.markNeedClip();
//     this.markNeedClipping();
//   }
//   public clipStop() {
//     if (this.clipping) return;
//     this.rect.disableDragPosition = false;
//     this.clippedValue = this.getClippedValue();
//     this.markClipped();
//   }
//   getClippedValue(): any {
//     const OX = Math.max(
//       0,
//       this.imageRect.position.x - this.imageRect.size.width * 0.5
//     );
//     const OY = Math.max(
//       0,
//       this.imageRect.position.y - this.imageRect.size.height * 0.5
//     );
//     const imgPo = new Vector(OX, OY);

//     const CX = this.position.x - this.width * 0.5;
//     const CY = this.position.y - this.height * 0.5;
//     const clipPo = new Vector(CX, CY);

//     const offset = Vector.sub(clipPo, imgPo);

//     const imgDataOfImgRectScaleWidth =
//       this.xImage.data.width / this.imageRect.size.width;
//     const imgDataOfImgRectScaleHeight =
//       this.xImage.data.height / this.imageRect.size.height;
//     return {
//       srcX:Math.max(0, offset.x * imgDataOfImgRectScaleWidth),
//       srcY: Math.max(0,offset.y * imgDataOfImgRectScaleHeight),
//       srcWidth: this.width * imgDataOfImgRectScaleWidth,
//       srcHeight: this.height * imgDataOfImgRectScaleHeight, // 源图像的裁剪区域
//       destX: this.position.x,
//       destY: this.position.y,
//       drawWidth: this.width,
//       drawHeight: this.height,
//       offsetX: offset.x,
//       offsetY: offset.y,
//       offset: Vector.sub(this.position, this.imageRect.position),
//     };
//   }
//   get value(): RectCropValue {
//     return this.clippedValue;
//   }
// }
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
  public clipRotate: number = 0;
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
      this.imageRect.setPosition(Vector.add(position.copy(), this.dragOffset));
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
      paint.clipRect(
        new Rect({
          x: this.position.x - this.width * 0.5,
          y: this.position.y - this.height * 0.5,
          width: this.width,
          height: this.height,
        }),
        () => {
          this.drawClipImage(paint);
        }
      );
    } else {
      this.drawClipImage(paint);
    }
    // this.drawClipImage(paint);
  }
  private drawClipImage(paint: Painter) {
    const { data } = this.xImage;
    const { width, height } = this.imageRect.size;
    // paint.save();
    // paint.translate(this.position.x, this.position.y);
    // paint.rotate(this.clipRotate);
    // paint.translate(-this.position.x, -this.position.y);
    paint.deepDrawImage(
      data,
      this.imageRect.position.x - width * 0.5,
      this.imageRect.position.y - height * 0.5,
      width,
      height
    );
    // paint.restore();
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
