import axios from 'axios';
import { getCookie } from '../utils/cookie';
const instance = axios.create({
  baseURL: 'localhost:3000',
  headers: {
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
