<script setup>
import { Document, House, SwitchButton } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';

const inputId = ref('');
const chartRef = ref();
const chart = ref();
const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15',
      operation: '编辑',
    },
    {
      sampleId: '002',
      sampleType: 'DNA',
      tubeVolume: '5ml',
      date: '2023/03/15',
      operation: '编辑',
    },
    {
      sampleId: '003',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15',
      operation: '编辑',
    },
    {
      sampleId: '004',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15',
      operation: '编辑',
    },
    {
      sampleId: '005',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15',
      operation: '编辑',
    },
  ]
);

onMounted(
  () => {
    if (chartRef.value) {
      chart.value = echarts.init(chartRef.value);
      const xData = ['DNA', '血液', '尿液', '唾液', '汗液', '肝脏', '肺组织', '心脏', '血浆', '血清'];
      const yData = [188, 387, 260, 150, 230, 0, 0, 0, 0, 0];
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
            <RouterLink :to="{ path: '/my-storage' }">
              <el-icon><Document /></el-icon>
              <span>我的存储</span>
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
              </div>
              <div>
                <el-table
                  ref="multipleTableRef"
                  :data="tableData"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column property="sampleId" label="样本 ID" />
                  <el-table-column property="sampleType" label="样本类型"   />
                  <el-table-column property="tubeVolume" label="单管体积"   />
                  <el-table-column property="date" label="存入时间" />
                  <el-table-column property="operation" label="操作" />
                </el-table>
                <div style="display: flex; margin-top: 20px">
                  <el-pagination style="margin: 0 auto;" layout="prev, pager, next, jumper" :total="100" />
                </div>
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