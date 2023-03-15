<script setup>
import { ref } from 'vue';
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'

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
          default-active="1"
        >
          <div class="title-tag">
            <el-tag :disable-transitions="true" class="title">生物样本库</el-tag>
          </div>
          <el-menu-item class="menu-items items" index="1">
              <el-icon><House /></el-icon>
              <span>首页</span>
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
          <el-menu-item class="menu-items items" index="4">
            <RouterLink :to="{ path: '/admin/manage-system' }">
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </RouterLink>
          </el-menu-item>
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
          <h2 class="title">首页</h2>
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
                <label for="refrigerators-id">冰箱 ID：</label>
                <el-input
                  id="refrigerators-id"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="inputId"  
                  placeholder="请输入冰箱 id"
                />
                <label for="specimens-id">样本 ID：</label>
                <el-input
                  id="specimens-id"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="inputId"  
                  placeholder="请输入样本 id"
                />
                <label for="specimens-type">样本类型：</label>
                <el-input
                  id="specimens-type"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="inputId"  
                  placeholder="请输入样本类型"
                />
                <el-button class="button">搜索冰箱</el-button>            
              </div>
              <div>
                <el-button class="button">存入样品</el-button>
              </div>    
            </div>
            <div style="padding: 16px 0;">
              <el-row>
                <el-col
                  v-for="(o, index) in 9"
                  :key="o"
                  :span="6"
                  :offset="index % 3 ? 3 : 0"
                  style="margin-bottom: 22px;"
                >
                  <el-card style="height: 166px;"
                    :body-style="{ padding: '0px 12px', display: 'flex', alignItems: 'center', height: '100%', fontSize: '14px' }"
                  >
                    <img
                      src="../../assets/imgs/冰箱.png"
                      style="width: 120px; padding: 0 6px;"
                    />
                    <div style="padding: 14px;">
                      <div style="margin-bottom: 5px; ">冰箱 ID：<span>{{ o.toString().padStart(2, '0') }}</span></div>
                      <div style="margin-bottom: 5px; ">样本类型：<span>血液库</span></div>
                      <div style="margin-bottom: 5px; ">冰箱型号：<span>{{ 'A'+o.toString().padStart(4, '0') }}</span></div>
                      <div style="margin-bottom: 5px; ">所在冰箱温度：<span>-65℃</span></div>
                      <div style="margin-bottom: 5px; ">所在冰箱容量：<span>520/3000</span></div>
                      <div style="margin-bottom: 5px; ">位置：<span>201号房3层2架</span></div>
                    </div>
                  </el-card>
                </el-col>
                <el-pagination style="margin: 0 auto;" layout="prev, pager, next, jumper" :total="100" />
              </el-row>
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
  cursor: default;
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
  display: flex;
  justify-content: space-between;
  border-bottom: 2px rgb(229, 230, 235) solid;
  padding-bottom: 16px;
}
.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>