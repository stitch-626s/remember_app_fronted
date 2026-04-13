<template>
  <div class="register-box">
    <h3 class="title">注册</h3>

    <div class="input-area">
      <p id="email">电子邮件</p>
      <el-input v-model="registerForm.username" class="input-email" placeholder="输入邮箱账号" />
      <p id="password">密码</p>
      <el-input v-model="registerForm.password" class="input-password" placeholder="输入密码" />
      <p id="confirm-password">确认密码</p>
      <el-input v-model="registerForm.confirmPassword" class="input-confirm-password" placeholder="再次输入密码" show-password />
    </div>

    <div>
      <div class="primary-btn">
        <el-button type="primary" class="register-btn" @click="handleRegister">注册</el-button>
      </div>
    </div>
      
  </div>
</template>

<script setup >
  import { ref } from 'vue';
  import CryptoJS from 'crypto-js';
  import request from '../utils/request';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const registerForm = ref({
    username: "",
    password: ""
  });

  const handleRegister = async () => {
    const usernameVerify = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!usernameVerify.test(registerForm.value.username)) {
      ElMessage.warning("邮箱格式不正确");
      return;
    }
    
    const passwordVerify = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!passwordVerify.test(registerForm.value.password)) {
      ElMessage.warning("密码格式不正确：必须包含数字和字母，且长度在8-16位之间");
      return;
    }

    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      ElMessage.warning("两次输入的密码不一致");
      return;
    }

    const encryptedPassword = CryptoJS.SHA256(registerForm.value.password).toString();
    const res =  await request.post('/users/register', {
      username: registerForm.value.username,
      password: encryptedPassword
    });

    if (res && res.code == 200) {
      console.log("注册成功！");
      ElMessage.success("注册成功！请登录");
      router.push('/login');
    } else {
      console.error("注册请求失败", res.message);
      ElMessage.error( res.message || "注册失败，请重试");
    }
}
</script>

<style>
    @import '../assets/styles/register.css'
</style>