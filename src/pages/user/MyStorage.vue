<script setup>
import { ref, reactive } from 'vue';
import { Document, House, SwitchButton } from '@element-plus/icons-vue';
import { logout } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

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
      sampleType: '污水',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '004',
      sampleType: '血液',
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
    {
      sampleId: '006',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '007',
      sampleType: 'DNA',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '008',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '009',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
    {
      sampleId: '010',
      sampleType: '血液',
      sampleDensity: '3',
      tubeVolume: '5',
      date: '2023/03/15'
    },
  ]
);

const data = reactive({
  sampleInfoVisible: false,
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



const inputId = ref('')

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
          default-active="2"
        >
          <div class="title-tag">
            <el-tag :disable-transitions="true" class="title">生物样本库</el-tag>
          </div>
          <el-menu-item class="menu-items items" index="1">
            <RouterLink :to="{ path: '/user' }">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </RouterLink>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="2">
            <el-icon><Document /></el-icon>
            <span>我的存储</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 顶部 -->
        <el-header class="header">
          <h2 class="title">我的存储</h2>
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
                  <el-table-column property="sampleType" label="样本类型" />
                  <el-table-column property="sampleDensity" label="样本浓度(g/ml)" />
                  <el-table-column property="tubeVolume" label="溶液体积(ml)" />
                  <el-table-column property="date" label="存入时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template #default>
                      <el-button link type="primary" size="small" @click="changeSampleDialog">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination style="position: absolute; bottom: 5%; left: 43%;" layout="prev, pager, next, jumper" :total="100" />
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