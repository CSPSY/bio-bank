/**
 * @description API 接口 --- 用户、管理员通用部分
 */
import axios from 'axios';
import Qs from 'qs';

const API = axios.create({
  baseURL: '/api'
});

/**
 * @description API 接口 --- 用户登录、注册部分接口
 */
// 登陆
const userLogin = (postObj) => {
  return API.post('/biobank/user/login', postObj);
};

// 注册
const userRegister = (code, postObj) => {
  return API.post('/biobank/user/?' + Qs.stringify(code), postObj)
};

// 获取邮箱验证码
const userGetCaptcha = (postObj) => {
  return API.post('/biobank/user/sendMsg?' + Qs.stringify(postObj));
};

// 忘记密码 --- 重置密码
const changePassword = (token, putObj) => {
  return API.put('/biobank/user/passcode/reset?' + Qs.stringify(token), putObj);
};

export { changePassword };
export { userLogin, userRegister, userGetCaptcha };