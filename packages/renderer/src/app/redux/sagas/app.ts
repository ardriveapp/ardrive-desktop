import { all, put, takeLatest } from "redux-saga/effects";
import { appActions } from "../slices/app";

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
