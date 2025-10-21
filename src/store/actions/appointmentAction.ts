import * as types from '../types';

export const getAppointmentAction = (data: any, callback?: any) => ({
  type: types.GET_APPOINTMENT,
  payload: data,
  callback,
});

export const getAppointmentSuccessAction = (data: any) => ({
  type: types.GET_APPOINTMENT + types.SUCCESS,
  payload: data,
});

export const updateAppointmentAction = (data: any, callback?: any) => ({
  type: types.UPDATE_APPOINTMENT,
  payload: data,
  callback,
});

export const updateAppointmentSuccessAction = (data: any) => ({
  type: types.UPDATE_APPOINTMENT + types.SUCCESS,
  payload: data,
});

export const rateAppointmentAction = (data: any, callback?: any) => ({
  type: types.RATE_APPOINTMENT,
  payload: data,
  callback,
});

export const rateAppointmentSuccessAction = (data: any) => ({
  type: types.RATE_APPOINTMENT + types.SUCCESS,
  payload: data,
});

export const getPromotionAction = (data: any, callback?: any) => ({
  type: types.GET_PROMOTION,
  payload: data,
  callback,
});
