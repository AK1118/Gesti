import ImageToolkit from "../image-toolkit";

interface GestiController {
    kit:ImageToolkit;
    down(e: Event): void;
    up(e: Event): void;
    move(e: Event): void;
    wheel(e: Event): void;
}

export default GestiController;