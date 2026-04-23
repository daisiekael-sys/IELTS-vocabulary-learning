/**
 * auth.js - Firebase Authentication 模块
 * 使用 Firebase v9 compat SDK（CDN 版本）
 * 强制使用 Firebase Auth，不使用 localStorage 降级
 */

// Firebase 项目配置（从 firebase-config.js 加载，如未加载则使用空配置）
const authConfig = window.authConfig || {};

// 全局状态
window.firebaseInitialized = false;
window._firebaseInitPromise = null;

/**
 * 动态加载 script 标签
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 防止重复加载
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load: ' + src));
        document.head.appendChild(script);
    });
}

/**
 * 加载 Firebase SDK 并初始化
 * 优先使用本地文件，失败则从 jsDelivr CDN 加载（国内可访问）
 */
async function initFirebase() {
    if (window.firebaseInitialized) return;

    const cdnSets = [
        // 本地文件（firebase-hosting 部署后可用）
        [
            'firebase/firebase-app.js',
            'firebase/firebase-auth.js',
            'firebase/firebase-firestore.js'
        ],
        // jsDelivr CDN（国内可访问，Firebase v8 compat）
        [
            'https://cdn.jsdelivr.net/npm/firebase@8.10.1/app/dist/index.cjs.js',
            'https://cdn.jsdelivr.net/npm/firebase@8.10.1/auth/dist/index.cjs.js',
            'https://cdn.jsdelivr.net/npm/firebase@8.10.1/firestore/dist/index.cjs.js'
        ],
        // unpkg CDN（备用）
        [
            'https://unpkg.com/firebase@8.10.1/firebase-app.js',
            'https://unpkg.com/firebase@8.10.1/firebase-auth.js',
            'https://unpkg.com/firebase@8.10.1/firebase-firestore.js'
        ],
        // Google CDN（海外直连）
        [
            'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
            'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
            'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
        ]
    ];

    let lastError = null;

    for (const cdnGroup of cdnSets) {
        try {
            console.log('[Auth] Trying CDN:', cdnGroup[0]);
            await loadScript(cdnGroup[0]);

            // 验证 firebase 对象存在
            if (typeof firebase === 'undefined') {
                throw new Error('firebase object not found after loading app.js');
            }

            // 并行加载 auth 和 firestore
            await Promise.all([
                loadScript(cdnGroup[1]),
                loadScript(cdnGroup[2])
            ]);

            console.log('[Auth] Firebase SDK loaded successfully');
            break; // 成功，退出循环
        } catch (err) {
            console.warn('[Auth] CDN failed:', cdnGroup[0], err.message);
            lastError = err;
            continue;
        }
    }

    if (typeof firebase === 'undefined') {
        throw new Error('所有 CDN 均加载失败，请检查网络连接。' + (lastError ? lastError.message : ''));
    }

    // 初始化 Firebase App（防止重复初始化）
    if (!firebase.apps.length) {
        firebase.initializeApp(authConfig);
    }

    window.auth = firebase.auth();
    window.db = firebase.firestore();
    window.firebaseInitialized = true;
    console.log('[Auth] Firebase initialized successfully');

    // 监听认证状态
    window.auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('[Auth] User is logged in:', user.email);
            // 登录后自动从云端同步数据
            syncDataFromCloud().then(() => {
                document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
            });
        } else {
            console.log('[Auth] No user logged in');
            document.dispatchEvent(new CustomEvent('userLoggedOut'));
        }
    });
}

/**
 * 等待 Firebase 初始化完成（幂等，多次调用安全）
 */
function waitForFirebase() {
    if (!window._firebaseInitPromise) {
        window._firebaseInitPromise = initFirebase();
    }
    return window._firebaseInitPromise;
}

/**
 * 注册用户
 */
async function registerUser(email, password) {
    await waitForFirebase();

    try {
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        console.log('[Auth] User registered:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        // 将 Firebase 错误码转换为中文
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
}

/**
 * 登录用户
 */
async function loginUser(email, password) {
    await waitForFirebase();

    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        console.log('[Auth] User logged in:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        throw new Error(translateFirebaseError(error.code) || error.message);
    }
}

/**
 * 登出用户
 */
async function logoutUser() {
    await waitForFirebase();
    await window.auth.signOut();
    console.log('[Auth] User logged out');
}

/**
 * 同步数据到云端 Firestore（节流：30秒内最多一次）
 */
let _lastSyncTime = 0;
async function syncDataWithCloud(force) {
    if (!window.firebaseInitialized || !window.auth || !window.auth.currentUser) return;
    const now = Date.now();
    if (!force && now - _lastSyncTime < 30000) return; // 30s 节流
    _lastSyncTime = now;

    const user = window.auth.currentUser;
    const localData = localStorage.getItem('ielts_learning_system');
    if (!localData) return;

    try {
        const data = JSON.parse(localData);
        await window.db.collection('users').doc(user.uid).set({
            data: data,
            lastSync: new Date().toISOString()
        });
        console.log('[Auth] Data synced to cloud');
        showToast('数据已同步到云端 ✓', '#4CAF50');
    } catch (err) {
        console.error('[Auth] Sync failed:', err);
    }
}

/**
 * 从云端 Firestore 拉取数据
 */
async function syncDataFromCloud() {
    if (!window.firebaseInitialized || !window.auth || !window.auth.currentUser) return;

    const user = window.auth.currentUser;
    try {
        const doc = await window.db.collection('users').doc(user.uid).get();
        if (doc.exists && doc.data().data) {
            localStorage.setItem('ielts_learning_system', JSON.stringify(doc.data().data));
            document.dispatchEvent(new CustomEvent('dataSynced'));
            console.log('[Auth] Data synced from cloud');
        }
    } catch (err) {
        console.error('[Auth] Sync from cloud failed:', err);
    }
}

/**
 * 显示轻提示
 */
function showToast(message, bgColor) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:20px;right:20px;background:${bgColor || '#333'};color:#fff;padding:12px 20px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.2);z-index:99999;font-size:14px;transition:opacity .4s`;
    el.textContent = message;
    document.body && document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }, 3000);
}

/**
 * Firebase 错误码 → 中文提示
 */
function translateFirebaseError(code) {
    const map = {
        'auth/email-already-in-use': '该邮箱已被注册，请直接登录',
        'auth/invalid-email': '邮箱格式不正确',
        'auth/weak-password': '密码强度不够，至少需要6位字符',
        'auth/user-not-found': '该邮箱尚未注册，请先注册',
        'auth/wrong-password': '密码错误，请重试',
        'auth/too-many-requests': '登录尝试次数过多，请稍后再试',
        'auth/network-request-failed': '网络连接失败，请检查网络后重试',
        'auth/user-disabled': '该账户已被禁用',
        'auth/invalid-credential': '邮箱或密码错误',
    };
    return map[code] || null;
}

// 暴露到全局
window.authConfig = authConfig;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.syncDataWithCloud = syncDataWithCloud;
window.syncDataFromCloud = syncDataFromCloud;
window.waitForFirebase = waitForFirebase;

// 页面加载时立即开始初始化（不阻塞，后台并行）
waitForFirebase().catch(err => {
    console.error('[Auth] Firebase initialization failed:', err);
    showToast('⚠️ Firebase 连接失败：' + err.message, '#e53935');
});
