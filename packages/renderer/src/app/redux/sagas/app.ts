import { ElectronHooks } from "app/electron-hooks/types";
import {
	all,
	call,
	getContext,
	put,
	putResolve,
	select,
	takeLatest,
} from "redux-saga/effects";
import { authSelectors } from "../selectors";
import { appActions } from "../slices/app";
import { AppUser } from "../types";

function* processUpdateFromMainProcessSaga(action: any) {
	const { actionName, payload } = action.payload;

	switch (actionName) {
		case "notifyUploadStatus":
			yield put(
				appActions.addUploadNotification({
					filesCount: payload.totalNumberOfFileUploads,
					totalPrice: +Number.parseFloat(payload.totalArDrivePrice).toFixed(5),
					totalSize: payload.totalSize,
				})
			);
			const user: AppUser = yield select(authSelectors.getUser);
			if (user != null) {
				yield putResolve(appActions.fetchFiles(user.login) as any);
			}
			return;
	}
}

function* openSyncFolderSaga() {
	const user = yield select(authSelectors.getUser);
	if (user != null) {
		const electronHooks: ElectronHooks = yield getContext("electronHooks");
		yield call([electronHooks.core, "openSyncFolder"], user.login);
	}
}

export default function* () {
	yield all([
		takeLatest(
			appActions.processUpdateFromMainProcess.type,
			processUpdateFromMainProcessSaga
		),
		takeLatest(appActions.openSyncFolder, openSyncFolderSaga),
	]);
}
