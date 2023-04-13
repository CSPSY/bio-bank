/**
 * @description API 接口，用户部分
 */
import axios from 'axios';
import Qs from 'qs';
import { router } from '../../router/index.js';

/**
 * @description API 接口 --- 用户浏览部分接口
 */
const API = axios.create({
  baseURL: '/api'
});

// 检查登录状态
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo') === null) {
    router.push('/user/login');
  }
  return req;
});

API.interceptors.response.use((res) => {
  if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {
    localStorage.removeItem('userInfo');
    router.push('/user/login');
  }
  return res;
});

/**
 * @description 首页部分
 */
// 获取样本数据
const getSample = (getObj) => {
  return API.get('biobank/sample/' + Qs.stringify(getObj));
};

// 获取样本类型统计
const getSampleTypeCnt = (getObj) => {
  return API.get('biobank/sample/' + Qs.stringify(getObj));
};

export { getSample, getSampleTypeCnt };