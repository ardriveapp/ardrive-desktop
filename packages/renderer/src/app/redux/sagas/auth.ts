import { all, call, getContext, put, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";
import { AppUser } from "../types";
import { authActions } from "../slices/auth";

function* loginSuccessSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const user: AppUser = action.payload.user;

  yield call(electronHooks.core.startWatchingFolders, user.login);
}

export default function* () {
  yield all([
    takeLatest(authActions.loginStart.fulfilled.type, loginSuccessSaga),
  ]);
}
