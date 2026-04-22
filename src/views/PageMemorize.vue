<template>
  <div class="memorize-page">
    <div class="memorize-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
      </div>

      <div class="question-card" @click="showAnswer = true">
        <div class="card-header">
          <span class="card-badge">{{ currentBank.qbName || '选择题库' }}</span>
          <span class="card-counter">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
        </div>

        <div class="card-content">
          <div class="question-section">
            <div class="section-label">题目</div>
            <h2 class="question-text">{{ currentQuestion.questionName }}</h2>
          </div>

          <div class="answer-section" :class="{ revealed: showAnswer }">
            <template v-if="showAnswer">
              <div class="section-label">答案解析</div>
              <div class="answer-text">{{ currentQuestion.questionAnswer }}</div>
            </template>

            <template v-else>
              <div class="reveal-hint">
                <el-icon :size="28">
                  <View />
                </el-icon>
                <span>点击查看答案</span>
              </div>
            </template>
          </div>
        </div>

        <button class="nav-btn prev" :disabled="currentIndex === 0" @click.stop="prevQuestion">
          <el-icon :size="24">
            <ArrowLeft />
          </el-icon>
        </button>

        <button class="nav-btn next" :disabled="currentIndex >= totalQuestions - 1" @click.stop="nextQuestion">
          <el-icon :size="24">
            <ArrowRight />
          </el-icon>
        </button>
      </div>

      <div class="feedback-actions">
        <button class="feedback-btn forget" @click="submitFeedback('forget')">
          <el-icon :size="22">
            <Close />
          </el-icon>
          <span>忘记了</span>
        </button>

        <button class="feedback-btn blur" @click="submitFeedback('blur')">
          <el-icon :size="22">
            <QuestionFilled />
          </el-icon>
          <span>有点模糊</span>
        </button>

        <button class="feedback-btn remember" @click="submitFeedback('remember')">
          <el-icon :size="22">
            <Check />
          </el-icon>
          <span>记住了</span>
        </button>
      </div>

      <div class="keyboard-hints">
        <span><kbd>←</kbd> 上一题</span>
        <span><kbd>→</kbd> 下一题</span>
        <span><kbd>空格</kbd> 显示答案</span>
      </div>
    </div>

    <teleport to="#right-aside" v-if="isMounted">
      <div class="aside-section">
        <div class="aside-title">切换题库</div>

        <div class="bank-list">
          <div v-for="bank in questionBanks" :key="bank.qbId"
            :class="['bank-option', { active: currentBankId === bank.qbId }]" @click="switchBank(bank)">
            <div class="bank-option-icon" :style="{ background: getGradient(bank.qbId) }">
              <el-icon :size="16">
                <FolderOpened />
              </el-icon>
            </div>

            <div class="bank-option-info">
              <div class="bank-option-name">{{ bank.qbName }}</div>
              <div class="bank-option-count">{{ bank.questions?.length || 0 }} 道题</div>
            </div>
          </div>
        </div>
      </div>

      <div class="aside-section" v-if="currentBank.qbId">
        <div class="aside-title">学习进度</div>

        <div class="progress-stats">
          <div class="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" stroke-width="8" stroke-linecap="round"
                :stroke-dasharray="`${progressPercent * 2.83} 283`" transform="rotate(-90 50 50)" />

              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
              </defs>

            </svg>
            <div class="progress-value">{{ Math.round(progressPercent) }}%</div>
          </div>
          <div class="progress-label">已完成 {{ currentIndex + 1 }} / {{ totalQuestions }} 题</div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  View,
  ArrowLeft,
  ArrowRight,
  Close,
  Check,
  QuestionFilled,
  FolderOpened
} from '@element-plus/icons-vue';
import request from '../utils/request';

const questionBanks = ref([]);
const currentBankId = ref(null);
const currentIndex = ref(0);
const showAnswer = ref(false);
const isMounted = ref(false);

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
];

const getGradient = (id) => gradients[id % gradients.length];

const currentBank = computed(() => {
  return questionBanks.value.find(b => b.qbId === currentBankId.value) || {
    qbId: 0,
    qbName: '',
    qb_description: '',
    questionNumber: 0,
    questions: []
  };
})

const totalQuestions = computed(() => currentBank.value.questions?.length || 0);

const progressPercent = computed(() => {
  if (totalQuestions.value === 0) return 0
  return ((currentIndex.value + 1) / totalQuestions.value) * 100;
})

const currentQuestion = computed(() => {
  const questions = currentBank.value.questions || [];
  if (questions.length > 0 && currentIndex.value < questions.length) {
    return questions[currentIndex.value];
  }
  return {
    questionId: 0,
    questionName: '暂无题目',
    question_answer: '请先选择一个题库开始学习'
  };
})

const loadQuestionBanks = async () => {
  const userInfoStr = localStorage.getItem('user_info');
  console.log(userInfoStr);

  if (!userInfoStr) {
    ElMessage.warning('请先登录');
    return;
  }

  const userData = JSON.parse(userInfoStr);
  const userId = userData?.user?.userId || userData?.userId;

  if (!userId) {
    ElMessage.error('获取用户信息失败');
    return;
  }

  const res = await request.get(`/questionBank/user/${userId}`)
  if (res.code === 200 || res.code === "200") {
    questionBanks.value = res.data;
    if (questionBanks.value.length > 0) {
      currentBankId.value = questionBanks.value[0].qbId;
    }
  }
}

const switchBank = async (bank) => {
  if (currentBankId.value === bank.qbId) return;

  try {
    await ElMessageBox.confirm(
      `切换到题库"${bank.qbName}"？当前进度将被重置。`,
      '切换题库',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    );
    currentBankId.value = bank.qbId;
    currentIndex.value = 0;
    showAnswer.value = false;
  } catch {
    ElMessage.error("切换失败");
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    showAnswer.value = false;
  }
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++;
    showAnswer.value = false;
  }
}

const submitFeedback = (type) => {
  const feedbackLabels = {
    forget: '忘记了',
    blur: '有点模糊',
    remember: '记住了'
  };

  console.log(`反馈: ${feedbackLabels[type]} - 题目: ${currentQuestion.value.questionName}`);

  if (currentIndex.value < totalQuestions.value - 1) {
    nextQuestion();
  } else {
    ElMessage.success('恭喜！本轮学习完成');
  }
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prevQuestion();
  } else if (e.key === 'ArrowRight') {
    nextQuestion();
  } else if (e.key === ' ') {
    e.preventDefault();
    showAnswer.value = true;
  }
}

onMounted(() => {
  isMounted.value = true;
  loadQuestionBanks();
  window.addEventListener('keydown', handleKeydown);
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
})
</script>

<style scoped>
@import '../assets/styles/memorize.css';
</style>