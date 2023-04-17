<script setup>
import { reactive, ref } from 'vue';
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search } from '@element-plus/icons-vue';
import printJS from 'print-js';
import { logout, sampleInfo } from '../../utils/index.js';
import { getAllFridges, addNewSample, editFridge } from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';
import { judgeInputNull } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  size: 9
});

// 根据页码，获取数据
const changeData = () => {
  getAllFridgesInfo();
};

const data = reactive({
  searchId: '',
  containerInfoVisible: false,
  sampleInfoVisible: false,
  sampleInnerVisible: false,
  container: {
    num: '',
    roomNum: '',
    capacity: '',
    size: '',
    storageTemp: '',
    deviceName: '',
    model: '',
    type: '',
    brand: '',
    buildTime: '',
    usageNumber: ''
  },
  fridgeDatasets: [],
  sampleInfo: sampleInfo,
  total: 0
});

// 获取所有冰箱数据
const getAllFridgesInfo = () => {
  const getObj = pageInfo;
  getAllFridges(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: false, message: resData.msg, type: 'error' });
      } else {
        data.fridgeDatasets = resData.list;
        data.total = resData.total;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
  // 刷新存入样本信息输入值
  for (let key in data.sampleInfo) {
    data.sampleInfo[key] = '';
  }
};
getAllFridgesInfo();

// 搜索冰箱
const sendSearchInfo = () => {
  if (data.searchId === '') {
    ElMessage({ showClose: true, message: '请输入冰箱 ID ~', type: 'warning' });
    return;
  }
  pageInfo.num = data.searchId;
  getAllFridgesInfo();
};

// 存入样本
const sendNewSampleInfo = () => {
  if (data.sampleInfo.num === '') {
    ElMessage({ showClose: true, message: '请填写样本 ID ~', type: 'warning' });
    return;
  } else if (data.sampleInfo.volume === '') {
    ElMessage({ showClose: true, message: '请填写溶液体积 ~', type: 'warning' });
    return;
  } else if (data.sampleInfo.type === '') {
    ElMessage({ showClose: true, message: '请填写样本类型 ~', type: 'warning' });
    return;
  }
  const postObj = {
    num: data.sampleInfo.num,
    concentration: data.sampleInfo.concentration,
    type: data.sampleInfo.type,
    acquisitionTime: data.sampleInfo.acquisitionTime,
    depositNum: data.sampleInfo.depositNum,
    volume: data.sampleInfo.volume,
    areaNum: data.sampleInfo.areaNum,
    securityLevel: data.sampleInfo.securityLevel,
    roomNum: data.sampleInfo.roomNum,
    fridgeNum: data.sampleInfo.fridgeNum,
    levelNum: data.sampleInfo.levelNum,
    occupy: data.sampleInfo.occupy,
    boxNum: data.sampleInfo.boxNum,
    sampleRow: data.sampleInfo.sampleRow,
    sampleColumn: data.sampleInfo.sampleColumn,
    treatInfo: data.sampleInfo.treatInfo
  };
  if (data.sampleInfo.specialInfo !== '') {
    postObj.specialInfo = data.sampleInfo.specialInfo;
  }
  if (data.sampleInfo.userId !== '') {
    postObj.userId = data.sampleInfo.userId;
  }
  if (judgeInputNull(postObj)) {
    return;
  }
  
  addNewSample(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.sampleInnerVisible = true;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};

// 存入样本，打印存入样本信息
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

// 查看，编辑冰箱信息
const containerInfoCard = (info) => {
  data.containerInfoVisible = true;
  data.container = info;
};

// 修改冰箱信息
const sendEditFridgeInfo = () => {
  const putObj = {
    id: data.container.id,
    num: data.container.num,
    roomNum: data.container.roomNum,
    capacity: data.container.capacity,
    size: data.container.size,
    storageTemp: data.container.storageTemp,
    deviceName: data.container.deviceName,
    model: data.container.model,
    type: data.container.type,
    brand: data.container.brand
  }
  if (putObj.num === '') {
    ElMessage({ showClose: true, message: '请填写设备 ID ~', type: 'warning' });
    return;
  } else if (putObj.type === '') {
    ElMessage({ showClose: true, message: '请填写设备类型 ~', type: 'warning' });
    return;
  } else if (putObj.capacity === '') {
    ElMessage({ showClose: true, message: '请填写设备容量 ~', type: 'warning' });
    return;
  } else if (putObj.size === '') {
    ElMessage({ showClose: true, message: '请填写设备尺寸 ~', type: 'warning' });
    return;
  }
  if (judgeInputNull(putObj)) {
    return;
  }
  editFridge(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.containerInfoVisible = false;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  });
};

