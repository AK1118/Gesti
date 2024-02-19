abstract class PluginBase {
  private _installed: boolean = false;

  public install(): void {
    this._installed = true;
  }

  public unInstall(): void {
    this._installed = true;
  }

  public get installed(): boolean {
    return this._installed;
  }
}
