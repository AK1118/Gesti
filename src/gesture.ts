import ImageBox from "./imageBox";
import Rect from "./rect";
import XImage from "./ximage";

class Gesture{
    imageBox:ImageBox=null;
    oldRect:Rect=null;
    public onStart(imageBox:ImageBox,event:Vector[]){

    }
    public cancel(){
        this.imageBox=null;
    }
}
export default Gesture;