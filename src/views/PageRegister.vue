<template>
  <div class="auth-page">
    <div class="auth-brand">
      <div class="brand-content">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h2 class="brand-title">记忆</h2>
        <p class="brand-subtitle">开启你的高效学习之旅</p>
      </div>
    </div>

    <div class="auth-form-container">
      <div class="auth-form-wrapper">
        <div class="form-header">
          <h2>创建账户</h2>
          <p>注册后即可使用全部功能</p>
        </div>

        <el-form 
          ref="formRef" 
          :model="registerForm" 
          :rules="rules" 
          class="auth-form"
        >
          <el-form-item prop="userAccount">
            <label class="form-label">电子邮件</label>
            <el-input 
              v-model="registerForm.userAccount" 
              placeholder="请输入您的邮箱地址"
              size="large"
              :prefix-icon="Message"
            />
          </el-form-item>

          <el-form-item prop="password">
            <label class="form-label">密码</label>
            <el-input 
              v-model="registerForm.password" 
              type="password"
              placeholder="8-16位，包含字母和数字"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
            <div class="password-strength" v-if="registerForm.password">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :style="{ width: passwordStrength.width }"
                  :class="passwordStrength.class"
                ></div>
              </div>

              <span class="strength-text" :class="passwordStrength.class">{{ passwordStrength.text }}</span>
            </div>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <label class="form-label">确认密码</label>
            <el-input 
              v-model="registerForm.confirmPassword" 
              type="password"
              placeholder="请再次输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-button 
            type="primary" 
            size="large" 
            class="submit-btn"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '创建账户' }}
          </el-button>
        </el-form>

        <div class="terms">
          点击"创建账户"即表示您同意我们的
          <a href="#">服务条款</a>
          和
          <a href="#">隐私政策</a>
        </div>

        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Message, Lock } from '@element-plus/icons-vue';
import CryptoJS from 'crypto-js';
import request from '../utils/request';

const router = useRouter();
const formRef = ref();
const loading = ref(false);

const registerForm = ref({
  userAccount: '',
  password: '',
  confirmPassword: ''
});

const validateConfirmPassword = (_rule, value, callback) => {
  if (value !== registerForm.value.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
}

const rules = {
  userAccount: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/, message: '密码必须包含字母和数字，长度8-16位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const passwordStrength = computed(() => {
  const password = registerForm.value.password;
  if (!password) return { width: '0%', text: '', class: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  
  if (score <= 2) return { width: '33%', text: '弱', class: 'weak' };
  if (score <= 4) return { width: '66%', text: '中', class: 'medium' };
  return { width: '100%', text: '强', class: 'strong' };
})

const handleRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      const encryptedPassword = CryptoJS.SHA256(registerForm.value.password).toString();

      const res = await request.post('/users/register', {
        userAccount: registerForm.value.userAccount,
        password: encryptedPassword
      });

      if (res.code === 200 || res.code === "200") {
        ElMessage.success('注册成功！请登录');
        router.push('/login');
      } else {
        ElMessage.error(res.message || '注册失败，请重试');
      }
    } catch (error) {
      console.error('注册异常：', error);
      ElMessage.error('系统繁忙，请稍后再试');
    } finally {
      loading.value = false;
    }
  })
}
</script>

<style scoped>
@import '../assets/styles/register.css';
</style>