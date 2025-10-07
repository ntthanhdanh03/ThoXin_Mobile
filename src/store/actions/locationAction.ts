import * as types from '../types';

export const getLocationPartnerAction = (data: any, callback?: any) => ({
  type: types.GET_LOCATION_PARTNER,
  payload: data,
  callback,
});

export const getLocationPartnerSuccessAction = (data: any) => ({
  type: types.GET_LOCATION_PARTNER + types.SUCCESS,
  payload: data,
});
