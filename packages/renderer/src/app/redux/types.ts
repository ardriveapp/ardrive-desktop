export interface AppState {
  files: ArDriveFile[];
}

export interface ArDriveFile {
  image?: string;
  name: string;
  modifiedDate: Date;
  size: number;
  type: "folder" | "file";
  fileImage?: string;
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
