import { all, call, getContext, put, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";
import { authActions } from "../actions";
import { AppUser } from "../types";

function* loginStartSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const { result, user } = yield call(
    electronHooks.core.login,
    action.payload.username,
    action.payload.password
  );
  if (result) {
    yield put(
      authActions.loginSuccess({
        address: user.walletPublicKey,
        login: user.login,
        balance: user.walletBalance,
      })
    );
  }
}

function* createUserSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const { username, password, syncFolderPath, walletPath } = action.payload;
  const result = yield call(
    electronHooks.core.createNewUser,
    username,
    password,
    syncFolderPath,
    walletPath
  );
  if (result) {
    yield put(authActions.loginStart(username, password));
  }
}

function* loginSuccessSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const user: AppUser = action.payload.user;

  yield call(electronHooks.core.startWatchingFolders, user.login);
}

export default function* () {
  yield all([
    takeLatest(authActions.loginStart.type, loginStartSaga),
    takeLatest(authActions.createUser.type, createUserSaga),
    takeLatest(authActions.loginSuccess.type, loginSuccessSaga),
  ]);
}
