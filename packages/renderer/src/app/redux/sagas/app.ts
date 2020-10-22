import { call, getContext, put, takeLatest, all } from "redux-saga/effects";

import { ElectronHooks } from "../../electron-hooks/types";

import { appActions } from "../actions";

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

export default function* () {
  yield all([
    takeLatest(appActions.openFile.type, openFileSaga),
    takeLatest(appActions.openFolder.type, openFolderSaga),
  ]);
}
