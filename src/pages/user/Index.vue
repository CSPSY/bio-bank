<script setup>
import { Document, House, SwitchButton } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive } from 'vue';
import { getSample, getSampleTypeCnt, getSampleBySampleId } from '../../apis/user/index.js';
import { logout, sampleInfo } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  size: 5
});

// 根据页码，获取数据
const changeData = () => {
  getAllSamples();
};

const data = reactive({
  sampleInfoVisible: false,
  sampleInfo: sampleInfo,
  sampleTypeXData: [],
  sampleTypeYData: [],
  sampleDatasets: [],
  total: 0
});

// 获取样本数据
const getAllSamples = () => {
  const getObj = pageInfo;
  getSample(getObj).then(res => {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.code === 0) {
        ElMessage({ showClose: true, message: resData.msg, type: 'warning' });
        return;
      }
      data.sampleDatasets = resData.list;
      data.total = resData.total;
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};
getAllSamples();

// 获取样本类型统计
const getAllSamplesTypeCnt = () => {
  getSampleTypeCnt().then(res => {
    if (res.status === 200) {
      const resData = res.data;
      if (resData.code === 0) {
        ElMessage({ showClose: true, message: resData.msg, type: 'warning' });
        return;
      }
      for (let key in resData.data) {
        data.sampleTypeXData.push(resData.data[key].type);
        data.sampleTypeYData.push(resData.data[key].total);
      }
      setSampleTypeTable();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
}
getAllSamplesTypeCnt();

const chartRef = ref();
const chart = ref();

// 数据可视化
const setSampleTypeTable = () => {
  if (chartRef.value) {
    chart.value = echarts.init(chartRef.value);
    const xData = data.sampleTypeXData;
    const yData = data.sampleTypeYData;
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

// 搜索样本
const searchInfo = reactive({
  sampleNum: '',
  sampleType: ''
});

const searchSample = () => {
  if (searchInfo.sampleNum === '' && searchInfo.sampleType === '') {
    ElMessage({ showClose: true, message: '请在搜索框填写样本 ID 或样本类型 ~', type: 'warning' });
    return;
  }
  getSampleBySampleId(searchInfo).then(res => {
    if (res.status === 200) {
      const resData = res.data;
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.sampleDatasets = resData.data;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};

// 查看样本信息
const readSampleInfoCard = (rowData) => {
  data.sampleInfoVisible = true;
  data.sampleInfo = rowData;
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
                    v-model.trim="searchInfo.sampleNum"  
                    placeholder="请输入样本 id"
                  />
                  <label for="specimens-type">样本类型：</label>
                  <el-input
                    id="specimens-type"
                    style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                    v-model.trim="searchInfo.sampleType"
                    placeholder="请输入样本类型"
                  />
                  <el-button class="button" @click="searchSample">搜索</el-button>        
                </div>
              </div>
              <div>
                <el-table
                  ref="multipleTableRef"
                  :data="data.sampleDatasets"
                  :border="true"
                  style="width: 100%"
                >
                  <el-table-column property="num" label="样本 ID" />
                  <el-table-column property="type" label="样本类型" />
                  <el-table-column property="concentration" label="样本浓度(g/ml)" />
                  <el-table-column property="volume" label="溶液体积(ml)" />
                  <el-table-column property="storeTime" label="存入时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope" #default>
                      <el-button link type="primary" size="small" @click="readSampleInfoCard(scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="position: absolute; bottom: 3%; left: 41%;"
                  layout="total, prev, pager, next, jumper" :total="data.total"
                  v-model:current-page="pageInfo.currentPage"
                  @current-change="changeData"
                />
                <!-- 点击查看后，样本信息的弹窗 -->
                <el-dialog
                  style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                 v-model="data.sampleInfoVisible" :close-on-click-modal="false"
                >
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
                      >{{ data.sampleInfo.num }}</el-descriptions-item>
                      <el-descriptions-item label="样本浓度(g/ml)" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.concentration }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本数量" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.depositNum }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本类型" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.type }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本源 ID" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.sampleSourceId }}
                      </el-descriptions-item>
                      <el-descriptions-item label="溶液体积(ml)" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.volume }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本采集时间" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.acquisitionTime }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本入库时间" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.storeTime }}
                      </el-descriptions-item>
                      <el-descriptions-item label="样本区域大小(㎡)" label-align="left" align="center" width="120px"
                      >{{ data.sampleInfo.occupy }}
                      </el-descriptions-item>
                    <el-descriptions-item label="安全级别" label-align="left" align="center" width="120px"
                    >
                      <el-tag size="small">{{ data.sampleInfo.securityLevel }}</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="3" border>
                    <el-descriptions-item label="治疗信息" label-align="left" align="center" width="135px"
                    >{{ data.sampleInfo.treatInfo }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="3" border>
                    <el-descriptions-item label="所属用户 ID" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.userId }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在房间号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.roomNum }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在冰箱号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.fridgeNum }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在层号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.levelNum }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在区域号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.areaNum }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在盒子号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.boxNum }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在盒子里的行号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.sampleRow }}
                    </el-descriptions-item>
                    <el-descriptions-item label="所在盒子里的列号" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.sampleColumn }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions v-show="data.sampleInfo.specialInfo" :column="3" border>
                    <el-descriptions-item
                      label="特例样本" label-align="left" align="center" width="120px"
                    >{{ data.sampleInfo.specialInfo }}</el-descriptions-item>
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