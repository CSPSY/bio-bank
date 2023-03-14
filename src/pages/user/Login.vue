<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { reactive } from 'vue';

const data = reactive({
    loginInfo: {
        username: "",
        password: ""
    },
    passwordFlag: false
})

</script>

<template>
  <div class="main-container">
  <div class="container">
    <h2 class="title">生物样本库管理中心</h2>
    <div class="card">
      <div class="mode">
        <RouterLink :to="{ path: '/login-admin' }" class="mode-select">管理员登录</RouterLink>
        <RouterLink :to="{ path: '/login-user' }" class="mode-select" style="border-bottom: 2px white solid;">用户登录</RouterLink>
      </div>
      <div class="items">
        <el-input v-model="data.loginInfo.username" placeholder="请输入用户名">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="items">
        <el-input v-model="data.loginInfo.password" type="password" placeholder="请输入密码" show-password>
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="items" style="display: flex; justify-content: space-between; padding: 0 12px;">
        <div>
          <el-checkbox v-model="passwordFlag" label="记住密码" size="large" style="color: aliceblue;" />
        </div>
        <a style="align-self: center; color: aliceblue; font-size: 14px; cursor: pointer;">
          忘记密码
        </a>
      </div>
      <div class="items" style="margin-bottom: 12px;">
        <el-button type="primary"
          style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
        >登录</el-button>
      </div>
      <div class="items">
        <el-button type="info"
          style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
        >注册账号</el-button>
      </div>
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
  width: 352px;
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
  padding: 6px 12px;
}
.el-button:focus:not(.el-button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>