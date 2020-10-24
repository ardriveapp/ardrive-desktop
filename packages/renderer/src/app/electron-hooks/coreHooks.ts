import { IpcRenderer } from "electron";

import { CoreHooks } from "./types";

export default (ipcRenderer: IpcRenderer): CoreHooks => {
  return {
    login: async (username: string, password: string) => {
      const { result, user } = await ipcRenderer.invoke(
        "login",
        username,
        password
      );
      return result;
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
    setupDatabase: async () => {
      await ipcRenderer.invoke("setupDatabase");
    },
  };
};
