import { IpcRenderer } from "electron";

import { CoreHooks } from "./types";

class CoreHooksImplementation implements CoreHooks {
  ipcRenderer: IpcRenderer;

  constructor(ipcRenderer: IpcRenderer) {
    this.ipcRenderer = ipcRenderer;
  }

  async login(username: string, password: string) {
    return await this.ipcRenderer.invoke("login", username, password);
  }

  async createNewUser(
    username: string,
    password: string,
    syncFolderPath: string,
    walletPath: string
  ) {
    return await this.ipcRenderer.invoke(
      "createNewUser",
      username,
      password,
      syncFolderPath,
      walletPath
    );
  }
  async startWatchingFolders(username: string) {
    await this.ipcRenderer.invoke("startWatchingFolders", username);
  }
  async fetchFiles(username: string): Promise<any[]> {
    return await this.ipcRenderer.invoke("fetchFiles", username);
  }
  async logout() {
    await this.ipcRenderer.invoke("logout");
  }
  async uploadFiles(login: string, password: string) {
    await this.ipcRenderer.invoke("uploadFiles", login, password);
  }
}

export default CoreHooksImplementation;
