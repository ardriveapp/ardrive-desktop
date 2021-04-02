import { ArDrive } from 'app/electron-hooks/types';

export interface UploadNotification {
	filesCount: number;
	totalPrice: number;
	totalSize: number;
}

export interface AppState {
	files: ArDriveFile[];
	drives: ArDrive[];
	users: number;
	uploadNotification?: UploadNotification;
}

export interface ArDriveFile {
	id: string;
	owner: string;
	location: string;
	modifiedDate: string;
	type: 'folder' | 'file';
	name: string;
	size: number;
	image?: string;
	fileImage?: string;
	driveName?: string;
	syncStatus?: 'downloaded' | 'uploaded' | 'syncing';
	webLink?: string;
}

export interface AuthState {
	isLoggedIn: boolean;
	isFirstLaunch: boolean;
	user: AppUser | null;
	isSyncing: boolean;
	isDuplicated: boolean;
}

export interface RootState {
	app: AppState;
	auth: AuthState;
}

export interface AppUser {
	login: string;
	address: string;
	balance: number;
	password: string; // TODO: Do not store sensitive info at storage
}

export type LoginStartArgs = {
	login: string;
	password: string;
};

export type CreateUserArgs = {
	username: string;
	password: string;
	syncFolderPath: string;
	createNew: boolean;
	walletPath?: string;
};

export type UpdateUserSyncDirArgs = {
	syncFolderPath: string;
	login: string;
	password: string;
};
