<template>
  <div class="home-layout">
    <div class="menu-top">
      <el-image class="image-home" :src=url fit="fill"/>
    </div>
    <el-container>
      <el-aside class="left-sidebar-container">
          <el-menu
            router
            :default-active="route.path"
            class="el-menu-vertical"
          >
            <el-menu-item index="/dashboard/store">
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
        <el-main>
          <div class="main-top">
            题库中心
          </div>
          <router-view />
        </el-main>

      <el-aside class="right-sidebar-container">
        Aside
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import {
  Document,
  HomeFilled,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import imageUrl from '../assets/images/临时.webp';

const route = useRoute();
const url = imageUrl;
</script>

<style lang="css" scoped>
    @import '../assets/styles/home.css';
</style>
