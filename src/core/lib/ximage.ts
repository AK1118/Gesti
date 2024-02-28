import Serializable from "../interfaces/Serialization";
import Cutter from "../../utils/cutters/cutter-H5";
import { ImageChunk } from "Gesti";
import ImageChunkConverter from "../abstract/image-chunk-converter";
import ImageChunkConverterH5 from "@/utils/converters/image-chunk-converter-H5";
import { ExportXImage } from "Serialization";
class XImage implements Serializable<{}> {
  originData: any;
  data: any;
  width: number = 0;
  height: number = 0;
  x: number = 0;
  y: number = 0;
  scale: number = 1;
  /**
   * 原始数据大小
   */
  fixedWidth: number = 0;
  fixedHeight: number = 0;
  url: string;
  constructor(params: createImageOptions) {
    const {
      data,
      width,
      height,
      scale,
      originData,
      fixedWidth,
      fixedHeight,
      url,
    } = params;
    if (!data || !width || !height) throw Error("数据或宽或高不能为空");
    this.originData = originData;
    this.data = data;
    this.width = width;
    this.height = height;
    this.scale = scale || 1;
    this.url = url;
    /**
     * 需要保留图片原始大小
     */
    if (fixedWidth && fixedHeight) {
      this.fixedWidth = fixedWidth;
      this.fixedHeight = fixedHeight;
    } else {
      this.fixedWidth = width;
      this.fixedHeight = height;
    }
    this.width *= this.scale;
    this.height *= this.scale;
    this.width = ~~this.width;
    this.height = ~~this.height;
  }
  public async export(): Promise<ExportXImage> {
    const url: string = this.url;
    let data: ImageChunk[];
    if (!url) {
      const cutter: Cutter = new Cutter();
      const chunks: ImageChunk[] =await cutter.getChunks(this);
      const coverter: ImageChunkConverter = new ImageChunkConverterH5();
      data = coverter.coverAllImageChunkToBase64(chunks);
    }
    return Promise.resolve({
      url: this.url,
      data: data,
      width: this.fixedWidth,
      height: this.fixedHeight,
    });
  }
  toJSON(): any {
    let data: ImageChunk[];
    return {
      url: this.url,
      data: data,
      width: this.fixedWidth,
      height: this.fixedHeight,
    };
  }
  toJson(): RectParams {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
export default XImage;
