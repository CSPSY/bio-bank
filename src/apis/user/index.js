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
  // 和 vite.config 里跨域配置保持一致。
  baseURL: ''
  // baseURL: 'http://150.158.18.74:8082'
});

// 检查登录状态
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo && JSON.parse(userInfo).userRole !== '用户' || userInfo === null) {
    // ElMessage({ showClose: true, message: '没有权限访问该页面 ~', type: 'error' });
    router.push('/user/login');
  }
  return req;
}, err => {
  return Promise.reject(err);
});

API.interceptors.response.use((res) => {
  if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {
    localStorage.removeItem('userInfo');
    router.push('/user/login');
  }
  return res;
}, err => {
  return Promise.reject(err);
});

/**
 * @description 首页，我的存储部分
 */
// 获取样本，根据 getObj 传参实现不同页面获取数据的不同及搜索功能
const getSample = (getObj) => {
  return API.get('/biobank/sample/?' + Qs.stringify(getObj));
};

// 获取样本类型统计
const getSampleTypeCnt = () => {
  return API.get('/biobank/sample/countByType');
};

export { getSample, getSampleTypeCnt };