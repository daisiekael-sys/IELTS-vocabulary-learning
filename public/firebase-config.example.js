/**
 * firebase-config.example.js - Firebase 项目配置模板
 * 
 * 使用方法：
 * 1. 复制此文件为 firebase-config.js
 * 2. 填入你的 Firebase 项目配置
 * 
 * ⚠️ firebase-config.js 已在 .gitignore 中排除，不会被提交到 GitHub
 * 线上部署通过 GitHub Actions Secrets 自动注入
 */
window.authConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
