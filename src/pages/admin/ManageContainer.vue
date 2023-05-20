<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting, Search, User, Folder, Picture, Close } from '@element-plus/icons-vue'
import { ref ,reactive, watch } from 'vue'
import { logout, sampleInfo, createFile, uploadFile, downloadFile, judgeInputNull } from '../../utils/index.js';
import {
  getContainerStorageInfo, getFridgeInfoByNum, getLevelInfoByNum, getAreaInfoByNum, getBoxInfoByNum,
  addNewContainer, addNewLevel, addNewArea, addNewBox,
  deleteFridge, deleteLevel, deleteArea, deleteBox,
  removeSample, editSampleInfo, getSample, updateBoxInfo, addNewSample
} from '../../apis/admin';
import printJS from 'print-js';
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
  size: 5
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
  containerInfoVisible: false,
  sampleInfoVisible: false,
  levelInfoVisible: false,
  areaInfoVisible: false,
  boxInfoVisible: false,

  sampleInnerVisible: false,
  newSampleInfoVisible: false,

  showTypeVisible: false,
  showBoxInfoVisible: false,
  
  newLevelInfo: {
    fridgeId: '',
    num: ''
  },
  newAreaInfo: {
    levelId: '',
    num: ''
  },
  newBoxInfo: {
    areaId: '',
    num: '',
    boxRow: '',
    boxColumn: '',
  },
  showBoxInfo: {
    areaId: '',
    num: '',
    boxRow: '',
    boxColumn: '',
    capacity: '',
    surplus: ''
  },

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
  newSampleInfo: sampleInfo,
  containerInfo: {
    num: '',
    brand: '',
    type: '',
    model: '',
    deviceName: '',
    capacity: '',
    areaNum: '',
    // boxNum: '',
    levelNum: '',
    roomNum: '',
    size: '',
    storageTemp: ''
  },

  // 新增行数据
  ruleForm: {
    sampleConfig: []
  },

  menuInfo: [],
  sampleDatasets: [],
  total: 0
});

const containerShowInfo = reactive({
  type: '',
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

const sideBarStatus = reactive({
  room: false,
  container: false,
  level: false,
  area: false,
  box: false,
  type: '',
  fridgeId: '',
  levelId: '',
  areaId: '',
  boxId: '',
  roomNum: '',
  fridgeNum: '',
  levelNum: '',
  areaNum: '',
  boxNum: ''
});

const inputStatus = reactive({
  levelNum: false,
  areaNum: false
});

// 上传图片
const uploadFileInfo = reactive({
  imgUrlContainer: '',
  imgContainer: '',
  imgUrlSample: '',
  imgSample: ''
});

// 获取侧边栏信息---，容器存储信息，房间号-设备编号-等
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

// 获取样本数据
const getAllSamples = () => {
  // 判断类型
  const getObj = {
    currentPage: pageInfo.currentPage,
    size: pageInfo.size
  };
  if (sideBarStatus.room) {
    getObj.roomNum = sideBarStatus.roomNum;
  } else if (sideBarStatus.container) {
    getObj.roomNum = sideBarStatus.roomNum;
    getObj.fridgeNum = sideBarStatus.fridgeNum;
  } else if (sideBarStatus.level) {
    getObj.roomNum = sideBarStatus.roomNum;
    getObj.fridgeNum = sideBarStatus.fridgeNum;
    getObj.levelNum = sideBarStatus.levelNum;
  } else if (sideBarStatus.area && sideBarStatus.type === '冰箱') {
    getObj.roomNum = sideBarStatus.roomNum;
    getObj.fridgeNum = sideBarStatus.fridgeNum;
    getObj.levelNum = sideBarStatus.levelNum;
    getObj.areaNum = sideBarStatus.areaNum;
  } else if (sideBarStatus.area) {
    getObj.areaId = sideBarStatus.areaId;
  } else if (sideBarStatus.box) {
    getObj.boxId = sideBarStatus.boxId;
  }

  // 获取样本
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

// 获取容器容量信息
const getContainerCapcityInfo = () => {
  let getObj = { num: sideBarStatus.fridgeNum, roomNum: sideBarStatus.roomNum };
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
};

// 根据房间号获取房间内样本数据
const getSampleInfoDatasetsByRoom = (room) => {
  sideBarStatus.room = true;
  sideBarStatus.container = false;
  sideBarStatus.level = false;
  sideBarStatus.area = false;
  sideBarStatus.box = false;
  
  data.showTypeVisible = false;

  sideBarStatus.roomNum = room.num;

  // 获取样本数据
  getAllSamples();
};

// 根据设备号获取设备内样本数据
const getSampleInfoDatasetsByCon = (room, fridge) => {
  sideBarStatus.room = false;
  sideBarStatus.container = true;
  sideBarStatus.level = false;
  sideBarStatus.area = false;
  sideBarStatus.box = false;
  sideBarStatus.type = fridge.type;

  data.showTypeVisible = true;
  
  sideBarStatus.roomNum = room.num;
  sideBarStatus.fridgeNum = fridge.num;

  let getObj = { num: fridge.num, roomNum: room.num };
  getFridgeInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        sideBarStatus.fridgeId = resData.data.id;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  
  getContainerCapcityInfo();

  // 获取样本数据
  getAllSamples();
};

// 根据层号获取层内样本数据
const getSampleInfoDatasetsByLevel = (room, fridge, level) => {
  sideBarStatus.room = false;
  sideBarStatus.container = false;
  sideBarStatus.level = true;
  sideBarStatus.area = false;
  sideBarStatus.box = false;

  sideBarStatus.type = fridge.type;
  data.showTypeVisible = true;

  sideBarStatus.roomNum = room.num;
  sideBarStatus.fridgeNum = fridge.num;
  sideBarStatus.levelNum = level.num;

  let getObj = { fridgeId: sideBarStatus.fridgeId, num: level.num };
  getLevelInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code !== 0) {
        const list = resData.list;
        for (let i = 0; i < list.length; i ++) {
          if (list[i].num === getObj.num) {
            sideBarStatus.levelId = list[i].id;
            break;
          }
        }
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });

  getContainerCapcityInfo();

  // 获取样本数据
  getAllSamples();
};

// 根据区号获取区内样本数据
const getSampleInfoDatasetsByArea = async (room, fridge, level, area) => {
  sideBarStatus.room = false;
  sideBarStatus.container = false;
  sideBarStatus.level = false;
  sideBarStatus.area = true;
  sideBarStatus.box = false;

  sideBarStatus.type = fridge.type;
  data.showTypeVisible = true;

  sideBarStatus.roomNum = room.num;
  sideBarStatus.fridgeNum = fridge.num;
  sideBarStatus.levelNum = level.num;
  sideBarStatus.areaNum = area.num;


  let getObj = { levelId: sideBarStatus.levelId, num: area.num };
  await getAreaInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code !== 0) {
        const list = resData.list;
        for (let i = 0; i < list.length; i ++) {
          if (list[i].num === getObj.num) {
            sideBarStatus.areaId = list[i].id;
            break;
          }
        }
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });

  getContainerCapcityInfo();

  // 获取样本数据
  getAllSamples();
};

