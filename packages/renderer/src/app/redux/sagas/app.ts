import {
  call,
  getContext,
  put,
  takeLatest,
  all,
  select,
} from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";

import { appActions, authActions } from "../actions";
import { authSelectors } from "../selectors";

function* initializeApplicationSaga(_: any) {
  const user = yield select(authSelectors.getUser);

  if (user != null) {
    yield put(authActions.loginSuccess(user));
  }
}

function* changeWindowSizeSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  yield call(electronHooks.native.changeWindowSize, action.payload.windowType);
}

function* fetchFilesSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const user = yield select(authSelectors.getUser);
  const files = yield call(electronHooks.core.fetchFiles, user.login);
  // TODO: Save and create type for files
}

export default function* () {
  yield all([
    takeLatest(
      appActions.initializeApplication.type,
      initializeApplicationSaga
    ),
    takeLatest(appActions.changeWindowSize.type, changeWindowSizeSaga),
    takeLatest(appActions.fetchFiles.type, fetchFilesSaga),
  ]);
}
