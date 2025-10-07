import axios from 'axios';
import qs from 'qs';
import { store } from '../store';
import { BASE_URL } from './constants';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => {
    if (params?.where) params.where = JSON.stringify(params?.where);
    return qs.stringify(params);
  },
});

api.interceptors.request.use(
  async config => {
    const storeData: any = store.getState();
    const token = storeData?.auth?.data?.id ?? '';
    // if (token) config.headers['Authorization'] = token
    return config;
  },
  error => {
    console.log(error);
  },
);
