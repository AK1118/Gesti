import IconBase from "@/core/lib/icon";

class CloseIcon extends IconBase {
  get isFill(): boolean {
    return false;
  }
  get data(): number[][][] {
    return [
      [
        [5, 5],
        [35, 35],
      ],
      [
        [35, 5],
        [5, 35],
      ],
    ];
  }
}
export default CloseIcon;
