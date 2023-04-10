<script setup>
import { reactive } from 'vue';
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search } from '@element-plus/icons-vue';
import printJS from 'print-js';
import { router } from '../../router';

const data = reactive({
  searchId: '',
  containerInfoVisible: false,
  sampleInfoVisible: false,
  sampleInnerVisible: false,
  container: {
    id: '',
    roomId: '',
    volume: '',
    size: '',
    temperature: '',
    date: '',
    version: '',
    type: '',
    brand: ''
  },
  sampleInfo: {
    id: '',
    density: '',
    type: '',
    gatherTime: '',
    addTime: '',
    tubeVolume: '',
    fromType: '',
    sum: '',
    area: '',
    safeLevel: '',
    userId: '',
    roomId: '',
    containerId: '',
    layerId: '',
    areaId: '',
    boxId: '',
    boxRowId: '',
    boxColId: '',
    remedyInfo: ''
  }
})

// 打印存入样本信息
const printSampleInfo = () => {
  printJS({
    printable: 'printInfo',
    type: 'html',
    targetStyles: ['*'],
    header: '样本信息'
  });
  data.sampleInfoVisible = false;
  data.sampleInnerVisible = false;
};

// 退出系统
const logout = () => {
  localStorage.removeItem('userInfo');
  ElMessage({ showClose: true, message: '退出成功', type: 'success' });
  router.push('/admin/login');
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
          <el-sub-menu class="menu-items items" index = "4">
              <template #title>
                  <el-icon>
                      <Setting />
                  </el-icon>
                  <span class="menu-items items">系统管理</span>
              </template>
              <el-menu-item class="menu-items items" index="4-1">
                  <RouterLink :to="{ path: '/admin/manage-auth' }">
                      <el-icon>
                          <Tickets />
                      </el-icon>
                      <span>权限管理</span>
                  </RouterLink>
              </el-menu-item>
              <el-menu-item class="menu-items items" index="4-2">
                  <el-icon>
                      <Tickets />
                  </el-icon>
              备份管理
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
          <h2 class="title">首页</h2>
          <span class="items">
            <el-popconfirm title="要退出系统吗 ？" @confirm="logout">
              <template #reference>
                <div class="exit">
                  <el-icon style="margin-right: 6px;"><SwitchButton /></el-icon>
                  退出系统
                </div>
              </template>
            </el-popconfirm>
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
                  v-model.trim="data.searchId"  
                  placeholder="请输入冰箱 id"
                  :suffix-icon="Search"
                />
                <el-button class="button">搜索冰箱</el-button>            
              </div>
              <div>
                <el-button class="button" @click="data.sampleInfoVisible=true">存入样本</el-button>
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
                  <el-card style="height: 166px; cursor: pointer;"
                    :body-style="{ padding: '0px 12px', display: 'flex', alignItems: 'center', height: '100%', fontSize: '14px' }"
                    @click="data.containerInfoVisible=true"
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
              <!-- 点击冰箱，冰箱信息弹框 -->
              <el-dialog v-model.trim="data.containerInfoVisible" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">冰箱信息</h3>
                </template>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备 ID：
                    <el-input style="width: 166px;" v-model.trim="data.container.id" placeholder="请输入设备 id" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    房间号 ID：
                    <el-input style="width: 166px;" v-model.trim="data.container.roomId" placeholder="请输入房间号 id" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    容量：
                    <el-input style="width: 166px;" v-model.trim="data.container.volume" placeholder="请输入容量" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备尺寸：
                    <el-input style="width: 166px;" v-model.trim="data.container.size" placeholder="请输入设备尺寸" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    存储温度：
                    <el-input style="width: 166px;" v-model.trim="data.container.temperature" placeholder="请输入存储温度" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    建立时间：
                    <el-input style="width: 166px;" v-model.trim="data.container.date" placeholder="请输入建立时间" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备型号：
                    <el-input style="width: 166px;" v-model.trim="data.container.version" placeholder="请输入设备型号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备类型：
                    <el-input style="width: 166px;" v-model.trim="data.container.type" placeholder="请输入设备类型" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备品牌：
                    <el-input style="width: 166px;" v-model.trim="data.container.brand" placeholder="请输入品牌" />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin: 22px 16px 0 0;">
                  <el-button style="margin-right: 12px;" class="button">确认修改</el-button>
                  <el-button style="margin-right: 12px;" class="button">删除</el-button>
                  <el-button style="margin-right: 12px;" class="button" @click="data.containerInfoVisible = false">取消</el-button>
                </div>
              </el-dialog>
              <!-- 存入样本，样本信息弹框 -->
              <el-dialog class="sampleInfoCard" v-model.trim="data.sampleInfoVisible" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">样本信息</h3>
                </template>
                <div id="printInfo">
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      样本 ID：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.id" placeholder="请输入样本 id" />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      样本浓度：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.density" placeholder="请输入样本浓度" />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      样本类型：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.type" placeholder="请输入样本类型" />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    单管体积：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.tubeVolume" placeholder="请输入单管体积" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    采集时间：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.gatherTime" placeholder="请输入采集时间" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    入库时间：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.addTime" placeholder="请输入入库时间" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    样本源<br/>类型：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.fromType" placeholder="请输入样本源类型" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    样本区域<br/>大小：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.area" placeholder="请输入样本区域大小" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    安全级别：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.safeLevel" placeholder="请输入安全级别" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                  治疗信息：
                  <el-input style="width: 75%;" autosize type="textarea" v-model.trim="data.sampleInfo.remedyInfo" placeholder="请输入治疗信息" />
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所属<br/>用户 ID：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.userId" placeholder="请输入用户 ID" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所在<br/>房间号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.roomId" placeholder="请输入房间号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所在<br/>冰箱号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.containerId" placeholder="请输入冰箱号" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所属层号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.layerId" placeholder="请输入层号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所在<br/>区域号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.areaId" placeholder="请输入区域号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    所在<br/>盒子号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxId" placeholder="请输入盒子号" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                    所在盒子里的行号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxRowId" placeholder="请输入盒子里的行号" />
                  </div>
                  <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                    所在盒子里的列号：
                    <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxColId" placeholder="请输入盒子里的列号" />
                  </div>
                </div>
                </div>
                <div style="display: flex; justify-content: flex-end;">
                  <el-button style="margin-right: 12px;" class="button"
                  @click="() => { data.sampleInnerVisible = true; }"
                  >确认</el-button>
                  <el-button style="margin-right: 12px;" class="button" @click="data.sampleInfoVisible=false">取消</el-button>
                </div>
              </el-dialog>
              <el-dialog v-model="data.sampleInnerVisible" width="30%" title="打印样品信息" append-to-body>
                <div style="display: flex; justify-content: flex-end;">
                  <el-button
                    style="margin-right: 12px;" class="button"
                    @click="printSampleInfo"
                  >确认</el-button>
                  <el-button style="margin-right: 12px;" class="button" @click="data.sampleInnerVisible=false">取消</el-button>
                </div>
              </el-dialog>
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