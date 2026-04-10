<template>
  <div class="my-bank-container">
    <div class="top-header">
      <div class="title">我的题库</div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-button type="warning" @click="handleEdit">修改</el-button>
        <el-button type="success" @click="handleViewBank">查看</el-button>
        <el-button type="danger"  @click="handleDelete">删除</el-button>
      </div>
    </div>

    <el-table 
      ref="bankTableRef"
      class="table-container" 
      :data="tableData" 
      :cell-style="{ padding: '15px 0' }"
      @selection-change="handleBankSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column class="name_column" label="题库名称" property="qb_name" />
      <el-table-column class="number_column" property="question_number" label="题目数量" />
      <el-table-column class="desc_column" property="qb_description" label="题库描述" show-overflow-tooltip />
    </el-table>

    <el-dialog 
      v-model="bankDialogVisible" 
      :title="bankDialogType === 'add' ? '新增题库' : '修改题库'" 
      width="400px"
    >
      <el-form :model="bankForm" label-width="80px">
        <el-form-item label="题库名称">
          <el-input v-model="bankForm.qb_name" placeholder="请输入题库名称" />
        </el-form-item>
        <el-form-item label="题库描述">
          <el-input type="textarea" v-model="bankForm.qb_description" placeholder="请输入题库描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="bankDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBankForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="questionListDialogVisible" 
      :title="`题库题目列表 - ${currentBankName}`" 
      width="800px"
    >
      <div class="dialog-toolbar">
        <el-button type="primary" @click="handleQuestionAdd">新增题目</el-button>
        <el-button type="warning" @click="handleQuestionEdit">修改题目</el-button>
        <el-button type="success" @click="handleQuestionView">查看题目</el-button>
        <el-button type="danger"  @click="handleQuestionDelete">删除题目</el-button>
      </div>

      <el-table 
        ref="questionTableRef"
        :data="questionTableData" 
        height="400px"
        @selection-change="handleQuestionSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="题目" property="question_name" show-overflow-tooltip />
        <el-table-column label="答案" property="question_answer" show-overflow-tooltip />
      </el-table>
    </el-dialog>

    <el-dialog 
      v-model="questionFormDialogVisible" 
      :title="questionFormType === 'add' ? '新增题目' : '修改题目'" 
      width="500px"
      append-to-body 
    >
      <el-form :model="questionForm" label-width="80px">
        <el-form-item label="题目内容">
          <el-input type="textarea" :rows="3" v-model="questionForm.question_name" placeholder="请输入题目" />
        </el-form-item>
        <el-form-item label="题目答案">
          <el-input type="textarea" :rows="4" v-model="questionForm.question_answer" placeholder="请输入答案解析" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="questionFormDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitQuestionForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog 
      v-model="questionViewDialogVisible" 
      title="题目详情" 
      width="500px"
      append-to-body
    >
      <div class="question-view-box">
        <div class="question-view-item">
          <div class="question-view-label">题目：</div>
          <div class="question-view-content">{{ currentViewQuestion.question_name }}</div>
        </div>
        <div class="question-view-item">
          <div class="question-view-label">答案解析：</div>
          <div class="question-view-content">{{ currentViewQuestion.question_answer }}</div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="questionViewDialogVisible = false">关 闭</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '../utils/request';

const tableData = ref([]); 
const selectedBankRows = ref([]); 
const bankTableRef = ref(null); 

const bankDialogVisible = ref(false); 
const bankDialogType = ref('add'); 
const bankForm = ref({ qb_name: '', qb_description: '' });

const getUserId = () => {
  const userInfoStr = localStorage.getItem("user_info");
  if (!userInfoStr) return null;
  const userData = JSON.parse(userInfoStr);
  return userData?.user?.user_id || userData?.user?.userId || userData?.user_id || userData?.userId;
};

const loadData = () => {
  const userId = getUserId();
  if (userId) {
    request.get(`/questionBank/user/${userId}`).then(res => {
      if (res.code == 200) tableData.value = res.data;
    });
  }
};

const handleBankSelectionChange = (val) => {
  selectedBankRows.value = val; 
};

const handleAdd = () => {
  if (bankTableRef.value) bankTableRef.value.clearSelection();
  bankForm.value = { qb_name: '', qb_description: '' };
  bankDialogType.value = 'add';
  bankDialogVisible.value = true;
};

const handleEdit = () => {
  if (selectedBankRows.value.length !== 1) {
    ElMessage.warning('请选择且只能选择一个题库进行修改！');
    return;
  }
  bankForm.value = { ...selectedBankRows.value[0] };
  bankDialogType.value = 'edit';
  bankDialogVisible.value = true;
};

