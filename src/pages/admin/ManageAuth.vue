<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive, onMounted } from 'vue';
const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');
const input5 = ref('');
const input6 = ref('');
const input7 = ref('');
const input8 = ref('');
const input9 = ref('');
const data = reactive({
  dialogTransferVisable: false
  });


const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '张三',
    },
    {
      sampleId: '002',
      sampleType: '李四',
    },
    {
      sampleId: '003',
      sampleType: '王五',
    },
    {
      sampleId: '004',
      sampleType: '赵六',
    },
    {
      sampleId: '005',
      sampleType: '孙奇',
    },
  ]
);


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
              <RouterLink style="color: rgb(83, 168, 255);" :to="{ path: '/admin/manage-auth' }">
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
          <span class="items">
            <div class="exit">
              <el-icon style="margin-right: 6px;"><SwitchButton /></el-icon>
              退出系统              
            </div>
          </span>
        </el-header>
        <!-- 内容区 -->
        <el-main style="background-color: rgb(245, 247, 253);">
          <div class="main-container">
            <div class="con-header">
              <div>
                <label for="specimens-id">用户ID：</label>
                <el-input
                  id="specimens-id"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="input1"
                  placeholder="请输入用户ID"
                />
                  <el-button class="button">搜索</el-button>
                  <el-button class="button" @click="data.dialogCreateUserVisable = true;">添加用户</el-button>
                  <el-dialog v-model="data.dialogCreateUserVisable" :close-on-click-modal="false">
                    <template #header>
                      <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">添加用户</h3>
                    </template>
                    <div style="display: flex; flex-direction: row;">
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户编号：
                          <el-input style="width: 256px;" v-model="input3" placeholder="请输入用户编号" />
                        </div>
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户账号：
                          <el-input style="width: 256px;" v-model="input4" placeholder="请输入用户账号" />
                        </div>
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户密码：
                          <el-input style="width: 256px;" v-model="input5" placeholder="请输入用户密码" />
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户姓名：
                          <el-input style="width: 256px;" v-model="input6" placeholder="请输入用户姓名" />
                        </div>
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户权限：
                          <el-input style="width: 256px;" v-model="input7" placeholder="请输入用户权限" />
                        </div>
                        <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                          用户电话：
                          <el-input style="width: 256px;" v-model="input8" placeholder="请输入用户电话" />
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        用户邮箱：
                        <el-input style="width: 256px;" v-model="input9" placeholder="请输入用户邮箱" />
                      </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                      <el-button style="margin-right: 12px;" class="button">确认</el-button>
                      <el-button style="margin-right: 12px;" class="button" @click="data.dialogCreateUserVisable = false">取消</el-button>
                    </div>
                  </el-dialog>
               </div>
              </div>
              <el-table
                ref="multipleTableRef"
                :data="tableData"
                :border="true"
                style="width: 100%"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column property="sampleId" label="用户ID" />
                <el-table-column property="sampleType" label="用户角色"   />
                <el-table-column fixed="right" label="操作" width="300">
                  <template #default>
                    <el-button link type="primary" size="small" @click="data.dialogCreateUserVisable=true">编辑</el-button>
                    <el-button link type="primary" size="small" >删除</el-button>
                    <el-button link type="primary" size="small" >权限设置</el-button>
                  </template>
                </el-table-column>
              </el-table>
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
</style>