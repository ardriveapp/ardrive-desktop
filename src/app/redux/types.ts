export interface AppState {
  initialized: boolean;
}

export interface AuthState {
  isLoggedIn: boolean;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
}