const handleDelete = () => {
  if (selectedBankRows.value.length === 0) {
    ElMessage.warning('请至少选择一个要删除的题库！');
    return;
  }
  ElMessageBox.confirm(`确定要删除这 ${selectedBankRows.value.length} 个题库吗？`, '警告', { type: 'error' }).then(async () => {
    const deletePromises = selectedBankRows.value.map(row => request.delete(`/questionBank/${row.qb_id}`));
    await Promise.all(deletePromises);
    ElMessage.success('删除题库成功');
    loadData();
  }).catch(() => {});
};

const submitBankForm = () => {
  const userId = getUserId();
  if (bankDialogType.value === 'add') {
    request.post('/questionBank', { user_id: userId, ...bankForm.value }).then(res => {
      if (res.code == 200) { ElMessage.success('新增题库成功'); bankDialogVisible.value = false; loadData(); }
    });
  } else {
    request.put('/questionBank', bankForm.value).then(res => {
      if (res.code == 200) { ElMessage.success('修改题库成功'); bankDialogVisible.value = false; loadData(); }
    });
  }
};

const questionListDialogVisible = ref(false);
const questionTableData = ref([]);
const currentBankId = ref(null); 
const currentBankName = ref('');

const selectedQuestionRows = ref([]); 
const questionTableRef = ref(null);

const questionFormDialogVisible = ref(false);
const questionFormType = ref('add');
const questionForm = ref({ question_name: '', question_answer: '' });

const questionViewDialogVisible = ref(false);
const currentViewQuestion = ref({});

const refreshQuestions = async () => {
  try {
    const res = await request.get(`/questionBank/${currentBankId.value}`);
    if (res.code == 200) {
      questionTableData.value = res.data.questions || [];
      loadData();
    }
  } catch (error) {
    console.error(error);
  }
};

const handleViewBank = () => {
  if (selectedBankRows.value.length !== 1) {
    ElMessage.warning('请选择且只能选择一个题库查看其题目！');
    return;
  }
  const bank = selectedBankRows.value[0];
  currentBankId.value = bank.qb_id;
  currentBankName.value = bank.qb_name;
  questionTableData.value = bank.questions || [];
  questionListDialogVisible.value = true;
};

const handleQuestionSelectionChange = (val) => {
  selectedQuestionRows.value = val;
};

const handleQuestionAdd = () => {
  if (questionTableRef.value) questionTableRef.value.clearSelection();
  questionForm.value = { question_name: '', question_answer: '' };
  questionFormType.value = 'add';
  questionFormDialogVisible.value = true;
};

const handleQuestionEdit = () => {
  if (selectedQuestionRows.value.length !== 1) {
    ElMessage.warning('请选择且只能选择一道题目进行修改！');
    return;
  }
  questionForm.value = { ...selectedQuestionRows.value[0] };
  questionFormType.value = 'edit';
  questionFormDialogVisible.value = true;
};

const handleQuestionView = () => {
  if (selectedQuestionRows.value.length !== 1) {
    ElMessage.warning('请选择且只能选择一道题目查看！');
    return;
  }
  currentViewQuestion.value = { ...selectedQuestionRows.value[0] };
  questionViewDialogVisible.value = true;
};

const handleQuestionDelete = () => {
  if (selectedQuestionRows.value.length === 0) {
    ElMessage.warning('请至少选择一道要删除的题目！');
    return;
  }
  ElMessageBox.confirm(`确定要删除这 ${selectedQuestionRows.value.length} 道题目吗？`, '警告', { type: 'error' }).then(async () => {
    const deletePromises = selectedQuestionRows.value.map(row => request.delete(`/question/${row.question_id}`));
    await Promise.all(deletePromises);
    ElMessage.success('删除题目成功');
    refreshQuestions();
  }).catch(() => {});
};

const submitQuestionForm = () => {
  if (!questionForm.value.question_name || !questionForm.value.question_answer) {
    ElMessage.error('题目和答案不能为空！');
    return;
  }

  const userId = getUserId();
  
  if (questionFormType.value === 'add') {
    const postData = {
      qb_id: currentBankId.value,
      user_id: userId,
      question_name: questionForm.value.question_name,
      question_answer: questionForm.value.question_answer
    };
    request.post('/question', postData).then(res => {
      if (res.code == 200) { 
        ElMessage.success('新增题目成功'); 
        questionFormDialogVisible.value = false; 
        refreshQuestions(); 
      }
    });
  } else {
    request.put('/question', questionForm.value).then(res => {
      if (res.code == 200) { 
        ElMessage.success('修改题目成功'); 
        questionFormDialogVisible.value = false; 
        refreshQuestions(); 
      }
    });
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
@import '../assets/styles/myquestionbank.css';
</style>