<template>
    <div class="home-layout">
        <div class="menu-top">
            <el-image class="image-home" :src="url" fit="fill"/>
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
                    <div class="click-hint">
                        点击屏幕查看答案
                    </div>
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
        </el-main>

        <el-aside class="right-sidebar-container">
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
  Close,   
  SemiSelect,
  Check
} from '@element-plus/icons-vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import request from '../utils/request';
import imageUrl from '../assets/images/临时.webp';


const route = useRoute();
const url = imageUrl;


const questionBanks = ref([]);
const currentBankId = ref(null);
const currentIndex = ref(0);
const showAnswer = ref(false);

const loadQuestion = () => {
  request.get('/questionBank').then(res => {
    if (res.code == 200) {
      questionBanks.value = res.data;
      if (questionBanks.value && questionBanks.value.length > 0) {
        currentBankId.value = questionBanks.value[0].qb_id;
      }
    } else {
      console.error('获取题库失败:', res.message);
    }
  });
};

onMounted(() => {
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
    alter('背完啦！');
  }
};
</script>

<style lang="css" scoped>
    @import '../assets/styles/memorize.css';
</style>