// 删除冰箱
const deleteFridge = () => {

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
          <el-sub-menu class="menu-items items" index="4">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span class="items">系统管理</span>
            </template>
            <el-menu-item class="menu-items items" index="4-1">
              <RouterLink :to="{ path: '/admin/manage-auth' }">
                <el-icon><Tickets /></el-icon>
                <span>权限管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <RouterLink :to="{ path: '/admin/manage-backup'}">
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
                <el-button class="button" @click="sendSearchInfo">搜索冰箱</el-button>
              </div>
              <div>
                <el-button class="button" @click="data.sampleInfoVisible=true">存入样本</el-button>
              </div>
            </div>
            <div style="padding: 16px 0;">
              <el-row>
                <el-col
                  v-for="(o, index) in data.fridgeDatasets.length"
                  :key="o"
                  :span="6"
                  :offset="index % 3 ? 3 : 0"
                  style="margin-bottom: 22px;"
                >
                  <el-card style="height: 166px; cursor: pointer;"
                    :body-style="{ padding: '0px 12px', display: 'flex', alignItems: 'center', height: '100%', fontSize: '14px' }"
                    @click="containerInfoCard(data.fridgeDatasets[index])"
                  >
                    <img
                      src="../../assets/imgs/冰箱.png"
                      style="width: 120px; padding: 0 6px;"
                    />
                    <div style="padding: 14px;">
                      <div style="margin-bottom: 5px; ">冰箱 ID：<span>{{ data.fridgeDatasets[index].num }}</span></div>
                      <div style="margin-bottom: 5px; ">设备类型：<span>{{ data.fridgeDatasets[index].type }}</span></div>
                      <div style="margin-bottom: 5px; ">冰箱型号：<span>{{ data.fridgeDatasets[index].model }}</span></div>
                      <div style="margin-bottom: 5px; ">
                        所在冰箱温度：<span>{{ data.fridgeDatasets[index].storageTemp }}
                          <!-- ℃ -->
                        </span>
                      </div>
                      <div style="margin-bottom: 5px; ">所在冰箱容量：<span>{{ data.fridgeDatasets[index].capacity }}</span></div>
                      <div style="margin-bottom: 5px; ">所在房间号：<span>{{ data.fridgeDatasets[index].roomNum }}</span></div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-pagination
                style="position: absolute; bottom: 3%; left: 41%;"
                layout="total, prev, pager, next, jumper" :total="data.total"
                :page-size="pageInfo.size"
                v-model:current-page="pageInfo.currentPage"
                @current-change="changeData"
              />
              <!-- 点击冰箱，冰箱信息弹框 -->
              <el-dialog v-model.trim="data.containerInfoVisible" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">冰箱信息</h3>
                </template>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备 ID：
                    <el-input style="width: 166px;" v-model.trim="data.container.num" placeholder="请输入设备 id" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    房间号：
                    <el-input style="width: 166px;" v-model.trim="data.container.roomNum" placeholder="请输入房间号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    容量：
                    <el-input style="width: 166px;" v-model.trim="data.container.capacity" placeholder="请输入容量" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备名称：
                    <el-input style="width: 166px;" v-model.trim="data.container.deviceName" placeholder="请输入设备名称" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备尺寸：
                    <el-input style="width: 166px;" v-model.trim="data.container.size" placeholder="请输入设备尺寸" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    存储温度：
                    <el-input style="width: 166px;" v-model.trim="data.container.storageTemp" placeholder="请输入存储温度" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备型号：
                    <el-input style="width: 166px;" v-model.trim="data.container.model" placeholder="请输入设备型号" />
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
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    建立时间：
                    <el-input style="width: 166px;" v-model.trim="data.container.buildTime" placeholder="请输入建立时间" disabled />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    已用容量：
                    <el-input style="width: 166px;" v-model.trim="data.container.size" placeholder="请输入已用容量" disabled />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin: 22px 16px 0 0;">
                  <el-button
                    style="margin-right: 12px;" class="button" type="primary" plain
                    @click="sendEditFridgeInfo"
                  >确认修改</el-button>
                  <el-popconfirm title="确认要删除这些样品吗 ？" @confirm="deleteFridge">
                    <template #reference>
                      <el-button style="margin-right: 12px;" class="button" type="danger" plain>删除</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button
                    style="margin-right: 12px;" class="button"
                    @click="data.containerInfoVisible = false"
                  >取消</el-button>
                </div>
              </el-dialog>
              <!-- 存入样本，样本信息弹框 -->
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
                      样本区域<br/>大小：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.occupy" placeholder="请输入样本区域大小" />
                    </div>
                    <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                      安全<br/>级别：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.securityLevel" placeholder="请输入安全级别" />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 22px;">
                    治疗信息：
                    <el-input style="width: 75%;" autosize type="textarea"
                      v-model.trim="data.sampleInfo.treatInfo" placeholder="请输入治疗信息"
                    />
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在<br/>房间号：
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.roomNum" placeholder="请输入房间号" />
                    </div>
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在<br/>冰箱号：
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.fridgeNum" placeholder="请输入冰箱号" />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在<br/>的层号 ： 
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.levelNum" placeholder="请输入层号" />
                    </div>
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在<br/>区域号：
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.areaNum" placeholder="请输入区域号" />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所属<br/>用户 ID：
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.userId" placeholder="请输入用户 ID" />
                    </div>
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在<br/>盒子号：
                      <el-input style="width: 236px;" v-model.trim="data.sampleInfo.boxNum" placeholder="请输入盒子号" />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在盒子里的行号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleRow" placeholder="请输入盒子里的行号" />
                    </div>
                    <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                      所在盒子里的列号：
                      <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleColumn" placeholder="请输入盒子里的列号" />
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
                  @click="sendNewSampleInfo"
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