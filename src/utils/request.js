import axios from 'axios';
import router from '../router/route';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
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
    const res = response.data;
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }

    if (res.code === '401' || res.code === 401) {
        ElMessage.error('登录状态已过期，请重新登录');
        localStorage.removeItem('user_info');
        router.push('/login');
    }

    return res;
}, error => {
    console.error('响应错误：', error);
    ElMessage.error('网络异常或服务器宕机');
    return Promise.reject(error)
});

export default request;