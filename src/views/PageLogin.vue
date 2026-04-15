<template>
  <div class="login-box">
    <h3 class="title">登录</h3>

    <div class="input-area">
      <p id="email">电子邮件</p>
      <el-input v-model="loginForm.userAccount" class="input-email" placeholder="输入邮箱账号" />
      <p id="password">密码</p>
      <el-input v-model="loginForm.password" class="input-password" @keyup.enter="handleLogin" placeholder="输入密码" />
      <router-link class="re-password" to="/re-password">忘记密码？</router-link>
    </div>

    <div>
      <div class="primary-btn">
        <el-checkbox class="check-btn" v-model="rememberAccount" label="记住账号" size="large" />
        <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
        <span id="register-tip">还没有账号？ <router-link class="to-register" to="/register">立即注册</router-link></span>
      </div>
    </div>
      
  </div>
</template>

<script setup >
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import CryptoJS from 'crypto-js';
import request from '../utils/request';

const router = useRouter();

const loginForm = ref({
  userAccount: "",
  password: ""
});

const rememberAccount = ref(false);

onMounted(() => {
  const saveAccount = localStorage.getItem("saveAccount");
  if (saveAccount) {
    loginForm.value.userAccount = saveAccount;
    rememberAccount.value = true;
  }
})

const handleLogin = async () => {
  if (!loginForm.value.userAccount || !loginForm.value.password) {
    ElMessage.warning("请填写账号和密码");
    return;
  }

  const encryptedPassword = CryptoJS.SHA256(loginForm.value.password).toString();

  try {
    const res = await request.post('/users/login', {
      userAccount: loginForm.value.userAccount,
      password: encryptedPassword
    });

    if (res.code == 200) {
      ElMessage.success("登录成功！");
      
      localStorage.setItem("user_info", JSON.stringify(res.data));

      router.push('/store'); 
    } else {
      ElMessage.error(res.message || "登录失败，请重试");
    }
  } catch (error) {
    console.error("登录异常：", error);
    ElMessage.error("系统繁忙，请稍后再试");
  }
};

</script>

<style lang="css" scoped>
  @import '../assets/styles/login.css';
</style>
