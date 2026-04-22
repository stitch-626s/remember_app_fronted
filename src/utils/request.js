import axios from 'axios';
import router from '../router/route';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000
});

request.interceptors.request.use(config => {
    const userInfoStr = localStorage.getItem('user_info');
    if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo.token) {
            config.headers['Authorization'] = 'Bearer ' + userInfo.token;
        }
    }
    return config;
}, error => {
    return Promise.reject(error)
});

request.interceptors.response.use(response => {
    return response.data;
}, error => {
    console.error('Response error:', error);
    if (error.response) {
        if (error.response.status === 401) {
            ElMessage.error('登录状态已过期，请重新登录');
            localStorage.removeItem('user_info');
            router.push('/login');
        } else {
            ElMessage.error(error.response.data?.message || '请求失败');
        }
    } else {
        ElMessage.error('网络异常，请检查后端服务');
    }
    return Promise.reject(error);
});

export default request;