import axios from 'axios';
import router from '../router/route';
import { ElMessage } from 'element-plus';
import { encryption } from './crypto';

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

    if (config.method === 'post' || config.method === 'put') {
        if (config.data) {
            const dataStr = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);

            const needEncrypt = config.url && (
                config.url.includes('/users/') &&
                !config.url.includes('/users/register') &&
                !config.url.includes('/users/login')
            );

            if (needEncrypt) {
                const encrypted = encryption.encryptHybrid(dataStr);
                config.data = {
                    encryptedData: encrypted.encryptedData,
                    encryptedKey: encrypted.encryptedKey
                };
                config.headers['Content-Type'] = 'application/json';
            }
        }
    }
    return config;
}, error => {
    return Promise.reject(error)
});

request.interceptors.response.use(response => {
    const res = response.data;

    if (res && res.encryptedKey && res.data) {
        try {
            const privateKey = localStorage.getItem('rsa_private_key');
            if (privateKey) {
                const decrypted = encryption.decryptHybrid(
                    res.data,
                    res.encryptedKey,
                    privateKey
                );
                res.data = JSON.parse(decrypted);
            }
        } catch (error) {
            Element.Message.error('数据解密失败');
            console.error('解密错误：', error);
        }
    }

    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }

    if (res.code === '401' || res.code === 401) {
        ElMessage.error('登录状态已过期，请重新登录');
        localStorage.removeItem('userInfo');
        router.push('/login');
    }

    return res;
}, error => {
    console.error('响应错误：', error);
    ElMessage.error('网络异常或服务器宕机');
    return Promise.reject(error)
});

export default request;