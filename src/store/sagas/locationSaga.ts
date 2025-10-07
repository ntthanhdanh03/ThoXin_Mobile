import * as actions from '../actions/locationAction';
import { put, takeLatest, delay, all, call } from 'redux-saga/effects';
import * as types from '../types';
import { IResponse } from '../../interfaces';
import { api } from '../../services/api';

function* getLocationPartnerSaga({
  payload,
  callback,
}: ReturnType<typeof actions.getLocationPartnerAction>) {
  try {
    const response: IResponse = yield call(() =>
      api.get(`/users/location/${payload.partnerId}`),
    );
    console.log('***getLocationPartnerSaga', response);
    if (response && response?.status === 200 && response?.data) {
      yield put(actions.getLocationPartnerSuccessAction(response?.data));
      callback && callback(response?.data, null);
    } else {
      callback && callback(null, 'failure');
    }
  } catch (e: any) {
    console.log('getLocationPartnerSaga', e, e?.response);
    callback && callback(null, 'failure');
  }
}

// function* updateAppointmentSaga({
//   payload,
//   callback,
// }: ReturnType<typeof actions.updateAppointmentAction>) {
//   try {
//     const response: IResponse = yield call(() =>
//       api.patch(`/appointments/${payload?.id}/client`, payload.postData),
//     );
//     if (response && response?.status === 200 && response?.data) {
//       const dataUpdate = {
//         data: response?.data,
//         typeUpdate: payload.typeUpdate,
//       };
//       yield put(actions.updateAppointmentSuccessAction(dataUpdate));

//       callback && callback(response?.data, null);
//     } else {
//       callback && callback(null, 'failure');
//     }
//   } catch (e: any) {
//     console.log('updateAppointmentSaga', e, e?.response);
//     callback && callback(null, 'failure');
//   }
// }

export default function* locationSaga() {
  yield all([takeLatest(types.GET_LOCATION_PARTNER, getLocationPartnerSaga)]);
  // yield all([takeLatest(types.UPDATE_APPOINTMENT, updateAppointmentSaga)]);
}
