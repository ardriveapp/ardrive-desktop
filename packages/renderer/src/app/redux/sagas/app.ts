import { put, takeLatest, all, select } from "redux-saga/effects";

import { authSelectors } from "../selectors";
import { appActions } from "../slices/app";
import { authActions } from "../slices/auth";
import { AppUser } from "../types";

function* initializeApplicationSaga(_: any) {
  const user: AppUser = yield select(authSelectors.getUser);

  // if (user != null) {
  //   yield put(authActions.loginStart.fulfilled(user));
  // }
}

export default function* () {
  yield all([
    takeLatest(
      appActions.initializeApplication.type,
      initializeApplicationSaga
    ),
  ]);
}
