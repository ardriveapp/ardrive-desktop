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
    openFolder: async () => {
      const { filePaths, canceled } = await ipcRenderer.invoke("openFolder");
      if (!canceled) {
        return filePaths[0];
      }
      return null;
    },
  };
};
