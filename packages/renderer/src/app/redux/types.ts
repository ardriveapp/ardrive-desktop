export interface AppState {
  initialized: boolean;
  openedFiles: {
    [name: string]: string;
  };
  openedFolders: {
    [name: string]: string;
  };
}

export interface AuthState {
  isLoggedIn: boolean;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
}
