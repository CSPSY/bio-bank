<script setup>
import { User, Lock, Message, Iphone } from '@element-plus/icons-vue';
import { reactive } from 'vue';
import { getCaptcha, sendRegisterInfo } from '../../utils/index.js';

const data = reactive({
    registerInfo: {
      accountInfo: '',
      fullName: '',
      passcode: '',
      phoneNumber: '',
      email: '',
      userRole: '管理员'
    },
    captcha: '',
    passwordFlag: false
});
</script>

<template>
  <div class="main-container">
  <div class="container">
    <h2 class="title">生物样本库管理中心</h2>
    <div class="card">
      <form>
        <div class="mode mode-select">管理员注册</div>
        <div class="items" style="display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <el-input v-model.trim="data.registerInfo.accountInfo" placeholder="请输入用户名">
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </div>
          <div style="width: 45%;">
            <el-input v-model.trim="data.registerInfo.fullName" placeholder="请输入真实姓名">
            </el-input>
          </div>
        </div>
        <div class="items">
          <el-input v-model.trim="data.registerInfo.passcode" type="password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items">
          <el-input v-model.trim="data.registerInfo.phoneNumber" placeholder="请输入电话号码">
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items" style="display: flex; justify-content: space-between;">
          <el-input v-model.trim="data.registerInfo.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items" style="display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <el-input v-model.trim="data.captcha" placeholder="请输入邮箱验证码">
            </el-input>
          </div>
          <div style="width: 45%;">
            <el-button style="width: 100%; height: 38px;" type="primary"
            @click="getCaptcha(data.registerInfo.email)" plain
          >获取邮箱验证码</el-button>
          </div>
        </div>
        <div class="items" style="margin-bottom: 12px;">
          <el-button type="primary"
            style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
            @click="sendRegisterInfo(data.captcha, data.registerInfo)"
          >注册</el-button>
        </div>
        <div class="items">
          <RouterLink :to="{ path: '/admin/login' }">
              <el-button type="info"
                style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
              >返回登录</el-button>
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
  padding: 16px 22px 12px;
  background-color: rgba(0, 7, 152, .7);
}
.mode {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.mode-select {
  color: whitesmoke;
  padding: 6px;
  width: 100%;

  font-size: 1.3rem;
  letter-spacing: .2rem;
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