/**
 * @description api 接口
 */
import axios from 'axios';
import Qs from 'qs';

const API = axios.create({
  // 和 vite.config 里跨域配置保持一致。
  baseURL: '/api'
});

/**
 * @description api 接口 --- 用户部分
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

export { userLogin, userRegister, userGetCaptcha };