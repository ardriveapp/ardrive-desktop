import { all, put, putResolve, select, takeLatest } from "redux-saga/effects";
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

export default function* () {
  yield all([
    takeLatest(
      appActions.processUpdateFromMainProcess.type,
      processUpdateFromMainProcessSaga
    ),
  ]);
}
