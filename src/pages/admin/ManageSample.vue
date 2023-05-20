<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search, User, Folder, Close, Picture } from '@element-plus/icons-vue'
import * as echarts from 'echarts';
import { ref, reactive, watch } from 'vue';
import { logout, judgeInputNull, sampleInfo, createFile, uploadFile, downloadFile } from '../../utils/index.js';
import {
  getSample, getSampleTypeCnt, getAlertSamples,
  editSampleInfo, moveSampleArea, deleteSampleData
} from '../../apis/admin/index.js';
import { ElMessage } from 'element-plus';

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
  if (data.searchAlertFlag) {
    searchAlertSamples();
  } else {
    getAllSamples();
  }
};

const data = reactive({
  searchAlertFlag: false,

  moveSampleCardVisible: false,
  sampleInfoVisible: false,
  sampleInfoMove: {
    num: '',
    roomNum: '',
    fridgeNum: '',
    levelNum: '',
    areaNum: '',
    boxNum: '',
    sampleRow: '',
    sampleColumn: ''
  },
  sampleInfo: sampleInfo,
  ruleForm: {
    sampleConfig: []
  },
  sampleTypeXData: [],
  sampleTypeYData: [],
  sampleDatasets: [],
  selectionSampleDataId: [],
  total: 0
});

