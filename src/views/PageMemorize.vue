<template>
  <div class="memorize-core">
      <header class="question-header">
          <button class="nav-btn" @click="prevQuestion" :disabled="currentIndex === 0">
              <span class="arrow">❮</span>
          </button>
          
          <div class="question-text">
              <span class="q-label">题目 {{ currentIndex + 1 }} / {{ currentBank.questions.length }}:</span>
              <h1>{{ currentQuestion.question_name }}</h1>
          </div>

          <button class="nav-btn" @click="nextQuestion" :disabled="currentIndex >= currentBank.questions.length - 1">
              <span class="arrow">❯</span>
          </button>
      </header>

      <section class="answer-section" @click="showAnswer = true">
          <div v-if="!showAnswer" class="answer-placeholder">
              <div class="click-hint">点击屏幕查看答案</div>
          </div>
          <div v-else class="answer-content animate-fade-in">
              <div class="answer-label">答案解析：</div>
              <p>{{ currentQuestion.question_answer }}</p>
          </div>
      </section>

      <footer class="action-footer">
          <button class="action-btn btn-forget" @click="submitFeedback('forget')">
              <el-icon><Close /></el-icon> 忘记
          </button>

          <button class="action-btn btn-blur" @click="submitFeedback('blur')">
              <el-icon><SemiSelect /></el-icon> 模糊
          </button>

          <button class="action-btn btn-remember" @click="submitFeedback('remember')">
              <el-icon><Check /></el-icon> 熟记
          </button>
      </footer>

      <teleport to="#right-aside" v-if="isMounted">
          <div class="bank-selector-title">题库切换</div>
          <div 
            v-for="bank in questionBanks" 
            :key="bank.qb_id"
            :class="['bank-card', { active: currentBankId === bank.qb_id }]"
            @click="switchBank(bank)"
          >
            <div class="bank-name">{{ bank.qb_name }}</div>
            <div class="bank-meta">{{ bank.question_number || bank.questions.length }} 道题</div>
          </div>
      </teleport>
  </div>
</template>

<script setup>
import {
  Close,
  SemiSelect,
  Check
} from '@element-plus/icons-vue';
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import request from '../utils/request';

const questionBanks = ref([]);
const currentBankId = ref(null);
const currentIndex = ref(0);
const showAnswer = ref(false);
const isMounted = ref(false);

const loadQuestion = () => {
  const userInfoStr = localStorage.getItem('user_info');

  if (!userInfoStr) {
    ElMessage.error('请先登录');
    return;
  }

  const userData = JSON.parse(userInfoStr);

  let userId = null;
  if (userData && userData.user) {
    userId = userData.user.user_id || userData.user.userId;
  } else if (userData) {
    userId = userData.user_id || userData.userId;
  }


  if (!userId) {
    ElMessage.error('获取用户信息失败，请重新登录');
    localStorage.removeItem('user_info');
    return;
  }

  request.get(`/questionBank/user/${userId}`).then(res => {
    if (res.code == 200) {
      questionBanks.value = res.data;
      if (questionBanks.value && questionBanks.value.length > 0) {
        currentBankId.value = questionBanks.value[0].qb_id;
      }
    } else {
      console.error('获取题库失败:', res.message);
      ElMessage.error(res.message || '加载题库失败，请重试');
    }
  });
};

onMounted(() => {
  isMounted.value = true;
  loadQuestion();
});

const currentBank = computed(() => {
  return questionBanks.value.find(b => b.qb_id === currentBankId.value) || { questions: [] };
});

const currentQuestion = computed(() => {
  const questions = currentBank.value.questions || [];
  if (questions.length > 0) {
    return questions[currentIndex.value] || { question_name: '暂无题目', question_answer: '数据异常' };
  }
  return { question_name: '暂无题目', question_answer: '请先选择有效题库' };
});

const switchBank = (bank) => {
  if (currentBankId.value === bank.qb_id) return;
  if (confirm(`是否切换到题库：${bank.qb_name}？`)) {
    currentBankId.value = bank.qb_id;
    currentIndex.value = 0;
    showAnswer.value = false;
  }
};

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    showAnswer.value = false;
  }
};

const nextQuestion = () => {
  if (currentIndex.value < currentBank.value.questions.length - 1) {
    currentIndex.value++;
    showAnswer.value = false;
  }
};

const submitFeedback = (type) => {
  console.log(`用户反馈: ${type} - 题目: ${currentQuestion.value.question_name}`);
  if (currentIndex.value < currentBank.value.questions.length - 1) {
    nextQuestion();
  } else {
    ElMessage.success('背完啦！');
  }
};
</script>

<style lang="css" scoped>
    @import '../assets/styles/memorize.css';
</style>