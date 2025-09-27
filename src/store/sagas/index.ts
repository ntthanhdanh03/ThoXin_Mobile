import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import orderSaga from './orderSaga';
import chatSaga from './chatSaga';

function* rootSaga() {
  yield all([authSaga(), orderSaga(), chatSaga()]);
}

export default rootSaga;
