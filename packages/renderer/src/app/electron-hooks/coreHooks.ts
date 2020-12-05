import { IpcRenderer } from "electron";

import { CoreHooks } from "./types";

export default (ipcRenderer: IpcRenderer): CoreHooks => {
  return {
    login: async (username: string, password: string) => {
      return await ipcRenderer.invoke("login", username, password);
    },
    createNewUser: async (
      username: string,
      password: string,
      syncFolderPath: string,
      walletPath: string
    ) => {
      const result = await ipcRenderer.invoke(
        "createNewUser",
        username,
        password,
        syncFolderPath,
        walletPath
      );
      return result;
    },
    startWatchingFolders: async (username: string) => {
      await ipcRenderer.invoke("startWatchingFolders", username);
    },
    fetchFiles: async (username: string) => {
      const files = await ipcRenderer.invoke("fetchFiles", username);
      return files;
    },
  };
};
