<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive, onMounted } from 'vue';

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
    id: '001',
    density: '3',
    type: '血液',
    gatherTime: '2023/03/15',
    addTime: '2023/03/16',
    tubeVolume: '5',
    fromType: '采集',
    sum: '12',
    area: '12',
    safeLevel: '安全',
    userId: '01',
    roomId: '201',
    containerId: '002',
    layerId: '2',
    areaId: '3',
    boxId: '2',
    boxRowId: '1',
    boxColId: '4',
    remedyInfo: 'O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液'
  }
});

const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '002',
      sampleType: 'DNA',
      sampleDensity: '3g/ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '003',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '004',
      sampleType: '污水',
      sampleDensity: '3g/ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '005',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      tubeVolume: '5ml',
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
          <h2 class="title">样本管理</h2>
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
            <div ref="chartRef" id="main"></div>
            <div id="container">
              <div class="con-header">
                <div>
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
                    <el-button class="button">搜索</el-button>        
                </div>
                <div>
                  <el-button class="button">出库</el-button>
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
                  <el-table-column property="sampleType" label="样本类型"   />
                  <el-table-column property="sampleDensity" label="样本浓度" />
                  <el-table-column property="tubeVolume" label="单管体积"   />
                  <el-table-column property="date" label="存入时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template #default>
                      <el-button link type="primary" size="small" @click="data.sampleInfoVisible=true">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="display: flex; margin-top: 20px">
                  <el-pagination style="margin: 0 auto;" layout="prev, pager, next, jumper" :total="100" />
                </div>
                <!-- 样本信息弹框 -->
                <el-dialog v-model.trim="data.sampleInfoVisible" :close-on-click-modal="false">
                  <template #header>
                    <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">样本信息</h3>
                  </template>
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
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.userId" placeholder="请输入用户 ID" disabled />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      所在<br/>房间号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.roomId" placeholder="请输入房间号" disabled />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      所在<br/>冰箱号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.containerId" placeholder="请输入冰箱号" disabled />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      所属层号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.layerId" placeholder="请输入层号" disabled />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      所在<br/>区域号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.areaId" placeholder="请输入区域号" disabled />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      所在<br/>盒子号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxId" placeholder="请输入盒子号" disabled />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在盒子里的行号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxRowId" placeholder="请输入盒子里的行号" disabled />
                    </div>
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在盒子里的列号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.boxColId" placeholder="请输入盒子里的列号" disabled />
                    </div>
                  </div>
                  <div style="display: flex; justify-content: flex-end;">
                    <el-button style="margin-right: 12px;" class="button">确认修改</el-button>
                    <el-button style="margin-right: 12px;" class="button" @click="data.sampleInfoVisible = false">取消</el-button>
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