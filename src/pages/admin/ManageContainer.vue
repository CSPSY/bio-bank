<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import { ref ,reactive } from 'vue'
import { logout } from '../../utils/index.js';

// 获取用户名，信息展示
const userName = ref('');
const adminInfo = localStorage.getItem('adminInfo');
if (adminInfo) {
  userName.value = JSON.parse(adminInfo).accountInfo;
}

const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const input4 = ref('');
const input5 = ref('');
const input6 = ref('');
const input7 = ref('');
const input8 = ref('');
const input9 = ref('');
const input10 = ref('');

const valueForBrand = ref('')
const valueForType = ref('')
const valueForModel = ref('')
const optionsForType = [
  {
    value: '冰箱',
    label: '冰箱',
  },
  {
    value: 'xxx',
    label: 'xxx',
  },
  {
    value: 'xxx',
    label: 'xxx',
  },
  {
    value: 'yyy',
    label: 'yyy',
  },
  {
    value: 'zzz',
    label: 'zzz',
  },
]

const optionsForBrand = [
  {
    value: '海尔',
    label: '海尔',
  },
  {
    value: 'xxx',
    label: '美的',
  },
]

const optionsForModel = [
  {
    value: '0x54',
    label: '0x54',
  },
  {
    value: '0x55',
    label: '0x55',
  },
]

const item = {
  date: '2016-05-02',
  name: 'Tom',
  address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(
  [
    {
      sampleId: '001',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '002',
      sampleType: 'DNA',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '003',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '004',
      sampleType: '污水',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
    {
      sampleId: '005',
      sampleType: '血液',
      tubeVolume: '5ml',
      date: '2023/03/15'
    },
  ]
);

const data = reactive({
  dialogTransferVisable: false,
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
  sampleInfo: {
    id: '001',
    density: '3',
    type: '血液',
    gatherTime: '2023/03/15',
    addTime: '2023/03/16',
    tubeVolume: '5',
    fromType: '采集',
    sum: '12',
    area: '12',
    safeLevel: '安全',
    userId: '01',
    roomId: '201',
    containerId: '002',
    layerId: '2',
    areaId: '3',
    boxId: '2',
    boxRowId: '1',
    boxColId: '4',
    remedyInfo: 'O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液, O 型血液'
  },
  menuInfo: [
    {
      roomNum: 201,
      roomValue: [
        {
          num: 111,
          numValue: [
            {
              levelNum: 1,
              levelValue: [
                {
                  areaNum: 1,
                  areaValue: [
                    {
                      boxNum: 1
                    },
                    {
                      boxNum: 2
                    }
                  ]
                },
                {
                  areaNum: 2,
                  areaValue: [
                    {
                      boxNum: 1
                    }
                  ]
                }
              ]
            },
            {
              levelNum: 2,
              levelValue: [
                {
                  areaNum: 1,
                  areaValue: [
                    {
                      boxNum: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      roomNum: 202,
      roomValue: [
        {
          num: 222,
          numValue: [
            {
              levelNum: 1,
              levelValue: [
                {
                  areaNum: 1,
                  areaValue: [
                    {
                      boxNum: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  sampleDatasets: [],
  searchContainerId: '',
  total: 0
});

// 根据盒号获取样本信息列表数据
const getSampleInfoDatasets = (boxNum) => {
  console.log(boxNum);
};

// 监听样本数据选中情况
const selectionChange = (selection) => {
  data.selectionSampleDataId = [];
  for (let key in selection) {
    data.selectionSampleDataId.push(selection[key].num);
  }
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
						<el-container class="layout-container-demo" style="height: 500px">
							<el-aside width="200px" style="background-color: rgb(255, 255, 255);">
								<el-scrollbar>
									<el-menu :default-openeds="['']">
                    <el-sub-menu 
                      v-for="(o, index) in data.menuInfo.length"
                      :key="o" :index="o.toString()"
                    >
                      <template #title>
                        房间号 {{ data.menuInfo[index].roomNum }}
                      </template>
                      <el-sub-menu
                        v-for="(o1, index1) in data.menuInfo[index].roomValue.length"
                        :key="o1" :index="o.toString() + '-' + o1.toString()"
                      >
                        <template #title>
                          设备号 {{ data.menuInfo[index].roomValue[index1].num }}
                        </template>
                        <el-sub-menu
                          v-for="(o2, index2) in data.menuInfo[index].roomValue[index1].numValue.length"
                          :key="o2" :index="o.toString()+'-'+o1.toString()+'-'+o2.toString()"
                        >
                          <template #title>
                            层号 {{ data.menuInfo[index].roomValue[index1].numValue[index2].levelNum }}
                          </template>
                          <el-sub-menu
                            v-for="(o3, index3) in data.menuInfo[index].roomValue[index1].numValue[index2].levelValue.length"
                            :key="o3" :index="o.toString()+'-'+o1.toString()+'-'+o2.toString()+'-'+o3.toString()"
                          >
                            <template #title>
                              区号 {{ data.menuInfo[index].roomValue[index1].numValue[index2].levelValue[index3].areaNum }}
                            </template>
                            <el-menu-item
                              v-for="(o4, index4) in data.menuInfo[index].roomValue[index1].numValue[index2].levelValue[index3].areaValue.length"
                              :key="o4" :index="o.toString()+'-'+o1.toString()+'-'+o2.toString()+'-'+o3.toString()+'-'+o4.toString()"
                              @click="getSampleInfoDatasets(data.menuInfo[index].roomValue[index1].numValue[index2].levelValue[index3].areaValue[index4].boxNum)"
                            >
                              盒号 {{ data.menuInfo[index].roomValue[index1].numValue[index2].levelValue[index3].areaValue[index4].boxNum }}
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
                      <label for="specimens-id">容器 ID：</label>
                      <el-input
                        id="specimens-id"
                        style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                        v-model="data.searchContainerId"
                        placeholder="请输入容器 id" />
                      <el-button class="button">搜索</el-button>
                      <el-button class="button" @click="data.containInfoVisible=true">创建容器</el-button>
                    </div>
                    <div style="margin-bottom: 8px; font-size: 1.4rem;">
                      <strong>内置样品</strong>
                    </div>
                  </section>
                  <section style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 13px; color: rgb(199, 199, 199);">房间号 1 > 冰箱 1 > 层号 1 > 区号 1 > 盒号 1</span>
                    <strong style="font-size: 1.3rem;">冰箱容量：4/500</strong>
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
                      <el-table-column property="concentration" label="样本浓度(g/ml)" />
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
                    <el-popconfirm title="确认要删除这些样品吗 ？" @confirm="">
                      <template #reference>
                        <el-button class="button" type="danger" plain>批量删除</el-button>
                      </template>
                    </el-popconfirm>
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