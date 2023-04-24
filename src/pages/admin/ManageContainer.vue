<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search } from '@element-plus/icons-vue'
import { ref ,reactive, watch } from 'vue'
import { logout, sampleInfo } from '../../utils/index.js';
import { getContainerStorageInfo, getFridgeInfoByNum,
  addNewContainer, deleteSampleData, editSampleInfo,
  getSample, getBoxInfoByNum
} from '../../apis/admin';
import { ElMain, ElMessage } from 'element-plus';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  size: 5,
  boxId: '',
});

// 搜索信息
const searchInfo = reactive({
  num: '',
  roomNum: ''
});

// 根据页码，获取数据
const changeData = () => {
  getAllSamples();
};

const data = reactive({
  dialogTransferVisable: false,
  containerInfoVisible: false,
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
  sampleInfo: sampleInfo,
  containerInfo: {
    num: '',
    brand: '',
    type: '',
    model: '',
    deviceName: '',
    capacity: '',
    areaNum: '',
    boxNum: '',
    levelNum: '',
    roomNum: '',
    column: '',
    row: '',
    size: '',
    storageTemp: ''
  },
  menuInfo: [],
  sampleDatasets: [],
  total: 0
});

const containerShowInfo = reactive({
  roomNum: '',
  fridgeNum: '',
  levelNum: '',
  areaNum: '',
  boxNum: '',
  usageNumber: '',
  capacity: '',
  boxCapcity: '',
  boxUsageNumber: ''
});

// 获取侧边栏信息---，容器存储信息，房间号-冰箱编号-等
const getSiderBarInfo = () => {
  getContainerStorageInfo().then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        data.menuInfo = resData.data;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};
getSiderBarInfo();

