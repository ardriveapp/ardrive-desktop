import { call, getContext, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "../../electron-hooks/types";

import { authActions } from "../actions";

function* loginStartSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const result = yield call(
    electronHooks.core.login,
    action.payload.username,
    action.payload.password
  );
}

export default function* () {
  yield takeLatest(authActions.loginStart.type, loginStartSaga);
}
