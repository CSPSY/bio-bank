<script setup>
import { ref } from 'vue';
import { Search, House, SwitchButton, MessageBox, Tickets, Memo, Warning, Setting } from '@element-plus/icons-vue'

const inputId = ref('')
</script>

<template>
  <div class="common-layout"> 
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="232px">
        <el-menu
          class="menu"
          background-color="rgb(255, 255, 255)"
          default-active="2"
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
              <el-icon><MessageBox /></el-icon>
              <span>容器管理</span>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="3">
            <el-icon><Tickets /></el-icon>
            <span>样本管理</span>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="4">
            <el-icon><Memo /></el-icon>
            <span>样本源管理</span>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="5">
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="6">
            <el-icon><Warning /></el-icon>
            <span>系统监控</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header">
          <h2 class="title">容器管理</h2>
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