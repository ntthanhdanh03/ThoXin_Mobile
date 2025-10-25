import * as actions from '../actions/appointmentAction';
import { put, takeLatest, delay, all, call } from 'redux-saga/effects';
import * as types from '../types';
import { IResponse } from '../../interfaces';
import { api } from '../../services/api';

function* getAppointmentSaga({
  payload,
  callback,
}: ReturnType<typeof actions.getAppointmentAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.get(`/appointments/client/${payload.clientId}`),
    );
    console.log('***getAppointmentSaga', response);
    if (response && response?.status === 200 && response?.data) {
      yield put(actions.getAppointmentSuccessAction(response?.data));
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('getAppointmentSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

function* getAppointmentByOrderSaga({
  payload,
  callback,
}: ReturnType<typeof actions.getAppointmentByOrderAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.get(`/appointments/order/${payload.orderId}`),
    );
    console.log('***getAppointmentByOrderSaga', response);
    if (response && response?.status === 200 && response?.data) {
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('getAppointmentByOrderSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

function* updateAppointmentSaga({
  payload,
  callback,
}: ReturnType<typeof actions.updateAppointmentAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.patch(`/appointments/${payload?.id}/client`, payload.postData),
    );
    if (response && response?.status === 200 && response?.data) {
      const dataUpdate = {
        data: response?.data,
        typeUpdate: payload.typeUpdate,
      };
      yield put(actions.updateAppointmentSuccessAction(dataUpdate));

      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('updateAppointmentSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

function* rateAppointmentSaga({
  payload,
  callback,
}: ReturnType<typeof actions.rateAppointmentAction>) {
  try {
    const response: IResponse = yield call(() => api.post(`/rates/`, payload));
    if (response && response?.status === 201 && response?.data) {
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('rateAppointmentSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}
function* getPromotionSaga({
  payload,
  callback,
}: ReturnType<typeof actions.getPromotionAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.get(`/promotions/client/${payload.clientId}`),
    );
    console.log('***getPromotionSaga', response);
    if (response && response?.status === 200 && response?.data) {
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('getAppointmentSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

export default function* appointmentSaga() {
  yield all([
    takeLatest(types.GET_APPOINTMENT, getAppointmentSaga),
    takeLatest(types.GET_APPOINTMENT_BY_ORDER, getAppointmentByOrderSaga),
    takeLatest(types.UPDATE_APPOINTMENT, updateAppointmentSaga),
    takeLatest(types.RATE_APPOINTMENT, rateAppointmentSaga),
    takeLatest(types.GET_PROMOTION, getPromotionSaga),
  ]);
}
