export interface UploadNotification {
  filesCount: number;
  totalPrice: number;
  totalSize: number;
}

export interface AppState {
  files: ArDriveFile[];
  uploadNotification?: UploadNotification;
}

export interface ArDriveFile {
  image?: string;
  name: string;
  modifiedDate: string;
  size: number;
  type: "folder" | "file";
  fileImage?: string;
  driveName?: string;
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
