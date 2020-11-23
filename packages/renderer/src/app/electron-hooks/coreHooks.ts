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
    startWatchingFolders: async (login: string) => {
      await ipcRenderer.invoke("startWatchingFolders", login);
    },
  };
};
