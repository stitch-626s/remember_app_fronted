<template>
  <div class="common-layout">
    <!-- 顶部区域 -->
    <div class="menu-top">
      <el-image class="image-home" :src="url" fit="fill"/>
    </div>
    
    <el-container class="main-container">
      <!-- 左侧边栏 -->
      <el-aside class="left-sidebar-container">
        <el-menu router :default-active="route.path" class="el-menu-vertical">
          <el-menu-item index="/store">
            <el-icon><home-filled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>

          <el-menu-item index="/memorize">
            <el-icon><icon-menu /></el-icon>
            <template #title>背题</template>
          </el-menu-item>

          <el-menu-item index="/myquestionbank">
            <el-icon><document /></el-icon>
            <template #title>题库</template>
          </el-menu-item>

          <el-menu-item index="/profile">
            <el-icon><setting /></el-icon>
            <template #title>个人主页</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 中间主内容区 -->
      <el-main class="middle-main-content">
        <router-view />
      </el-main>

      <!-- 右侧边栏 -->
      <el-aside class="right-sidebar-container">
        <div id="right-aside">
            
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { Document, HomeFilled, Menu as IconMenu, Setting } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import imageUrl from '../assets/images/临时.webp';

const route = useRoute();
const url = imageUrl;
</script>

<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden; 
}

.menu-top {
  width: 100%;
  height: 56px;
  background-color: #fafafb;
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
  flex-shrink: 0;
}

.image-home {
  width: 30px;
  height: 30px;
  margin-top: 13px;
  margin-left: 20px;
}

.main-container {
  flex: 1; 
  overflow: hidden;
}

.left-sidebar-container {
  width: 200px !important;
  height: 100%;
  transition: width 0.1s ease;
  overflow-y: auto;
}

.left-sidebar-container::-webkit-scrollbar {
  display: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  border-right: none; 
  border-right: 1px solid rgba(153, 153, 153, 0.3);
}

.middle-main-content {
  padding: 20px;
  overflow-y: auto; 
}

.right-sidebar-container {
  width: 200px;
  height: 100%;
  border-left: 1px solid rgba(153, 153, 153, 0.3);
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>