import { combineReducers } from 'redux';
import authReducer from './authReducer';
import orderReducer from './orderReducer';
import chatReducer from './chatReducer';

export const combinedReducers = combineReducers({
  auth: authReducer,
  order: orderReducer,
  chat: chatReducer,
});
