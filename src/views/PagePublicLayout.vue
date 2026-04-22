<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="logo-text">记忆</span>
        </div>
      </div>

      <nav class="header-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          :class="['nav-item', { active: route.path === item.path }]"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-menu">
            <el-avatar :size="36" class="user-avatar">
              {{ userInitial }}
            </el-avatar>
            <span class="user-name">{{ userName }}</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人主页
              </el-dropdown-item>

              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>

    <div class="app-body">
      <aside class="app-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-title">导航菜单</div>
          <router-link 
            v-for="item in sidebarItems" 
            :key="item.path"
            :to="item.path"
            :class="['sidebar-item', { active: route.path === item.path }]"
          >
            <el-icon :size="20"><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-title">学习统计</div>

          <div class="stats-card">
            <div class="stat-row">
              <span class="stat-label">今日学习</span>
              <span class="stat-value">25 题</span>
            </div>

            <div class="stat-row">
              <span class="stat-label">连续打卡</span>
              <span class="stat-value highlight">7 天</span>
            </div>

            <div class="stat-row">
              <span class="stat-label">掌握率</span>
              <span class="stat-value">78%</span>
            </div>
          </div>
        </div>
      </aside>

      <main class="app-main">
        <router-view />
      </main>

      <aside class="app-aside">
        <div id="right-aside">
          <div class="aside-section">
            <div class="aside-title">快速开始</div>

            <div class="quick-actions">
              <router-link to="/memorize" class="quick-action">
                <el-icon :size="24"><Reading /></el-icon>
                <span>开始背题</span>
              </router-link>
              
              <router-link to="/myquestionbank" class="quick-action">
                <el-icon :size="24"><Plus /></el-icon>
                <span>创建题库</span>
              </router-link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  HomeFilled, 
  Reading, 
  FolderOpened, 
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  Plus
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/store', label: '题库中心', icon: HomeFilled },
  { path: '/memorize', label: '开始背题', icon: Reading },
  { path: '/myquestionbank', label: '我的题库', icon: FolderOpened }
]

const sidebarItems = [
  { path: '/store', label: '题库中心', icon: HomeFilled },
  { path: '/memorize', label: '开始背题', icon: Reading },
  { path: '/myquestionbank', label: '我的题库', icon: FolderOpened },
  { path: '/profile', label: '个人主页', icon: User }
]

const userInfo = computed(() => {
  try {
    const info = localStorage.getItem('user_info')
    return info ? JSON.parse(info) : null
  } catch {
    return null
  }
})

const userName = computed(() => {
  const user = userInfo.value?.user
  return user?.nickname || user?.userAccount?.split('@')[0] || '用户'
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    localStorage.removeItem('user_info')
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style lang="css" scoped>
@import '../assets/styles/layout';
</style>
