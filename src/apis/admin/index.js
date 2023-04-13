/**
 * @description API 接口，管理员部分
 */
import axios from 'axios';
import Qs from 'qs';
import { router } from '../../router/index.js';

const API = axios.create({
  // 和 vite.config 里跨域配置保持一致。
  baseURL: '/api'
});

// 检查登录状态
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo') === null) {
    router.push('/admin/login');
  }
  return req;
});

API.interceptors.response.use((res) => {
  if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {
    localStorage.removeItem('userInfo');
    router.push('/admin/login');
  }
  return res;
});

/**
 * @description 权限管理部分
 */
// 查询所有用户
const getAllUser = (getObj) => {
  return API.get('/biobank/user/?' + Qs.stringify(getObj));
};

// 通过用户 ID 查询指定用户数据
const getSpecialUser = (id) => {
  return API.get(`/biobank/user/${id}`);
};

// 根据用户 ID，删除用户
const deleteUser = (id) => {
  return API.delete(`/biobank/user/${id}`);
};

// 编辑用户信息
const editUser = (putObj) => {
  return API.put('/biobank/user/', putObj);
};

/**
 * @description 系统监控部分
 */
// 设置预警阈值
const setAlertNum = (postObj) => {
  return API.post('/system/alert?' + Qs.stringify(postObj));
};

// 查询样本库容量
const searchSampleConVal = (getObj) => {
  return API.get('/system/?' + Qs.stringify(getObj));
};

export { getAllUser, getSpecialUser, deleteUser, editUser };
export { setAlertNum, searchSampleConVal };