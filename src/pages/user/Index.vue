<script setup>
import { Document, House, SwitchButton } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive, onMounted } from 'vue';

const inputId = ref('');
const chartRef = ref();
const chart = ref();
const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      sampleVolume: '50ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '002',
      sampleType: 'DNA',
      sampleDensity: '3g/ml',
      sampleVolume: '50ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '003',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      sampleVolume: '50ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '004',
      sampleType: '污水',
      sampleDensity: '3g/ml',
      sampleVolume: '50ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '005',
      sampleType: '血液',
      sampleDensity: '3g/ml',
      sampleVolume: '50ml',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
  ]
);

const data = reactive({
  sampleInfoVisible: false,
  sampleInfo: {
    id: '001',
    density: '5',
    type: '血液',
    volume: '5',
    gatherTime: '2023/03/15',
    addTime: '2023/03/16',
    fromType: '采集',
    sum: '12',
    remedyInfo: 'O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液',
    area: '12',
    safeLevel: '安全',
    userId: '01',
    roomId: '201',
    containerId: '002',
    layerId: '2',
    areaId: '3',
    boxId: '2',
    boxRowId: '1',
    boxColId: '4'
  }
});

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
const changeSampleDialog = () => {
  data.sampleInfoVisible = true;
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
                  :border="true"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column property="sampleId" label="样本 ID" />
                  <el-table-column property="sampleType" label="样本类型"   />
                  <el-table-column property="sampleDensity" label="样本浓度" />
                  <el-table-column property="sampleVolume" label="样本体积" />
                  <el-table-column property="tubeVolume" label="单管体积"   />
                  <el-table-column property="date" label="存入时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template #default>
                      <el-button link type="primary" size="small" @click="changeSampleDialog">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="display: flex; margin-top: 20px">
                  <el-pagination style="margin: 0 auto;" layout="prev, pager, next, jumper" :total="100" />
                </div>
                <!-- 点击查看后，样本信息的弹窗 -->
                <el-dialog v-model="data.sampleInfoVisible" :close-on-click-modal="false">
                  <template #header>
                    <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">样本信息</h3>
                  </template>
                    <el-descriptions :column="3" border>
                      <el-descriptions-item
                        label="样本 ID"
                        label-align="left"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        width="120px"
                      >{{ data.sampleInfo.id }}</el-descriptions-item>
                      <el-descriptions-item label="样本浓度" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.density }} g/ml
                      </el-descriptions-item>
                      <el-descriptions-item label="样本类型" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.type }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本体积" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.volume }} ml
                      </el-descriptions-item>
                      <el-descriptions-item label="样本采集时间" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.gatherTime }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本入库时间" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.addTime }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本源类型" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.fromType }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本区域大小" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.area }} ㎡
                      </el-descriptions-item>
                      <el-descriptions-item label="安全级别" label-align="left" align="center" width="120px"
                      >
                        <el-tag size="small">{{ data.sampleInfo.safeLevel }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="所属用户 ID" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.userId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在房间号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.roomId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在冰箱号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.containerId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在层号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.layerId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在区域号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.areaId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在盒子号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.boxId }}
                      </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions :column="2" border>
                      <el-descriptions-item label="所在盒子里的行号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.boxRowId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="所在盒子里的列号" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.boxColId }}
                      </el-descriptions-item>
                    </el-descriptions>
                    <el-descriptions :column="3" border>
                      <el-descriptions-item label="治疗信息" label-align="left" align="center" width="135px"
                      >{{ data.sampleInfo.remedyInfo }}
                      </el-descriptions-item>
                    </el-descriptions>
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