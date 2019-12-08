import axios from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'http://60.169.78.55:9292/openapi/',
  timeout: 60000,
});
// 添加响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error),
);

export function post(uri, params, config) {
  return instance.post(uri, params, config);
}

export function get(uri, config) {
  return instance.get(uri, config);
}
