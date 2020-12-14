import { Middleware } from "@reduxjs/toolkit";

export type WindowType = "desktop" | "mobile";

export interface CoreHooks {
  login(
    username: string,
    password: string
  ): Promise<{
    result: boolean;
    user: any;
  }>;
  createNewUser(
    username: string,
    password: string,
    syncFolderPath: string,
    createNew: boolean,
    walletPath?: string
  ): Promise<string>;
  startWatchingFolders(username: string): Promise<void>;
  fetchFiles(username: string): Promise<any[]>;
  stopWatchingFolders(): Promise<void>;
  uploadFiles(login: string, password: string): Promise<void>;
  backupWallet(login: string, password: string): Promise<void>;
  openSyncFolder(login: string): Promise<void>;
}

export interface NativeHooks {
  openFile(): Promise<string | undefined>;
  openFolder(): Promise<string | undefined>;
  changeWindowSize(windowType: WindowType): Promise<void>;
}

export interface ElectronHooks {
  core: CoreHooks;
  native: NativeHooks;
  middleware: Middleware;
}