// 获取样本数据
const getAllSamples = async () => {
  data.ruleForm.sampleConfig = [];
  const getObj = pageInfo;
  console.log(getObj)
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

// 获取样本类型统计
const getAllSamplesTypeCnt = () => {
  getSampleTypeCnt().then(res => {
    const resData = res.data;
    if (res.status === 200) {
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
  }).catch(err => {
    console.log(err);
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
  data.searchAlertFlag = false;
  if (searchInfo.sampleNum === '' && searchInfo.sampleType === '') {
    ElMessage({ showClose: true, message: '请在搜索框填写样本编号 或样本类型 ~', type: 'warning' });
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
  getAllSamples();
};

// 编辑样本信息
const editSampleInfoCard = (rowData) => {
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

// 发送样本编辑信息
const sendEditInfo = async () => {
  if (data.sampleInfo.num === '') {
    ElMessage({ showClose: true, message: '请填写样本编号 ~', type: 'warning' });
    return;
  }
  const putObj = {
    id: data.sampleInfo.id,
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
  
  putObj.specialInfo = {};
  const sampleConfig = data.ruleForm.sampleConfig;
  for (let i = 0, len = sampleConfig.length; i < len; i ++) {
    if (sampleConfig[i].inputKey !== '') {
        putObj.specialInfo[sampleConfig[i].inputKey] = sampleConfig[i].inputValue;
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
        putObj.image = imageName;
      }
      handleRemoveImg();
    } else if (uploadFileInfo.imgUrlSample) {
      putObj.image = data.sampleInfo.image;
    } else {
      putObj.image = '';
    }
  })();
  
  editSampleInfo(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.sampleInfoVisible = false;
        closeEditSampleInfoCard();
        getAllSamples();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 移动样本存储的库位置信息
const sendMoveSampleArea = () => {
  const putObj = {
    num: data.sampleInfoMove.num,
    roomNum: data.sampleInfoMove.roomNum,
    fridgeNum: data.sampleInfoMove.fridgeNum,
    levelNum: data.sampleInfoMove.levelNum,
    areaNum: data.sampleInfoMove.areaNum,
    boxNum: data.sampleInfoMove.boxNum,
    sampleRow: data.sampleInfoMove.sampleRow,
    sampleColumn: data.sampleInfoMove.sampleColumn
  };
  if (putObj.num === '') {
    ElMessage({ showClose: true, message: '请填写样本编号 ~', type: 'warning' });
    return;
  }
  if (judgeInputNull(putObj)) {
    return;
  }

  moveSampleArea(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.moveSampleCardVisible = false;
      }
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
  imgUrlSample: '',
  imgSample: '',
});

const uploadImgSample = (file) => {
  const imgFile = createFile(file);
  if (imgFile) {
    uploadFileInfo.imgSample = imgFile.raw;
    uploadFileInfo.imgUrlSample = URL.createObjectURL(imgFile.raw);
  }
};

// 移除图片
const handleRemoveImg = () => {
  uploadFileInfo.imgSample = '';
  uploadFileInfo.imgUrlSample = '';
};

// 搜索低于阈值的样本
const searchAlertSamples = () => {
  data.searchAlertFlag = true;
  getAlertSamples(pageInfo).then(async res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code !== 0) {
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
        ElMessage({ showClose: true, message: '搜索低于阈值的样本失败 ~', type: 'error' });
      }
    }
  }).catch(err => {
    console.log(err);
  });
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

// 关闭编辑样本信息弹框
const closeEditSampleInfoCard = () => {
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
                <div>
                  <el-tooltip content="搜索低于阈值的样本" placement="bottom" effect="light">
                    <el-button class="button" @click="searchAlertSamples">搜索样本</el-button>
                  </el-tooltip>
                  <el-popconfirm title="确认要删除这些样本吗 ？" @confirm="sendDeleteSampleData">
                    <template #reference>
                      <el-button class="button">删除样本</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button class="button" @click="data.moveSampleCardVisible = true;">移库</el-button>
                  <!-- 移库后的弹窗 -->
                  <el-dialog v-model="data.moveSampleCardVisible" :close-on-click-modal="false">
                    <template #header>
                      <h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">移库</h3>
                    </template>
                    <div style="display: flex; align-items: center; font-size: 1.06rem; margin-bottom: 22px;">
                      样本编号：
                      <el-input style="width: 152px;" v-model="data.sampleInfoMove.num" placeholder="请输入样本编号" />
                    </div>
                    <h3
                      style="border-bottom: 1px solid;  letter-spacing: .12rem; padding-bottom: 8px; margin-bottom: 16px;"
                    >移入位置</h3>
                    <div style="display: flex;  font-size: 1.06rem; margin-bottom: 22px;">
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        房间号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.roomNum" placeholder="例，01" />
                      </div>
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        设备号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.fridgeNum" placeholder="例，01" />
                      </div>
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        层&emsp;号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.levelNum" placeholder="例，01" />
                      </div>
                    </div>
                    <div style="display: flex;  font-size: 1.06rem; margin-bottom: 22px;">
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        区域号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.areaNum" placeholder="例，01" />
                      </div>
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        盒&emsp;号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.boxNum" placeholder="例，01" />
                      </div>
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        盒&emsp;内<br/>行&emsp;号：
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.sampleRow" placeholder="例，1" />
                      </div>
                    </div>
                    <div style="display: flex; justify-content: space-between;  font-size: 1.06rem; margin-bottom: 22px;">
                      <div style="width: 30%; margin-right: 26px; align-items: center; display: flex; justify-content: space-between;">
                        盒&emsp;内<br/>列&emsp;号
                        <el-input style="width: 166px;" v-model="data.sampleInfoMove.sampleColumn" placeholder="例，1" />
                      </div>
                      <div style="align-self: flex-end;">
                        <el-popconfirm title="要将样本移到这个地方吗 ？" @confirm="sendMoveSampleArea">
                          <template #reference>
                            <el-button
                              style="margin-right: 12px;" class="button" type="primary" plain
                            >移入</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button
                          style="margin-right: 12px;" class="button"
                          @click="data.moveSampleCardVisible = false"
                        >取消</el-button>
                      </div>
                    </div>
                  </el-dialog>
                </div>
              </div>
              <div>
                <el-table
                  ref="multipleTableRef"
                  :data="data.sampleDatasets"
                  @selection-change="selectionChange"
                  :border="true"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column property="num" label="样本编号" />
                  <el-table-column property="type" label="样本类型" />
                  <el-table-column property="amount" label="样本数量" />
                  <el-table-column property="alertThreshold" label="样本阈值" />
                  <el-table-column property="acquisitionTime" label="采集时间" />
                  <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope" #default>
                      <el-button
                        link type="primary" size="small"
                        @click="editSampleInfoCard(scope.row)"
                      >编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  style="display: flex; justify-content: center;"
                  layout="total, prev, pager, next, jumper" :total="data.total"
                  :page-size="pageInfo.size"
                  v-model:current-page="pageInfo.currentPage"
                  @current-change="changeData"
                />
                <!-- 样本信息弹框 -->
                <el-dialog class="sampleInfoCard"
                  style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                  v-model="data.sampleInfoVisible" :close-on-click-modal="false"
                  :before-close="closeEditSampleInfoCard"
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
                      <div style="display: flex; justify-content: flex-end;">
                        <el-popconfirm title="确认要修改这个样本信息吗 ？" @confirm="sendEditInfo">
                          <template #reference>
                            <el-button style="margin-right: 12px;" class="button">确认</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button
                          style="margin-right: 12px;" class="button"
                          @click="closeEditSampleInfoCard"
                        >取消</el-button>
                      </div>
                    </div>
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