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
 * 需要考虑动态改变屏幕大小
 */

class ScreenUtils implements Serializable<ScreenUtilExportEntity> {
  private readonly option: ScreenUtilOption;
  private readonly scaleWidth: number;
  private readonly scaleHeight: number;
  private readonly scaleText: number;
  constructor(option: ScreenUtilOption) {
    this.option = option;
    const {
      designWidth = 750,
      designHeight = 1334,
      devicePixelRatio = 1,
      canvasWidth,
      canvasHeight,
      minTextAdapt = false,
    } = option;
    this.scaleWidth = (canvasWidth / designWidth) * devicePixelRatio;
    this.scaleHeight = (canvasHeight / designHeight) * devicePixelRatio;
    this.scaleText = minTextAdapt
      ? Math.min(this.scaleWidth, this.scaleHeight)
      : this.scaleWidth;
  }
  toJSON(): ScreenUtilExportEntity {
    return this.option; 
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
}

export default ScreenUtils;
