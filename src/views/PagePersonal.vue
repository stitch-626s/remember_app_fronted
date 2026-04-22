<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-banner"></div>

      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="100" class="user-avatar">
            <img v-if="userInfo.userAvatar" :src="userInfo.userAvatar">
            <span v-else> {{ userInitial }}</span>
          </el-avatar>

          <el-button size="small" class="edit-avatar-btn" circle @click="triggerAvatarUpload">
            <el-icon>
              <Camera />
            </el-icon>
          </el-button>
          <input type="file" ref="avatarInputRef" accept="image/*" style="display: none" @change="handleAvatarChange" />
        </div>

        <div class="user-info">
          <h1 class="user-name">{{ userInfo.userName || '用户_' }}</h1>
          <p class="user-email">{{ userInfo.userAccount || 'user@example.com' }}</p>

          <div class="user-badges">
            <!-- <span class="badge">📚 知识爱好者</span>
            <span class="badge">🔥 连续学习 7 天</span> -->
          </div>
        </div>

        <!-- <el-button type="primary" class="edit-profile-btn">
          <el-icon>
            <Edit />
          </el-icon>
          编辑资料
        </el-button> -->
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
          <el-icon :size="24">
            <Document />
          </el-icon>
        </div>

        <div class="stat-info">
          <div class="stat-value">{{ stats.totalQuestions }}</div>
          <div class="stat-label">学习题目</div>
        </div>

      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
          <el-icon :size="24">
            <FolderOpened />
          </el-icon>
        </div>

        <div class="stat-info">
          <div class="stat-value">{{ stats.totalBanks }}</div>
          <div class="stat-label">创建题库</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
          <el-icon :size="24">
            <Timer />
          </el-icon>
        </div>

        <div class="stat-info">
          <div class="stat-value">{{ stats.studyHours }}h</div>
          <div class="stat-label">学习时长</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
          <el-icon :size="24">
            <Trophy />
          </el-icon>
        </div>

        <div class="stat-info">
          <div class="stat-value">{{ stats.masteryRate }}%</div>
          <div class="stat-label">掌握率</div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">账号设置</h2>

      <div class="settings-list">
        <div class="settings-item" @click="showEditDialog('nickname')">
          <div class="settings-icon">
            <el-icon>
              <User />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">用户昵称</div>
            <div class="settings-value">{{ userInfo.userName || '未设置' }}</div>
          </div>

          <el-icon class="settings-arrow">
            <ArrowRight />
          </el-icon>
        </div>

        <div class="settings-item" @click="showEditDialog('email')">
          <div class="settings-icon">
            <el-icon>
              <Message />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">绑定邮箱</div>
            <div class="settings-value">{{ userInfo.userEmail || '未绑定' }}</div>
          </div>

          <el-icon class="settings-arrow">
            <ArrowRight />
          </el-icon>
        </div>

        <div class="settings-item" @click="showEditDialog('phone')">
          <div class="settings-icon">
            <el-icon>
              <Phone />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">手机号码</div>
            <div class="settings-value">{{ userInfo.userPhoneNum || '未绑定' }}</div>
          </div>

          <el-icon class="settings-arrow">
            <ArrowRight />
          </el-icon>
        </div>

        <div class="settings-item" @click="showEditDialog('password')">
          <div class="settings-icon">
            <el-icon>
              <Lock />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">修改密码</div>
            <div class="settings-value">••••••••</div>
          </div>

          <el-icon class="settings-arrow">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="section-title">偏好设置</h2>

      <div class="settings-list">
        <div class="settings-item">
          <div class="settings-icon">
            <el-icon>
              <Bell />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">学习提醒</div>
            <div class="settings-value">每天 20:00</div>
          </div>

          <el-switch v-model="reminderEnabled" />
        </div>

        <div class="settings-item">
          <div class="settings-icon">
            <el-icon>
              <Moon />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label">深色模式</div>
            <div class="settings-value">跟随系统</div>
          </div>

          <el-switch v-model="darkMode" />
        </div>
      </div>
    </div>

    <div class="settings-section danger">
      <h2 class="section-title">危险操作</h2>

      <div class="settings-list">
        <div class="settings-item" @click="handleLogout">
          <div class="settings-icon danger">
            <el-icon>
              <SwitchButton />
            </el-icon>
          </div>

          <div class="settings-content">
            <div class="settings-label danger">退出登录</div>
            <div class="settings-value">退出当前账号</div>
          </div>

          <el-icon class="settings-arrow">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <el-dialog v-model="editDialogVisible"
      :title="editType === 'userPassword' ? '修改密码' : editType === 'userName' ? '修改昵称' : editType === 'userEmail' ? '修改邮箱' : '修改手机号'"
      width="400px" :close-on-click-modal="false">
      <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="昵称" v-if="editType === 'userName'" prop="userName">
          <el-input v-model="editForm.userName" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="邮箱" v-if="editType === 'userEmail'" prop="userEmail">
          <el-input v-model="editForm.userEmail" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="手机号" v-if="editType === 'userPhoneNum'" prop="userPhoneNum">
          <el-input v-model="editForm.userPhoneNum" placeholder="请输入手机号" />
        </el-form-item>

        <template v-if="editType === 'userPassword'">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="editForm.oldPassword" type="password" placeholder="请输入原密码" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="editForm.newPassword" type="password" placeholder="请输入新密码" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="editForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEdit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Camera,
  Edit,
  Document,
  FolderOpened,
  Timer,
  Trophy,
  User,
  Message,
  Phone,
  Lock,
  ArrowRight,
  Bell,
  Moon,
  SwitchButton,
  Plus
} from '@element-plus/icons-vue';
import request from '../utils/request';
import { lo } from 'element-plus/es/locale/index.mjs';

