/**
 * @description 工具类
 */
import { userGetCaptcha, userRegister } from '../apis/index.js';
import { router } from '../router/index.js';
import { uploadAllFiles, downloadAllFiles } from '../apis/admin/index.js';
import md5 from 'js-md5';

// 报错信息
const errorMap = new Map([
  ['accountInfo', '请填写用户名 ~'], ['fullName', '请填写真实姓名 ~'], ['passcode', '请填写密码 ~'],
  ['phoneNumber', '请填写电话号码 ~'], ['email', '请填写邮箱 ~'], ['captcha', '请填写邮箱验证码 ~'],
  ['token', '请返回邮箱重新打开链接 ~'], ['roomNum', '请填写房间号 ~'], ['fridgeNum', '请填写设备号 ~'],
  ['levelNum', '请填写层号 ~'], ['areaNum', '请填写区域号 ~'], 
  // ['boxNum', '请填写盒号 ~'],
  // ['sampleRow', '请填写盒内行号 ~'], ['sampleColumn', '请填写盒内列号 ~'], ['occupy', '请填写样本所占区域大小 ~'],
  // ['acquisitionTime', '请填写样本采集时间 ~'], ['depositNum', '请填写样本存入数量 ~'], ['securityLevel', '请填写安全级别 ~'],
  // ['storeTime', '请填写样本存入时间 ~'], ['treatInfo', '请填写治疗信息 ~'], ['concentration', '请填写样本溶度'],
  ['userRole', '请填写用户权限 ~'], ['userAccount', '请填写用户账号 ~']
]);

// 样本信息
const sampleInfo = {
  num: '',
  concentration: '',
  type: '',
  acquisitionTime: '',
  amount: '',
  alertThreshold: '',
  volume: '',
  sampleSourceId: '',
  areaNum: '',
  securityLevel: '',
  userAccount: '',
  roomNum: '',
  fridgeNum: '',
  levelNum: '',
  image: '',
  boxNum: '',
  sampleRow: '',
  sampleColumn: '',
  treatInfo: '',
  specialInfo: '{}'
};

/**
 * @description 检查是否输入了必要信息
 * @return true: 没有，false: 有
 */
const judgeInputNull = (postObj) => {
  for (const key in postObj) {
    if (postObj[key] === '' && errorMap.get(key)) {
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
  }).catch(err => {
    console.log(err);
  });
};

// 注册
const sendRegisterInfo = (captcha, registerInfo) => {
  const code = { code: captcha };
  registerInfo.passcode = registerInfo.passcode;
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
  }).catch(err => {
    console.log(err);
  });
};

// 退出系统
const logout = () => {
  localStorage.removeItem('userInfo');
  ElMessage({ showClose: true, message: '退出成功', type: 'success' });
  router.push('/user/login');
};

/**
 * @description 上传下载
 */
// 生成图片
const createFile = (file) => {
  if (file) {
    const suffix = file.name.split('.')[1];
    const isLt10M  = file.size / 1024 / 1024 < 10;
    if (['png','jpeg','jpg'].indexOf(suffix) < 0) {
      ElMessage({ showClose: true, message: '上传图片只支持 png、jpeg、jpg 格式！', type: 'error' });
      return false;
    }
    if (!isLt10M ) {
      ElMessage({ showClose: true, message: '上传图片大小不能超过 10MB！', type: 'error' });
      return false;
    }
    return file;
  }
};

// 上传图片
const uploadFile = async (postObj) => {
  let ret = '';
  await uploadAllFiles(postObj).then(res => {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.code === 0) {
        ElMessage({ showClose: false, message: resData.msg, type: 'error' });
        ret = '';
      } else {
        ret = resData.msg;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
      ret = '';
    }
  }).catch(err => {
    console.log(err);
  });

  return ret;
};

// 下载图片
const downloadFile = async (getObj) => {
  let url = '';
  await downloadAllFiles(getObj).then(res => {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.code !== 0) {
        url = URL.createObjectURL(resData);
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  return url;
};

export { sampleInfo };
export { errorMap, judgeInputNull };
export { getCaptcha, sendRegisterInfo };
export { logout };
export { getCookie, delCookie };
export { createFile, downloadFile, uploadFile };