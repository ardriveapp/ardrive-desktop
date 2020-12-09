import { all, call, getContext, select, takeLatest } from "redux-saga/effects";

import { ElectronHooks } from "app/electron-hooks/types";
import { AppUser } from "../types";
import { authActions } from "../slices/auth";
import { authSelectors } from "../selectors";

function* startWatchingSaga(action?: any) {
  let user: AppUser | null = action?.payload;

  if (user == null) {
    user = yield select(authSelectors.getUser);
  }
  if (user != null) {
    const electronHooks: ElectronHooks = yield getContext("electronHooks");
    yield call([electronHooks.core, "startWatchingFolders"], user.login);
  }
}

export default function* () {
  yield all([
    call(startWatchingSaga),
    takeLatest(authActions.startWatching.type, startWatchingSaga),
  ]);
}
