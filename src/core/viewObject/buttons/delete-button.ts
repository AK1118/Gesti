import CloseButton from "./closeButton";

class DeleteButton extends CloseButton {
  effect(): void {
    this.master.getKit().cancel(this.master);
    this.master.getKit().remove(this.master);
  }
}

export default DeleteButton;
