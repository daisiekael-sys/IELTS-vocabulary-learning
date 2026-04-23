// 本地存储工具函数
const STORAGE_KEY = 'ielts_learning_system';
const TODAY_KEY = 'ielts_today_stats';
const LAST_LEARNING_KEY = 'ielts_last_learning';
const LAST_SYNC_KEY = 'ielts_last_sync';

// 获取存储数据
function getStorageData() {
  try {
    const data = wx.getStorageSync(STORAGE_KEY);
    if (data) {
      return data;
    }
  } catch (e) {
    console.error('获取存储数据失败:', e);
  }
  
  // 返回默认数据结构
  return {
    ebbinghaus: {
      masterMap: {},
      stats: { totalError: 0, totalMaster: 0 },
      errors: [],
      memory: {}
    },
    synonyms: {
      starred: {},
      errors: [],
      mastered: {}
    },
    settings: {
      currentUnit: 'all',
      currentMode: 'normal',
      currentFilter: 'all'
    }
  };
}

// 保存存储数据
function setStorageData(data) {
  try {
    wx.setStorageSync(STORAGE_KEY, data);
    return true;
  } catch (e) {
    console.error('保存存储数据失败:', e);
    return false;
  }
}

// 获取同义替换标星词汇
function getStarredWords() {
  const data = getStorageData();
  return data.synonyms?.starred || {};
}

// 保存同义替换标星词汇
function saveStarredWords(starred) {
  const data = getStorageData();
  if (!data.synonyms) {
    data.synonyms = {};
  }
  data.synonyms.starred = starred;
  return setStorageData(data);
}

// 切换词汇标星状态
function toggleStarWord(wordEn, wordCn) {
  const wordKey = wordEn + '_' + wordCn;
  const starred = getStarredWords();
  
  let newStatus = '';
  if (starred[wordKey] === 'starred') {
    newStatus = 'starred-double';
  } else if (starred[wordKey] === 'starred-double') {
    newStatus = '';
    delete starred[wordKey];
  } else {
    newStatus = 'starred';
  }
  
  if (newStatus) {
    starred[wordKey] = newStatus;
  }
  
  saveStarredWords(starred);
  return newStatus;
}

// 获取艾宾浩斯学习数据
function getEbbinghausData() {
  const data = getStorageData();
  return data.ebbinghaus || {
    masterMap: {},
    stats: { totalError: 0, totalMaster: 0 },
    errors: [],
    memory: {}
  };
}

// 保存艾宾浩斯学习数据
function saveEbbinghausData(ebbinghausData) {
  const data = getStorageData();
  data.ebbinghaus = ebbinghausData;
  return setStorageData(data);
}

// 获取设置
function getSettings() {
  const data = getStorageData();
  return data.settings || {
    currentUnit: 'all',
    currentMode: 'normal',
    currentFilter: 'all'
  };
}

// 保存设置
function saveSettings(settings) {
  const data = getStorageData();
  data.settings = settings;
  return setStorageData(data);
}

// 获取今日统计数据
function getTodayData() {
  const today = new Date().toDateString();
  try {
    const data = wx.getStorageSync(TODAY_KEY);
    if (data && data.date === today) {
      return data;
    }
  } catch (e) {
    console.error('获取今日数据失败:', e);
  }
  // 返回默认今日数据
  return {
    date: today,
    synonyms: 0,
    ebbinghaus: 0,
    correct: 0,
    total: 0
  };
}

// 更新今日统计
function updateTodayStats(type, correct) {
  const data = getTodayData();
  if (type === 'synonyms') {
    data.synonyms += 1;
  } else if (type === 'ebbinghaus') {
    data.ebbinghaus += 1;
  }
  data.total += 1;
  if (correct) {
    data.correct += 1;
  }
  try {
    wx.setStorageSync(TODAY_KEY, data);
  } catch (e) {
    console.error('保存今日数据失败:', e);
  }
}

// 获取同义替换数据
function getSynonymsData() {
  const data = getStorageData();
  return data.synonyms || { starred: {}, errors: [], mastered: {} };
}

// 保存同义替换数据
function saveSynonymsData(synonymsData) {
  const data = getStorageData();
  data.synonyms = synonymsData;
  return setStorageData(data);
}

// 获取上次学习记录
function getLastLearning() {
  try {
    return wx.getStorageSync(LAST_LEARNING_KEY);
  } catch (e) {
    return null;
  }
}

// 保存上次学习记录
function setLastLearning(learning) {
  try {
    wx.setStorageSync(LAST_LEARNING_KEY, {
      ...learning,
      date: new Date().toDateString()
    });
  } catch (e) {
    console.error('保存学习记录失败:', e);
  }
}

// 获取上次同步时间
function getLastSync() {
  try {
    return wx.getStorageSync(LAST_SYNC_KEY);
  } catch (e) {
    return null;
  }
}

// 保存上次同步时间
function setLastSync(timestamp) {
  try {
    wx.setStorageSync(LAST_SYNC_KEY, timestamp);
  } catch (e) {
    console.error('保存同步时间失败:', e);
  }
}

// 清除所有数据
function clearAllData() {
  try {
    wx.removeStorageSync(STORAGE_KEY);
    wx.removeStorageSync(TODAY_KEY);
    wx.removeStorageSync(LAST_LEARNING_KEY);
    wx.removeStorageSync(LAST_SYNC_KEY);
    return true;
  } catch (e) {
    console.error('清除数据失败:', e);
    return false;
  }
}

module.exports = {
  getStorageData,
  setStorageData,
  getStarredWords,
  saveStarredWords,
  toggleStarWord,
  getEbbinghausData,
  saveEbbinghausData,
  getSettings,
  saveSettings,
  getTodayData,
  updateTodayStats,
  getSynonymsData,
  saveSynonymsData,
  getLastLearning,
  setLastLearning,
  getLastSync,
  setLastSync,
  clearAllData
};
