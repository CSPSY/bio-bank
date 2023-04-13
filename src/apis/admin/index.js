/**
 * @description API 接口，管理员部分
 */
import axios from 'axios';
import Qs from 'qs';

const API = axios.create({
  // 和 vite.config 里跨域配置保持一致。
  baseURL: '/api'
});

/**
 * @description 权限管理部分
 */
// 查询所有用户
const getAllUser = (getObj) => {
  return API.get('/biobank/user/?' + Qs.stringify(getObj));
};

// 通过用户 ID 查询指定用户数据
const getSpecialUser = (getObj) => {
  return API.get('/biobank/user/getUserById?' + Qs.stringify(getObj));
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

export { getAllUser, getSpecialUser };
export { setAlertNum, searchSampleConVal };