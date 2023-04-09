/**
 * @description 工具类
 */

// 报错信息
const errorMap = new Map([
  ['accountInfo', '请填写用户名 ~'], ['fullName', '请填写真实姓名 ~'], ['passcode', '请填写密码 ~'],
  ['phoneNumber', '请填写电话号码 ~'], ['email', '请填写邮箱 ~'], ['captcha', '请填写邮箱验证码 ~']
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

export { errorMap, judgeInputNull };