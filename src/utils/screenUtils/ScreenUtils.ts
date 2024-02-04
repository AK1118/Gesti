import Serializable from "@/core/interfaces/Serialization";
import { ScreenUtilOption } from "@/types/gesti";
import { ScreenUtilExportEntity } from "Serialization";

/**
 * 屏幕适配器
 * 假如画布1宽高为 1000*100，画布2宽高为  500*500
 * 在画布1内画一个居中的  S=500*500 P={10,10}矩形，转移到画布2内
 * 假设设计稿高宽为750*750，那么画布1适配因子等于  1000/750，画布2适配因子等于 500/750
 * 画布1适配因子: 1.33   画布2适配因子  0.66
 * 在画布1内矩形大小等于  S=666.6*666.6    P={13.3,13.3}   画布二内矩形大小等于   S=333.3*333.3 P={6.6,6.6}
 *
 * 导出
 * 画布一导出数据携带原始size以及设计稿宽高用于还原大小
 * 注意，精度不可省略
 * 假设导出画布大小1000*1000，设计稿大小750*750,适配因子 1.33，矩形666.6*666.6，P 13.3*13.3计算原矩形大小等于  S= 666.6/1.33=500 P=13.3、13.3
 * 
 * 
 * 
 * 

 */

class ScreenUtils implements Serializable<ScreenUtilExportEntity> {
  private readonly option: ScreenUtilOption;
  private readonly scaleWidth: number;
  private readonly scaleHeight: number;
  private readonly scaleText: number;
  private readonly designWidth: number;
  private readonly designHeight: number;
  private readonly _deviceCanvasRatio: {
    widthRatio: number;
    heightRatio: number;
  };
  private _devScale: number = 1;
  private _devicePixelRatio: number = 1;
  constructor(option?: ScreenUtilOption) {
    if (!option) return;
    this.option = option;
    const {
      designWidth = 750,
      designHeight = 1334,
      devicePixelRatio = 1,
      canvasWidth,
      canvasHeight,
      minTextAdapt = false,
    } = option;
    this.scaleWidth = canvasWidth / designWidth;
    this.scaleHeight = canvasHeight / designHeight;
    this.designWidth = designWidth;
    this.designHeight = designHeight;
    this.scaleText = minTextAdapt
      ? Math.min(this.scaleWidth, this.scaleHeight)
      : this.scaleWidth;
    this._deviceCanvasRatio = option.deviceCanvasRatio || {
      widthRatio: 1,
      heightRatio: 1,
    };
    this.computeDevicePixelRatio(devicePixelRatio);
  }
  /**
   * 计算缩放因子的倒数控制画布缩放
   */
  private computeDevicePixelRatio(devicePixelRatio: number): void {
    this._devicePixelRatio = devicePixelRatio;
    this._devScale = 1 / this._devicePixelRatio;
  }
  public get deviceCanvasRatio(): {
    widthRatio: number;
    heightRatio: number;
  } {
    return this._deviceCanvasRatio;
  }
  public get devScale(): number {
    return this._devScale;
  }
  public get devicePixelRatio(): number {
    return this._devicePixelRatio;
  }

  toJSON(): ScreenUtilExportEntity {
    return {
      scaleHeight: this.scaleHeight,
      scaleText: this.scaleText,
      scaleWidth: this.scaleWidth,
      ...this.option,
    };
  }

  public setSp(fontSize: number): number {
    return this.scaleText * fontSize;
  }
  public setWidth(width: number): number {
    return this.scaleWidth * width;
  }
  public setHeight(height: number): number {
    return this.scaleHeight * height;
  }
  public get fullWidth(): number {
    return this.setWidth(this.designWidth);
  }
  public get fullHeight(): number {
    return this.setHeight(this.designHeight);
  }
  public static format(entity: ScreenUtilExportEntity): ScreenUtils {
    return new ScreenUtils(entity);
  }
  public restoreFromFactorWidthWidth(width: number): number {
    return width / this.scaleWidth;
  }
  public restoreFromFactorWidthHeight(height: number): number {
    return height / this.scaleHeight;
  }
  public restoreFromFactorWidthText(fontSize: number): number {
    return fontSize / this.scaleText;
  }

  public setDevicePixelRatio(devicePixelRatio: number): void {
    this._devicePixelRatio = devicePixelRatio;
    // this.computeDevicePixelRatio(devicePixelRatio);
  }
}

export default ScreenUtils;
