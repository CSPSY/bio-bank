<script setup>
import { reactive, ref, watch } from 'vue';
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search, User, Folder, Close, Picture } from '@element-plus/icons-vue';
import printJS from 'print-js';
import { logout, sampleInfo, createFile, downloadFile, uploadFile } from '../../utils/index.js';
import {
  getAllFridges, addNewSample, editFridge,
  deleteFridge, selectByAlert, getAlertSamples
} from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';
import { judgeInputNull } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const userInfo = localStorage.getItem('userInfo');
if (userInfo) {
  userName.value = JSON.parse(userInfo).accountInfo;
}

const judgeSamplesAlert = () => {
  const getObj = {
    currentPage: 1,
    size: 5
  }
  getAlertSamples(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.list.length !== 0) {
        ElMessage({ showClose: true, message: '当前有样本超过阈值，请去样本管理页面查看！！', type: 'warning' });
      }
    }
  }).catch(err => {
    console.log(err);
  });
};

const judgeFridgeAlert = () => {
  selectByAlert().then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.data.length !== 0) {
        ElMessage({ showClose: true, message: '当前有设备超过阈值，请去系统监控页面查看！！', type: 'warning' });
      }
      judgeSamplesAlert();
    }
  }).catch(err => {
    console.log(err);
  });
};
judgeFridgeAlert();

// 页码信息
const pageInfo = reactive({
  currentPage: 1,
  pageSize: 9
});

// 根据页码，获取数据
const changeData = () => {
  getAllFridgesInfo();
};

const data = reactive({
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
  // 新增行数据
  ruleForm: {
    sampleConfig: []
  },
  total: 0
});

// 搜索信息
const searchInfo = reactive({
  num: '',
  roomNum: ''
});

// 获取所有设备数据
const getAllFridgesInfo = () => {
  const getObj = pageInfo;
  getAllFridges(getObj).then(async res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: false, message: resData.msg, type: 'error' });
      } else {
        data.fridgeDatasets = resData.list;
        data.total = resData.total;
        for (let i = 0; i < data.fridgeDatasets.length; i ++) {
          if (data.fridgeDatasets[i].image) {
            const getObj = {
              name: data.fridgeDatasets[i].image
            };
            data.fridgeDatasets[i].imgUrl = await downloadFile(getObj);
          } else {
            data.fridgeDatasets[i].imgUrl = '';
          }
        }
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  // 刷新存入样本信息输入值
  for (let key in data.sampleInfo) {
    data.sampleInfo[key] = '';
  }
};
getAllFridgesInfo();

// 搜索设备
const sendSearchInfo = () => {
  if (searchInfo.roomNum === '' && searchInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入房间号或设备编号 ~', type: 'warning' });
    return;
  }
  const getObj = {
    currentPage: 1,
    pageSize: 9
  };
  if (searchInfo.roomNum !== '') {
    getObj.roomNum = searchInfo.roomNum;
  } else {
    getObj.roomNum = null;
  }
  if (searchInfo.num !== '') {
    getObj.num = searchInfo.num;
  } else {
    getObj.num = null;
  }
  getAllFridges(getObj).then(async res => {
    const resData = res.data;
    if (res.status === 200) {
      data.total = resData.total;
      if (resData.total === 0) {
        ElMessage({ showClose: true, message: '查询失败 ~', type: 'warning' });
      } else {
        ElMessage({ showClose: true, message: '查询成功 ~', type: 'success' });
        data.fridgeDatasets = resData.list;
        for (let i = 0; i < data.fridgeDatasets.length; i ++) {
          if (data.fridgeDatasets[i].image) {
            const getObj = {
              name: data.fridgeDatasets[i].image
            };
            data.fridgeDatasets[i].imgUrl = await downloadFile(getObj);
          } else {
            data.fridgeDatasets[i].imgUrl = '';
          }
        }
      }
    }
  }).catch(err => {
    console.log(err);
  });
};

