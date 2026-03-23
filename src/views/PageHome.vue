<template>
  <div class="home-layout">
    <div class="menu-top">
      <el-image class="image-home" :src=url fit="fill"/>
    </div>
    <el-container>
      <el-aside class="left-sidebar-container">
          <el-menu
            :default-active="route.path"
            class="el-menu-vertical"
          >
            <el-menu-item index="1">
            <el-icon><home-filled /></el-icon>
            <template #title>首页</template>
            </el-menu-item>

            <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <template #title>背题</template>
            </el-menu-item>

            <el-menu-item index="3">
            <el-icon><document /></el-icon>
            <template #title>题库</template>
            </el-menu-item>

            <el-menu-item index="4">
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
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import imageUrl from '../assets/images/triangle_PNG6.jpg'

const route = useRoute()
const url = imageUrl
</script>

<style lang="css" scoped>
    @import '../assets/styles/home.css'
</style>
