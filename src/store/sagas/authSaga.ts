import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkPhoneExistAction } from './../actions/authAction';
import { put, takeLatest, delay, all, call } from 'redux-saga/effects';
import * as actions from '../actions/authAction';
import * as types from '../types';
import { IResponse } from '../../interfaces';
import { api } from '../../services/api';

function* checkPhoneExistSaga({
  payload,
  callback,
}: ReturnType<typeof actions.checkPhoneExistAction>) {
  try {
    const postData = {
      phoneNumber: payload?.phoneNumber,
      role: payload?.role,
    };
    const checkUserResponse: IResponse = yield call(() =>
      api.post('/auth/checkPhoneExist', postData),
    );
    if (checkUserResponse?.data?.exists === true) {
      callback && callback(true, null);
    } else {
      callback && callback(false, null);
    }
  } catch (e: any) {
    console.error('Error in checkPhoneExistSaga:', e);
    callback?.(false, e);
  }
}

function* partnerRegisterSaga({
  payload,
  callback,
}: ReturnType<typeof actions.partnerRegisterAction>) {
  try {
    const postData = {
      phoneNumber: payload?.phoneNumber,
      password: payload?.password,
      role: payload?.role,
    };
    const checkUserResponse: IResponse = yield call(() =>
      api.post('/auth/register', postData),
    );
    console.log('checkUserResponse?.data', checkUserResponse?.data);
    if (checkUserResponse?.data?.success === true) {
      callback?.(checkUserResponse.data, null);
    } else {
      callback?.(null, checkUserResponse?.data?.message || 'Đăng ký thất bại');
    }
  } catch (e: any) {
    console.error('Error in partnerRegisterSaga:', e);
    callback?.(false, e);
  }
}

function* loginSaga({
  payload,
  callback,
}: ReturnType<typeof actions.loginAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.post('/auth/login', {
        phoneNumber: payload.phoneNumber,
        password: payload.password,
        role: payload.role,
      }),
    );

    if (response?.data?.token) {
      console.log('responseeeeeeeeeeeeeeeeeeeeeee', response?.data);
      callback?.(response.data, null);
      yield call(AsyncStorage.setItem, 'authToken', response.data.token);
      yield put(actions.loginSuccessAction(response?.data));
    } else {
      callback?.(null, response?.data?.message || 'Đăng nhập thất bại');
    }
  } catch (e: any) {
    console.error('Error in loginSaga:', e);
    const errMsg =
      e?.response?.data?.message || e?.message || 'Đăng nhập thất bại';
    callback?.(null, errMsg);
  }
}

function* createInstallationSaga({
  payload,
  callback,
}: ReturnType<typeof actions.createInstallationAction>) {
  try {
    const API = `/auth/installations`;
    const response: IResponse = yield call(() => api.put(API, payload));
    console.log('***createInstallationSagaPayload', payload);
    if (response && response?.status === 200 && response?.data) {
      console.log('***createInstallationSagaResponse', response?.data);
      yield put(actions.createInstallationSuccessAction(payload.deviceToken));
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('createInstallationSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

function* deleteInstallationSaga({
  payload,
  callback,
}: ReturnType<typeof actions.deleteInstallationAction>) {
  try {
    const API = `/auth/installations/${payload.userId}/${encodeURIComponent(payload.token)}`;
    const response: IResponse = yield call(() => api.delete(API));
    console.log('***deleteInstallationSaga', API, payload, response);

    if (response && response?.status === 200 && response?.data) {
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('deleteInstallationSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}
function* refreshTokenSaga({
  payload,
  callback,
}: ReturnType<typeof actions.refreshTokenAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.post('/auth/refreshToken', {
        refreshToken: payload.refreshToken,
      }),
    );
    if (response?.data?.token) {
      console.log('responseeeeeeeeeeeeeeeeeeeeeee', response?.data);
      callback?.(response.data, null);
      yield call(AsyncStorage.setItem, 'authToken', response.data.token);
      yield put(actions.refreshTokenSuccessAction(response?.data));
    } else {
      callback?.(null, response?.data?.message || 'Đăng nhập thất bại');
    }
  } catch (e: any) {
    console.error('Error in refreshTokenSaga:', e);
    const errMsg =
      e?.response?.data?.message || e?.message || 'Đăng nhập thất bại';
    callback?.(null, errMsg);
  }
}
function* updateUserSaga({
  payload,
  callback,
}: ReturnType<typeof actions.updateUserAction>) {
  try {
    const API = `/users/${payload?.id}`;
    const response: IResponse = yield call(() =>
      api.patch(API, payload?.updateData),
    );
    console.log('***updateUserSaga', API, payload, response);
    if (response && response?.status === 200 && response?.data) {
      yield put(actions.updateUserSuccessAction(payload?.updateData));
      callback && callback(payload?.updateData, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('updateUserSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}
export default function* authSaga() {
  yield all([
    takeLatest(types.LOG_IN, loginSaga),
    takeLatest(types.CHECK_PHONE_EXIST, checkPhoneExistSaga),
    takeLatest(types.PARTNER_REGISTER, partnerRegisterSaga),
    takeLatest(types.CREATE_INSTALLATION, createInstallationSaga),
    takeLatest(types.DELETE_INSTALLATION, deleteInstallationSaga),
    takeLatest(types.REFRESH_TOKEN, refreshTokenSaga),
    takeLatest(types.UPDATE_USER, updateUserSaga),
  ]);
}
