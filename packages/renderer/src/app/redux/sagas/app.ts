import { all, takeLatest } from "redux-saga/effects";
import { appActions } from "../slices/app";

function* processUpdateFromMainProcessSaga(action: any) {}

export default function* () {
  yield all([
    takeLatest(
      appActions.processUpdateFromMainProcess.type,
      processUpdateFromMainProcessSaga
    ),
  ]);
}
