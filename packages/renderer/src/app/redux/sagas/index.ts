import { all } from 'redux-saga/effects';

import appSaga from './app';
import authSaga from './auth';

export default function* () {
	yield all([appSaga(), authSaga()]);
}
