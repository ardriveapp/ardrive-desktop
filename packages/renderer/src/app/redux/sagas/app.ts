import { call, getContext, put, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "../../electron-hooks/types";

import { appActions } from "../actions";

function* openFileSaga(_: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const result = yield call(electronHooks.native.openFile);
  yield put(appActions.openFile.completor());
  debugger;
}

export default function* () {
  yield takeLatest(appActions.openFile.type, openFileSaga);
}
