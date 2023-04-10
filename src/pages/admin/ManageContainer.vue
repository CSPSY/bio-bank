<script setup>
import { House, SwitchButton, MessageBox, Tickets, Warning, Setting } from '@element-plus/icons-vue'
import { ref ,reactive } from 'vue'

const inputId = ref('');
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
  }
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
						<el-container class="layout-container-demo" style="height: 500px">
							<el-aside width="200px" style="background-color: rgb(255, 255, 255);">
								<el-scrollbar>
									<el-menu :default-openeds="['1', '3']">
										<el-sub-menu index="1">
											<template #title>
												房间号 1
											</template>
											<el-sub-menu index="1-1">
												<template #title>
													设备号 1
												</template>
												<el-menu-item-group>
													<el-menu-item index="1-1-1">层号 1</el-menu-item>
												</el-menu-item-group>
												<el-menu-item-group>
													<el-menu-item index="1-1-2">层号 2</el-menu-item>
												</el-menu-item-group>
												<el-menu-item-group>
													<el-menu-item index="1-1-3">层号 3</el-menu-item>
												</el-menu-item-group>
												<el-sub-menu index="1-1-4">
													<template #title>层 4</template>
													<el-menu-item index="1-1-4-1">区号 1</el-menu-item>
													<el-menu-item index="1-1-4-2">区号 2</el-menu-item>
													<el-menu-item index="1-1-4-3">区号 3</el-menu-item>
													<el-sub-menu index="1-1-4-4">
                            <template #title>
                              区号 4
                            </template>
                            <el-menu-item index="1-1-4-4-1">盒号 1</el-menu-item>
                            <el-menu-item index="1-1-4-4-2">盒号 2</el-menu-item>
                            <el-menu-item index="1-1-4-4-3">盒号 3</el-menu-item>
                          </el-sub-menu>
												</el-sub-menu>
											</el-sub-menu>
										</el-sub-menu>
										<el-sub-menu index="2">
											<template #title>
												房间号 2
											</template>
											<el-sub-menu index="2-1">
												<template #title>
													设备号 1
												</template>
												<el-menu-item-group>
													<el-menu-item index="2-1-1">层号 1</el-menu-item>
												</el-menu-item-group>
												<el-menu-item-group>
													<el-menu-item index="2-1-2">层号 2</el-menu-item>
												</el-menu-item-group>
												<el-menu-item-group>
													<el-menu-item index="2-1-3">层号 3</el-menu-item>
												</el-menu-item-group>
												<el-sub-menu index="2-1-4">
													<template #title>层号 4</template>
													<el-menu-item index="2-1-4-1">区号 1</el-menu-item>
													<el-menu-item index="2-1-4-2">区号 2</el-menu-item>
													<el-menu-item index="2-1-4-3">区号 3</el-menu-item>
													<el-sub-menu index="2-1-4-4">
                            <template #title>
                              区号 4
                            </template>
                            <el-menu-item index="2-1-4-4-1">盒号 1</el-menu-item>
                            <el-menu-item index="2-1-4-4-2">盒号 2</el-menu-item>
                            <el-menu-item index="2-1-4-4-3">盒号 3</el-menu-item>
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
										<div class="con-header">
											<div>
												<label for="specimens-id">容器 ID：</label>
												<el-input
                          id="specimens-id"
                          style="height: 32px; width: 212px; padding: 0 22px 0 0;"
                          v-model="inputId"
                          placeholder="请输入容器 id" />
												<el-button class="button">搜索</el-button>
												<el-button class="button" @click="data.containInfoVisible=true">创建容器</el-button>
												<!-- 样本信息弹框 -->
												<el-dialog v-model.trim="data.containInfoVisible" :close-on-click-modal="false">
													<template #header>
														<h3 style="border-bottom: 1px solid; font-size: 1.3rem; letter-spacing: .12rem; padding-bottom: 16px;">创建容器</h3>
													</template>
													<div style="display: flex; flex-direction: row;">
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															*设备类型：
															<el-select v-model="valueForType" placeholder="请选择">
																<el-option
                                  v-for="item in optionsForType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled" />
															</el-select>
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															*设备品牌：
															<el-select v-model="valueForBrand" placeholder="请选择">
																<el-option
																		   v-for="item in optionsForBrand"
																		   :key="item.value"
																		   :label="item.label"
																		   :value="item.value"
																		   :disabled="item.disabled" />
															</el-select>
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															*设备型号：
															<el-select v-model="valueForModel" placeholder="请选择">
																<el-option
																		   v-for="item in optionsForModel"
																		   :key="item.value"
																		   :label="item.label"
																		   :value="item.value"
																		   :disabled="item.disabled" />
															</el-select>
														</div>
													</div>
													<div style="display: flex; flex-direction: row;">
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															设备容量：
															<el-input style="width: 215px;" v-model="input1" placeholder="请输入设备容量" />
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															内部尺寸：
															<el-input style="width: 215px;" v-model="input2" placeholder="请输入内部尺寸" />
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															*编号：
															<el-input style="width: 215px;" v-model="input3" placeholder="请输入编号" />
														</div>
													</div>
													<div style="display: flex; flex-direction: row;">
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															存储温度：
															<el-input style="width: 215px;" v-model="input4" placeholder="请输入存储温度" />
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															创建时间：
															<el-input style="width: 215px;" v-model="input5" placeholder="请输入创建时间" />
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															所在房间号：
															<el-input style="width: 215px;" v-model="input6" placeholder="请输入所在房间号" />
														</div>
													</div>
													<h3 style="border-bottom: 1px solid;  letter-spacing: .12rem; padding-bottom: 16px;">设备内部结构</h3>
													<div style="display: flex; flex-direction: row;">
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															层数：
															<el-input style="width: 215px;" v-model="input7" placeholder="请输入层数" />
														</div>
														<div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
															盒数：
															<el-input style="width: 215px;" v-model="input8" placeholder="请输入盒数" />
														</div>
													</div>
													<div style="display: flex; flex-direction: row;">
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              架数：
                              <el-input style="width: 215px;" v-model="input9" placeholder="请输入架数" />
                            </div>
                            <div style="width: 30%; margin: 0 26px 22px 0; align-items: center; display: flex; justify-content: space-between;">
                              容量：
                              <el-input style="width: 215px;" v-model="input10" placeholder="请输入容量" />
                            </div>
                        </div>
                      <div style="display: flex; justify-content: flex-end;">
                        <el-button style="margin-right: 12px;" class="button">确认</el-button>
                        <el-button style="margin-right: 12px;" class="button" @click="data.containInfoVisible = false">取消</el-button>
                      </div>
                      </el-dialog>
                      </div>
                      <div>
                        &nbsp
                      </div>
                      <div>
                        <label for="specimens-id" style="font-size: 20px;">
                          <strong>内置样品</strong>
                        </label>
                      </div>
                    </div>
                    <div>
                      &nbsp
                    </div>
                    <div>
                      <label for="specimens-id" style="font-size: 13px;color: rgb(192,192,192)">0001冰箱 > 层号02 > 架号04 > 盒号01</label>
                      <el-row type="flex" justify="end">
                        <label for="specimens-id" style="font-size: 20px;">
                          <strong>冰箱容量：4/500</strong>
                        </label>
                      </el-row>
                    </div>
                    <div>
                      &nbsp
                    </div>
                    <el-scrollbar>
                      <el-table
                        ref="multipleTableRef"
                        :data="tableData"
                        :border="true"
                        style="width: 100%">
                      <el-table-column type="selection" width="55" />
                      <el-table-column property="sampleId" label="样品ID" />
                      <el-table-column property="sampleType" label="样品类型" />
                      <el-table-column property="tubeVolume" label="单管体积" />
                      <el-table-column property="date" label="存入时间" />
                      <el-table-column fixed="right" label="操作" width="120">
                        <template #default>
                          <el-button link type="primary" size="small" @click="data.containInfoVisible=true">编辑</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-button class="button" style="">批量删除</el-button>
                  </el-scrollbar>
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
</style>