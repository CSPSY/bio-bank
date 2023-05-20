<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';
import { userLogin } from '../../apis/index.js';
import { router } from '../../router/index.js';
import { judgeInputNull } from '../../utils/index.js';
import { Base64 } from 'js-base64';
import { md5 } from 'js-md5';

const data = reactive({
    loginInfo: {
        accountInfo: '',
        passcode: ''
    },
    passcodeFlag: false
});

const getLoginInfo = () => {
  const userLoginInfo = localStorage.getItem('userLoginInfo');
  if (userLoginInfo) {
    const { accountInfo, passcode } = JSON.parse(userLoginInfo);
    data.loginInfo.accountInfo = accountInfo;
    data.loginInfo.passcode = Base64.decode(passcode);
  }
};
getLoginInfo();

// 用户登录
const sendLoginInfo = () => {
  const postObj = {
    accountInfo: data.loginInfo.accountInfo,
    passcode: data.loginInfo.passcode
  };
  if (judgeInputNull(postObj)) {
    return;
  }
  userLogin(postObj).then(res => {
    if (res.status === 200) {
      if (res.data.code === 1) {
        const resData = res.data.data;
        if (resData.userRole === '管理员') {
          ElMessage({ showClose: true, message: '请切换用户账号登录 ~', type: 'warning' });
          return;
        }
        if (data.passcodeFlag) {
          localStorage.setItem(
            'userLoginInfo',
            JSON.stringify({
              accountInfo: data.loginInfo.accountInfo,
              passcode: Base64.encode(data.loginInfo.passcode)
            })
          );
        }
        localStorage.setItem('userInfo', JSON.stringify( resData ));
        router.push('/user');
      }
      ElMessage({ showClose: true, message: res.data.msg, type: res.data.code ? 'success' : 'error' });
    } else {
      ElMessage({ showClose: true, message: res.data.msg, type: 'error'});
    }
  }).catch(err => {
    console.log(err);
  });
};

</script>

<template>
  <div class="main-container">
  <div class="container">
    <h2 class="title">生物样本库管理中心</h2>
    <div class="card">
      <form>
        <div class="mode">
          <RouterLink :to="{ path: '/admin/login' }" class="mode-select">管理员登录</RouterLink>
          <RouterLink :to="{ path: '/user/login' }" class="mode-select" style="border-bottom: 2px white solid;">用户登录</RouterLink>
        </div>
        <div class="items">
          <el-input v-model="data.loginInfo.accountInfo" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items">
          <el-input v-model="data.loginInfo.passcode" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items" style="display: flex; justify-content: space-between; padding: 0 12px;">
          <div>
            <el-checkbox v-model="data.passcodeFlag" label="记住密码" size="large" style="color: aliceblue;" />
          </div>
          <RouterLink :to="{ path: '/forget-password' }" style="align-self: center; color: aliceblue; font-size: 14px; cursor: pointer;">
            忘记密码
          </RouterLink>
        </div>
        <div class="items" style="margin-bottom: 12px;">
          <el-button type="primary"
            style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
            @click="sendLoginInfo"
          >登录</el-button>
        </div>
        <div class="items">
          <RouterLink :to="{ path: '/user/register' }">
            <el-button type="info"
              style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
            >注册账号</el-button>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<style scoped>
.main-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url('../../../public/login-bg.png');
  background-size: 100% 100%;
}
/* card */
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title {
  color: whitesmoke;
  text-align: center;
  font-size: 1.8rem;
  letter-spacing: .12rem;
  margin-bottom: 12px;
}
.card {
  width: 382px;
  color: whitesmoke;
  border: 1px rgb(121, 121, 121) solid;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 3%);
  display: flex;
  flex-direction: column;
  padding: 24px 22px 12px;
  background-color: rgba(0, 7, 152, .7);
}
.mode {
  display: flex;
  margin-bottom: 16px;
}
.mode-select {
  color: whitesmoke;
  cursor: pointer;
  padding: 6px;
  width: 100%;
  text-align: center;
}
.items {
  margin-bottom: 18px;
}
:deep(.items .el-input__wrapper) {
  font-size: 1rem;
  border-radius: 6px;
  padding: 4px 12px;
}
.el-button:focus:not(.el-button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>