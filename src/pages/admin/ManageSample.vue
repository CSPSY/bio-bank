<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive, onMounted } from 'vue';
import { logout } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

const inputId = ref('');
const chartRef = ref();
const chart = ref();
const data = reactive({
  dialogTransferVisable: false,
  sampleInfoVisible: false,
  sampleInfoRemove: {
    id: '',
    roomId: '',
    containerId: '',
    layerId: '',
    areaId: '',
    boxId: '',
    boxRowId: '',
    boxColId: ''
  },
  sampleInfo: {
    num: '001',
    concentration: '3',
    type: '污水',
    acquisitionTime: '2023/03/15',
    depositNum: '23',
    storeTime: '2023/03/16',
    volume: '5',
    sampleSourceId: '03',
    areaNum: '12',
    securityLevel: '安全',
    userId: '01',
    roomNum: '201',
    fridgeNum: '002',
    levelNum: '2',
    occupy: '3',
    boxNum: '2',
    sampleRow: '1',
    sampleColumn: '4',
    treatInfo: '病菌来源体的污水。',
    specialInfo: '这是一个来自于加工厂的污水，里面拥有许多待研究与发现的病菌。'
  }
});
const searchInfo = reactive({
  searchId: '',
  type: ''
})

const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '002',
      sampleType: 'DNA',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '003',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '004',
      sampleType: '污水',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '005',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
  ]
);

// 数据可视化
onMounted(
  () => {
    if (chartRef.value) {
      chart.value = echarts.init(chartRef.value);
      const xData = ['DNA', '血液', '尿液', '唾液', '汗液', '肝脏', '肺组织', '心脏', '血浆', '血清', '污水'];
      const yData = [188, 387, 260, 150, 230, 0, 0, 0, 0, 0, 0];
      const option = {
        title: {
          text: '样本类型总览：'
        },
        color: '#409eff',
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      };
      chart.value.setOption(option);
    }
  }
)
</script>

