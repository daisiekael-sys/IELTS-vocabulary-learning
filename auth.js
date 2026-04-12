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

// 初始化Firebase
if (!window.firebase) {
    // 动态加载Firebase SDK
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
    script.onload = function() {
        const authScript = document.createElement('script');
        authScript.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
        authScript.onload = function() {
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
            firestoreScript.onload = function() {
                initializeFirebase();
            };
            document.head.appendChild(firestoreScript);
        };
        document.head.appendChild(authScript);
    };
    document.head.appendChild(script);
} else {
    initializeFirebase();
}

function initializeFirebase() {
    try {
        firebase.initializeApp(authConfig);
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        window.firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        checkAuthState();
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// 等待Firebase初始化
function waitForFirebase() {
    return new Promise((resolve, reject) => {
        if (window.firebaseInitialized) {
            resolve();
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 30; // 最多等待30秒
        const interval = setInterval(() => {
            attempts++;
            if (window.firebaseInitialized) {
                clearInterval(interval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                reject(new Error('Firebase initialization timeout'));
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
        await waitForFirebase();
        
        if (!window.auth) {
            throw new Error('Firebase auth not initialized');
        }
        
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User registered:', user.email);
        return user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// 登录用户
async function loginUser(email, password) {
    try {
        await waitForFirebase();
        
        if (!window.auth) {
            throw new Error('Firebase auth not initialized');
        }
        
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User logged in:', user.email);
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// 登出用户
async function logoutUser() {
    try {
        await waitForFirebase();
        
        if (!window.auth) {
            throw new Error('Firebase auth not initialized');
        }
        
        await window.auth.signOut();
        console.log('User logged out');
        return;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// 同步数据到云端
function syncDataWithCloud() {
    if (!window.auth || !window.auth.currentUser) {
        console.log('No user logged in, skipping sync');
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
    if (!window.auth || !window.auth.currentUser) {
        console.log('No user logged in, skipping sync');
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

// 暴露方法到全局
if (typeof window !== 'undefined') {
    window.authConfig = authConfig;
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.logoutUser = logoutUser;
    window.syncDataWithCloud = syncDataWithCloud;
    window.syncDataFromCloud = syncDataFromCloud;
}