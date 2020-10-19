import { IpcRenderer } from "electron";

import { NativeHooks } from "./types";

export default (ipcRenderer: IpcRenderer): NativeHooks => {
  return {
    openFile: async () => {
      const { filePaths, canceled } = await ipcRenderer.invoke("openFile");
      if (!canceled) {
        return filePaths[0];
      }
      return null;
    },
    openDirectory: async () => {
      const result = await ipcRenderer.invoke("openDirectory");
      return result;
    },
  };
};
