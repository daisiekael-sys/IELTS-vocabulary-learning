/**
 * miniprogram/utils/firebase-config.example.js - 小程序端 Firebase 配置模板
 * 
 * 使用方法：
 * 1. 复制此文件为 firebase-config.js
 * 2. 填入你的 Firebase 项目配置（与网页版 public/firebase-config.js 保持一致）
 * 
 * ⚠️ firebase-config.js 已在 .gitignore 中排除，不会被提交到 GitHub
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const DEFAULT_USER_ID = 'YOUR_DEFAULT_FIREBASE_UID';

module.exports = {
  firebaseConfig,
  DEFAULT_USER_ID
};
