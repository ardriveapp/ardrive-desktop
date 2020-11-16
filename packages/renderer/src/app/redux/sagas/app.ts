import { call, getContext, put, takeLatest, all } from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";

import { appActions } from "../actions";

function* initializeApplicationSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  yield call(electronHooks.core.setupDatabase);
}

function* openFileSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const path = yield call(electronHooks.native.openFile);
  yield put(
    appActions.openFileSuccess({
      name: action.payload,
      path: path,
    })
  );
}

function* openFolderSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  const path = yield call(electronHooks.native.openFolder);
  yield put(
    appActions.openFolderSuccess({
      name: action.payload,
      path: path,
    })
  );
}

function* changeWindowSizeSaga(action: any) {
  const electronHooks: ElectronHooks = yield getContext("electronHooks");
  yield call(electronHooks.native.changeWindowSize, action.payload.windowType);
}

export default function* () {
  yield all([
    takeLatest(
      appActions.initializeApplication.type,
      initializeApplicationSaga
    ),
    takeLatest(appActions.openFile.type, openFileSaga),
    takeLatest(appActions.openFolder.type, openFolderSaga),
    takeLatest(appActions.changeWindowSize.type, changeWindowSizeSaga),
  ]);
}
