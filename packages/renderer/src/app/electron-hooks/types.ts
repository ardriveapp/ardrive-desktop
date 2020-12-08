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
    walletPath: string
  ): Promise<string>;
  startWatchingFolders(username: string): Promise<void>;
  fetchFiles(username: string): Promise<any[]>;
}

export interface NativeHooks {
  openFile(): Promise<string | null>;
  openFolder(): Promise<string | null>;
  changeWindowSize(windowType: WindowType): Promise<void>;
}

export interface ElectronHooks {
  core: CoreHooks;
  native: NativeHooks;
  middleware: Middleware;
}
