import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const publicKey = import.meta.env.VITE_APP_RSA_PUBLIC_KEY;

export const encryption = {
    passwordHash(password) {
        return CryptoJS.SHA256(password).toString();
    },

    generateAESKey() {
        return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
    },

    encryptAES(data, key) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Base64.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    const combined = iv.concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
},

    decryptAES(encryptedData, key) {
    const combined = CryptoJS.enc.Base64.parse(encryptedData);
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4), combined.sigBytes - 16);
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        CryptoJS.enc.Base64.parse(key),
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
},

    encryptRSA(data, publicKey) {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        return encryptor.encrypt(data);
    },

    decryptRSA(privateKey, encrypted) {
        const decryptor = new JSEncrypt();
        decryptor.setPrivateKey(privateKey);
        return decryptor.decrypt(encrypted);
    },

    encryptHybrid(data) {
        const aesKey = this.generateAESKey();
        const encryptedData = this.encryptAES(data, aesKey);
        const encryptedKey = this.encryptRSA(aesKey, publicKey);
        return {
            encryptedData,
            encryptedKey
        };
    },

    decryptHybrid(encryptedData, encryptedKey, privateKey) {
        const aesKey = this.decryptRSA(privateKey, encryptedKey);
        const decrypted = this.decryptAES(encryptedData, aesKey);
        return decrypted;
    }
};