// 根据盒号获取盒内样本数据
const getSampleInfoDatasetsByBox = async (room, fridge, level, area, boxNum) => {
  event.stopPropagation();
  sideBarStatus.room = false;
  sideBarStatus.container = false;  
  sideBarStatus.level = false;
  sideBarStatus.area = false;
  sideBarStatus.box = true;
  
  sideBarStatus.type = fridge.type;
  data.showTypeVisible = true;
  
  sideBarStatus.roomNum = room.num;
  sideBarStatus.fridgeNum = fridge.num;
  sideBarStatus.levelNum = level.num;
  sideBarStatus.areaNum = area.num;
  sideBarStatus.boxNum = boxNum;


  let getObj = {
    areaId: sideBarStatus.areaId,
    num: boxNum
  };
  await getBoxInfoByNum(getObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code !== 0) {
        const list = resData.list;
        let boxInfo = {};
        for (let i = 0; i < list.length; i ++) {
          if (list[i].num === getObj.num) {
            sideBarStatus.boxId = list[i].id;
            boxInfo = resData.list[i];
            break;
          }
        }
        containerShowInfo.boxCapcity = boxInfo.capacity;
        containerShowInfo.boxUsageNumber = boxInfo.capacity - boxInfo.surplus;
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });

  getContainerCapcityInfo();

  // 获取样本数据
  getAllSamples();
};

