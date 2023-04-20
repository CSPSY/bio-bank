<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue';
import { logout } from '../../utils/index.js';
import { setAlertNum, searchSampleConVal } from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

const data = reactive({
  tableVisible: false,
  setWarnCard: false,
  alertNum: '',
  containerDatasets: [],
  total: 0
});

const searchInfo = reactive({
  pageNum: 1,
  pageSize: 10,
  givenValue: '',
});

// 设置预警阈值
const sendAlertNum = () => {
  if (data.alertNum === '') {
    ElMessage({ showClose: true, message: '请填写预警值 ~', type: 'warning' });
    return;
  }
  const postObj = { alertThreshold: data.alertNum };
  setAlertNum(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        ElMessage({ showClose: true, message: resData.msg, type: 'success' });
      } else {
        ElMessage({ showClose: true, message: resData.msg, type: 'error' });
      }
      data.setWarnCard = false;
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 搜索样本库
const searchSampleContainer = () => {
  if (searchInfo.givenValue === '') {
    ElMessage({ showClose: true, message: '请填写样本库容量 ~', type: 'warning' });
    return;
  }
  const getObj = searchInfo;
  searchSampleConVal(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (res.data.code !== 0) {
        data.containerDatasets = res.data.list;
        data.tableVisible = true;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
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
          default-active="5"
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
              <span class="menu-items items">系统管理</span>
            </template>
            <el-menu-item class="menu-items items" index="4-1">
              <RouterLink :to="{ path: '/admin/manage-auth' }">
                <el-icon><Tickets /></el-icon>
                <span>权限管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <RouterLink :to="{ path: '/admin/manage-backup' }">
                <el-icon><Tickets /></el-icon>
                <span>备份管理</span>
              </RouterLink>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item class="menu-items items" index="5">
            <el-icon><Warning /></el-icon>
            <span>系统监控</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header">
          <h2 class="title">系统监控</h2>
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
              <div style="width: 352px; display: flex; align-items: center; white-space: nowrap; margin-right: 122px;">
                <span>样本库容量 &lt; ： </span>
                <el-input v-model.trim="searchInfo.givenValue" placeholder="请输入样本库容量（[0.0 ~ 1.0]）" />
              </div>
              <div>
                <el-button class="button" @click="searchSampleContainer">搜索</el-button>
                <el-button class="button" @click="data.setWarnCard=true">设置预警</el-button>
              </div>
            </div>
            <div v-show="data.tableVisible">
              <el-table
                ref="multipleTableRef"
                :data="data.containerDatasets"
                :border="true"
                style="width: 100%; margin-top: 16px;"
              >
                <el-table-column property="num" label="设备 ID" />
                <el-table-column property="type" label="设备类型"   />
                <el-table-column property="roomNum" label="所在房间号" />
                <el-table-column property="storageTemp" label="设备存储温度"   />
                <el-table-column property="buildTime" label="创建时间" />
                <el-table-column property="capacity" label="设备容量" width="120" />
              </el-table>
              <el-pagination
                style="position: absolute; bottom: 5%; left: 43%;"
                layout="prev, pager, next, jumper" :total="data.total"
                :page-size="searchInfo.pageSize"
                v-model:current-page="searchInfo.pageNum"
              />
            </div>
            <el-dialog class="setWarnCard"
              v-model.trim="data.setWarnCard" :close-on-click-modal="false"
            >
              <template #header>
                <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">设置预警</h3>
              </template>
              <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                预警值([0.0 ~ 1.0])：
                <el-input style="width: 30%;" autosize type="text"
                  v-model.trim="data.alertNum" placeholder="请输入预警值"
                />
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <el-button style="margin-right: 12px;" class="button" @click="sendAlertNum">确认</el-button>
                <el-button style="margin-right: 12px;" class="button" @click="data.setWarnCard=false">取消</el-button>
              </div>
            </el-dialog>
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
  height: 56px;
  
  align-items: center;
}
.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>