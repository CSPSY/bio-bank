/**
 * @description 工具类
 */
import { userGetCaptcha, userRegister } from '../apis/index.js';
import { router } from '../router/index.js';

// 报错信息
const errorMap = new Map([
  ['accountInfo', '请填写用户名 ~'], ['fullName', '请填写真实姓名 ~'], ['passcode', '请填写密码 ~'],
  ['phoneNumber', '请填写电话号码 ~'], ['email', '请填写邮箱 ~'], ['captcha', '请填写邮箱验证码 ~'],
  ['token', '请返回邮箱重新打开链接 ~']
])

/**
 * @description 检查是否输入了必要信息
 * @return true: 没有，false: 有
 */
const judgeInputNull = (postObj) => {
  for (const key in postObj) {
    if (postObj[key] === '') {
      ElMessage({ showClose: true, message: errorMap.get(key), type: 'warning' });
      return true;
    }
  }
  return false;
};

// 获取 cookie
const getCookie = (name) => {
  let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) {
    return decodeURI(arr[2]);
  }
  return null;
};

// 删除 cookie
const delCookie = (name) => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
};

/**
 * @description 用户、管理员 --- 登录、注册部分所需函数
 */
// 获取验证码
const getCaptcha = (email) => {
  if (email === '') {
    ElMessage({ showClose: true, message: errorMap.get('email'), type: 'warning' });
    return;
  }
  const postObj = { email: email, flag: 0 };
  userGetCaptcha(postObj).then(res => {
    if (res.status === 200) {
      ElMessage({ showClose: true, message: res.data.msg, type: res.data.code === 1 ? 'success' : 'error' } );
    } else {
      ElMessage({ showClose: true, message: '验证码发送失败', type: 'error' });
    }
  });
};

// 注册
const sendRegisterInfo = (captcha, registerInfo) => {
  const code = { code: captcha };
  const postObj = registerInfo;
  if (judgeInputNull(postObj)) {
    return;
  }
  if (captcha === '') {
    ElMessage({ showClose: true, message: errorMap.get('captcha'), type: 'warning' });
    return;
  }
  userRegister(code, postObj).then(res => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        ElMessage({ showClose: true, message: '注册失败，请检查输入信息是否有误', type: 'error'});
      } else {
        ElMessage({ showClose: false, message: res.data.msg, type: 'success'});
        if (registerInfo.userRole === '用户') {
          router.push('/user/login');
        } else if (registerInfo.userRole === '管理员') {
          router.push('/admin/login');
        }
      }
    } else {
      ElMessage({ showClose: true, message: '注册失败', type: 'error' });
    }
  });
};

// 退出系统
const logout = () => {
  localStorage.removeItem('userInfo');
  ElMessage({ showClose: true, message: '退出成功', type: 'success' });
  router.push('/user/login');
};

export { errorMap, judgeInputNull };
export { getCaptcha, sendRegisterInfo };
export { logout };
export { getCookie, delCookie };