// 根据盒号获取盒内样本数据
const getAllSamples = () => {
  const getObj = pageInfo;
  getSample(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: true, message: resData.msg, type: 'warning' });
        return;
      }
      data.sampleDatasets = resData.list;
      data.total = resData.total;
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 根据盒号获取盒内样本数据
const getSampleInfoDatasets = (room, fridge, level, area, boxNum) => {
  containerShowInfo.roomNum = room.num;
  containerShowInfo.fridgeNum = fridge.num;
  containerShowInfo.levelNum = level.num;
  containerShowInfo.areaNum = area.num;
  containerShowInfo.boxNum = boxNum;

  let getObj = { num: fridge.num, roomNum: room.num };
  getFridgeInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        containerShowInfo.usageNumber = resData.data.usageNumber;
        containerShowInfo.capacity = resData.data.capacity;
      } else {
        containerShowInfo.usageNumber = 0;
        containerShowInfo.capacity = 0;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  getObj = {
    fridgeNum: fridge.num,
    roomNum: room.num,
    areaNum: area.num,
    levelNum: level.num,
    num: boxNum
  };
  getBoxInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      const boxInfo = resData.list[0];
      containerShowInfo.boxCapcity = boxInfo.capacity;
      containerShowInfo.boxUsageNumber = boxInfo.capacity - boxInfo.surplus;

      pageInfo.boxId = boxInfo.id;
      getAllSamples();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 监听样本数据选中情况
const selectionChange = (selection) => {
  data.selectionSampleDataId = [];
  for (let key in selection) {
    data.selectionSampleDataId.push(selection[key].id);
  }
};

// 编辑样本信息
const editSampleInfoCard = (rowData) => {
  data.sampleInfoVisible = true;
  data.sampleInfo = rowData;
  data.roomNum = data.roomNum + '房';
  data.fridgeNum = data.roomNum + data.fridgeNum + '冰箱';
  data.levelNum = data.fridgeNum + data.levelNum + '层';
  data.areaNum = data.levelNum + data.areaNum + '区';
  data.boxNum = data.areaNum + data.boxNum + '盒';
};

// 发送样本编辑信息
const sendEditInfo = () => {
  const putObj = {
    id: data.sampleInfo.id,
    num: data.sampleInfo.num,
    concentration: data.sampleInfo.concentration,
    type: data.sampleInfo.type,
    acquisitionTime: data.sampleInfo.acquisitionTime,
    volume: data.sampleInfo.volume,
    securityLevel: data.sampleInfo.securityLevel,
    treatInfo: data.sampleInfo.treatInfo,
    userAccount: data.sampleInfo.userAccount,
    specialInfo: data.sampleDatasets.specialInfo,
    sampleSourceId: data.sampleDatasets.sampleSourceId
  };
  editSampleInfo(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        location.reload();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  data.sampleInfoVisible = false;
  getAllSamples();
};

const sideBar = ref(null);

// 根据冰箱编号，房间号搜索，展开侧边栏
const searchFridge = () => {
  if (searchInfo.roomNum === '') {
    ElMessage({ showClose: true, message: '请输入房间号 ~', type: 'warning' });
    return;
  } else if (searchInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入冰箱编号 ~', type: 'warning' });
    return;
  }

  let flag = false;
  const roomList = data.menuInfo;
  for (let i in roomList) {
    if (roomList[i].num === searchInfo.roomNum) {
      let tmp = i;
      tmp ++;
      let lastIdx = tmp + '-';
      const fridgeList = roomList[i].fridgeList;
      for (let j in fridgeList) {
        tmp = j;
        tmp ++;
        let idx = lastIdx + tmp;
        if (fridgeList[j].num === searchInfo.num) {
          sideBar.value.open(idx)
          flag = true;
        }
      }
    }
  }
  if (flag) {
    ElMessage({ showClose: true, message: '查询成功，对应设备在左侧菜单已展开 ~', type: 'success' });
  } else {
    ElMessage({ showClose: true, message: '查询失败，没有找到该设备 ~', type: 'error' });
  }
};

// 创建容器
const sendNewContainerInfo = () => {
  const postObj = {
    num: data.containerInfo.num,
    brand: data.containerInfo.brand,
    type: data.containerInfo.type,
    model: data.containerInfo.model,
    deviceName: data.containerInfo.deviceName,
    capacity: data.containerInfo.capacity,
    areaNum: data.containerInfo.areaNum,
    boxNum: data.containerInfo.boxNum,
    levelNum: data.containerInfo.levelNum,
    roomNum: data.containerInfo.roomNum,
    column: data.containerInfo.column,
    row: data.containerInfo.row,
    size: data.containerInfo.size,
    storageTemp: data.containerInfo.storageTemp
  }

  addNewContainer(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        ElMessage({ showClose: false, message: resData.msg, type: 'success' });
        data.containerInfoVisible = false;
        location.reload();
      } else {
        ElMessage({ showClose: false, message: '创建失败，请检查输入信息', type: 'error' });
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 批量删除样本数据
const sendDeleteSampleData = () => {
  const deleteData = { ids: data.selectionSampleDataId };
  if (deleteData.ids.length === 0) {
    ElMessage({ showClose: true, message: '请勾选要删除的样本 ~', type: 'warning' });
    return;
  }
  let deleteStr = '';
  for (let i = 0; i < deleteData.ids.length; i ++) {
    let tmp = '';
    if (i) {
      tmp = tmp + '&';
    }
    tmp = tmp + 'ids=' + deleteData.ids[i];
    deleteStr = deleteStr + tmp;
  }
  console.log(deleteStr);
  deleteSampleData(deleteStr).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      getAllSamples();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 创建容器时，监听数据变化，计算容量
watch(data.containerInfo, (info) => {
  info.capacity = info.levelNum * info.areaNum * info.boxNum * info.row * info.column;
});
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
            <RouterLink :to="{ path: '/admin' }">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </RouterLink>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="2">
            <el-icon><MessageBox /></el-icon>
            <span>容器管理</span>
          </el-menu-item>
          <el-menu-item class="menu-items items" index="3">
            <RouterLink :to="{ path: '/admin/manage-sample' }">
              <el-icon><Tickets /></el-icon>
              <span>样本管理</span>
            </RouterLink>
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
          <h2 class="title">容器管理</h2>
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
						<el-container class="layout-container-demo" style="height: 620px">
							<el-aside width="232px" style="background-color: rgb(255, 255, 255);">
								<el-scrollbar>
									<el-menu ref="sideBar" :unique-opened="true" :default-openeds="['']">
                    <el-sub-menu
                      v-for="(room, key) in data.menuInfo"
                      :key="key+1" :index="(key+1).toString()"
                    >
                      <template #title>
                        房间号 {{ room.num }}
                      </template>
                      <el-sub-menu
                        v-for="(fridge, key1) in room.fridgeList"
                        :key="key1" :index="(key+1).toString()+'-'+(key1+1).toString()"
                      >
                        <template #title>
                          冰箱号 {{ fridge.num }}
                        </template>
                        <el-sub-menu
                          v-for="(level, key2) in fridge.levelVoList"
                          :key="key2" :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()"
                        >
                          <template #title>
                            层号 {{ level.num }}
                          </template>
                          <el-sub-menu
                            v-for="(area, key3) in level.areaVoList"
                            :key="key3"
                            :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()+'-'
                                    +(key3+1).toString()"
                          >
                            <template #title>
                              区号 {{ area.num }}
                            </template>
                            <el-menu-item
                              v-for="(boxNum, key4) in area.boxVoList"
                              :key="key4"
                              :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()+'-'
                                      +(key3+1).toString()+'-'+(key4+1).toString()"
                              @click="getSampleInfoDatasets(room, fridge, level, area, boxNum)"
                            >
                              盒号 {{ boxNum }}
                            </el-menu-item>
                          </el-sub-menu>
                        </el-sub-menu>
                      </el-sub-menu>
                    </el-sub-menu>
									</el-menu>
								</el-scrollbar>
							</el-aside>
							<el-container>
                <el-main>
                  <div style="padding:10px 30px">
                    <section class="con-header">
                      <div style="margin-bottom: 26px;">
                        <label for="room-id">房间号：</label>
                        <el-input
                        id="room-id"
                        style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                        v-model.trim="searchInfo.roomNum"
                        placeholder="请输入房间号"
                        :suffix-icon="Search"
                        />
                        <label for="fridge-id">冰箱编号：</label>
                        <el-input
                          id="fridge-id"
                          style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                          v-model.trim="searchInfo.num"
                          placeholder="请输入冰箱编号"
                          :suffix-icon="Search"
                        />
                        <el-button class="button"
                          @click="searchFridge"
                        >搜索</el-button>
                        <el-button class="button" @click="data.containerInfoVisible=true">创建容器</el-button>
                      </div>
                      <div style="margin-bottom: 8px; font-size: 1.4rem;">
                        <strong>内置样品</strong>
                      </div>
                    </section>
                    <section style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span style="font-size: 13px; color: rgb(199, 199, 199);">
                        {{
                          `房间号 ${containerShowInfo.roomNum} > 冰箱 ${containerShowInfo.fridgeNum} > 
                          层号 ${containerShowInfo.levelNum} > 区号 ${containerShowInfo.areaNum} > 盒号 ${containerShowInfo.boxNum}`
                        }}
                      </span>
                      <span>
                        <strong style="font-size: 1.3rem; margin-right: 32px;">
                          {{ `冰箱容量：${containerShowInfo.usageNumber}/${containerShowInfo.capacity}` }}
                        </strong>
                        <strong style="font-size: 1.3rem;">
                          {{ `盒子容量：${containerShowInfo.boxUsageNumber}/${containerShowInfo.boxCapcity}` }}
                        </strong>
                      </span>
                    </section>
                    <section>
                      <el-table
                        ref="multipleTableRef"
                        :data="data.sampleDatasets"
                        @selection-change="selectionChange"
                        :border="true"
                        style="width: 100%; margin-bottom: 12px;"
                      >
                        <el-table-column type="selection" width="55" />
                        <el-table-column property="num" label="样本 ID" />
                        <el-table-column property="type" label="样本类型" />
                        <el-table-column property="concentration" label="样本浓度" />
                        <el-table-column property="volume" label="溶液体积(ml)" />
                        <el-table-column property="storeTime" label="存入时间" />
                        <el-table-column fixed="right" label="操作" width="120">
                          <template v-slot="scope" #default>
                            <el-button
                              link type="primary" size="small"
                              @click="editSampleInfoCard(scope.row)"
                            >编辑</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-popconfirm title="确认要删除这些样品吗 ？" @confirm="sendDeleteSampleData">
                        <template #reference>
                          <el-button style="margin-bottom: 16px;" class="button" type="danger" plain>批量删除</el-button>
                        </template>
                      </el-popconfirm>
                      <el-pagination
                        style="position: absolute; left: 50%;"
                        layout="total, prev, pager, next, jumper" :total="data.total"
                        :page-size="pageInfo.size"
                        v-model:current-page="pageInfo.currentPage"
                        @current-change="changeData"
                      />
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
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.concentration" placeholder="请输入样本浓度" />
                            </div>
                            <!-- <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              样本数量：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.depositNum" placeholder="请输入样本数量" />
                            </div> -->
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              样本类型：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.type" placeholder="请输入样本类型" />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              样本源 ID：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleSourceId" placeholder="请输入样本源 ID" />
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              溶液体积：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.volume" placeholder="请输入溶液体积(ml)" />
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              采集时间：
                              <el-date-picker
                                style="width: 166px" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                v-model.trim="data.sampleInfo.acquisitionTime" type="date" placeholder="请选择采集时间"
                              />
                              <!-- <el-input style="width: 166px;" v-model.trim="data.sampleInfo.acquisitionTime" placeholder="请输入采集时间" /> -->
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              入库时间：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.storeTime" placeholder="请输入入库时间"  disabled/>
                            </div>
                            <!-- <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              样本区域<br/>大小：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.occupy" placeholder="请输入样本区域大小" />
                            </div> -->
                          </div>
                          <div style="display: flex; flex-direction: row; align-items: center;">
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所属<br/>用户账号：
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.userAccount" placeholder="请输入用户账号" />
                            </div>
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              安全级别：
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.securityLevel" placeholder="请输入安全级别" />
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
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.roomNum" placeholder="请输入房间号" disabled />
                            </div>
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在<br/>冰箱号：
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.fridgeNum" placeholder="请输入冰箱号" disabled />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在<br/>的层号 ： 
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.levelNum" placeholder="请输入层号" disabled />
                            </div>
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在<br/>区域号：
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.areaNum" placeholder="请输入区域号" disabled />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在<br/>盒子号：
                              <el-input style="width: 236px;" v-model.trim="data.sampleInfo.boxNum" placeholder="请输入盒子号" disabled />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在盒子里的行号：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleRow" placeholder="请输入盒子里的行号" disabled />
                            </div>
                            <div style="width: 50%; margin: 0 26px 22px 0; align-items: center; display: flex;">
                              所在盒子里的列号：
                              <el-input style="width: 166px;" v-model.trim="data.sampleInfo.sampleColumn" placeholder="请输入盒子里的列号" disabled />
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
                          <el-popconfirm title="确认要修改这个样本信息吗 ？" @confirm="sendEditInfo">
                            <template #reference>
                              <el-button style="margin-right: 12px;" class="button">确认</el-button>
                            </template>
                          </el-popconfirm>
                          <el-button
                            style="margin-right: 12px;" class="button"
                            @click="data.sampleInfoVisible=false"
                          >取消</el-button>
                        </div>
                      </el-dialog>
                      <!-- 创建容器，信息弹框 -->
                      <el-dialog v-model.trim="data.containerInfoVisible" :close-on-click-modal="false">
                        <template #header>
                          <h3
                            style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                          >创建容器</h3>
                        </template>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            冰箱编号：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.num" placeholder="例，01" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>类型：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.type" placeholder="例，冰箱" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>品牌：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.brand" placeholder="请输入设备品牌" />
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>型号：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.model" placeholder="请输入型号" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>尺寸：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.size" placeholder="例，6" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>名称：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.deviceName" placeholder="请输入设备名称" />
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            存储<br>温度：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.storageTemp" placeholder="例，6℃" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            所在<br>房间号：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.roomNum" placeholder="例，01" />
                          </div>
                        </div>
                        <h3
                        style="border-bottom: 1px solid;  letter-spacing: .12rem; padding-bottom: 10px; margin-bottom: 16px;"
                        >设备内部结构</h3>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            层数：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.levelNum" placeholder="例，1" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            区数：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.areaNum" placeholder="例，1" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            盒子数：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.boxNum" placeholder="例，1" />
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            行数：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.row" placeholder="例，1" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            列数：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.column" placeholder="例，1" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>容量：
                            <el-input style="width: 166px;" v-model.trim="data.containerInfo.capacity" placeholder="" disabled/>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                          <el-button
                          style="margin-right: 12px;" class="button"
                          @click="sendNewContainerInfo"
                          >确认</el-button>
                          <el-button
                            style="margin-right: 12px;" class="button"
                            @click="data.containerInfoVisible = false"
                          >取消</el-button>
                        </div>
                     </el-dialog>
                    </section>
                  </div>
                </el-main>
              </el-container>
            </el-container>
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
.button:focus:not(.button:hover) {
  background-color: var(--el-button-bg-color);
  border-color: var(--el-button-border-color);
  color: var(--el-button-text-color);
};
</style>