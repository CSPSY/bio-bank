<script setup>
import { Message, Lock } from '@element-plus/icons-vue';
import { reactive } from 'vue';
import { judgeInputNull } from '../utils/index.js';
import { useRoute } from 'vue-router';
import { changePassword } from '../apis/index.js';
import { ElMessage } from 'element-plus';
import { router } from '../router';

const data = reactive({
  info: {
    email: '',
    passcode: ''
  },
  token: ''
});

const { query } = useRoute();
const getToken = () => {
  data.token = Object.keys(query)[0];
};
getToken();

const sendNewPassword = () => {
  const putObj = data.info;
  if (judgeInputNull(putObj)) {
    return;
  }
  const token = { token: data.token };
  changePassword(token, putObj).then(res => {
    if (res.status === 200) {
      ElMessage({ showClose: true, message: res.data.msg, type: res.data.code === 1 ? 'success' : 'error' } );
      if (res.data.code === 1) {
        router.push('/user/login');
      }
    } else {
      ElMessage({ showClose: true, message: '发送失败', type: 'error' });
    }
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
          <span :to="{ path: '/admin/login' }" class="mode-select" style="border-bottom: 2px white solid;">重置密码</span>
        </div>
        <div class="items" style="display: flex; justify-content: space-between;">
          <el-input v-model.trim="data.info.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items">
          <el-input v-model.trim="data.info.passcode" type="password" placeholder="请输入新密码" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="items" style="margin-bottom: 12px;">
          <el-button type="primary"
            style="width: 100%; border-radius: 6px; font-size: 1.1rem; letter-spacing: 0.3rem; padding: 18px;"
            @click="sendNewPassword"
          >确认</el-button>
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

  font-size: 1.3rem;
  letter-spacing: 1rem;
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