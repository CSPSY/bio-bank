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
  if (localStorage.getItem('adminInfo') === null) {
    router.push('/admin/login');
  }
  return req;
});

API.interceptors.response.use((res) => {
  if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {
    localStorage.removeItem('adminInfo');
    router.push('/admin/login');
  }
  return res;
});

/**
 * @description 首页部分
 */
// 查询所有冰箱数据
const getAllFridges = (getObj) => {
  return API.get('/biobank/fridge/' + Qs.stringify(getObj));
};

// 搜索冰箱的编号，返回冰箱信息
const getSpecialFridge = (getObj) => {
  return API.get('/biobank/fridge/getByNum' + Qs.stringify(getObj));
};

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

// 添加用户
const addUser = (postObj) => {
  return API.post('/biobank/user/addUser', postObj);
};

/**
 * @description 样本管理部分
 */
// 获取样本
const getSample = (getObj) => {
  return API.get('/biobank/sample/?' + Qs.stringify(getObj));
};

// 获取样本类型统计
const getSampleTypeCnt = () => {
  return API.get('/biobank/sample/countByType');
};

// 根据样本 ID，样本类型获取数据
const getSampleBySampleId = (getObj) => {
  return API.get('/biobank/sample/getSampleBySampleId?' + Qs.stringify(getObj));
};

// 编辑样本信息
const editSampleInfo = (putObj) => {
  return API.put('/biobank/sample/', putObj);
};

// 移动样本存储的库位置信息
const moveSampleArea = (putObj) => {
  return API.put('/biobank/sample/updateSample', putObj);
};

// 批量删除样本数据
const deleteSampleData = (deleteData) => {
  return API.delete('/biobank/sample/batchDelete', deleteData);
};

// 新增样本数据
const addNewSample = (postObj) => {
  return API.post('/biobank/sample/', postObj);
};

/**
 * @description 系统监控部分
 */
// 查询样本库容量
const searchSampleConVal = (getObj) => {
  return API.get('/system/?' + Qs.stringify(getObj));
};

// 设置预警阈值
const setAlertNum = (postObj) => {
  return API.post('/system/alert?' + Qs.stringify(postObj));
};


export {
  getSample, getSampleTypeCnt, getSampleBySampleId,
  editSampleInfo, moveSampleArea, deleteSampleData
};
export { getAllFridges, getSpecialFridge, addNewSample };
export { getAllUser, getSpecialUser, deleteUser, editUser, addUser };
export { setAlertNum, searchSampleConVal };