// Firebase 配置和同步功能
const firebaseConfig = {
  apiKey: "AIzaSyA3zBg6XgHrFZgVfH86TxjnSlSzi44_Ekk",
  authDomain: "synonymous-substitutions.firebaseapp.com",
  projectId: "synonymous-substitutions",
  storageBucket: "synonymous-substitutions.firebasestorage.app",
  messagingSenderId: "183899195249",
  appId: "1:183899195249:web:3d2e2bb9590df74cbfd8d0",
  measurementId: "G-14CB5KHRXK"
};

// Firestore REST API 基础 URL
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

// 默认 Firebase UID（与网页版互通）
const DEFAULT_USER_ID = 'x5Q3rdO1oXSCO57ukNky7Nh6LB52';

// 获取存储的用户ID
function getUserId() {
  try {
    const stored = wx.getStorageSync('firebase_user_id');
    return stored || DEFAULT_USER_ID;
  } catch (e) {
    return DEFAULT_USER_ID;
  }
}

// 保存用户ID
function setUserId(userId) {
  try {
    wx.setStorageSync('firebase_user_id', userId);
    return true;
  } catch (e) {
    console.error('保存用户ID失败:', e);
    return false;
  }
}

// 设置自定义用户ID（用于绑定网页版账号）
function setCustomUserId(userId) {
  return setUserId(userId);
}

// 微信登录获取 OpenID（通过云函数）
function login() {
  return new Promise((resolve, reject) => {
    // 先检查是否已有用户ID
    const existingId = getUserId();
    if (existingId) {
      resolve(existingId);
      return;
    }

    // 获取微信登录凭证
    wx.login({
      success: (res) => {
        if (res.code) {
          // 调用云函数换取 openid
          wx.cloud.callFunction({
            name: 'login',
            data: { code: res.code },
            success: (cloudRes) => {
              if (cloudRes.result && cloudRes.result.success) {
                const openid = cloudRes.result.openid;
                setUserId(openid);
                resolve(openid);
              } else {
                reject(new Error(cloudRes.result?.error || '获取 openid 失败'));
              }
            },
            fail: (err) => {
              console.error('云函数调用失败:', err);
              // 云函数失败时使用临时ID（降级方案）
              const tempId = 'temp_' + res.code;
              setUserId(tempId);
              resolve(tempId);
            }
          });
        } else {
          reject(new Error('登录失败：' + res.errMsg));
        }
      },
      fail: reject
    });
  });
}

// 将数据转换为 Firestore 格式
function toFirestoreData(data) {
  const fields = {};
  for (const key in data) {
    const value = data[key];
    if (typeof value === 'string') {
      fields[key] = { stringValue: value };
    } else if (typeof value === 'number') {
      fields[key] = { integerValue: String(value) };
    } else if (typeof value === 'boolean') {
      fields[key] = { booleanValue: value };
    } else if (value instanceof Date) {
      fields[key] = { timestampValue: value.toISOString() };
    } else if (Array.isArray(value)) {
      fields[key] = { arrayValue: { values: value.map(v => toFirestoreValue(v)) } };
    } else if (typeof value === 'object' && value !== null) {
      fields[key] = { mapValue: { fields: toFirestoreData(value) } };
    }
  }
  return fields;
}

function toFirestoreValue(value) {
  if (typeof value === 'string') {
    return { stringValue: value };
  } else if (typeof value === 'number') {
    return { integerValue: String(value) };
  } else if (typeof value === 'boolean') {
    return { booleanValue: value };
  } else if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  } else if (typeof value === 'object' && value !== null) {
    return { mapValue: { fields: toFirestoreData(value) } };
  }
  return { nullValue: null };
}

// 从 Firestore 格式解析数据
function fromFirestoreData(doc) {
  if (!doc || !doc.fields) return {};
  
  const result = {};
  for (const key in doc.fields) {
    result[key] = fromFirestoreValue(doc.fields[key]);
  }
  return result;
}

function fromFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  if (value.arrayValue && value.arrayValue.values) {
    return value.arrayValue.values.map(v => fromFirestoreValue(v));
  }
  if (value.mapValue && value.mapValue.fields) {
    return fromFirestoreData(value.mapValue);
  }
  return null;
}

// 上传数据到云端（通过云函数）
function uploadData(data) {
  return new Promise((resolve, reject) => {
    const userId = getUserId();
    
    wx.cloud.callFunction({
      name: 'syncData',
      data: {
        action: 'upload',
        userId: userId,
        data: data
      },
      success: (res) => {
        if (res.result && res.result.success) {
          resolve(res.result);
        } else {
          reject(new Error(res.result?.error || '上传失败'));
        }
      },
      fail: reject
    });
  });
}

// 从云端下载数据（通过云函数）
function downloadData() {
  return new Promise((resolve, reject) => {
    const userId = getUserId();
    
    wx.cloud.callFunction({
      name: 'syncData',
      data: {
        action: 'download',
        userId: userId
      },
      success: (res) => {
        if (res.result && res.result.success) {
          resolve(res.result.data);
        } else {
          reject(new Error(res.result?.error || '下载失败'));
        }
      },
      fail: reject
    });
  });
}

// 同步所有数据
async function syncAllData(localData) {
  const userId = getUserId();
  if (!userId) {
    throw new Error('用户ID未设置，无法同步');
  }

  const results = {
    uploaded: false,
    downloaded: false,
    conflicts: [],
    timestamp: new Date().toISOString()
  };

  try {
    // 1. 尝试下载云端数据
    const cloudData = await downloadData().catch(() => null);

    // 2. 时间戳比较和合并
    let mergedData = {
      synonyms: localData.synonyms,
      ebbinghaus: localData.ebbinghaus,
      stats: localData.stats
    };

    if (cloudData) {
      mergedData.synonyms = mergeData(localData.synonyms, cloudData.synonyms);
      mergedData.ebbinghaus = mergeData(localData.ebbinghaus, cloudData.ebbinghaus);
      mergedData.stats = mergeData(localData.stats, cloudData.stats);
      results.downloaded = true;
    }

    // 3. 上传合并后的数据
    await uploadData(mergedData);
    results.uploaded = true;
    results.mergedData = mergedData;

    // 4. 更新本地同步时间
    wx.setStorageSync('ielts_last_sync', results.timestamp);

    return results;
  } catch (error) {
    console.error('同步失败:', error);
    throw error;
  }
}

// 合并数据（时间戳优先策略）
function mergeData(local, cloud) {
  if (!cloud) return local;
  if (!local) return cloud;

  const localTime = local.updatedAt ? new Date(local.updatedAt).getTime() : 0;
  const cloudTime = cloud.updatedAt ? new Date(cloud.updatedAt).getTime() : 0;

  // 云端数据更新，使用云端
  if (cloudTime > localTime) {
    return cloud;
  }
  
  // 本地数据更新，使用本地
  return local;
}

module.exports = {
  firebaseConfig,
  login,
  getUserId,
  setUserId,
  uploadData,
  downloadData,
  syncAllData,
  mergeData
};