// 删除设备
const sendDleteFridgeInfo = (id) => {
  deleteFridge(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.containerInfoVisible = false;
        location.reload();
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

const sideBar = ref(null);  

// 根据设备编号，房间号搜索，展开侧边栏
const searchFridge = () => {
  if (searchInfo.roomNum === '') {
    ElMessage({ showClose: true, message: '请输入房间号 ~', type: 'warning' });
    return;
  } else if (searchInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入设备编号 ~', type: 'warning' });
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
          sideBar.value.open(idx);
          getSampleInfoDatasetsByCon(roomList[i], fridgeList[j]);
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
const sendNewContainerInfo = async () => {
  // 判断输入
  const postObj = {
    num: data.containerInfo.num,
    brand: data.containerInfo.brand,
    type: data.containerInfo.type,
    model: data.containerInfo.model,
    deviceName: data.containerInfo.deviceName,
    areaNum: data.containerInfo.areaNum,
    levelNum: data.containerInfo.levelNum,
    roomNum: data.containerInfo.roomNum,
    size: data.containerInfo.size,
    storageTemp: data.containerInfo.storageTemp,
  }
  if (postObj.num === '') {
    ElMessage({ showClose: true, message: '请填写设备编号 ~', type: 'warning' });
    return;
  } else if (postObj.type === '') {
    ElMessage({ showClose: true, message: '请填写设备类型 ~', type: 'warning' });
    return;
  } else if (postObj.deviceName === '') {
    ElMessage({ showClose: true, message: '请填写设备名称 ~', type: 'warning' });
    return;
  } else if (postObj.roomNum === '') {
    ElMessage({ showClose: true, message: '请填写房间号 ~', type: 'warning' });
    return;
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
        postObj.image = imageName;
      }
      handleRemoveImg();
    } else {
      postObj.image = '';
    }
  })();
    
  if (postObj.type === '冰箱') {
    postObj.capacity = 0;
  } else {
    postObj.capacity = null;
  }

  addNewContainer(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 1) {
        ElMessage({ showClose: false, message: resData.msg, type: 'success' });
        data.containerInfoVisible = false;
        getSiderBarInfo();
      } else {
        ElMessage({ showClose: false, message: '创建失败，请检查输入信息', type: 'error' });
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

// 批量出库样本数据
const sendremoveSample = () => {
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

  removeSample(deleteStr).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code === 0) {
        ElMessage({ showClose: true, message: '出库失败 ~', type: 'error' });
      } else {
        ElMessage({ showClose: true, message: resData.msg, type: 'success' });
        getAllSamples();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });

  getContainerCapcityInfo();
};

// 创建容器时，监听数据变化，计算容量
watch(data.containerInfo, (info) => {
  if (data.containerInfo.type === '箱子') {
    info.levelNum = 1;
    info.areaNum = 1;
    inputStatus.levelNum = true;
    inputStatus.areaNum = true;
  } else {
    if (inputStatus.levelNum) {
      info.levelNum = '';
    }
    if (inputStatus.areaNum) {
      info.areaNum = '';
    }
    inputStatus.levelNum = false;
    inputStatus.areaNum = false;
  }
});

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
  uploadFileInfo.imgUrlSample = '';
  uploadFileInfo.imgSample = '';
  uploadFileInfo.imgBox = '';
  uploadFileInfo.imgBoxUrl = '';
};

