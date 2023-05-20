<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, User, Folder } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue';
import { logout } from '../../utils/index.js';
import { getAllOperation, deleteAllOperation } from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  size: 10
});

// 根据页码，获取数据
const changeData = () => {
  getOperationInfo();
};

const data = reactive({
  operationCardVisiable: false,
  operationDatasets: [{
    modul: '操作模块',
    type: '操作类型',
    description: '操作描述',
    requestParam: '请求参数',
    responseParam: '返回参数',
    method: '操作方法',
    uri: '请求 URI',
    userName: '操作员姓名',
    userAccount: '操作员账号',
    createTime: '操作时间'
  }],
  operationInfo: {
    modul: '操作模块',
    type: '操作类型',
    description: '操作描述',
    requestParam: '请求参数',
    responseParam: '返回参数',
    method: '操作方法',
    uri: '请求 URI',
    userName: '操作员姓名',
    userAccount: '操作员账号',
    createTime: '操作时间'
  },
  total: 0,
});

// 搜索信息
const searchInfo = reactive({
  userName: '',
  modul: '',
  type: '',
  searchDatetime: ''
});


// 获取操作信息
const getOperationInfo = () => {
  const getObj = pageInfo;
  getAllOperation(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: false, message: resData.msg, type: 'error' });
      } else {
        data.operationDatasets = resData.list;
        data.total = resData.total;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};
getOperationInfo();

// 发送搜索信息
const sendSearchInfo = () => {
  if (searchInfo.userName) {
    pageInfo.userName = searchInfo.userName;
  } else {
    pageInfo.userName = '';
  }
  if (searchInfo.modul) {
    pageInfo.modul = searchInfo.modul;
  } else {
    pageInfo.modul = '';
  }
  if (searchInfo.type) {
    pageInfo.type = searchInfo.type;
  } else {
    pageInfo.type = '';
  }
  if (searchInfo.searchDatetime) {
    pageInfo.beginTime = searchInfo.searchDatetime[0];
    pageInfo.endTime = searchInfo.searchDatetime[1];
  } else {
    pageInfo.beginTime = '';
    pageInfo.endTime = '';
  }
  getOperationInfo();
};

// 重置 --- 删除所有操作信息
const deleteAllOperationInfo = () => {
  deleteAllOperation().then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      getOperationInfo();
    } else {
      ElMessage({ showClose: true, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 展示操作信息卡片
const showOperationCard = (rowData) => {
  data.operationCardVisiable = true;
  data.operationInfo = rowData;
  console.log(rowData)
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
          default-active="4-3"
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
              <RouterLink :to="{ path: '/admin/manage-auth'}">
                <el-icon><User /></el-icon>
                <span>权限管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <RouterLink :to="{ path: '/admin/manage-backup' }">
                <el-icon><Folder /></el-icon>
                <span>备份管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-3">
              <el-icon><Tickets /></el-icon>
              <span>日志管理</span>
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
          <h2 class="title">日志管理</h2>
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
            <div class="main-top">
              <div style="display: flex; align-items: center; width: 15%;">
                <label for="operate-name">操作员姓名：</label>
                <el-input
                  id="operate-name" v-model="searchInfo.userName"
                  style="height: 32px; width: 102px; padding: 0 12px 0 0;"
                  placeholder="操作员姓名"
                />
              </div>
              <div style="display: flex; align-items: center; width: 15%;">
                <label for="operate-model">操作模块：</label>
                <el-input
                  id="operate-model" v-model="searchInfo.modul"
                  style="height: 32px; width: 112px; padding: 0 12px 0 0;"
                  placeholder="操作模块"
                />
              </div>
              <div style="display: flex; align-items: center; width: 15%;">
                <label for="operate-type">操作类型：</label>
                <el-input
                  id="operate-type" v-model="searchInfo.type"
                  style="height: 32px; width: 112px; padding: 0 12px 0 0;"
                  placeholder="操作类型"
                />
              </div>
              <div style="display: flex; align-items: center; margin-right: 22px;">
                <label for="operate-time">操作时间：</label>
                <el-date-picker
                  v-model="searchInfo.searchDatetime"
                  type="datetimerange"
                  range-separator="到"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD hh:mm:ss"
                  value-format="YYYY-MM-DD hh:mm:ss"
                />
              </div>
              <el-button class="button" @click="sendSearchInfo" type="primary" plain>搜索</el-button>
              <el-popconfirm title="确认要删除所有数据吗 ？" @confirm="deleteAllOperationInfo">
                <template #reference>
                  <el-button class="button" type="danger" plain>重置</el-button>
                </template>
              </el-popconfirm>
            </div>
            <div class="main-bottom">
              <el-table
                ref="multipleTableRef"
                :data="data.operationDatasets"
                :border="true"
                style="width: 1280px"
              >
                <el-table-column property="modul" label="操作模块" width="150" />
                <el-table-column property="type" label="操作类型" width="130" />
                <el-table-column property="description" label="操作描述" width="130" />
                <el-table-column property="userName" label="操作员姓名" width="110" />
                <el-table-column property="userAccount" label="操作员账号" width="110" />
                <el-table-column property="uri" label="请求 URI" width="280" />
                <el-table-column property="createTime" label="操作时间" width="260" />
                <el-table-column label="操作" width="110">
                  <template v-slot="scope" #default>
                    <el-button link type="primary" size="small" @click="showOperationCard(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 点击查看后，样本信息的弹窗 -->
              <el-dialog
                style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                v-model="data.operationCardVisiable" :close-on-click-modal="false"
              >
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">操作信息</h3>
                </template>
                <el-card shadow="never">
                  <div style="margin-bottom: 26px; word-break: break-all;">操作模块：{{ data.operationInfo.modul }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">操作类型：{{ data.operationInfo.type }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">操作描述：{{ data.operationInfo.description }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">请求参数：{{ data.operationInfo.requestParam }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">返回参数：{{ data.operationInfo.responseParam }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">操作方法：{{ data.operationInfo.method }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">请求 URI：{{ data.operationInfo.uri }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">操作员姓名：{{ data.operationInfo.userName }}</div>
                  <div style="margin-bottom: 26px; word-break: break-all;">操作员账号：{{ data.operationInfo.userAccount }}</div>
                  <div style="word-break: break-all;">操作时间：{{ data.operationInfo.createTime }}</div>
                </el-card>
              </el-dialog>
              <el-pagination
                style="position: absolute; bottom: 5%; left: 41%;"
                layout="total, prev, pager, next, jumper" :total="data.total"
                :page-size="pageInfo.size"
                v-model:current-page="pageInfo.currentPage"
                @current-change="changeData()"
              />
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
.main-top {
  margin: 25px 0 0 55px;
  display: flex;

  align-items: center;
}
.main-bottom {
  margin: 25px 0 0 32px;
}
.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>