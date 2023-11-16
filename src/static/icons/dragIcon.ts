import IconBase from "@/core/lib/icon";

class DragIcon extends IconBase{
    get data(): number[][][] {
       return [
        [[5,5],[19,5],[5,19]],
        [[35,35],[21,35],[35,21]],
        [[21,5],[35,5],[35,19]],
        [[5,21],[5,35],[19,35]]
       ];
    }   
}

export default DragIcon;