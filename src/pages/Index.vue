<script setup>
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="170px">
        <el-menu
          class="menu"
          active-text-color="#ffd04b"
          background-color="rgb(194, 194, 194)"
          default-active="1"
        >
          <img style="width: 88px; margin: 22px auto;" src="../assets/imgs/smallD.png" alt="logo">
          <el-menu-item class="center" index="1">
              <span class="title">首页</span>
          </el-menu-item>
          <el-menu-item class="center" index="2">
            <span class="title">我的存储</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
        </el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.menu {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.center {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 1.06rem;
  font-weight: 400;
  text-align: center;
  opacity: 0.9;
  margin: 12px 0;
  letter-spacing: .3rem;
}

.header {
  height: 90px;
  background-color: rgb(235, 235, 235);
}
</style>