// 发送新增层信息
const sendNewLevelInfo = () => {
  if (data.newLevelInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入层编号 ~', type: 'warning' });
    return;
  }
  const postObj = {
    fridgeId: sideBarStatus.fridgeId,
    num: data.newLevelInfo.num
  };
  addNewLevel(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      data.levelInfoVisible = false;
      data.newLevelInfo.num = '';
      getSiderBarInfo();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 删除层
const deleteThisLevel = () => {
  const id = sideBarStatus.levelId;
  deleteLevel(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        sideBarStatus.levelId = '';
        location.reload();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 发送新增区信息
const sendNewAreaInfo = () => {
  if (data.newAreaInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入区编号 ~', type: 'warning' });
    return;
  }
  const postObj = {
    levelId: sideBarStatus.levelId,
    num: data.newAreaInfo.num
  };
  addNewArea(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      data.areaInfoVisible = false;
      data.newAreaInfo.num = '';
      getSiderBarInfo();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 删除区
const deleteThisArea = () => {
  const id = sideBarStatus.areaId;
  deleteArea(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        sideBarStatus.areaId = '';
        location.reload();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 发送新增盒信息
const sendNewBoxInfo = async () => {
  if (data.newBoxInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入盒编号 ~', type: 'warning' });
    return;
  } else if (data.newBoxInfo.boxRow === '') {
    ElMessage({ showClose: true, message: '请输入行数 ~', type: 'warning' });
    return;
  } else if (data.newBoxInfo.boxColumn === '') {
    ElMessage({ showClose: true, message: '请输入列数 ~', type: 'warning' });
    return;
  }
  const postObj = {
    areaId: sideBarStatus.areaId,
    num: data.newBoxInfo.num,
    boxRow: data.newBoxInfo.boxRow,
    boxColumn: data.newBoxInfo.boxColumn,
    roomNum: sideBarStatus.roomNum,
    fridgeNum: sideBarStatus.fridgeNum,
    levelNum: sideBarStatus.levelNum,
    areaNum: sideBarStatus.areaNum
  };
  postObj.capacity = postObj.boxRow * postObj.boxColumn;
  postObj.surplus = postObj.capacity; 

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
        postObj.image = imageName;
      }
      handleRemoveImg();
    } else {
      postObj.image = '';
    }
  })();

  addNewBox(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      closeNewBoxInfoCard();
      getSiderBarInfo();
      getContainerCapcityInfo();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 删除盒
const deleteThisBox = () => {
  const id = sideBarStatus.boxId;
  deleteBox(id).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: true, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        sideBarStatus.boxId = '';
        location.reload();
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 查看盒信息
const showThisBoxInfo = async () => {
  const getObj = {
    areaId: sideBarStatus.areaId,
    num: sideBarStatus.boxNum
  };
  await getBoxInfoByNum(getObj).then(async res => {
    const resData = res.data;
    if (res.status === 200) {
      if (resData.code !== 0) {
        const list = resData.list;
        let boxInfo = {};
        for (let i = 0; i < list.length; i ++) {
          if (list[i].num === getObj.num) {
            sideBarStatus.boxId = list[i].id;
            boxInfo = resData.list[i];
            break;
          }
        }
        data.showBoxInfo.num = boxInfo.num;
        data.showBoxInfo.boxRow = boxInfo.boxRow;
        data.showBoxInfo.boxColumn = boxInfo.boxColumn;
        data.showBoxInfo.capacity = boxInfo.capacity;
        data.showBoxInfo.surplus = boxInfo.surplus;
        data.showBoxInfo.image = boxInfo.image;

        if (boxInfo.image) {
          const getObj2 = {
            name: boxInfo.image
          };
          uploadFileInfo.imgUrlContainer = await downloadFile(getObj2);
        } else {
          uploadFileInfo.imgUrlContainer = '';
        }
      }
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
  
  data.showBoxInfoVisible = true;
};

// 编辑盒信息
const sendshowBoxInfo = async () => {
  if (data.showBoxInfo.num === '') {
    ElMessage({ showClose: true, message: '请输入盒编号 ~', type: 'warning' });
    return;
  }
  const putObj = {
    id: sideBarStatus.boxId,
    areaId: sideBarStatus.areaId,
    num: data.showBoxInfo.num,
    boxRow: data.showBoxInfo.boxRow,
    boxColumn: data.showBoxInfo.boxColumn,
    capacity: data.showBoxInfo.capacity,
    surplus: data.showBoxInfo.surplus,
    roomNum: sideBarStatus.roomNum,
    fridgeNum: sideBarStatus.fridgeNum,
    levelNum: sideBarStatus.levelNum,
    areaNum: sideBarStatus.areaNum
  };

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
    } else if (uploadFileInfo.imgUrlContainer) {
      putObj.image = data.showBoxInfo.image;
    } else {
      putObj.image = '';
    }
  })();

  updateBoxInfo(putObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      closeShowBoxInfoCard();
      sideBarStatus.boxNum = putObj.num;
      getSiderBarInfo();
    } else {
      ElMessage({ showClose: false, message: resData.msg, type: 'error' });
    }
  }).catch(err => {
    console.log(err);
  });
};

// 存入样本
const sendNewSampleInfo = async () => {
  if (data.newSampleInfo.num === '') {
    ElMessage({ showClose: true, message: '请填写样本编号 ~', type: 'warning' });
    return;
  }
  const postObj = {
    num: data.newSampleInfo.num,
    type: data.newSampleInfo.type,
    acquisitionTime: data.newSampleInfo.acquisitionTime,
    areaNum: data.newSampleInfo.areaNum,
    roomNum: data.newSampleInfo.roomNum,
    fridgeNum: data.newSampleInfo.fridgeNum,
    levelNum: data.newSampleInfo.levelNum,
    boxNum: data.newSampleInfo.boxNum,
    sampleRow: data.newSampleInfo.sampleRow,
    sampleColumn: data.newSampleInfo.sampleColumn,
    userAccount: data.newSampleInfo.userAccount,
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

  addNewSample(postObj).then(res => {
    const resData = res.data;
    if (res.status === 200) {
      ElMessage({ showClose: false, message: resData.msg, type: resData.code === 1 ? 'success' : 'error' });
      if (resData.code === 1) {
        data.sampleInnerVisible = true;
      }
      getAllSamples();
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
  closeNewSampleInfoCard();
  data.sampleInnerVisible = false;
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

// 关闭存入样本信息弹框
const closeNewSampleInfoCard = () => {
  data.newSampleInfoVisible = false;
  data.newSampleInfo = sampleInfo;
  data.ruleForm.sampleConfig = [];
  handleRemoveImg();
};

// 关闭编辑样本信息弹框
const closeEditSampleInfoCard = () => {
  data.sampleInfoVisible = false;
  data.sampleInfo = sampleInfo;
  data.ruleForm.sampleConfig = [];
  handleRemoveImg();
};

// 关闭新增盒信息弹框
const closeNewBoxInfoCard = () => {
  data.boxInfoVisible = false;
  data.newBoxInfo.num = '';
  data.newBoxInfo.boxRow = '';
  data.newBoxInfo.boxColumn = '';
  handleRemoveImg();
};

// 关闭查看盒信息弹框
const closeShowBoxInfoCard = () => {
  data.showBoxInfoVisible = false;
  data.newBoxInfo.num = '';
  data.newBoxInfo.boxRow = '';
  data.newBoxInfo.boxColumn = '';
  handleRemoveImg();
};

// 关闭打印卡
const closePrintInfoCard = () => {
  data.sampleInnerVisible = false;
  closeNewSampleInfoCard();
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
                      @click.stop="getSampleInfoDatasetsByRoom(room)"
                    >
                      <template #title>
                        房间号 {{ room.num }}
                      </template>
                      <el-sub-menu
                        v-for="(fridge, key1) in room.fridgeList"
                        :key="key1" :index="(key+1).toString()+'-'+(key1+1).toString()"
                        @click.stop="getSampleInfoDatasetsByCon(room, fridge)"
                      >
                        <template #title>
                          设备号 {{ fridge.num }}
                        </template>
                        <el-sub-menu
                          v-for="(level, key2) in fridge.levelVoList"
                          :key="key2" :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()"
                          @click.stop="getSampleInfoDatasetsByLevel(room, fridge, level)"
                        >
                          <template #title>
                            层号 {{ level.num }}
                          </template>
                          <el-sub-menu
                            v-for="(area, key3) in level.areaVoList"
                            :key="key3"
                            :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()+'-'
                                    +(key3+1).toString()"
                            @click.stop="getSampleInfoDatasetsByArea(room, fridge, level, area)"
                          >
                            <template #title>
                              区号 {{ area.num }}
                            </template>
                            <el-menu-item
                              v-for="(boxNum, key4) in area.boxVoList"
                              :key="key4"
                              :index="(key+1).toString()+'-'+(key1+1).toString()+'-'+(key2+1).toString()+'-'
                                      +(key3+1).toString()+'-'+(key4+1).toString()"
                              @click="getSampleInfoDatasetsByBox(room, fridge, level, area, boxNum)"
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
                        <el-button class="button" @click="searchFridge" plain>搜索</el-button>
                        <el-button class="button" style="margin-right: 32px" @click="data.containerInfoVisible=true" plain>创建容器</el-button>
                        <el-button
                          v-show="sideBarStatus.container && (sideBarStatus.type === '冰箱' || sideBarStatus.type === '柜子')"
                          class="button" @click="data.levelInfoVisible=true" type="primary" plain
                        >新增层</el-button>
                        <el-popconfirm width="auto" title="确认要删除该设备吗 ？" @confirm="sendDleteFridgeInfo(sideBarStatus.fridgeId)">
                          <template #reference>
                            <el-button v-show="sideBarStatus.container" class="button" type="danger" plain>删除设备</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button
                          v-show="sideBarStatus.level && (sideBarStatus.type === '冰箱' || sideBarStatus.type === '柜子')"
                          @click="data.areaInfoVisible=true"
                          class="button" type="primary" plain
                        >新增区</el-button>
                        <el-popconfirm width="auto" title="确认要删除该层吗 ？" @confirm="deleteThisLevel">
                          <template #reference>
                            <el-button
                              v-show="sideBarStatus.level && (sideBarStatus.type === '冰箱' || sideBarStatus.type === '柜子')"
                              class="button" type="danger" plain
                            >删除层</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button  
                          v-show="sideBarStatus.area && sideBarStatus.type === '冰箱'" class="button"
                          @click="data.boxInfoVisible=true" type="primary" plain
                        >新增盒</el-button>
                        <el-popconfirm width="auto" title="确认要删除该区吗 ？" @confirm="deleteThisArea">
                          <template #reference>
                            <el-button
                              v-show="sideBarStatus.area && sideBarStatus.type !== '箱子'"
                              class="button" type="danger" plain
                            >删除区</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button
                          v-show="sideBarStatus.box" @click="showThisBoxInfo"
                          class="button" type="primary" plain
                        >查看盒</el-button>
                        <el-popconfirm width="auto" title="确认要删除该盒吗 ？" @confirm="deleteThisBox">
                          <template #reference>
                            <el-button v-show="sideBarStatus.box" class="button" type="danger" plain>删除盒</el-button>
                          </template>
                        </el-popconfirm>
                        <el-button
                          v-show="sideBarStatus.type==='冰箱'&&sideBarStatus.box||
                            sideBarStatus.type==='箱子'&&sideBarStatus.area||
                            sideBarStatus.type==='柜子'&&sideBarStatus.area"
                          style="float: right;"
                          class="button" @click="() => {
                            data.ruleForm.sampleConfig=[]; data.newSampleInfoVisible=true;
                            data.newSampleInfo.roomNum=sideBarStatus.roomNum;
                            data.newSampleInfo.fridgeNum=sideBarStatus.fridgeNum;
                            data.newSampleInfo.levelNum=sideBarStatus.levelNum;
                            data.newSampleInfo.areaNum=sideBarStatus.areaNum;
                          }"
                        >存入样本</el-button>
                        <!-- 新增层，信息弹框 -->
                        <el-dialog v-model="data.levelInfoVisible" :close-on-click-modal="false">
                          <template #header>
                            <h3
                              style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                            >新增层</h3>
                          </template>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              层编号：
                              <el-input style="width: 166px;" v-model="data.newLevelInfo.num" placeholder="例，01" />
                            </div>
                          </div>
                          <div style="display: flex; justify-content: flex-end;">
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="sendNewLevelInfo"
                            >确认</el-button> 
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="() => { data.levelInfoVisible=false; data.newLevelInfo.num=''; }"
                            >取消</el-button>
                          </div>
                        </el-dialog>
                        <!-- 新增区，信息弹框 -->
                        <el-dialog v-model="data.areaInfoVisible" :close-on-click-modal="false">
                          <template #header>
                            <h3
                              style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                            >新增区</h3>
                          </template>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              区编号：
                              <el-input style="width: 166px;" v-model="data.newAreaInfo.num" placeholder="例，01" />
                            </div>
                          </div>
                          <div style="display: flex; justify-content: flex-end;">
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="sendNewAreaInfo"
                            >确认</el-button> 
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="() => { data.areaInfoVisible=false; data.newAreaInfo.num=''; }"
                            >取消</el-button>
                          </div>
                        </el-dialog>
                        <!-- 新增盒，信息弹框 -->
                        <el-dialog
                          v-model="data.boxInfoVisible" :close-on-click-modal="false"
                          :before-close="closeNewBoxInfoCard"
                        >
                          <template #header>
                            <h3
                              style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                            >新增盒</h3>
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
                              盒编号：
                              <el-input style="width: 166px;" v-model="data.newBoxInfo.num" placeholder="例，01" />
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              行数：
                              <el-input style="width: 166px;" v-model="data.newBoxInfo.boxRow" placeholder="例，1" />
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              列数：
                              <el-input style="width: 166px;" v-model="data.newBoxInfo.boxColumn" placeholder="例，1" />
                            </div>
                          </div>
                          <div style="display: flex; justify-content: flex-end;">
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="sendNewBoxInfo"
                            >确认</el-button> 
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="closeNewBoxInfoCard"
                            >取消</el-button>
                          </div>
                        </el-dialog>
                        <!-- 查看盒，信息弹框 -->
                        <el-dialog
                          v-model="data.showBoxInfoVisible" :close-on-click-modal="false"
                          :before-close="closeShowBoxInfoCard"
                        >
                          <template #header>
                            <h3
                              style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                            >盒信息</h3>
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
                              盒编号：
                              <el-input style="width: 166px;" v-model="data.showBoxInfo.num" placeholder="例，01"/>
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              行数：
                              <el-input style="width: 166px;" v-model="data.showBoxInfo.boxRow" placeholder="例，1" disabled/>
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              列数：
                              <el-input style="width: 166px;" v-model="data.showBoxInfo.boxColumn" placeholder="例，1" disabled/>
                            </div>
                          </div>
                          <div style="display: flex; justify-content: flex-end;">
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="sendshowBoxInfo"
                            >确认</el-button> 
                            <el-button
                              style="margin-right: 12px;" class="button"
                              @click="closeShowBoxInfoCard"
                            >取消</el-button>
                          </div>
                        </el-dialog>
                      </div>
                      <section style="margin-bottom: 8px; font-size: 1.4rem; display: flex; justify-content: space-between;">
                        <div>
                          <strong>内置样品</strong>
                        </div>
                        <div v-show="data.showTypeVisible">
                          <strong>{{ sideBarStatus.type }}</strong>
                        </div>
                      </section>
                    </section>
                    <section style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                      <span v-show="sideBarStatus.room" style="font-size: 13px; color: rgb(199, 199, 199); height: 18px;">
                        {{
                          `房间号 ${sideBarStatus.roomNum}`
                        }}
                      </span>
                      <span v-show="sideBarStatus.container" style="font-size: 13px; color: rgb(199, 199, 199); height: 18px;">
                        {{
                          `房间号 ${sideBarStatus.roomNum} > 设备 ${sideBarStatus.fridgeNum}`
                        }}
                      </span>
                      <span v-show="sideBarStatus.level" style="font-size: 13px; color: rgb(199, 199, 199); height: 18px;">
                        {{
                          `房间号 ${sideBarStatus.roomNum} > 设备 ${sideBarStatus.fridgeNum} > 
                          层号 ${sideBarStatus.levelNum}`
                        }}
                      </span>
                      <span v-show="sideBarStatus.area" style="font-size: 13px; color: rgb(199, 199, 199); height: 18px;">
                        {{
                          `房间号 ${sideBarStatus.roomNum} > 设备 ${sideBarStatus.fridgeNum} > 
                          层号 ${sideBarStatus.levelNum} > 区号 ${sideBarStatus.areaNum}`
                        }}
                      </span>
                      <span v-show="sideBarStatus.box" style="font-size: 13px; color: rgb(199, 199, 199); height: 18px;">
                        {{
                          `房间号 ${sideBarStatus.roomNum} > 设备 ${sideBarStatus.fridgeNum} > 
                          层号 ${sideBarStatus.levelNum} > 区号 ${sideBarStatus.areaNum} > 盒号 ${sideBarStatus.boxNum}`
                        }}
                      </span>
                      <span style="height: 18px;">
                        <strong v-show="sideBarStatus.box" style="font-size: 1.3rem; margin-right: 32px;">
                          {{ `盒子容量：${containerShowInfo.boxUsageNumber}/${containerShowInfo.boxCapcity}` }}
                        </strong>
                        <strong v-show="data.showTypeVisible && sideBarStatus.type==='冰箱'" style="  font-size: 1.3rem;">
                          {{ `设备容量：${containerShowInfo.usageNumber}/${containerShowInfo.capacity}` }}
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
                      <el-popconfirm title="确认要删除这些样品吗 ？" @confirm="sendremoveSample">
                        <template #reference>
                          <el-button style="margin-bottom: 16px;" class="button" type="danger" plain>批量出库</el-button>
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
                                  />
                                </div>
                                <div style="margin-bottom: 22px;">
                                  数量：
                                  <el-input
                                    style="width: 166px;" v-model="data.sampleInfo.amount" placeholder="请输入样本数量"
                                  />
                                </div>
                                <div style="margin-bottom: 22px; margin-right: 12px;">
                                  时间：
                                  <el-date-picker
                                  style="width: 166px" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                  v-model="data.sampleInfo.acquisitionTime" type="date" placeholder="请选择采集时间"
                                  />
                                </div>
                              </div>
                              <div style="width: 50%;">
                                <div style="margin-bottom: 22px; margin-right: 12px;">
                                  类型：
                                  <el-input
                                    style="width: 166px;" v-model="data.sampleInfo.type" placeholder="请输入样本类型"
                                  />
                                </div>
                                <div style="margin-bottom: 22px;">
                                  阈值：
                                  <el-input
                                    style="width: 166px;" v-model="data.sampleInfo.alertThreshold" placeholder="请输入预警阈值"
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
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>设备号：
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.fridgeNum" placeholder="例，01"
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>的层号 ： 
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.levelNum" placeholder="例，01"
                              />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>区域号：
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.areaNum" placeholder="请例，01"
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>盒子号：
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.boxNum" placeholder="例，01"
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所属<br/>用户账号：
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.userAccount" placeholder="请输入用户账号"
                              />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 50%; margin: 0 26px 20px 0; align-items: center; display: flex;">
                              所在盒子里的行号：
                              <el-input
                                style="width: 166px;" v-model="data.sampleInfo.sampleRow" placeholder="例，1"
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
                      <!-- 创建容器，信息弹框 -->
                      <el-dialog v-model="data.containerInfoVisible" :close-on-click-modal="false">
                        <template #header>
                          <h3
                            style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;"
                          >创建容器</h3>
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
                            <el-input style="width: 166px;" v-model="data.containerInfo.num" placeholder="例，01" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>类型：
                            <el-select style="width: 166px;" v-model="data.containerInfo.type">
                              <el-option v-for="item in containerTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
                            </el-select>
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>品牌：
                            <el-input style="width: 166px;" v-model="data.containerInfo.brand" placeholder="请输入设备品牌" />
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>型号：
                            <el-input style="width: 166px;" v-model="data.containerInfo.model" placeholder="请输入型号" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>尺寸：
                            <el-input style="width: 166px;" v-model="data.containerInfo.size" placeholder="例，6" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            设备<br>名称：
                            <el-input style="width: 166px;" v-model="data.containerInfo.deviceName" placeholder="请输入设备名称" />
                          </div>
                        </div>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            存储<br>温度：
                            <el-input style="width: 166px;" v-model="data.containerInfo.storageTemp" placeholder="例，6℃" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            所在<br>房间号：
                            <el-input style="width: 166px;" v-model="data.containerInfo.roomNum" placeholder="例，01" />
                          </div>
                        </div>
                        <h3
                          style="border-bottom: 1px solid;  letter-spacing: .12rem; padding-bottom: 10px; margin-bottom: 16px;"
                        >设备内部结构</h3>
                        <div style="display: flex; flex-direction: row;">
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            层数：
                            <el-input style="width: 166px;" v-model="data.containerInfo.levelNum" placeholder="例，1" :disabled="inputStatus.levelNum" />
                          </div>
                          <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                            区数：
                            <el-input style="width: 166px;" v-model="data.containerInfo.areaNum" placeholder="例，1" :disabled="inputStatus.areaNum"/>
                          </div>
                        </div>
                        <div style="display: flex; justify-content: flex-end;">
                          <el-button
                          style="margin-right: 12px;" class="button"
                          @click="sendNewContainerInfo"
                          >确认</el-button> 
                          <el-button
                            style="margin-right: 12px;" class="button"
                            @click="data.containerInfoVisible=false"
                          >取消</el-button>
                        </div>
                      </el-dialog>
                      <!-- 存入样本，样本信息弹框 -->
                      <el-dialog class="sampleInfoCard"
                        style="position: absolute; left: 50%; top: -8%; transform: translateX(-50%);"
                        v-model="data.newSampleInfoVisible" :close-on-click-modal="false"
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
                                    style="width: 166px;" v-model="data.newSampleInfo.num" placeholder="请输入样本编号"
                                    :ref="setItemRef" @keyup.native.enter="focusNextInput(3)"
                                    @blur="() => { data.newSampleInfo.num = data.newSampleInfo.num.trim(); }"
                                  />
                                </div>
                                <div style="margin-bottom: 22px;">
                                  数量：
                                  <el-input
                                    style="width: 166px;" v-model="data.newSampleInfo.amount" placeholder="请输入样本数量"
                                    :ref="setItemRef" @keyup.native.enter="focusNextInput(4)"
                                  />
                                </div>
                                <div style="margin-bottom: 22px; margin-right: 12px;">
                                  时间：
                                  <el-date-picker
                                  style="width: 166px" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                                  v-model="data.newSampleInfo.acquisitionTime" type="date" placeholder="请选择采集时间"
                                  :ref="setItemRef" @keyup.native.enter="focusNextInput(5)"
                                  />
                                </div>
                              </div>
                              <div style="width: 50%;">
                                <div style="margin-bottom: 22px; margin-right: 12px;">
                                  类型：
                                  <el-input
                                    style="width: 166px;" v-model="data.newSampleInfo.type" placeholder="请输入样本类型"
                                    :ref="setItemRef" @keyup.native.enter="focusNextInput(1)"
                                  />
                                </div>
                                <div style="margin-bottom: 22px;">
                                  阈值：
                                  <el-input
                                    style="width: 166px;" v-model="data.newSampleInfo.alertThreshold" placeholder="请输入预警阈值"
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
                                style="width: 166px;" v-model="data.newSampleInfo.roomNum" placeholder="例，01"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(6)"
                                disabled
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>设备号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.fridgeNum" placeholder="例，01"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(7)"
                                disabled
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>的层号 ： 
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.levelNum" placeholder="例，01"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(8)"
                                disabled
                              />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>区域号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.areaNum" placeholder="请例，01"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(9)"
                                disabled
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所在<br/>盒子号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.boxNum" placeholder="例，01"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(10)"
                              />
                            </div>
                            <div style="width: 30%; margin: 0 26px 20px 0; align-items: center; display: flex; justify-content: space-between">
                              所属<br/>用户账号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.userAccount" placeholder="请输入用户账号"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(11)"
                              />
                            </div>
                          </div>
                          <div style="display: flex; flex-direction: row;">
                            <div style="width: 50%; margin: 0 26px 20px 0; align-items: center; display: flex;">
                              所在盒子里的行号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.sampleRow" placeholder="例，1"
                                :ref="setItemRef" @keyup.native.enter="focusNextInput(12)"
                              />
                            </div>
                            <div style="width: 50%; margin: 0 26px 20px 0; align-items: center; display: flex;">
                              所在盒子里的列号：
                              <el-input
                                style="width: 166px;" v-model="data.newSampleInfo.sampleColumn" placeholder="例，1"
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