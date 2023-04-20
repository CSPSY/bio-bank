<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue';
import { judgeInputNull, logout } from '../../utils/index.js';
import { getAllUser, deleteUser, editUser, addUser } from '../../apis/admin/index.js';
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
  size: 8,
  accountInfo: '',
});

// 根据页码，获取数据
const changeData = () => {
  getUsers();
};

const data = reactive({
  searchAccountInfo: '',
  createUserCardVisiable: false,
  editUserCardVisiable: false,
  userDatasets: [],
  total: 0,
});

// 获取用户信息列表
const getUsers = () => {
  const getObj = pageInfo;
  getAllUser(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: false, message: resData.msg, type: 'error' });
      } else {
        data.userDatasets = resData.list;
        data.total = resData.total;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};
getUsers(pageInfo);

const newUserInfo = reactive({
  accountInfo: '',
  passcode: '',
  fullName: '',
  userRole: '',
  phoneNumber: '',
  email: ''
});

const editUserInfo = reactive({
  id: '',
  accountInfo: '',
  fullName: '',
  userRole: '',
  phoneNumber: '',
  email: ''
});

// 根据用户名，搜索指定用户
const searchSpecialUser = () => {
  if (data.searchAccountInfo === '') {
    ElMessage({ showClose: true, message: '请输入用户名', type: 'warning' });
    return;
  }
  pageInfo.accountInfo = data.searchAccountInfo;
  getUsers();
};

// 编辑用户信息
const editUserCard = (rowData) => {
  editUserInfo.id = rowData.id;
  editUserInfo.accountInfo = rowData.accountInfo;
  editUserInfo.fullName = rowData.fullName;
  editUserInfo.userRole = rowData.userRole;
  editUserInfo.phoneNumber = rowData.phoneNumber;
  editUserInfo.email = rowData.email;
  data.editUserCardVisiable = true;
};

const sendEditInfo = () => {
  const putObj = editUserInfo;
  editUser(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      data.editUserCardVisiable = false;
      getUsers();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 根据用户 ID，删除用户
const deleteUserById = (id) => {
  deleteUser(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        location.reload();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 添加用户
const addNewUser = () => {
  const postObj = newUserInfo;
  console.log(postObj)
  if (judgeInputNull(postObj)) {
    return;
  }
  addUser(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.createUserCardVisiable = false;
        getUsers();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

const userRoleOptions = [{
  value: '用户',
  label: '用户',
},
{
  value: '管理员',
  label: '管理员',
}]
</script>

<template>
  <div class="common-layout"> 
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="232px">
        <el-menu
          class="menu"
          background-color="rgb(255, 255, 255)"
          default-active="4-1"
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
              <el-icon><Tickets /></el-icon>
              <span>权限管理</span>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <RouterLink :to="{ path: '/admin/manage-backup' }">
                <el-icon><Tickets /></el-icon>
                <span>备份管理</span>
              </RouterLink>
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
          <h2 class="title">权限管理</h2>
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
              <label for="account-info">用户名：</label>
              <el-input
                id="account-info" v-model.trim="data.searchAccountInfo"
                style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                placeholder="请输入用户名"
              />
              <el-button class="button" @click="searchSpecialUser">搜索</el-button>
              <el-button class="button" @click="data.createUserCardVisiable = true;">添加用户</el-button>
              <!-- 添加用户信息弹框 -->
              <el-dialog v-model="data.createUserCardVisiable" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">添加用户</h3>
                </template>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户名：
                    <el-input style="width: 186px;" v-model.trim="newUserInfo.accountInfo" placeholder="请输入用户名" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    密码：
                    <el-input style="width: 186px;" v-model.trim="newUserInfo.passcode" placeholder="请输入用户密码" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    姓名：
                    <el-input style="width: 186px;" v-model.trim="newUserInfo.fullName" placeholder="请输入用户真实姓名" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>权限：
                    <!-- <el-input style="width: 186px;" v-model.trim="newUserInfo.userRole" placeholder="请输入用户权限" />                     -->
                    <el-select style="width: 186px;" v-model="newUserInfo.userRole">
                      <el-option v-for="item in userRoleOptions" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>电话：
                    <el-input style="width: 186px;" v-model.trim="newUserInfo.phoneNumber" placeholder="请输入用户电话" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>邮箱：
                    <el-input style="width: 186px;" v-model.trim="newUserInfo.email" placeholder="请输入用户邮箱" />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                  <el-button
                    style="margin-right: 12px;" class="button" @click="addNewUser"
                  >确认</el-button>
                  <el-button
                    style="margin-right: 12px;" class="button" @click="data.createUserCardVisiable = false"
                  >取消</el-button>
                </div>
              </el-dialog>
            </div>
            <div class="main-bottom">
              <el-table
                ref="multipleTableRef"
                :data="data.userDatasets"
                :border="true"
                style="width: 1080px"
              >
                <el-table-column property="id" label="用户 ID" width="190" />
                <el-table-column property="accountInfo" label="用户名" width="120" />
                <el-table-column property="fullName" label="姓名" width="110" />
                <el-table-column property="userRole" label="用户角色" width="120" />
                <el-table-column property="phoneNumber" label="电话号码" width="140" />
                <el-table-column property="email" label="邮箱" width="280" />
                <el-table-column label="操作" width="120">
                  <template v-slot="scope" #default>
                    <el-button link type="primary" size="small" @click="editUserCard(scope.row)">编辑</el-button>
                    <el-popconfirm title="确认要删除该用户吗 ？" @confirm="deleteUserById(scope.row.id)">
                      <template #reference>
                          <el-button link type="primary" size="small" @click="">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 编辑用户信息弹框 -->
              <el-dialog v-model="data.editUserCardVisiable" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">编辑用户</h3>
                </template>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户名：
                    <el-input style="width: 186px;" v-model="editUserInfo.accountInfo" placeholder="请输入用户名" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    姓名：
                    <el-input style="width: 186px;" v-model="editUserInfo.fullName" placeholder="请输入用户真实姓名" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>权限：
                    <!-- <el-input style="width: 186px;" v-model.trim="editUserInfo.userRole" placeholder="请输入用户权限" /> -->
                    <el-select style="width: 186px;" v-model="editUserInfo.userRole">
                      <el-option v-for="item in userRoleOptions" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>电话：
                    <el-input style="width: 186px;" v-model="editUserInfo.phoneNumber" placeholder="请输入用户电话" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    用户<br>邮箱：
                    <el-input style="width: 186px;" v-model="editUserInfo.email" placeholder="请输入用户邮箱" />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                  <el-button style="margin-right: 12px;" class="button" @click="sendEditInfo">确认</el-button>
                  <el-button style="margin-right: 12px;" class="button" @click="data.editUserCardVisiable = false">取消</el-button>
                </div>
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