// 存入样本
const sendNewSampleInfo = async () => {
  if (data.sampleInfo.num === '') {
    ElMessage({ showClose: true, message: '请填写样本编号 ~', type: 'warning' });
    return;
  }
  const postObj = {
    num: data.sampleInfo.num,
    type: data.sampleInfo.type,
    acquisitionTime: data.sampleInfo.acquisitionTime,
    areaNum: data.sampleInfo.areaNum,
    roomNum: data.sampleInfo.roomNum,
    fridgeNum: data.sampleInfo.fridgeNum,
    levelNum: data.sampleInfo.levelNum,
    boxNum: data.sampleInfo.boxNum,
    sampleRow: data.sampleInfo.sampleRow,
    sampleColumn: data.sampleInfo.sampleColumn,
    userAccount: data.sampleInfo.userAccount,
    amount: data.sampleInfo.amount,
    alertThreshold: data.sampleInfo.alertThreshold
  };

  if (judgeInputNull(postObj)) {
    return;
  }

  postObj.specialInfo = {};
  const sampleConfig = data.ruleForm.sampleConfig;
  for (let i = 0, len = sampleConfig.length; i < len; i ++) {
    if (sampleConfig[i].inputKey !== '') {
        postObj.specialInfo[sampleConfig[i].inputKey] = sampleConfig[i].inputValue;
    }
  }

  // 上传图片
  await (async () => {
    if (uploadFileInfo.imgSample) {
      const postObj1 = {
        file: uploadFileInfo.imgSample
      };
      const imageName = await uploadFile(postObj1);
      if (imageName === '') {
        ElMessage({ showClose: true, message: '图片上传失败 ~', type: 'error' });
      } else {
        postObj.image = imageName;
      }
    } else {
      postObj.image = '';
    }
  })();
  
  data.ruleForm.sampleConfig = [];
  addNewSample(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.sampleInnerVisible = true;
      }
    } else {
      ElMessage({ showClose: false, message: '存入失败 ~', type: 'error' });
    }
  }).catch(err => {
    console.log(err);
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
  data.sampleInnerVisible = false;
  closeNewSampleInfoCard();
};

// 查看，编辑设备信息
const containerInfoCard = (info) => {
  data.containerInfoVisible = true;
  data.container = info;
  if (info.imgUrl === 'undefined') {
    info.imgUrl = '';
  }
  uploadFileInfo.imgUrlContainer = info.imgUrl;
};

// 修改设备信息
const sendEditFridgeInfo = async () => {
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

  // 上传图片
  await (async () => {
    if (uploadFileInfo.imgContainer) {
      const postObj1 = {
        file: uploadFileInfo.imgContainer
      };
      const imageName = await uploadFile(postObj1);
      if (imageName === '') {
        ElMessage({ showClose: true, message: '图片上传失败 ~', type: 'error' });
      } else {
        putObj.image = imageName;
      }
      handleRemoveImg();
    } else if (uploadFileInfo.imgUrlContainer) {
      putObj.image = data.container.image;
    } else {
      putObj.image = '';
    }
  })();


  // 发送编辑信息
  editFridge(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.containerInfoVisible = false;
        getAllFridgesInfo();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  
  uploadFileInfo.imgContainer = '';
  uploadFileInfo.imgUrlContainer = '';
};

// 删除设备
const sendDleteFridgeInfo = (id) => {
  deleteFridge(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.containerInfoVisible = false;
        getAllFridgesInfo();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 设备类型选择
const containerTypeOptions = [
  {
    value: '冰箱',
    label: '冰箱',
  },
  {
    value: '柜子',
    label: '柜子',
  },
  {
    value: '箱子',
    label: '箱子',
  }
];

// 回车跳到下一输入框
const refItems = reactive([]);

const setItemRef = (el) => {
  refItems.push(el);
};

const focusNextInput = (nextRefIdx) => {
  refItems[nextRefIdx].focus();
};

// 上传图片
const uploadFileInfo = reactive({
  imgUrlContainer: '',
  imgContainer: '',
  imgUrlSample: '',
  imgSample: '',
});

const uploadImg = (file) => {
  const imgFile = createFile(file);
  if (imgFile) {
    uploadFileInfo.imgContainer = imgFile.raw;
    uploadFileInfo.imgUrlContainer = URL.createObjectURL(imgFile.raw);
  }
};

const uploadImgSample = (file) => {
  const imgFile = createFile(file);
  if (imgFile) {
    uploadFileInfo.imgSample = imgFile.raw;
    uploadFileInfo.imgUrlSample = URL.createObjectURL(imgFile.raw);
  }
};

// 移除图片
const handleRemoveImg = () => {
  uploadFileInfo.imgUrlContainer = '';
  uploadFileInfo.imgContainer = '';
  uploadFileInfo.imgSample = '';
  uploadFileInfo.imgUrlSample = '';
};

// 新增行数据
const addSampleConfig = () => {
  data.ruleForm.sampleConfig.push({
    inputKey: '',
    inputValue: ''
  })
};

// 删除行数据
const removeSampleConfig = (item) => {
  const index = data.ruleForm.sampleConfig.indexOf(item)
  if (index !== -1) {
    data.ruleForm.sampleConfig.splice(index, 1)
  }
};

// 关闭打印卡
const closePrintInfoCard = () => {
  data.sampleInnerVisible = false;
  closeNewSampleInfoCard();
};

// 关闭输入框
const closeNewSampleInfoCard = () => {
  data.sampleInfoVisible = false;
  data.sampleInfo = sampleInfo;
  data.ruleForm.sampleConfig = [];
  handleRemoveImg();
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
                <el-icon><User /></el-icon>
                <span>权限管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-2">
              <RouterLink :to="{ path: '/admin/manage-backup'}">
                <el-icon><Folder /></el-icon>
                <span>备份管理</span>
              </RouterLink>
            </el-menu-item>
            <el-menu-item class="menu-items items" index="4-3">
              <RouterLink :to="{ path: '/admin/manage-log'}">
                <el-icon><Tickets /></el-icon>
                <span>日志管理</span>
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
                <label for="room-id">房间号：</label>
                <el-input
                  id="room-id"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="searchInfo.roomNum"  
                  placeholder="请输入房间号"
                  :suffix-icon="Search"
                  />
                <label for="fridge-id">设备编号：</label>
                <el-input
                  id="fridge-id"
                  style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                  v-model="searchInfo.num"  
                  placeholder="请输入设备编号"
                  :suffix-icon="Search"
                />
                  <el-button class="button" @click="sendSearchInfo">搜索设备</el-button>
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
                      :src="data.fridgeDatasets[index].imgUrl"
                      alt="无设备图片"
                      style="width: 120px; padding: 0 6px;"
                    />
                    <div style="padding: 14px;">
                      <div style="margin-bottom: 5px; ">编号：<span>{{ data.fridgeDatasets[index].num }}</span></div>
                      <div style="margin-bottom: 5px; ">
                        类型：<span>{{ data.fridgeDatasets[index].type }}</span>
                      </div>
                      <div style="margin-bottom: 5px; ">型号：<span>{{ data.fridgeDatasets[index].model }}</span></div>
                      <div style="margin-bottom: 5px; ">
                        容量：
                        <span>
                          {{ `${data.fridgeDatasets[index].usageNumber}/${data.fridgeDatasets[index].capacity}` }}
                        </span>
                      </div>
                      <div style="margin-bottom: 5px; ">所在房间号：<span>{{ data.fridgeDatasets[index].roomNum }}</span></div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-pagination
                style="position: absolute; bottom: 3%; left: 41%;"
                layout="total, prev, pager, next, jumper" :total="data.total"
                :page-size="pageInfo.pageSize"
                v-model:current-page="pageInfo.currentPage"
                @current-change="changeData"
              />
              <!-- 点击设备，设备信息弹框 -->
              <el-dialog v-model="data.containerInfoVisible" :close-on-click-modal="false">
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">设备信息</h3>
                </template>
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :multiple="false"
                  :on-change="uploadImg"
                  drag
                  accept="image/jpg, image/jpeg, image/png"
                  style="width: 98%; margin-bottom: 32px; height: 140px;"
                >
                  <el-icon
                    v-if="uploadFileInfo.imgUrlContainer" class="el-icon-circle-close deleteImg" @click.stop="handleRemoveImg"
                  ><Close /></el-icon>
                  <img
                    style="height: 100px;"
                    v-if="uploadFileInfo.imgUrlContainer" :src="uploadFileInfo.imgUrlContainer" class="el-upload--picture-car"
                  />
                  <div v-else>
                    <el-icon style="font-size: 40px"><Picture /></el-icon>
                    <div>上传图片</div>
                    <div>格式为 png、jpeg 或 jpg</div>
                    <div>图片不能太大，太大会上传失败 ~</div>
                  </div>
                </el-upload>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备编号：
                    <el-input style="width: 166px;" v-model="data.container.num" placeholder="例，01" disabled/>
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    房间号：
                    <el-input style="width: 166px;" v-model="data.container.roomNum" placeholder="例，01" disabled/>
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    容量：
                    <el-input style="width: 166px;" v-model="data.container.capacity" placeholder="请输入容量" disabled/>
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备名称：
                    <el-input style="width: 166px;" v-model="data.container.deviceName" placeholder="请输入设备名称" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备尺寸：
                    <el-input style="width: 166px;" v-model="data.container.size" placeholder="请输入设备尺寸" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    存储温度：
                    <el-input style="width: 166px;" v-model="data.container.storageTemp" placeholder="请输入存储温度" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备型号：
                    <el-input style="width: 166px;" v-model="data.container.model" placeholder="请输入设备型号" />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备类型：
                    <el-select style="width: 166px;" v-model="data.container.type" disabled>
                      <el-option v-for="item in containerTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    设备品牌：
                    <el-input style="width: 166px;" v-model="data.container.brand" placeholder="请输入品牌" />
                  </div>
                </div>
                <div style="display: flex; flex-direction: row;">
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    建立时间：
                    <el-input style="width: 166px;" v-model="data.container.buildTime" placeholder="请输入建立时间" disabled />
                  </div>
                  <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                    已用容量：
                    <el-input style="width: 166px;" v-model="data.container.usageNumber" placeholder="请输入已用容量" disabled />
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin: 22px 16px 0 0;">
                  <el-popconfirm title="确认要修改设备为当前信息吗 ？" @confirm="sendEditFridgeInfo">
                    <template #reference>
                      <el-button style="margin-right: 12px;" class="button" type="primary" plain>确认修改</el-button>
                    </template>
                  </el-popconfirm>
                  <el-popconfirm title="确认要删除这个设备吗 ？" @confirm="sendDleteFridgeInfo(data.container.id)">
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
                v-model="data.sampleInfoVisible" :close-on-click-modal="false"
                :before-close="closeNewSampleInfoCard"
              >
                <template #header>
                  <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">样本信息</h3>
                </template>
                <div id="printInfo">
                  <div style="display: flex; flex-direction: row;">
                    <el-upload
                      action="#"
                      :show-file-list="false"
                      :auto-upload="false"
                      :multiple="false"
                      :on-change="uploadImgSample"
                      drag
                      accept="image/jpg, image/jpeg, image/png"
                      style="width: 40%; margin-bottom: 32px; height: 140px;"
                    >
                      <el-icon
                        v-if="uploadFileInfo.imgUrlSample" class="el-icon-circle-close deleteImg" @click.stop="handleRemoveImg"
                      ><Close /></el-icon>
                      <img
                        style="height: 100px; max-width: 100%;"
                        v-if="uploadFileInfo.imgUrlSample" :src="uploadFileInfo.imgUrlSample" class="el-upload--picture-car"
                      />
                      <div v-else>
                        <el-icon style="font-size: 40px"><Picture /></el-icon>
                        <div>上传样本图片</div>
                        <div>格式为 png、jpeg 或 jpg</div>
                        <div>图片不能太大，太大会上传失败 ~</div>
                      </div>
                    </el-upload>
                    <div style="display: flex; width: 60%; padding-left: 22px;">
                      <div style="width: 50%;">
                        <div style="margin-bottom: 22px; margin-right: 12px;">
                          编号：
                          <el-input
                            style="width: 166px;" v-model="data.sampleInfo.num" placeholder="请输入样本编号"
                            :ref="setItemRef" @keyup.native.enter="focusNextInput(3)"
                            @blur="() => { data.sampleInfo.num = data.sampleInfo.num.trim(); }"
                          />
                        </div>
                        <div style="margin-bottom: 22px;">
                          数量：
                          <el-input
                            style="width: 166px;" v-model="data.sampleInfo.amount" placeholder="请输入样本数量"
                            :ref="setItemRef" @keyup.native.enter="focusNextInput(4)"
                          />
                        </div>
                        <div style="margin-bottom: 22px; margin-right: 12px;">
                          时间：
                          <el-date-picker
                          style="width: 166px" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                          v-model="data.sampleInfo.acquisitionTime" type="date" placeholder="请选择采集时间"
                          :ref="setItemRef" @keyup.native.enter="focusNextInput(5)"
                          />
                        </div>
                      </div>
                      <div style="width: 50%;">
                        <div style="margin-bottom: 22px; margin-right: 12px;">
                          类型：
                          <el-input
                            style="width: 166px;" v-model="data.sampleInfo.type" placeholder="请输入样本类型"
                            :ref="setItemRef" @keyup.native.enter="focusNextInput(1)"
                          />
                        </div>
                        <div style="margin-bottom: 22px;">
                          阈值：
                          <el-input
                            style="width: 166px;" v-model="data.sampleInfo.alertThreshold" placeholder="请输入预警阈值"
                            :ref="setItemRef" @keyup.native.enter="focusNextInput(2)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所在<br/>房间号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.roomNum" placeholder="例，01"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(6)"
                      />
                    </div>
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所在<br/>设备号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.fridgeNum" placeholder="例，01"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(7)"
                      />
                    </div>
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所在<br/>的层号 ： 
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.levelNum" placeholder="例，01"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(8)"
                        />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所在<br/>区域号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.areaNum" placeholder="请例，01"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(9)"
                      />
                    </div>
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所在<br/>盒子号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.boxNum" placeholder="例，01"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(10)"
                      />
                    </div>
                    <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                      所属<br/>用户账号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.userAccount" placeholder="请输入用户账号"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(11)"
                      />
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: row;">
                    <div style="width: 50%; margin: 0 26px 20px 0; align-items: center; display: flex;">
                      所在盒子里的行号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.sampleRow" placeholder="例，1"
                        :ref="setItemRef" @keyup.native.enter="focusNextInput(12)"
                      />
                    </div>
                    <div style="width: 50%; margin: 0 26px 20px 0; align-items: center; display: flex;">
                      所在盒子里的列号：
                      <el-input
                        style="width: 166px;" v-model="data.sampleInfo.sampleColumn" placeholder="例，1"
                        :ref="setItemRef"
                      />
                    </div>
                  </div>
                  <div
                    style="display: flex; flex-direction: row;"
                    v-for="(item, index) in data.ruleForm.sampleConfig"
                    :key="index"
                  >
                    <div style="margin-bottom: 22px; align-items: center; display: flex;">
                      <el-input
                        style="width: 126px; margin-right: 13px;" autosize type="textarea"
                        v-model="item.inputKey" placeholder="名称"
                      />
                      <el-input
                        style="width: 366px; margin-right: 22px;" autosize type="textarea"
                        v-model="item.inputValue" placeholder="值"
                      />
                      <el-button class="button"
                        @click="removeSampleConfig(item)" type="danger" plain
                      >删除行</el-button>
                    </div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <el-button class="button"
                    @click="addSampleConfig"
                  >新增行</el-button>
                  <div>
                    <el-button style="margin-right: 12px;" class="button"
                      @click="sendNewSampleInfo"
                    >确认</el-button>
                    <el-button
                      style="margin-right: 12px;" class="button"
                      @click="closeNewSampleInfoCard"
                    >取消</el-button>
                  </div>
                </div>
              </el-dialog>
              <el-dialog
                v-model="data.sampleInnerVisible" width="30%" title="打印样品信息"
                :before-close="closePrintInfoCard"
                append-to-body
              >
                <div style="display: flex; justify-content: flex-end;">
                  <el-button
                    style="margin-right: 12px;" class="button"
                    @click="printSampleInfo"
                  >确认</el-button>
                  <el-button
                    style="margin-right: 12px;" class="button"
                    @click="closePrintInfoCard"
                  >取消</el-button>
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