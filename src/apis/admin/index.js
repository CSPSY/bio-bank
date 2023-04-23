/**
 * @description API 接口，管理员部分
 */
import axios from 'axios';
import Qs from 'qs';
import { router } from '../../router/index.js';
import { ElMessage } from 'element-plus';

const API = axios.create({
  // 和 vite.config 里跨域配置保持一致。
  baseURL: ''
  // baseURL: 'http://150.158.18.74:8082'
});

// 检查登录状态
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo && JSON.parse(userInfo).userRole !== '管理员' || userInfo === null) {
    // ElMessage({ showClose: true, message: '没有权限访问该页面 ~', type: 'error' });
    router.push('/admin/login');
  }
  return req;
}, err => {
  return Promise.reject(err);
});

API.interceptors.response.use((res) => {
  if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') {
    localStorage.removeItem('userInfo');
    router.push('/admin/login');
  }
  return res;
}, err => {
  return Promise.reject(err);
});

/**
 * @description 首页部分
 */
// 查找是否有冰箱超过阈值
const selectByAlert = () => {
  return API.get('/system/selectByAlert');
};

// 查询所有冰箱数据，也可以实现搜索
const getAllFridges = (getObj) => {
  return API.get('/biobank/fridge/?' + Qs.stringify(getObj));
};

// 修改冰箱数据
const editFridge = (putObj) => {
  return API.put('/biobank/fridge/', putObj);
};

// 根据冰箱编号和房间号获取冰箱信息
const getFridgeInfoByNum = (getObj) => {
  return API.get('/biobank/fridge/getByNum?' + Qs.stringify(getObj));
};

// 新增样本数据
const addNewSample = (postObj) => {
  return API.post('/biobank/sample/', postObj);
};

// 删除冰箱
const deleteFridge = (id) => {
  return API.delete(`/biobank/fridge/${id}`);
};

/**
 * @description 容器管理部分
 */
// 获取侧边栏信息---，容器存储信息，房间号-设备号-等
const getContainerStorageInfo = (getObj) => {
  return API.get('/biobank/fridge/getSidebar?' + Qs.stringify(getObj));
};

// 创建容器
const addNewContainer = (postObj) => {
  return API.post('/biobank/fridge/', postObj);
};

// 根据盒子编号获取样本信息
const getBoxInfoByNum = (getObj)=> {
  return API.get('/biobank/box/?' + Qs.stringify(getObj));
};

/**
 * @description 样本管理部分
 */
// 获取样本，根据 getObj 传参实现搜索样本功能
const getSample = (getObj) => {
  return API.get('/biobank/sample/?' + Qs.stringify(getObj));
};

// 获取样本类型统计
const getSampleTypeCnt = () => {
  return API.get('/biobank/sample/countByType');
};

// 编辑样本信息
const editSampleInfo = (putObj) => {
  return API.put('/biobank/sample/', putObj);
};

// 移动样本存储的库位置信息
const moveSampleArea = (putObj) => {
  return API.put('/biobank/sample/moveSample', putObj);
};

// 批量删除样本数据
const deleteSampleData = (deleteData) => {
  return API.delete('/biobank/sample/batchDelete?' + deleteData);
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
 * @description 备份管理部分
 */
// 样本库备份---备份数据库
const backupBiobankDB = (paramsObj) => {
  return API.post('/system/backup?' + Qs.stringify(paramsObj));
};

// 样本库恢复---用之前备份的，进行数据库恢复
const restoreBiobankDB = (paramsObj) => {
  return API.post('/system/restore?' + Qs.stringify(paramsObj));
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


export { getAllFridges, addNewSample, editFridge, deleteFridge, selectByAlert };
export {
  getSample, getSampleTypeCnt,
  editSampleInfo, moveSampleArea, deleteSampleData
};
export { getContainerStorageInfo, addNewContainer,
  getFridgeInfoByNum, getBoxInfoByNum
};
export { getAllUser, getSpecialUser, deleteUser, editUser, addUser };
export { backupBiobankDB, restoreBiobankDB };
export { setAlertNum, searchSampleConVal };