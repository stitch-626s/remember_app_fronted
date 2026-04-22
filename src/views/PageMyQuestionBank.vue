<template>
  <div class="my-bank-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">我的题库</h1>
        <p class="page-description">管理您创建的所有题库和题目</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新建题库
        </el-button>
      </div>
    </div>

    <div class="banks-list">
      <div v-for="bank in tableData" :key="bank.qbId" :class="['bank-item', { selected: selectedBankId === bank.qbId }]"
        @click="selectBank(bank)">
        <div class="bank-checkbox">
          <el-checkbox :model-value="selectedBankId === bank.qbId" @change="selectBank(bank)" @click.stop />
        </div>

        <div class="bank-icon" :style="{ background: getGradient(bank.qbId) }">
          <el-icon :size="24">
            <FolderOpened />
          </el-icon>
        </div>

        <div class="bank-info">
          <h3 class="bank-name">{{ bank.qbName }}</h3>
          <p class="bank-desc">{{ bank.qbDescription || '暂无描述' }}</p>
        </div>

        <div class="bank-stats">
          <span class="stat-badge">{{ bank.questionNumber || 0 }} 题</span>
        </div>

        <div class="bank-actions">
          <el-button-group>
            <el-button size="small" @click.stop="handleViewBank(bank)">
              <el-icon>
                <View />
              </el-icon>
            </el-button>

            <el-button size="small" @click.stop="handleEditBank(bank)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>

            <el-button size="small" type="danger" @click.stop="handleDeleteBank(bank)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>

      <div v-if="tableData.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="64">
            <FolderAdd />
          </el-icon>
        </div>

        <h3>还没有创建题库</h3>
        <p>点击上方"新建题库"按钮开始创建您的第一个题库</p>

        <el-button type="primary" size="large" @click="handleAdd">
          <el-icon>
            <Plus />
          </el-icon>
          立即创建
        </el-button>
      </div>
    </div>

    <el-dialog v-model="bankDialogVisible" :title="bankDialogType === 'add' ? '新建题库' : '编辑题库'" width="480px"
      :close-on-click-modal="false">
      <el-form :model="bankForm" label-position="top" class="dialog-form">
        <el-form-item label="题库名称" required>
          <el-input v-model="bankForm.qbName" placeholder="请输入题库名称" size="large" />
        </el-form-item>

        <el-form-item label="题库描述">
          <el-input type="textarea" v-model="bankForm.qbDescription" placeholder="请输入题库描述（可选）" :rows="4" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="bankDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBankForm" :loading="submitting">
          {{ bankDialogType === 'add' ? '创建' : '保存' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="questionListDialogVisible" :title="currentBankName" width="900px" :close-on-click-modal="false"
      class="question-dialog">
      <div class="question-dialog-header">
        <div class="question-count">
          共 {{ questionTableData.length }} 道题目
        </div>

        <div class="question-actions">
          <el-button type="primary" @click="handleQuestionAdd">
            <el-icon>
              <Plus />
            </el-icon>
            新增题目
          </el-button>
        </div>
      </div>

      <div class="questions-list">
        <div v-for="(question, index) in questionTableData" :key="question.questionId"
          :class="['question-item', { selected: selectedQuestionId === question.questionId }]"
          @click="selectQuestion(question)">
          <div class="question-index">{{ index + 1 }}</div>

          <div class="question-content">
            <div class="question-text">{{ question.questionName }}</div>
            <div class="question-answer">{{ question.questionAnswer }}</div>
          </div>

          <div class="question-item-actions">
            <el-button text @click.stop="handleQuestionView(question)">
              <el-icon>
                <View />
              </el-icon>
            </el-button>

            <el-button text @click.stop="handleQuestionEdit(question)">
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>

            <el-button text type="danger" @click.stop="handleQuestionDelete(question)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>

        <div v-if="questionTableData.length === 0" class="empty-questions">
          <el-icon :size="48">
            <Document />
          </el-icon>
          <p>暂无题目，点击"新增题目"添加</p>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="questionFormDialogVisible" :title="questionFormType === 'add' ? '新增题目' : '编辑题目'" width="600px"
      append-to-body :close-on-click-modal="false">
      <el-form :model="questionForm" label-position="top" class="dialog-form">
        <el-form-item label="题目内容" required>
          <el-input type="textarea" v-model="questionForm.questionName" placeholder="请输入题目内容" :rows="4" />
        </el-form-item>

        <el-form-item label="答案解析" required>
          <el-input type="textarea" v-model="questionForm.questionAnswer" placeholder="请输入答案解析" :rows="6" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="questionFormDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitQuestionForm" :loading="submitting">
          {{ questionFormType === 'add' ? '添加' : '保存' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="questionViewDialogVisible" title="题目详情" width="600px" append-to-body>
      <div class="question-view">
        <div class="view-section">
          <div class="view-label">题目</div>
          <div class="view-content">{{ currentViewQuestion.questionName }}</div>
        </div>

        <div class="view-section">
          <div class="view-label">答案解析</div>
          <div class="view-content answer">{{ currentViewQuestion.questionAnswer }}</div>
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="questionViewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Plus,
  FolderOpened,
  View,
  Edit,
  Delete,
  Document,
  FolderAdd
} from '@element-plus/icons-vue';
import request from '../utils/request';

const tableData = ref([]);
const selectedBankId = ref(null);
const submitting = ref(false);

const bankDialogVisible = ref(false);
const bankDialogType = ref('add');
const bankForm = ref({ qbId: 0, qbName: '', qbDescription: '' });

const questionListDialogVisible = ref(false);
const questionTableData = ref([]);
const currentBankId = ref(null);
const currentBankName = ref('');
const selectedQuestionId = ref(null);

const questionFormDialogVisible = ref(false);
const questionFormType = ref('add');
const questionForm = ref({ questionId: 0, questionName: '', questionAnswer: '' });

const questionViewDialogVisible = ref(false);
const currentViewQuestion = ref({ questionId: 0, questionName: '', questionAnswer: '' });

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
];

const getGradient = (id) => gradients[id % gradients.length];

const getUserId = () => {
  const userInfoStr = localStorage.getItem('user_info');
  if (!userInfoStr) return null
  const userData = JSON.parse(userInfoStr);
  return userData?.user?.userId || userData?.userId
}

const loadData = async () => {
  const userId = getUserId();
  if (userId) {
    const res = await request.get(`/questionBank/user/${userId}`);
    if (res.code === 200 || res.code === "200") {
      tableData.value = res.data;
    }
  }
}

const selectBank = (bank) => {
  selectedBankId.value = selectedBankId.value === bank.qbId ? null : bank.qbId;
}

const selectQuestion = (question) => {
  selectedQuestionId.value = selectedQuestionId.value === question.questionId ? null : question.questionId;
}

const handleAdd = () => {
  bankForm.value = { qbId: 0, qbName: '', qbDescription: '' };
  bankDialogType.value = 'add';
  bankDialogVisible.value = true;
}

const handleEditBank = (bank) => {
  bankForm.value = { qbId: bank.qbId, qbNName: bank.qbName, qbDescription: bank.qbDescription };
  bankDialogType.value = 'edit';
  bankDialogVisible.value = true;
}

const handleDeleteBank = async (bank) => {
  try {
    await ElMessageBox.confirm(`确定要删除题库"${bank.qbName}"吗？此操作不可恢复。`, '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });
    await request.delete(`/questionBank/${bank.qbId}`);
    ElMessage.success('删除成功');
    loadData();
  } catch {
    ElMessage.error("删除失败");
  }
}

const submitBankForm = async () => {
  if (!bankForm.value.qbName.trim()) {
    ElMessage.warning('请输入题库名称');
    return
  };

  submitting.value = true;
  try {
    const userId = getUserId();
    if (bankDialogType.value === 'add') {
      await request.post('/questionBank', { userId: userId, ...bankForm.value });
      ElMessage.success('创建成功');
    } else {
      await request.put('/questionBank', bankForm.value);
      ElMessage.success('保存成功');
    }
    bankDialogVisible.value = false;
    loadData();
  } finally {
    submitting.value = false;
  }
}

const handleViewBank = (bank) => {
  currentBankId.value = bank.qbId;
  currentBankName.value = bank.qbName;
  questionTableData.value = bank.questions || [];
  selectedQuestionId.value = null;
  questionListDialogVisible.value = true;
}

const refreshQuestions = async () => {
  const res = await request.get(`/questionBank/${currentBankId.value}`);
  if (res.code === 200 || res.code === "200") {
    questionTableData.value = res.data?.questions || [];
    loadData();
  }
}

const handleQuestionAdd = () => {
  questionForm.value = { question_id: 0, questionName: '', questionAnswer: '' };
  questionFormType.value = 'add';
  questionFormDialogVisible.value = true;
}

const handleQuestionEdit = (question) => {
  questionForm.value = { ...question };
  questionFormType.value = 'edit';
  questionFormDialogVisible.value = true;
}

const handleQuestionView = (question) => {
  currentViewQuestion.value = { ...question };
  questionViewDialogVisible.value = true;
}

const handleQuestionDelete = async (question) => {
  try {
    await ElMessageBox.confirm('确定要删除这道题目吗？', '确认删除', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });
    await request.delete(`/question/${question.questionId}`);
    ElMessage.success('删除成功');
    refreshQuestions();
  } catch {
    ElMessage.error("删除失败");
  }
}

const submitQuestionForm = async () => {
  if (!questionForm.value.questionName.trim() || !questionForm.value.questionAnswer.trim()) {
    ElMessage.warning('请填写题目和答案');
    return;
  }

  submitting.value = true;
  try {
    const userId = getUserId();
    if (questionFormType.value === 'add') {
      await request.post('/question', {
        qbId: currentBankId.value,
        userId: userId,
        ...questionForm.value
      });
      ElMessage.success('添加成功');
    } else {
      await request.put('/question', questionForm.value);
      ElMessage.success('保存成功');
    }
    questionFormDialogVisible.value = false;
    refreshQuestions();
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadData();
})
</script>

<style scoped>
@import '../assets/styles/myquestionbank.css';
</style>