const router = useRouter();
const reminderEnabled = ref(false);
const darkMode = ref(false);

const userInfo = ref({
  userId: '',
  userName: '',
  userAccount: '',
  userEmail: '',
  userPhoneNum: '',
  userAvatar: ''
});
const avatarInputRef = ref(null);
const editDialogVisible = ref(false);
const editType = ref('');
const editForm = ref({
  userName: '',
  userEmail: '',
  userPhoneNum: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const editFormRef = ref(null);

const editRules = {
  userName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  userEmail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  userPhoneNum: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== editForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const stats = ref({
  totalQuestions: null,
  totalBanks: null,
  studyHours: null,
  masteryRate: null
});

const userInitial = computed(() => {
  const userAvatar = userInfo.value.userAvatar || 'U';
  return userAvatar;
});

const loadUserInfo = () => {
  const userInfoStr = localStorage.getItem('user_info');
  if (userInfoStr) {
    const data = JSON.parse(userInfoStr);
    const user = data.user || data;
    userInfo.value = {
      userId: user.userId || '',
      userName: user.userName || '',
      userAccount: user.userAccount || '',
      userEmail: user.userEmail || '',
      userPhoneNum: user.userPhoneNum || '',
      userAvatar: user.userAvatar || ''
    };
  }
}

const loadStats = async () => {
  const userInfoStr = localStorage.getItem('user_info');
  if (userInfoStr) {
    const data = JSON.parse(userInfoStr);
    const userId = data.user?.userId || data.userId;

    if (userId) {
      const res = await request.get(`/questionBank/user/${userId}`);
      if (res.code === 200 || res.code === "200") {
        const banks = res.data || [];
        stats.value.totalBanks = banks.length;
        stats.value.totalQuestions = banks.reduce((sum, bank) => sum + (bank.questionNumber || 0), 0);
      }
    }
  }
}

const triggerAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const isImage = file.type.startsWith('image/')
  const isLt2G = file.size / 1024  < 2

  if (!isImage) {
    ElMessage.error('请选择图片文件')
    return
  }
  if (!isLt2G) {
    ElMessage.error('图片大小不能超过 2GB')
    return
  }

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target.result

    const res = await request.put('/users', {
      userId: userInfo.value.userId,
      userAvatar: base64
    })

    if (res.code === 200 || res.code === '200') {
      ElMessage.success('头像更新成功')

      const userData = {
        ...JSON.parse(localStorage.getItem('user_info') || '{}'),
        user: res.data
      }
      localStorage.setItem('user_info', JSON.stringify(userData))

      userInfo.value.userAvatar = res.data?.userAvatar
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  }
  reader.readAsDataURL(file)

  event.target.value = ''
}

const showEditDialog = (type) => {
  const typeMap = {
    nickname: 'userName',
    email: 'userEmail',
    phone: 'userPhoneNum',
    password: 'userPassword'
  }
  editType.value = typeMap[type] || type
  editForm.value = {
    userName: userInfo.value.userName || '',
    userEmail: userInfo.value.userEmail || '',
    userPhoneNum: userInfo.value.userPhoneNum || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  editDialogVisible.value = true
}

const handleEdit = async () => {
  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    const updateData = {
      userId: userInfo.value.userId
    }

    if (editType.value === 'userName') {
      updateData.userName = editForm.value.userName
    } else if (editType.value === 'userEmail') {
      updateData.userEmail = editForm.value.userEmail
    } else if (editType.value === 'userPhoneNum') {
      updateData.userPhoneNum = editForm.value.userPhoneNum
    } else if (editType.value === 'userPassword') {
      updateData.userPassword = editForm.value.newPassword
    }

    try {
      const res = await request.put('/users', updateData)
      if (res.code === 200 || res.code === '200') {
        ElMessage.success('更新成功')
        editDialogVisible.value = false
        const updatedUser = res.data
        const userData = {
          ...JSON.parse(localStorage.getItem('user_info') || '{}'),
          user: updatedUser
        };
        localStorage.setItem('user_info', JSON.stringify(userData));

        userInfo.value = {
          ...userInfo.value,
          userName: updatedUser?.userName || updateData.userName,
          userEmail: updatedUser?.userEmail || userInfo.value.userEmail,
          userPhoneNum: updatedUser?.userPhoneNum || userInfo.value.userPhoneNum
        };
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '更新失败')
    }
  })
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出登录', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    localStorage.removeItem('user_info');
    ElMessage.success('已退出登录');
    router.push('/login');
  } catch { }
}

onMounted(() => {
  loadUserInfo();
  loadStats();
})
</script>

<style lang="css" scoped>
@import '../assets/styles/personal.css';
</style>