import axios from 'axios';
import NProgress from 'nprogress'; // progress bar
import qs from 'qs';
import { serialize } from '@/utils';
import { message } from 'antd';

const axiosInstance = axios.create({
  url: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
});

// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});

// HTTPrequest拦截
axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start(); // start progress bar

    // token
    const isToken = (config.headers || {}).isToken === false;
    const token = '';
    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token; // token
    }

    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    if (config.method === 'get') {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    const code = response.data.code;
    if (code === 1) {
      message.error(response.data.msg);
      return Promise.reject(new Error(response.data.msg));
    }
    return response.data;
  },
  (error) => {
    // 处理 503 网络异常
    NProgress.done();
    return Promise.reject(new Error(error));
  }
);

export default axiosInstance;
