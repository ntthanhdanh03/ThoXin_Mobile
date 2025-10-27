import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import orderSaga from './orderSaga';
import chatSaga from './chatSaga';
import appointmentSaga from './appointmentSaga';
import locationSaga from './locationSaga';
import rateSaga from './rateSaga';

function* rootSaga() {
  yield all([
    authSaga(),
    orderSaga(),
    chatSaga(),
    appointmentSaga(),
    locationSaga(),
    rateSaga(),
  ]);
}

export default rootSaga;
