import { IpcRenderer } from "electron";

import CoreHooks from "./coreHooks";
import NativeHooks from "./nativeHooks";
import { ElectronHooks } from "./types";

export default (ipcRenderer: IpcRenderer): ElectronHooks => {
  if (ipcRenderer == null) {
    throw new Error("ipcRenderer is null!");
  }
  return {
    core: CoreHooks(ipcRenderer),
    native: NativeHooks(ipcRenderer),
  };
};
