// 学习页面逻辑
const storage = require('../../utils/storage.js');

Page({
  data: {
    todayStats: {
      synonyms: 0,
      ebbinghaus: 0,
      total: 0
    },
    synonymsCount: 0,
    synonymsProgress: 0,
    ebbinghausCount: 475,
    ebbinghausProgress: 0,
    lastLearning: null
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats() {
    const today = new Date().toDateString();
    
    // 今日统计
    const todayData = storage.getTodayData();
    this.setData({
      todayStats: {
        synonyms: todayData.synonyms || 0,
        ebbinghaus: todayData.ebbinghaus || 0,
        total: (todayData.synonyms || 0) + (todayData.ebbinghaus || 0)
      }
    });

    // 同义替换统计
    const synonymsData = storage.getSynonymsData();
    const synonymsTotal = this.getSynonymsTotalCount();
    const synonymsMastered = Object.keys(synonymsData.mastered || {}).length;
    this.setData({
      synonymsCount: synonymsTotal,
      synonymsProgress: synonymsTotal > 0 ? Math.round((synonymsMastered / synonymsTotal) * 100) : 0
    });

    // 艾宾浩斯统计
    const ebbinghausData = storage.getEbbinghausData();
    const ebbinghausMastered = Object.keys(ebbinghausData.masterMap || {}).filter(
      k => ebbinghausData.masterMap[k] >= 7
    ).length;
    this.setData({
      ebbinghausProgress: Math.round((ebbinghausMastered / 475) * 100)
    });

    // 上次学习记录
    const lastLearning = storage.getLastLearning();
    if (lastLearning && lastLearning.date === today) {
      this.setData({ lastLearning });
    }
  },

  // 获取同义替换总词数
  getSynonymsTotalCount() {
    const vocabData = require('../../utils/vocabularyData.js');
    let count = 0;
    // vocabularyData 是数组格式，每个元素有 categories
    const data = vocabData.vocabularyData || [];
    data.forEach(unit => {
      if (unit.categories) {
        unit.categories.forEach(category => {
          if (category.words) {
            count += category.words.length;
          }
        });
      }
    });
    return count;
  },

  // 进入同义替换
  goToSynonyms() {
    wx.navigateTo({
      url: '/pages/synonyms/synonyms'
    });
  },

  // 进入艾宾浩斯
  goToEbbinghaus() {
    wx.navigateTo({
      url: '/pages/ebbinghaus/ebbinghaus'
    });
  },

  // 继续学习
  continueLearning() {
    const { lastLearning } = this.data;
    if (!lastLearning) return;

    if (lastLearning.type === 'synonyms') {
      wx.navigateTo({ url: '/pages/synonyms/synonyms' });
    } else {
      wx.navigateTo({ url: '/pages/ebbinghaus/ebbinghaus' });
    }
  }
});
