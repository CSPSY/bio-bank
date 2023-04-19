<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import { logout } from '../../utils/index.js';
import { reactive, ref } from 'vue';
import { backupBiobankDB, restoreBiobankDB } from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

const data = reactive({
  backupVisible: true,
  restoreVisible: false,
  backupInfo: {
    path: '/home/beifen',
    dbName: 'bio-bank'
  },
  restoreInfo: {
    path: '/home/beifen/backup.sql',
    dbName: 'bio-bank'
  }
});

const showBackup = () => {
  data.restoreVisible = false;
  data.backupVisible = true;
};

const showRecover = () => {
  data.backupVisible = false;
  data.restoreVisible = true;
};

// 样本库备份，数据库备份
const backupBiobank = () => {
  const paramsObj = data.backupInfo;
  if (paramsObj.path === '') {
    ElMessage({ showClose: true, message: '请填写服务器的存储目录 ~', type: 'warning' });
    return;
  } else if (paramsObj.dbName) {
    ElMessage({ showClose: true, message: '请填写数据库名称 ~', type: 'warning' });
    return;
  }
  backupBiobankDB(paramsObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        ElMessage({ showClose: true, message: resData.msg, type: 'success' });
        return;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};

// 数据库恢复，根据文件恢复数据库信息
const restoreBiobank = () => {
  const paramsObj = data.restoreInfo;
  if (paramsObj.path === '') {
    ElMessage({ showClose: true, message: '请填写服务器上恢复文件所在的位置 ~', type: 'warning' });
    return;
  } else if (paramsObj.dbName) {
    ElMessage({ showClose: true, message: '请填写数据库名称 ~', type: 'warning' });
    return;
  }
  restoreBiobankDB(paramsObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        ElMessage({ showClose: true, message: resData.msg, type: 'success' });
        return;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};
</script>

<template>
  <div class="common-layout"> 
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="232px">
        <el-menu
          class="menu"
          background-color="rgb(255, 255, 255)"
          default-active="4-2"
          :default-openeds="['4']"
        >
          <div class="title-tag">
            <el-tag :disable-transitions="true" class="title">生物样本库</el-tag>
          </div>
          <el-menu-item class="menu-items items" index="1">
            <RouterLink :to="{ path: '/admin' }">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </RouterLink>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="2">
            <RouterLink :to="{ path: '/admin/manage-container' }">
              <el-icon><MessageBox /></el-icon>
              <span>容器管理</span>
            </RouterLink>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="3">
            <RouterLink :to="{ path: '/admin/manage-sample' }">
              <el-icon><Tickets /></el-icon>
              <span>样本管理</span>
            </RouterLink>
          </el-menu-item>
          <el-sub-menu class="menu-items items" index = "4">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span class="items">系统管理</span>
            </template>
            <el-menu-item class="menu-items items" index="4-1">
              <RouterLink :to="{ path: '/admin/manage-auth' }">
                <el-icon><Tickets /></el-icon>
                <span>权限管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <el-icon><Tickets /></el-icon>
              <span>备份管理</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item class="menu-items items" index="5">
            <RouterLink :to="{ path: '/admin/monitor-system' }">
              <el-icon><Warning /></el-icon>
              <span>系统监控</span>
            </RouterLink>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header">
          <h2 class="title">备份管理</h2>
          <div class="items" style="display: flex; align-items: center;">
            <span style="margin-right: 12px;">Hi! 用户 {{ userName }}</span>
            <el-popconfirm title="要退出系统吗 ？" @confirm="logout">
              <template #reference>
                <div class="exit">
                  <el-icon style="margin-right: 6px;"><SwitchButton /></el-icon>
                  退出系统
                </div>
              </template>
            </el-popconfirm>
          </div>
        </el-header>
        <!-- 内容区 -->
        <el-main style="background-color: rgb(245, 247, 253);">
          <div class="main-container">
            <div class="con-header">
              <div class="con-header-left">
                <el-button class="button" @click="showBackup">样本库备份</el-button>
                <el-button class="button" @click="showRecover">样本库恢复</el-button>
              </div>
              <!-- 样本库备份 -->
              <div class="con-header-right" v-show="data.backupVisible">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>样本库备份</span>
                      <el-popconfirm
                        width="220" title="确认要将数据库备份到服务器上的这个位置吗 ？"
                        @confirm="backupBiobank"
                      >
                        <template #reference>
                          <el-button
                            style="margin-top: 0;"
                            class="button" type="primary" text plain
                          >进行备份</el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                  <section>
                    <div style="font-size: 14px; display: flex; align-items: center; margin-bottom: 16px;">
                      <span style="width: 30%;">存储目录：</span>
                      <el-input style="width: 66%;" v-model.trim="data.backupInfo.path" />
                    </div>
                    <div style="font-size: 14px; display: flex; align-items: center;">
                      <span style="width: 30%;">数据库名称：</span>
                      <el-input style="width: 66%;" v-model.trim="data.backupInfo.dbName" />
                    </div>
                  </section>
                </el-card>
              </div> 
              <!-- 样本库恢复 -->
              <div class="con-header-right" v-show="data.restoreVisible">
                <el-card class="box-card">
                  <template #header>
                    <div class="card-header">
                      <span>样本库恢复</span>
                      <el-popconfirm
                        width="220" title="确认要用这个文件来恢复数据库吗 ？"
                        @confirm="restoreBiobank"
                      >
                      <template #reference>
                        <el-button
                          style="margin-top: 0;"
                          class="button" type="primary" text plain
                        >进行恢复</el-button>
                      </template>
                    </el-popconfirm>
                    </div>
                  </template>
                  <section>
                    <div style="font-size: 14px; display: flex; align-items: center; margin-bottom: 16px;">
                      <span style="width: 30%;">恢复文件位置：</span>
                      <el-input style="width: 66%;" v-model.trim="data.restoreInfo.path" />
                    </div>
                    <div style="font-size: 14px; display: flex; align-items: center;">
                      <span style="width: 30%;">数据库名称：</span>
                      <el-input style="width: 66%;" v-model.trim="data.restoreInfo.dbName" />
                    </div>
                  </section>
                </el-card>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 侧边栏样式 */
.title-tag {
  margin: 12px auto;
}
.title-tag .title {
  padding: 20px;
}
.menu {
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
a {
  width: 100%;
}
.menu-items {
  margin-bottom: 4px;
}
.menu-items.is-active {
  background-color: rgb(242, 243, 245);
  border-radius: 6px;
}
.items {
  font-size: 1.06rem;
  font-weight: 400;
  opacity: 0.9;
  letter-spacing: .12rem;
}
/* 顶部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}
.title {
  font-size: 1.2rem;
  font-weight: 460;
  text-align: center;
  opacity: 0.8;
  margin: 12px 0;
  letter-spacing: .12rem;
}
.exit {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
}
.exit:hover {
  background-color: rgb(242, 243, 245);
  border-radius: 5px;
}
/* 内容区样式 */
.main-container {
  background-color: #fff;
  padding: 16px;
  height: 100%;
}
.con-header {
  margin: 55px 0 0 55px;
  display: flex;
  
  align-items: center;
}
.con-header-left {
  display: flex;
  flex-direction: column;

  align-self: flex-start;
  padding-top: 32px;
  margin-right: 56px;
}
.con-header-right {
  padding: 12px;
}
.button {
  margin: 0;
}
.button:not(:first-child) {
  margin-top: 12px;
}
.box-card {
  width: 528px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>