import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY;

export const encryption = {
    passwordHash(password) {
        return CryptoJS.SHA256(password).toString();
    },
    
    userInfoEncrypt(data) {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        return encryptor.encrypt(data);
    }
};