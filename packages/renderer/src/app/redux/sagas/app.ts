import { call, getContext, put, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "../../electron-hooks/types";

import { appActions } from "../actions";

function* openFileSaga(_: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const path = yield call(electronHooks.native.openFile);
  yield put(appActions.openFileSuccess(path));
}

export default function* () {
  yield takeLatest(appActions.openFile.type, openFileSaga);
}
