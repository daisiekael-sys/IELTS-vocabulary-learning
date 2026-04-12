// 登录系统配置
const authConfig = {
    apiKey: "AIzaSyA3zBg6XgHrFZgVfH86TxjnSlSzi44_Ekk",
    authDomain: "synonymous-substitutions.firebaseapp.com",
    projectId: "synonymous-substitutions",
    storageBucket: "synonymous-substitutions.firebasestorage.app",
    messagingSenderId: "183899195249",
    appId: "1:183899195249:web:3d2e2bb9590df74cbfd8d0"
};

// 初始化状态
window.firebaseInitialized = false;
window.localAuthEnabled = true; // 启用本地认证
console.log('Auth.js loaded, starting Firebase initialization');

// 主动加载Firebase SDK
console.log('Initiating Firebase SDK loading immediately');
loadFirebaseSDK();

// 加载Firebase SDK函数
function loadFirebaseSDK() {
    console.log('Loading Firebase SDK...');
    
    // 检查是否在Trae IDE环境中运行
    const isTraeIDE = window.location.href.includes('localhost:8000') || window.location.href.includes('127.0.0.1');
    console.log('Running in local development environment:', isTraeIDE);
    
    // 在本地开发环境中，直接使用本地存储模式
    if (isTraeIDE) {
        console.log('Local development environment detected, using local storage mode');
        return;
    }
    
    // 检查网络连接
    const isOnline = navigator.onLine;
    console.log('Network status:', isOnline ? 'Online' : 'Offline');
    
    if (!isOnline) {
        console.warn('Offline mode detected, will use local storage');
        return;
    }
    
    console.log('Attempting to load Firebase SDK from primary CDN...');
    // 先加载firebase-app.js，再加载其他模块
    loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js')
        .then(() => {
            console.log('Firebase App loaded, loading additional modules...');
            return Promise.allSettled([
                loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js'),
                loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js')
            ]);
        })
        .then(results => {
            console.log('Primary CDN loading results:', results);
            const failed = results.filter(r => r.status === 'rejected');
            if (failed.length === 0) {
                console.log('All Firebase SDKs loaded successfully from primary CDN');
            } else {
                console.error(`${failed.length} Firebase SDKs failed to load from primary CDN`);
                console.log('Failed results:', failed);
                console.log('Trying alternative CDN...');
                loadFirebaseSDKFromAlternativeCDN();
            }
        })
        .catch(error => {
            console.error('Error loading Firebase App:', error);
            console.log('Error stack:', error.stack);
            console.log('Trying alternative CDN...');
            loadFirebaseSDKFromAlternativeCDN();
        });
}

// 从备用CDN加载Firebase SDK
function loadFirebaseSDKFromAlternativeCDN() {
    console.log('Loading Firebase SDK from alternative CDN...');
    
    // 先加载firebase-app.js，再加载其他模块
    loadScript('https://cdn.jsdelivr.net/npm/firebase@9.22.2/dist/firebase-app.js')
        .then(() => {
            console.log('Firebase App loaded from alternative CDN, loading additional modules...');
            return Promise.allSettled([
                loadScript('https://cdn.jsdelivr.net/npm/firebase@9.22.2/dist/firebase-auth.js'),
                loadScript('https://cdn.jsdelivr.net/npm/firebase@9.22.2/dist/firebase-firestore.js')
            ]);
        })
        .then(results => {
            console.log('Alternative CDN loading results:', results);
            const failed = results.filter(r => r.status === 'rejected');
            if (failed.length === 0) {
                console.log('All Firebase SDKs loaded successfully from alternative CDN');
            } else {
                console.error(`${failed.length} Firebase SDKs failed to load from alternative CDN`);
                console.log('Failed results:', failed);
                console.warn('Falling back to local storage mode');
            }
        })
        .catch(error => {
            console.error('Error loading Firebase App from alternative CDN:', error);
            console.log('Error stack:', error.stack);
            console.warn('Falling back to local storage mode');
        });
}

// 加载脚本的辅助函数
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        // 添加超时处理
        const timeout = setTimeout(() => {
            console.error(`Script load timeout: ${src}`);
            reject(new Error(`Timeout loading ${src}`));
        }, 10000); // 10秒超时
        script.onload = () => {
            clearTimeout(timeout);
            console.log(`Script loaded: ${src}`);
            resolve(src);
        };
        script.onerror = () => {
            clearTimeout(timeout);
            console.error(`Script failed to load: ${src}`);
            reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
    });
}

