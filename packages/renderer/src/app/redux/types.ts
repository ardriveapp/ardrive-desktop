export interface AppState {
  initialized: boolean;
  openFilePath: string | null;
}

export interface AuthState {
  isLoggedIn: boolean;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
}
