import * as types from '../types';

export const getChatRoomByOrderAction = (data: any, callback?: any) => ({
  type: types.GET_CHAT_BY_ORDER,
  payload: data,
  callback,
});

export const getChatRoomByOrderSuccessAction = (data: any) => ({
  type: types.GET_CHAT_BY_ORDER + types.SUCCESS,
  payload: data,
});

export const getMessageAction = (data: any, callback?: any) => ({
  type: types.GET_MESSAGE,
  payload: data,
  callback,
});

export const getMessageSuccessAction = (data: any) => ({
  type: types.GET_MESSAGE + types.SUCCESS,
  payload: data,
});

export const sendMessageAction = (data: any, callback?: any) => ({
  type: types.SEND_MESSAGE,
  payload: data,
  callback,
});

export const sendMessageSuccessAction = (data: any) => ({
  type: types.SEND_MESSAGE + types.SUCCESS,
  payload: data,
});