// DOMContentLoaded事件处理
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded, checking Firebase...');
    
    // 检查是否在本地开发环境中运行
    const isLocalDev = window.location.href.includes('localhost:8000') || window.location.href.includes('127.0.0.1');
    console.log('Running in local development environment:', isLocalDev);
    
    // 在本地开发环境中，直接使用本地存储模式，不显示错误信息
    if (isLocalDev) {
        console.log('Local development environment detected, initializing local auth directly');
        initializeLocalAuth();
        return;
    }
    
    // 延迟检查Firebase加载状态，给SDK足够的加载时间
    let checkAttempts = 0;
    const maxCheckAttempts = 20; // 最多检查20次（约10秒）
    
    function checkFirebaseStatus() {
        checkAttempts++;
        console.log('Checking Firebase status, attempt:', checkAttempts);
        console.log('Current firebase object:', typeof firebase);
        
        if (typeof firebase !== 'undefined') {
            console.log('Firebase SDK found, initializing...');
            initializeFirebase();
        } else if (checkAttempts >= maxCheckAttempts) {
            console.error('Firebase SDK not loaded after', maxCheckAttempts, 'attempts!');
            console.error('Final check - firebase is:', typeof firebase);
            
            // 创建一个警告元素来显示问题，但不阻止用户使用系统
            const warningElement = document.createElement('div');
            warningElement.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: orange; color: white; padding: 10px; text-align: center; z-index: 10000; font-weight: 500;';
            warningElement.textContent = 'Firebase SDK加载失败，请检查网络连接或防火墙设置。系统将使用本地存储模式，数据仅保存在当前设备。';
            document.body.appendChild(warningElement);
            
            // 3秒后自动隐藏警告
            setTimeout(function() {
                warningElement.style.transition = 'opacity 0.5s ease';
                warningElement.style.opacity = '0';
                setTimeout(function() {
                    if (document.body.contains(warningElement)) {
                        document.body.removeChild(warningElement);
                    }
                }, 500);
            }, 3000);
            
            // 初始化本地认证
            initializeLocalAuth();
        } else {
            // 继续检查
            console.log('Firebase not yet loaded, waiting...');
            setTimeout(checkFirebaseStatus, 500); // 每500毫秒检查一次
        }
    }
    
    // 开始检查
    checkFirebaseStatus();
});

function initializeFirebase() {
    try {
        console.log('Starting Firebase initialization with config:', authConfig);
        firebase.initializeApp(authConfig);
        console.log('Firebase App initialized');
        window.auth = firebase.auth();
        console.log('Firebase Auth initialized');
        window.db = firebase.firestore();
        console.log('Firebase Firestore initialized');
        window.firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        checkAuthState();
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        console.error('Error details:', error.message);
        // 初始化本地认证作为降级方案
        initializeLocalAuth();
    }
}

// 初始化本地认证
function initializeLocalAuth() {
    console.log('Initializing local auth...');
    // 本地用户存储
    if (!localStorage.getItem('localUsers')) {
        localStorage.setItem('localUsers', JSON.stringify({}));
    }
    // 检查本地登录状态
    const currentUser = localStorage.getItem('currentLocalUser');
    if (currentUser) {
        console.log('Local user found:', currentUser);
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { email: currentUser } }));
    } else {
        console.log('No local user logged in');
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
}

// 等待Firebase初始化（如果可用）
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        console.log('Starting waitForFirebase, current state:', window.firebaseInitialized);
        if (window.firebaseInitialized) {
            console.log('Firebase already initialized, resolving immediately');
            resolve();
            return;
        }
        
        // 如果本地认证已启用，直接resolve
        if (window.localAuthEnabled) {
            console.log('Local auth enabled, resolving immediately');
            resolve();
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 30; // 最多等待30秒
        console.log('Starting polling for Firebase initialization, max attempts:', maxAttempts);
        const interval = setInterval(() => {
            attempts++;
            console.log('Polling attempt:', attempts, 'current state:', window.firebaseInitialized);
            if (window.firebaseInitialized) {
                console.log('Firebase initialized, resolving');
                clearInterval(interval);
                resolve();
            } else if (attempts >= maxAttempts) {
                console.log('Firebase initialization timeout after', maxAttempts, 'attempts');
                clearInterval(interval);
                // 如果Firebase初始化超时，但本地认证已启用，仍然resolve
                if (window.localAuthEnabled) {
                    resolve();
                } else {
                    reject(new Error('Firebase initialization timeout'));
                }
            }
        }, 1000);
    });
}

// 检查认证状态
function checkAuthState() {
    if (window.auth) {
        window.auth.onAuthStateChanged(function(user) {
            if (user) {
                // 用户已登录
                console.log('User logged in:', user.email);
                document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
                syncDataWithCloud();
            } else {
                // 用户未登录
                console.log('User not logged in');
                document.dispatchEvent(new CustomEvent('userLoggedOut'));
            }
        });
    }
}

