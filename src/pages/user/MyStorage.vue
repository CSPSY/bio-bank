<script setup>
import { ref, reactive } from 'vue';
import { Document, House, SwitchButton, Search, Picture } from '@element-plus/icons-vue';
import { logout, sampleInfo, downloadFile } from '../../utils/index.js';
import { getSample } from '../../apis/user';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  size: 10
});

// 根据页码，获取数据
const changeData = () => {
  getAllSamples();
};

const data = reactive({
  sampleInfoVisible: false,
  sampleInfo: sampleInfo,
  sampleDatasets: [],
  ruleForm: {
    sampleConfig: []
  },
  total: 0
});

// 图片
const uploadFileInfo = reactive({
  imgUrlSample: '',
  imgSample: '',
});

// 获取样本数据
const getAllSamples = () => {
  const getObj = pageInfo;
  getObj.userAccount = userName.value;
  getSample(getObj).then(async res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: true, message: resData.msg, type: 'warning' });
        return;
      }
      data.sampleDatasets = resData.list;
      data.total = resData.total;
      for (let i = 0, len = data.sampleDatasets.length; i < len; i ++) {
        if (data.sampleDatasets[i].image) {
          const getObj = {
            name: data.sampleDatasets[i].image
          };
          data.sampleDatasets[i].imgUrl = await downloadFile(getObj);
        } else {
          data.sampleDatasets[i].imgUrl = '';
        }
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};
getAllSamples();

// 搜索样本
const searchInfo = reactive({
  sampleNum: '',
  sampleType: ''
});

const searchSample = () => {
  if (searchInfo.sampleNum === '' && searchInfo.sampleType === '') {
    ElMessage({ showClose: true, message: '请在搜索框填写样本编号或样本类型 ~', type: 'warning' });
    return;
  }
  if (searchInfo.sampleNum !== '') {
    pageInfo.num = searchInfo.sampleNum;
  } else {
    pageInfo.num = null;
  }
  if (searchInfo.sampleType !== '') {
    pageInfo.type = searchInfo.sampleType;
  } else {
    pageInfo.type = null;
  }
  pageInfo.userAccount = userName.value;
  getAllSamples();
};

// 查看样本信息
const readSampleInfoCard = (rowData) => {
  for (const [key, value] of Object.entries(rowData.specialInfo)) {
    data.ruleForm.sampleConfig.push({
      inputKey: key,
      inputValue: value
    });
  }
  data.sampleInfo = rowData;
  uploadFileInfo.imgUrlSample = rowData.imgUrl;
  data.sampleInfoVisible = true;
};

// 关闭查看信息弹框
const closeSampleInfoCard = () => {
  data.sampleInfoVisible = false;
  data.sampleInfo = sampleInfo;
  data.ruleForm.sampleConfig = [];
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
                  <label for="specimens-id">样本编号：</label>
                  <el-input
                    id="specimens-id"
                    style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                    v-model="searchInfo.sampleNum"  
                    placeholder="请输入样本编号"
                    :suffix-icon="Search"
                  />
                  <label for="specimens-type">样本类型：</label>
                  <el-input
                    id="specimens-type"
                    style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                    v-model="searchInfo.sampleType"
                    placeholder="请输入样本类型"
                    :suffix-icon="Search"
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
                  <el-table-column property="num" label="样本编号" />
                  <el-table-column property="type" label="样本类型" />
                  <el-table-column property="amount" label="样本数量" />
                  <el-table-column property="alertThreshold" label="样本阈值" />
                  <el-table-column property="acquisitionTime" label="采集时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope" #default>
                      <el-button link type="primary" size="small" @click="readSampleInfoCard(scope.row)">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="position: absolute; bottom: 3%; left: 41%;"
                  layout="total, prev, pager, next, jumper" :total="data.total"
                  :page-size="pageInfo.size"
                  v-model:current-page="pageInfo.currentPage"
                  @current-change="changeData"
                />
                <!-- 点击查看后，样本信息的弹窗 -->
                <el-dialog
                  style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                  v-model="data.sampleInfoVisible" :close-on-click-modal="false"
                  :before-close="closeSampleInfoCard"
                >
                  <template #header>
                    <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">操作信息</h3>
                  </template>
                  <el-card shadow="never">
                    <el-upload
                      action="#"
                      :show-file-list="false"
                      :auto-upload="false"
                      :multiple="false"
                      drag
                      accept="image/jpg, image/jpeg, image/png"
                      style="width: 98%; margin-bottom: 22px; height: 140px;"
                      :disabled="true"
                    >
                      <img
                        style="height: 100px;"
                        v-if="uploadFileInfo.imgUrlSample" :src="uploadFileInfo.imgUrlSample" class="el-upload--picture-car"
                      />
                      <div v-else>
                        <el-icon style="font-size: 40px"><Picture /></el-icon>
                        <div>无样本图片</div>
                      </div>
                    </el-upload>
                    <div style="margin-bottom: 6px; word-break: break-all;">样本编号：{{ data.sampleInfo.num }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">操作类型：{{ data.sampleInfo.type }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">样本数量：{{ data.sampleInfo.amount }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">预警阈值：{{ data.sampleInfo.alertThreshold }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">采集时间：{{ data.sampleInfo.acquisitionTime }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在房间号：{{ data.sampleInfo.roomNum }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在设备号：{{ data.sampleInfo.fridgeNum }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在层号：{{ data.sampleInfo.levelNum }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在区域号：{{ data.sampleInfo.areaNum }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在盒子号：{{ data.sampleInfo.boxNum }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在盒子里的行号：{{ data.sampleInfo.boxRow }}</div>
                    <div style="margin-bottom: 6px; word-break: break-all;">所在盒子里的列号：{{ data.sampleInfo.boxColumn }}</div>
                    <div
                      style="margin-bottom: 6px; word-break: break-all;"
                      v-for="(item, index) in data.ruleForm.sampleConfig"
                      :key="item.inputKey"
                    >
                      {{ item.inputKey + '：' + item.inputValue }}
                    </div>
                  </el-card>
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
:deep(.el-upload .el-upload-dragger) {
  /* width: 100%; */
  padding: 20px 10px;
}
.deleteImg {
  font-size: 30px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
}
.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>