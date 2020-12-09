import { IpcRenderer } from "electron";

import { NativeHooks, WindowType } from "./types";

class NativeHooksImplementation implements NativeHooks {
  ipcRenderer: IpcRenderer;

  constructor(ipcRenderer: IpcRenderer) {
    this.ipcRenderer = ipcRenderer;
  }
  async openFile() {
    const { filePaths, canceled } = await this.ipcRenderer.invoke("openFile");
    if (!canceled) {
      return filePaths[0];
    }
    return null;
  }
  async openFolder() {
    const { filePaths, canceled } = await this.ipcRenderer.invoke("openFolder");
    if (!canceled) {
      return filePaths[0];
    }
    return null;
  }
  async changeWindowSize(windowType: WindowType) {
    await this.ipcRenderer.invoke("changeWindowSize", windowType);
  }
}

export default NativeHooksImplementation;
