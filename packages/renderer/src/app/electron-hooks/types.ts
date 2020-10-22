export interface CoreHooks {
  login(username: string, password: string): Promise<boolean>;
}

export interface NativeHooks {
  openFile(): Promise<string | null>;
  openFolder(): Promise<string | null>;
}

export interface ElectronHooks {
  core: CoreHooks;
  native: NativeHooks;
}
