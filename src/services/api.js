import axios from 'axios';
export const API_URL = import.meta.env.VITE_API_URL || 'https://ecommerce.routemisr.com/api/v1';
export const http = axios.create({ baseURL: API_URL, timeout: 20000 });
http.interceptors.request.use(config => { const token = localStorage.getItem('freshcart_token'); if (token) config.headers.token = token; return config; });
export const api = {
  get: (url, config) => http.get(url, config), post: (url, data, config) => http.post(url, data, config),
  put: (url, data, config) => http.put(url, data, config), delete: (url, config) => http.delete(url, config)
};
export const unwrap = response => response?.data?.data ?? response?.data;
