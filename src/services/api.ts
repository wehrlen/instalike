import axios, { AxiosRequestHeaders } from 'axios';

const API_URL = process.env.REACT_APP_ENDPOINT;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token !== null) {
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        } as AxiosRequestHeaders,
      };
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      if (localStorage.getItem('token') !== null) {
        api
          .post<Instalike.AuthJWT>('/auth/refresh')
          .then((response) => {
            localStorage.setItem('token', response.data.accessToken);
            return response;
          })
          .catch(() => {
            localStorage.removeItem('token');
          });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
