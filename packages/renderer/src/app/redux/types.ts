export interface AppState {
  openedFiles: {
    [name: string]: string;
  };
  openedFolders: {
    [name: string]: string;
  };
}

export interface AuthState {
  isLoggedIn: boolean;
  isFirstLaunch: boolean;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
}
