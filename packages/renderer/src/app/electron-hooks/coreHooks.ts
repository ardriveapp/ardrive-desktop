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
    createNew: boolean,
    walletPath?: string
  ) {
    return await this.ipcRenderer.invoke(
      "createNewUser",
      username,
      password,
      syncFolderPath,
      createNew,
      walletPath
    );
  }
  async createNewWallet() {
    await this.ipcRenderer.invoke("createNewWallet");
  }
  async startWatchingFolders(username: string) {
    await this.ipcRenderer.invoke("startWatchingFolders", username);
  }
  async fetchFiles(username: string): Promise<any[]> {
    return await this.ipcRenderer.invoke("fetchFiles", username);
  }
  async stopWatchingFolders() {
    await this.ipcRenderer.invoke("stopWatchingFolders");
  }
  async uploadFiles(login: string, password: string) {
    await this.ipcRenderer.invoke("uploadFiles", login, password);
  }
  async backupWallet(login: string, password: string) {
    await this.ipcRenderer.invoke("backupWallet", login, password);
  }
  async openSyncFolder(login: string) {
    await this.ipcRenderer.invoke("openSyncFolder", login);
  }
  async createNewDrive(
    login: string,
    driveName: string,
    isPrivate: boolean = true
  ) {
    await this.ipcRenderer.invoke(
      "createNewDrive",
      login,
      driveName,
      isPrivate
    );
  }
  async getAllDrives(login: string, password: string) {
    return await this.ipcRenderer.invoke("getAllDrives", login, password);
  }
  async attachDrive(
    login: string,
    password: string,
    driveId: string,
    isShared: boolean = false
  ) {
    await this.ipcRenderer.invoke(
      "attachDrive",
      login,
      password,
      driveId,
      isShared
    );
  }
}

export default CoreHooksImplementation;
