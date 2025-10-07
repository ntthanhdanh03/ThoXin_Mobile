import { combineReducers } from 'redux';
import authReducer from './authReducer';
import orderReducer from './orderReducer';
import chatReducer from './chatReducer';
import appointmentReducer from './appointmentReducer';
import locationReducer from './locationReducer';

export const combinedReducers = combineReducers({
  auth: authReducer,
  order: orderReducer,
  chat: chatReducer,
  appointment: appointmentReducer,
  location: locationReducer,
});
