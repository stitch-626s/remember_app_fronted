<template>
  <div class="auth-page">
    <div class="auth-brand">
      <div class="brand-content">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 class="brand-title">记忆</h1>
        <p class="brand-subtitle">记忆App题库学习平台</p>
      </div>
    </div>

    <div class="auth-form-container">
      <div class="auth-form-wrapper">
        <div class="form-header">
          <h2>登录</h2>
          <p>登录您的账户开始学习之旅</p>
        </div>

        <el-form 
          ref="formRef" 
          :model="loginForm" 
          :rules="rules" 
          class="auth-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="userAccount">
            <label class="form-label">电子邮件</label>
            <el-input 
              v-model="loginForm.userAccount" 
              placeholder="请输入您的邮箱地址"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <label class="form-label">密码</label>
            <el-input 
              v-model="loginForm.password" 
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberAccount">记住账号</el-checkbox>
            <router-link to="/reset" class="forgot-link">忘记密码？</router-link>
          </div>

          <el-button 
            type="primary" 
            size="large" 
            class="submit-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form>

        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Message, Lock } from '@element-plus/icons-vue';
import CryptoJS from 'crypto-js';
import request from '../utils/request';

const router = useRouter();
const loading = ref(false);

const loginForm = ref({
  userAccount: '',
  password: ''
});

const rememberAccount = ref(false);

const rules = {
  userAccount: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
};

onMounted(() => {
  const saveAccount = localStorage.getItem('saveAccount');
  if (saveAccount) {
    loginForm.value.userAccount = saveAccount
    rememberAccount.value = true
  };
})

const handleLogin = async () => {
  if (!loginForm.value.userAccount || !loginForm.value.password) {
    ElMessage.warning('请输入账号和密码');
    return;
  }

  loading.value = true;

  try {
    const encryptedPassword = CryptoJS.SHA256(loginForm.value.password).toString();

    const res = await request.post('/users/login', {
      userAccount: loginForm.value.userAccount,
      password: encryptedPassword
    });
    
    if (res.code === 200 || res.code === '200') {
      ElMessage.success('登录成功！');

      if (rememberAccount.value) {
        localStorage.setItem('saveAccount', loginForm.value.userAccount);
      }

      localStorage.setItem('user_info', JSON.stringify(res.data));
      router.push('/store');
    } else {
      ElMessage.error(res.message || '登录失败，请重试');
    }
  } catch (error) {
    console.error('登录异常：', error);
    ElMessage.error('系统繁忙，请稍后再试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import '../assets/styles/login.css';
</style>