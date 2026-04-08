<template>
    <div>
        <el-table class="table-container" :data="questionBank" :cell-style="{ padding: '15px 0' }" >
        <el-table-column class="name_column" label="题库名称">
            <template #default="scope">
                {{ scope.row.qb_name }}
            </template>
        </el-table-column>
        <el-table-column 
            class="number_column" 
            property="question_number" 
            label="题目数量" 
            />
        <el-table-column
            class="desc_column"
            property="qb_description" 
            label="题库描述" 
            show-overflow-tooltip 
        />
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '../utils/request';
import { ElMessage } from 'element-plus';

const questionBank = ref([]);

const loadQuestionBank = () => {
    request.get('/questionBank').then(res => {
        if (res.code == 200) {
            questionBank.value = res.data
                console.log('后端返回数据：', res);
        } else {
            console.error('获取失败，状态码：', res.code);
            ElMessage.error(res.message || '加载题库失败，请重试');
        }
    })
}

onMounted(() => {
    loadQuestionBank();
})
</script>