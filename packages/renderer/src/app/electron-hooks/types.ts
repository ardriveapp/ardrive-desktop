export interface CoreHooks {
  login(username: string, password: string): Promise<boolean>;
}

export interface ElectronHooks {
  core: CoreHooks;
}
