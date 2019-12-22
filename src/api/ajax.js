/*
ajax 请求函数模块
返回值promise对象（异步返回的是response.data）
*/
import axios from 'axios';
import qs from 'qs';
import store from '../store';
import router from '../router';

import { GET, POST_FORM, POST_JSON, POST_TOKEN, POST_TOKEN_FORM } from './ajaxRequestType';

// axios.defaults.withCredentials = true

export default function ajax(url = '', data = {}, type = GET) {
  return new Promise((resolve, reject) => {
    // 执行异步请求
    let promise;

    switch (type) {
      case GET: {
        promise = sendGetReq(url, data);
        break;
      }
      case POST_JSON: {
        promise = sendPostReqType4Json(url, data);
        break;
      }
      case POST_FORM: {
        promise = sendPostReqType4Form(url, data);
        break;
      }
      case POST_TOKEN: {
        promise = sendpostReqCarryTaken(url, data);
        break;
      }
      case POST_TOKEN_FORM: {
        promise = sendPostReqCarryTokenType4Form(url, data);
        break;
      }
    }

    promise
      .then(response => {
        if (
          response.data &&
          response.data.retMsg &&
          response.data.retMsg.includes('您已获取过积分')
        ) {
          response.data.retMsg = '主人,您已经获取过该积分，不准调皮哦~';
        }
        // 成功了调用resolve()
        resolve(response.data);
        if (response.data.httpCode === 801) {
          if (router.currentRoute !== '/personalCenter') {
            localStorage.removeItem('token');
            localStorage.removeItem('loginType');
            window.location.reload();
          }
        }
      })
      .catch(error => {
        // 失败了调用reject()
        reject(error);
      });
  });
}

/**
 * 发送get请求
 * @param url 请求路径
 * @param data 数据
 * @returns {Promise<AxiosResponse<T>>}
 */
const sendGetReq = (url, data) => {
  // 准备 url query 参数数据
  let dataStr = ''; // 数据拼接字符串
  Object.keys(data).forEach(key => {
    dataStr += `${key}=${data[key]}&`;
  });
  if (dataStr !== '') {
    dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
    url = `${url}?${dataStr}`;
  }
  // 发送 get 请求
  return axios.get(url);
};

/**
 * 发送post请求以json方式提交
 * @param url
 * @param data
 */
const sendPostReqType4Json = (url, data) => {
  axios.defaults.headers.common.token = localStorage.getItem('token');
  return axios.post(url, data);
};

/**
 * 发送post请求以表单方式提交
 * @param url
 * @param data
 * @returns {Promise<AxiosResponse<T>>}
 */
const sendPostReqType4Form = (url, data) => axios.post(url, qs.stringify(data));

const sendPostReqCarryTokenType4Form = (url, data) => {
  axios.defaults.headers.common.token = localStorage.getItem('token');
  return axios.post(url, qs.stringify(data));
};

const sendpostReqCarryTaken = (url, data) => {
  axios.defaults.headers.common.token = localStorage.getItem('token');
  return axios.post(url, data);
};
