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
  user: AppUser | null;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
}

export interface AppUser {
  login: string;
  address: string;
  balance: number;
}
