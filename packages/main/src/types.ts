export type WindowType = "desktop" | "mobile";

export type WindowSize = {
	[type in WindowType]: {
		height: number;
		width: number;
	};
};

export class CancellationToken {
	isCancelled: boolean;

	constructor() {
		this.isCancelled = false;
	}

	cancel() {
		this.isCancelled = true;
	}
}
export interface ArFSFileMetaData {
	id: number;
	login: string;
	appName: string;
	appVersion: string;
	unixTime: number;
	contentType: string;
	entityType: string;
	driveId: string;
	parentFolderId: string;
	fileId: string;
	fileSize: number;
	fileName: string;
	fileHash: string;
	filePath: string;
	fileVersion: number;
	cipher: string;
	dataCipherIV: string;
	metaDataCipherIV: string;
	lastModifiedDate: number;
	isLocal: number;
	isPublic: number;
	permaWebLink: string;
	metaDataTxId: string;
	dataTxId: string;
	fileDataSyncStatus: number;
	fileMetaDataSyncStatus: number;
	cloudOnly: number;
}
