import {
  updateOrderAction,
  selectApplicantAction,
} from './../actions/orderAction';
import * as actions from '../actions/orderAction';
import { put, takeLatest, delay, all, call } from 'redux-saga/effects';
import * as types from '../types';
import { IResponse } from '../../interfaces';
import { api } from '../../services/api';

function* getOrderSaga({
  payload,
  callback,
}: ReturnType<typeof actions.getOrderAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.get(`/orders/client/${payload.clientId}`),
    );
    console.log('***getOrderSaga', response);
    if (response && response?.status === 200 && response?.data) {
      console.log('payload', payload);
      yield put(actions.getOrderSuccessAction(response?.data));

      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('getOrderSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}
function* createOrderSaga({
  payload,
  callback,
}: ReturnType<typeof actions.createOrderAction>) {
  try {
    console.log('payloadddddddddddddddddddd', payload);
    const API = `/orders`;
    const response: IResponse = yield call(() =>
      api.post(API, payload.dataOrder),
    );
    console.log('***createOrderSaga', response);

    if (response && [200, 201].includes(response.status) && response.data) {
      yield put(actions.createOrderSuccessAction(response?.data));
      callback && callback(response?.data, null);
    } else {
      const message =
        response?.data?.message || 'Tạo đơn hàng thất bại, vui lòng thử lại.';
      callback && callback(null, message);
    }
  } catch (e: any) {
    console.log('createOrderSaga', e, e?.response);

    const errorMessage =
      e?.response?.data?.message || 'Đã có lỗi xảy ra khi tạo đơn hàng.';
    callback && callback(null, errorMessage);
  }
}

function* updateOrderSaga({
  payload,
  callback,
}: ReturnType<typeof actions.updateOrderAction>) {
  try {
    const API = `/orders/${payload?.id}`;
    const response: IResponse = yield call(() =>
      api.patch(API, payload?.updateData),
    );
    console.log('***updateOrderSaga', API, payload, response);
    if (response && response?.status === 200 && response?.data) {
      yield put(actions.updateOrderSuccessAction(response?.data));
      callback && callback(payload?.updateData, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('updateOrderSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

function* selectApplicantSaga({
  payload,
  callback,
}: ReturnType<typeof actions.selectApplicantAction>) {
  try {
    const API = `/orders/${payload?.id}/select`;
    const response: IResponse = yield call(() =>
      api.patch(API, payload?.updateData),
    );
    console.log('***selectApplicantSaga', API, payload, response);

    if (response && response?.status === 200 && response?.data) {
      yield put(actions.selectApplicantSuccessAction(response?.data));
      callback && callback(payload?.updateData, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('selectApplicantSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

export default function* orderSaga() {
  yield all([
    takeLatest(types.CREATE_ORDER, createOrderSaga),
    takeLatest(types.GET_ORDER, getOrderSaga),
    takeLatest(types.UPDATE_ORDER, updateOrderSaga),
    takeLatest(types.SELECT_APPLICANT, selectApplicantSaga),
  ]);
}
