import axios from 'axios';
import {Config} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {storageRead, storageWrite} from './storageUtils';
import store from '../redux/store';
import {setLogoutSuccess} from '../containers/Authentication/Logout/logoutSlice';
import {setNetworkError} from '../containers/Authentication/Login/networkSlice';

export const api = axios.create({
  baseURL: Config.MYCAREBRIDGE_BASE_URL,
});

api.interceptors.request.use(
  async config => {
    let accessToken = await storageRead('accessToken');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (!error.response) {
      store.dispatch(setNetworkError(true));
      return Promise.reject({message: 'Network Error'});
    }

    const status = error.response.status;
    const errorData = error.response.data;

    if (status === 400) {
      return Promise.reject(errorData);
    }

    if (
      status === 401 &&
      error?.config?.url !== 'auth/login' &&
      error?.config?.url !== 'auth/validate-otp' &&
      error?.config?.url !== 'auth/forgot-password' &&
      error?.config?.url !== 'auth/logout' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        store.dispatch(setLogoutSuccess(true));
        await AsyncStorage.removeItem('accessToken');
      }
    }

    return Promise.reject(errorData || error);
  },
);

async function refreshToken() {
  try {
    let refreshTokens = await storageRead('refreshToken');

    if (!refreshTokens) {
      throw new Error('Refresh token not found');
    }

    let headers = {
      Authorization: `Bearer ${refreshTokens}`,
    };

    const response = await axios.get(
      `${Config.MYCAREBRIDGE_BASE_URL}auth/getAccessToken`,
      {headers},
    );
    const newAccessToken = response?.data?.data?.accessToken;
    const newRefreshToken = response?.data?.data?.refreshToken;

    await storageWrite('accessToken', newAccessToken);
    await storageWrite('refreshToken', newRefreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error('Error in refreshing access token:', error);
    return null;
  }
}
