// Firebase 配置和同步功能
// 敏感配置从外挂文件读取（firebase-config.js 已加入 .gitignore）
const { firebaseConfig, DEFAULT_USER_ID } = require('./firebase-config');

// Firestore REST API 基础 URL
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

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

// 上传数据到 Firestore（通过 REST API 直连，不再依赖微信云函数）
function uploadData(data) {
  return new Promise((resolve, reject) => {
    const userId = getUserId();
    const url = FIRESTORE_BASE_URL + '/users/' + userId;
    const firestoreData = {
      fields: toFirestoreData({
        data: JSON.stringify(data),
        updatedAt: new Date().toISOString()
      })
    };

    wx.request({
      url: url,
      method: 'PATCH',
      header: { 'Content-Type': 'application/json' },
      data: firestoreData,
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true });
        } else {
          reject(new Error('上传失败: HTTP ' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')));
      }
    });
  });
}

// 从 Firestore 下载数据（通过 REST API 直连）
function downloadData() {
  return new Promise((resolve, reject) => {
    const userId = getUserId();
    const url = FIRESTORE_BASE_URL + '/users/' + userId;

    wx.request({
      url: url,
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.fields) {
          const parsed = fromFirestoreData(res.data.fields);
          // 兼容网页版字段名：网页版用 data 字段存对象，小程序用 data 字段存 JSON 字符串
          try {
            if (typeof parsed.data === 'string') {
              resolve(JSON.parse(parsed.data));
            } else if (typeof parsed.data === 'object' && parsed.data !== null) {
              resolve(parsed.data);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        } else if (res.statusCode === 404) {
          // 文档不存在，返回 null（新用户）
          resolve(null);
        } else {
          reject(new Error('下载失败: HTTP ' + res.statusCode));
        }
      },
      fail: (err) => {
        reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')));
      }
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
  setCustomUserId,
  uploadData,
  downloadData,
  syncAllData,
  mergeData
};