<template>
  <div class="common-layout"> 
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="232px">
        <el-menu
          class="menu"
          background-color="rgb(255, 255, 255)"
          default-active="3"
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
            <el-icon><Tickets /></el-icon>
            <span>样本管理</span>
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
          <h2 class="title">样本管理</h2>
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
            <div ref="chartRef" id="main"></div>
            <div id="container">
              <div class="con-header">
                <div>
                  <label for="specimens-id">样本 ID：</label>
                  <el-input
                    id="specimens-id"
                    style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                    v-model="searchInfo.sampleId"  
                    placeholder="请输入样本 id"
                  />
                  <label for="specimens-type">样本类型：</label>
                  <el-input
                    id="specimens-type"
                    style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                    v-model="searchInfo.type"
                    placeholder="请输入样本类型"
                  />
                  <el-button class="button">搜索</el-button>        
                </div>
                <div>
                  <el-popconfirm title="确认要移出这些样本吗 ？" @confirm="">
                    <template #reference>
                      <el-button class="button">出库</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button class="button" @click="data.dialogTransferVisable = true;">移库</el-button>
                  <!-- 移库后的弹窗 -->
                  <el-dialog v-model="data.dialogTransferVisable" :close-on-click-modal="false">
                    <template #header>
                      <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">移库</h3>
                    </template>
                    <div style="display: flex; align-items: center; font-size: 1.06rem; margin-bottom: 22px;">
                      样本 ID：
                      <el-input style="width: 152px;" v-model.trim="data.sampleInfoRemove.id" placeholder="请输入样本 ID" />
                    </div>
                    <div style="display: flex; align-items: center; font-size: 1.06rem; margin-bottom: 12px;">移入位置</div>
                    <div style="display: flex; font-size: 1.06rem; margin-bottom: 12px;">
                      <div style="margin-right: 42px;">
                        房号：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.roomId" placeholder="请输入" />
                      </div>
                      <div style="margin-right: 42px;">
                        冰箱号：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.containerId" placeholder="请输入" />
                      </div>
                      <div style="margin-right: 42px;">
                        层号：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.layerId" placeholder="请输入" />
                      </div>
                      <div>
                        区号：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.areaId" placeholder="请输入" />
                      </div>
                    </div>
                    <div style="display: flex; font-size: 1.06rem; margin-bottom: 32px;">
                      <div style="margin-right: 42px;">
                        盒号：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.boxId" placeholder="请输入" />
                      </div>
                      <div style="margin-right: 42px;">
                        盒内行 ID：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.boxRowId" placeholder="请输入" />
                      </div>
                      <div>
                        盒内列 ID：
                        <el-input style="width: 98px;" v-model.trim="data.sampleInfoRemove.boxColId" placeholder="请输入" />
                      </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                      <el-button style="margin-right: 12px;" class="button" @click="data.dialogTransferVisable = false">取消</el-button>
                      <el-button style="margin-right: 12px;" class="button">移入</el-button>
                    </div>
                  </el-dialog>
                </div>
              </div>
              <div>
                <el-table
                  ref="multipleTableRef"
                  :data="tableData"
                  :border="true"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column property="sampleId" label="样本 ID" />
                  <el-table-column property="sampleType" label="样本类型" />
                  <el-table-column property="sampleDensity" label="样本浓度(g/ml)" />
                  <el-table-column property="tubeVolume" label="溶液体积(ml)" />
                  <el-table-column property="date" label="存入时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template #default>
                      <el-button link type="primary" size="small" @click="data.sampleInfoVisible=true">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination style="position: absolute; bottom: 5%; left: 43%;" layout="prev, pager, next, jumper" :total="100" />
                <!-- 样本信息弹框 -->
                <el-dialog class="sampleInfoCard"
                  style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                  v-model.trim="data.sampleInfoVisible" :close-on-click-modal="false"
                >
                  <template #header>
                    <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">样本信息</h3>
                  </template>
                  <div id="printInfo">
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本 ID：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.num" placeholder="请输入样本 id" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本浓度：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.concentration" placeholder="请输入样本浓度(g/ml)" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本数量：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.depositNum" placeholder="请输入样本数量" />
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本类型：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.type" placeholder="请输入样本类型" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本源 ID：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleSourceId" placeholder="请输入样本源 ID" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        溶液体积：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.volume" placeholder="请输入溶液体积(ml)" />
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        采集时间：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.acquisitionTime" placeholder="请输入采集时间" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        入库时间：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.storeTime" placeholder="请输入入库时间" />
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        样本区域<br/>大小(㎡)：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.area" placeholder="请输入样本区域大小" />
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                      安全级别：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.securityLevel" placeholder="请输入安全级别" />
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                      治疗信息：
                      <el-input style="width: 75%;" autosize type="textarea"
                        v-model.trim="data.sampleInfo.treatInfo" placeholder="请输入治疗信息"
                      />
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所属<br/>用户 ID：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.userId" placeholder="请输入用户 ID" disabled/>
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所在<br/>房间号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.roomNum" placeholder="请输入房间号" disabled/>
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所在<br/>冰箱号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.fridgeNum" placeholder="请输入冰箱号" disabled/>
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所属层号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.levelNum" placeholder="请输入层号" disabled/>
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所在<br/>区域号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.areaNum" placeholder="请输入区域号" disabled/>
                      </div>
                      <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                        所在<br/>盒子号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxNum" placeholder="请输入盒子号" disabled/>
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                      <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                        所在盒子里的行号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleRow" placeholder="请输入盒子里的行号" disabled/>
                      </div>
                      <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                        所在盒子里的列号：
                        <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleColumn" placeholder="请输入盒子里的列号" disabled/>
                      </div>
                    </div>
                    <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                      特例信息：
                      <el-input style="width: 75%;"
                        autosize type="textarea" v-model.trim="data.sampleInfo.specialInfo" placeholder="请输入特例信息"
                      />
                    </div>
                  </div>
                  <div style="display: flex; justify-content: flex-end;">
                    <el-button style="margin-right: 12px;" class="button"
                    @click="() => { data.sampleInnerVisible = true; }"
                    >确认</el-button>
                    <el-button style="margin-right: 12px;" class="button" @click="data.sampleInfoVisible=false">取消</el-button>
                  </div>
                </el-dialog>
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
#main {
  height: 300px;
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