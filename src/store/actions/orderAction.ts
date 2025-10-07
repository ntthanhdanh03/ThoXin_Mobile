import * as types from '../types';

export const createOrderAction = (data: any, callback?: any) => ({
  type: types.CREATE_ORDER,
  payload: data,
  callback,
});

export const createOrderSuccessAction = (data: any) => ({
  type: types.CREATE_ORDER + types.SUCCESS,
  payload: data,
});

export const getOrderAction = (data: any, callback?: any) => ({
  type: types.GET_ORDER,
  payload: data,
  callback,
});

export const getOrderSuccessAction = (data: any) => ({
  type: types.GET_ORDER + types.SUCCESS,
  payload: data,
});

export const updateOrderAction = (data: any, callback?: any) => ({
  type: types.UPDATE_ORDER,
  payload: data,
  callback,
});

export const updateOrderSuccessAction = (data: any) => ({
  type: types.UPDATE_ORDER + types.SUCCESS,
  payload: data,
});

export const selectApplicantAction = (data: any, callback?: any) => ({
  type: types.SELECT_APPLICANT,
  payload: data,
  callback,
});

export const selectApplicantSuccessAction = (data: any) => ({
  type: types.SELECT_APPLICANT + types.SUCCESS,
  payload: data,
});