// 注册用户
async function registerUser(email, password) {
    try {
        console.log('Starting registerUser with email:', email);
        await waitForFirebase();
        
        // 如果Firebase可用，使用Firebase注册
        if (window.firebaseInitialized && window.auth) {
            console.log('registerUser: Firebase auth available, creating user');
            const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('User registered:', user.email);
            return user;
        }
        // 否则使用本地认证
        else if (window.localAuthEnabled) {
            console.log('registerUser: Using local auth');
            const localUsers = JSON.parse(localStorage.getItem('localUsers') || '{}');
            
            // 检查邮箱是否已存在
            if (localUsers[email]) {
                throw new Error('该邮箱已被注册');
            }
            
            // 注册新用户
            localUsers[email] = password; // 实际应用中应该加密密码
            localStorage.setItem('localUsers', JSON.stringify(localUsers));
            
            // 自动登录
            localStorage.setItem('currentLocalUser', email);
            
            console.log('Local user registered:', email);
            return { email: email };
        }
        else {
            throw new Error('No authentication method available');
        }
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error details:', error.message);
        throw error;
    }
}

// 登录用户
async function loginUser(email, password) {
    try {
        await waitForFirebase();
        
        // 如果Firebase可用，使用Firebase登录
        if (window.firebaseInitialized && window.auth) {
            const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('User logged in:', user.email);
            return user;
        }
        // 否则使用本地认证
        else if (window.localAuthEnabled) {
            console.log('loginUser: Using local auth');
            const localUsers = JSON.parse(localStorage.getItem('localUsers') || '{}');
            
            // 检查用户是否存在且密码正确
            if (!localUsers[email] || localUsers[email] !== password) {
                throw new Error('邮箱或密码错误');
            }
            
            // 登录成功
            localStorage.setItem('currentLocalUser', email);
            
            console.log('Local user logged in:', email);
            return { email: email };
        }
        else {
            throw new Error('No authentication method available');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// 登出用户
async function logoutUser() {
    try {
        await waitForFirebase();
        
        // 如果Firebase可用，使用Firebase登出
        if (window.firebaseInitialized && window.auth) {
            await window.auth.signOut();
            console.log('User logged out from Firebase');
        }
        // 无论如何，清除本地登录状态
        if (window.localAuthEnabled) {
            localStorage.removeItem('currentLocalUser');
            console.log('Local user logged out');
        }
        
        return;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// 同步数据到云端
function syncDataWithCloud() {
    // 只有在Firebase可用且用户已登录时才同步
    if (!window.firebaseInitialized || !window.auth || !window.auth.currentUser) {
        console.log('No user logged in or Firebase not available, skipping sync');
        return;
    }
    
    const user = window.auth.currentUser;
    const userId = user.uid;
    
    // 从本地存储获取数据
    const localData = localStorage.getItem('ielts_learning_system');
    if (localData) {
        try {
            const data = JSON.parse(localData);
            window.db.collection('users').doc(userId).set({
                data: data,
                lastSync: new Date().toISOString()
            })
            .then(() => {
                console.log('Data synced to cloud successfully');
            })
            .catch((error) => {
                console.error('Error syncing data to cloud:', error);
            });
        } catch (error) {
            console.error('Error parsing local data:', error);
        }
    }
}

// 从云端同步数据
function syncDataFromCloud() {
    // 只有在Firebase可用且用户已登录时才同步
    if (!window.firebaseInitialized || !window.auth || !window.auth.currentUser) {
        console.log('No user logged in or Firebase not available, skipping sync');
        return;
    }
    
    const user = window.auth.currentUser;
    const userId = user.uid;
    
    window.db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.data) {
                    localStorage.setItem('ielts_learning_system', JSON.stringify(data.data));
                    console.log('Data synced from cloud successfully');
                    document.dispatchEvent(new CustomEvent('dataSynced'));
                }
            } else {
                console.log('No data found in cloud');
            }
        })
        .catch((error) => {
            console.error('Error syncing data from cloud:', error);
        });
}

// 定期同步数据
setInterval(syncDataWithCloud, 60000); // 每60秒同步一次

// 测试Firebase SDK加载
function testFirebaseLoad() {
    console.log('=== Testing Firebase SDK Load ===');
    console.log('Current network status:', navigator.onLine ? 'Online' : 'Offline');
    console.log('Current firebase object:', typeof firebase);
    
    // 测试主CDN
    console.log('Testing primary CDN...');
    loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js')
        .then(() => {
            console.log('✓ Primary CDN works!');
            console.log('Firebase object after load:', typeof firebase);
        })
        .catch(error => {
            console.error('✗ Primary CDN failed:', error);
            // 测试备用CDN
            console.log('Testing alternative CDN...');
            loadScript('https://cdn.jsdelivr.net/npm/firebase@9.22.2/dist/firebase-app.js')
                .then(() => {
                    console.log('✓ Alternative CDN works!');
                    console.log('Firebase object after load:', typeof firebase);
                })
                .catch(error => {
                    console.error('✗ Alternative CDN failed:', error);
                    console.log('Both CDNs failed, using local storage mode');
                });
        });
}

// 暴露方法到全局
if (typeof window !== 'undefined') {
    window.authConfig = authConfig;
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.logoutUser = logoutUser;
    window.syncDataWithCloud = syncDataWithCloud;
    window.syncDataFromCloud = syncDataFromCloud;
    window.testFirebaseLoad = testFirebaseLoad;
}