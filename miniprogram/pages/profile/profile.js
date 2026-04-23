// 我的页面逻辑
const storage = require('../../utils/storage.js');
const firebase = require('../../utils/firebase.js');

Page({
  data: {
    todayStats: {
      learned: 0,
      correct: 0,
      accuracy: 0
    },
    estimateDays: 0,
    totalProgress: 0,
    stats: {
      mastered: 0,
      learning: 0,
      new: 475
    },
    lastSyncTime: '未同步',
    isLoggedIn: false,
    userId: ''
  },

  onLoad() {
    this.loadStats();
    this.checkSyncStatus();
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const userId = firebase.getUserId();
    this.setData({
      isLoggedIn: true,
      userId: userId
    });
  },

  // 设置自定义用户ID
  setCustomUserId() {
    wx.showModal({
      title: '设置用户ID',
      content: '输入Firebase用户ID（与网页版互通）',
      editable: true,
      placeholderText: 'x5Q3rdO1oXSCO57ukNky7Nh6LB52',
      success: (res) => {
        if (res.confirm && res.content) {
          firebase.setCustomUserId(res.content);
          this.setData({ userId: res.content });
          wx.showToast({ title: '设置成功', icon: 'success' });
        }
      }
    });
  },

  // 微信登录
  async login() {
    try {
      wx.showLoading({ title: '登录中...' });
      const userId = await firebase.login();
      this.setData({
        isLoggedIn: true,
        userId: userId
      });
      wx.showToast({ title: '登录成功', icon: 'success' });
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({ title: '登录失败', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats() {
    // 今日统计
    const todayData = storage.getTodayData();
    const learned = (todayData.synonyms || 0) + (todayData.ebbinghaus || 0);
    const correct = todayData.correct || 0;
    const accuracy = learned > 0 ? Math.round((correct / learned) * 100) : 0;
    
    this.setData({
      todayStats: { learned, correct, accuracy }
    });

    // 计算预计天数
    if (correct > 0) {
      const remaining = 475 - this.getTotalMastered();
      const days = Math.ceil(remaining / correct);
      this.setData({ estimateDays: days });
    }

    // 总进度
    const mastered = this.getTotalMastered();
    const learning = this.getTotalLearning();
    const newWords = 475 - mastered - learning;
    const progress = Math.round((mastered / 475) * 100);
    
    this.setData({
      totalProgress: progress,
      stats: { mastered, learning, new: newWords }
    });
  },

  // 获取已掌握总数
  getTotalMastered() {
    // 艾宾浩斯已掌握
    const ebbinghausData = storage.getEbbinghausData();
    const ebbinghausMastered = Object.keys(ebbinghausData.masterMap || {}).filter(
      k => ebbinghausData.masterMap[k] >= 7
    ).length;
    
    // 同义替换已掌握（2星视为掌握）
    const synonymsData = storage.getSynonymsData();
    const synonymsMastered = Object.keys(synonymsData.starred || {}).filter(
      k => synonymsData.starred[k] === 2
    ).length;
    
    return ebbinghausMastered + synonymsMastered;
  },

  // 获取学习中总数
  getTotalLearning() {
    // 艾宾浩斯学习中（1-6级）
    const ebbinghausData = storage.getEbbinghausData();
    const ebbinghausLearning = Object.keys(ebbinghausData.masterMap || {}).filter(
      k => ebbinghausData.masterMap[k] >= 1 && ebbinghausData.masterMap[k] < 7
    ).length;
    
    // 同义替换学习中（1星）
    const synonymsData = storage.getSynonymsData();
    const synonymsLearning = Object.keys(synonymsData.starred || {}).filter(
      k => synonymsData.starred[k] === 1
    ).length;
    
    return ebbinghausLearning + synonymsLearning;
  },

  // 检查同步状态
  checkSyncStatus() {
    const lastSync = storage.getLastSync();
    if (lastSync) {
      const time = new Date(lastSync).toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      this.setData({ lastSyncTime: time });
    }
  },

  // 一键同步（上传+下载合并）
  async syncData() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: '需要登录',
        content: '同步数据需要先登录微信',
        success: (res) => {
          if (res.confirm) {
            this.login().then(() => {
              if (this.data.isLoggedIn) {
                this.syncData();
              }
            });
          }
        }
      });
      return;
    }

    wx.showLoading({ title: '同步中...' });

    try {
      const localData = {
        synonyms: storage.getSynonymsData(),
        ebbinghaus: storage.getEbbinghausData(),
        stats: {
          todayData: storage.getTodayData(),
          lastLearning: storage.getLastLearning()
        }
      };

      const result = await firebase.syncAllData(localData);

      // 如果有合并后的数据，更新本地
      if (result.mergedData) {
        if (result.mergedData.synonyms) {
          storage.saveSynonymsData(result.mergedData.synonyms);
        }
        if (result.mergedData.ebbinghaus) {
          storage.saveEbbinghausData(result.mergedData.ebbinghaus);
        }
      }

      this.checkSyncStatus();
      this.loadStats();

      const message = result.downloaded
        ? '同步成功（已合并云端数据）'
        : '同步成功（已上传本地数据）';

      wx.showToast({ title: message, icon: 'success' });
    } catch (error) {
      console.error('同步失败:', error);
      wx.showModal({
        title: '同步失败',
        content: error.message || '请检查网络连接',
        showCancel: false
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 上传数据到云端
  async uploadData() {
    wx.showLoading({ title: '上传中...' });

    try {
      const data = {
        synonyms: storage.getSynonymsData(),
        ebbinghaus: storage.getEbbinghausData(),
        stats: {
          todayData: storage.getTodayData(),
          lastLearning: storage.getLastLearning()
        },
        updatedAt: new Date().toISOString()
      };

      await firebase.uploadData(data);

      storage.setLastSync(Date.now());
      this.checkSyncStatus();
      wx.showToast({ title: '上传成功', icon: 'success' });
    } catch (error) {
      console.error('上传失败:', error);
      wx.showToast({ title: '上传失败', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 从云端下载数据
  async downloadData() {
    wx.showLoading({ title: '下载中...' });

    try {
      const cloudData = await firebase.downloadData();

      if (cloudData) {
        if (cloudData.synonyms) {
          const localSynonyms = storage.getSynonymsData();
          const merged = firebase.mergeData(localSynonyms, cloudData.synonyms);
          storage.saveSynonymsData(merged);
        }

        if (cloudData.ebbinghaus) {
          const localEbbinghaus = storage.getEbbinghausData();
          const merged = firebase.mergeData(localEbbinghaus, cloudData.ebbinghaus);
          storage.saveEbbinghausData(merged);
        }

        storage.setLastSync(Date.now());
        this.checkSyncStatus();
        this.loadStats();
        wx.showToast({ title: '下载成功', icon: 'success' });
      } else {
        wx.showToast({ title: '云端暂无数据', icon: 'none' });
      }
    } catch (error) {
      console.error('下载失败:', error);
      wx.showToast({ title: '下载失败', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 导出数据
  exportData() {
    const data = {
      ebbinghaus: storage.getEbbinghausData(),
      synonyms: storage.getSynonymsData(),
      exportTime: new Date().toISOString()
    };
    
    wx.setClipboardData({
      data: JSON.stringify(data),
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 导入数据
  importData() {
    wx.showModal({
      title: '导入数据',
      content: '请粘贴备份数据（将覆盖当前进度）',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          try {
            const data = JSON.parse(res.content);
            if (data.ebbinghaus) storage.saveEbbinghausData(data.ebbinghaus);
            if (data.synonyms) storage.saveSynonymsData(data.synonyms);
            this.loadStats();
            wx.showToast({ title: '导入成功', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '数据格式错误', icon: 'error' });
          }
        }
      }
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？不会影响已同步的数据',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({ title: '已清除', icon: 'success' });
              this.loadStats();
            }
          });
        }
      }
    });
  },

  // 重置进度
  resetProgress() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '确定要重置所有学习进度吗？此操作不可恢复！',
      confirmColor: '#ff7272',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '再次确认',
            content: '真的确定吗？所有学习记录将被清空！',
            confirmColor: '#ff7272',
            success: (res2) => {
              if (res2.confirm) {
                storage.clearAllData();
                this.loadStats();
                wx.showToast({ title: '已重置', icon: 'success' });
              }
            }
          });
        }
      }
    });
  }
});
