export interface CoreHooks {
  login(username: string, password: string): Promise<boolean>;
  createNewUser(
    username: string,
    password: string,
    syncFolderPath: string,
    walletPath: string
  ): Promise<string>;
  setupDatabase(): Promise<void>;
}

export interface NativeHooks {
  openFile(): Promise<string | null>;
  openFolder(): Promise<string | null>;
  changeWindowSize(width: number, height: number): Promise<void>;
}

export interface ElectronHooks {
  core: CoreHooks;
  native: NativeHooks;
}
