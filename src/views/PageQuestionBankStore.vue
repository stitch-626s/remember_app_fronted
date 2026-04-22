<template>
  <div class="store-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">题库中心</h1>
        <p class="page-description">探索海量优质题库，开启高效学习之旅</p>
      </div>
      <div class="header-search">
        <el-input v-model="searchKeyword" placeholder="搜索题库..." size="large" :prefix-icon="Search" clearable
          class="search-input" />
      </div>
    </div>

    <div class="category-tabs">
      <button v-for="category in categories" :key="category.value"
        :class="['category-tab', { active: activeCategory === category.value }]"
        @click="activeCategory = category.value">
        {{ category.label }}
      </button>
    </div>

    <div class="banks-grid">
      <div v-for="bank in filteredBanks" :key="bank.qbId" class="bank-card" @click="viewBank(bank)">
        <div class="bank-icon" :style="{ background: getGradient(bank.qbId) }">
          <el-icon :size="28">
            <FolderOpened />
          </el-icon>
        </div>
        <div class="bank-content">
          <h3 class="bank-name">{{ bank.qbName }}</h3>
          <p class="bank-desc">{{ bank.qbDescription }}</p>
          <div class="bank-meta">
            <span class="meta-item">
              <el-icon>
                <Document />
              </el-icon>
              {{ bank.questionNumber }} 题
            </span>
          </div>
        </div>
        <div class="bank-action">
          <el-button type="primary" size="small" round>
            查看
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="questionListDialogVisible" :title="currentBankName" width="800px" :close-on-click-modal="false">
      <div class="questions-list" v-if="questionTableData.length > 0">
        <div v-for="(question, index) in questionTableData" :key="question.questionId" class="question-item">
          <div class="question-index">{{ index + 1 }}</div>
          <div class="question-content">
            <div class="question-text">题目： {{ question.questionName }}</div>
            <div class="question-answer">答案： {{ question.questionAnswer }}</div>
          </div>
        </div>
      </div>

      <div v-else class="empty-questions">
        <p>暂无题目</p>
      </div>

      <template #footer>
        <el-button @click="questionListDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <div v-if="filteredBanks.length === 0" class="empty-state">
      <el-icon :size="64" class="empty-icon">
        <FolderOpened />
      </el-icon>
      <h3>未找到相关题库</h3>
      <p>尝试修改搜索关键词或选择其他分类</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, FolderOpened, Document } from '@element-plus/icons-vue';
import request from '../utils/request';

const questionBanks = ref([]);
const searchKeyword = ref('');
const activeCategory = ref('all');

const questionListDialogVisible = ref(false);
const questionTableData = ref([]);
const currentBankId = ref(null);
const currentBankName = ref('');

const categories = [
  { label: '全部', value: 'all' },
  // { label: '编程开发', value: 'dev' },
  // { label: '数据结构', value: 'data' },
  // { label: '前端技术', value: 'frontend' },
  // { label: '后端技术', value: 'backend' }
];

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
];

const getGradient = (id) => gradients[id % gradients.length];

const filteredBanks = computed(() => {
  let banks = questionBanks.value;

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    banks = banks.filter(b =>
      b.qbName.toLowerCase().includes(keyword) ||
      b.qbDescription.toLowerCase().includes(keyword)
    );
  }

  return banks;
})

const loadQuestionBanks = async () => {
  try {
    const res = await request.get('/questionBank');
    if (res.code === 200 || res.code === "200") {
      questionBanks.value = res.data;
    }
  } catch (error) {
    console.error('加载题库失败:', error);
  }
}

const viewBank = async (bank) => {
  currentBankId.value = bank.qbId;
  currentBankName.value = bank.qbName;

  try {
    const res = await request.get(`/questionBank/${bank.qbId}`);
    if (res.code === 200 || res.code === "200") {
      questionTableData.value = res.data?.questions || [];
      questionListDialogVisible.value = true;
    }
  } catch (error) {
    ElMessage.error('加载题库详情失败');
  }
}

onMounted(() => {
  loadQuestionBanks();
})
</script>

<style scoped>
@import '../assets/styles/questionbankstore.css';
</style>