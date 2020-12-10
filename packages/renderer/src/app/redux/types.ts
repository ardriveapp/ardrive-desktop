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
  id: string;
  owner: string;
  location: string;
  modifiedDate: string;
  type: "folder" | "file";
  name: string;
  size: number;
  image?: string;
  fileImage?: string;
  driveName?: string;
  syncStatus?: "downloaded" | "uploaded";
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
