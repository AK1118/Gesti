import IconBase from "@/core/lib/icon";

class ScaleIcon extends IconBase{
    get data(): number[][][] {
        return [
            [[5,5],[25,5],[5,25]],[[35,35],[10,35],[35,10]]
        ];
    }
}
export default ScaleIcon;