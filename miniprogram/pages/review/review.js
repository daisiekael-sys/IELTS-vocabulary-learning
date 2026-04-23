// 复习页面逻辑
const storage = require('../../utils/storage.js');

Page({
  data: {
    activeTab: 'synonyms',
    synonymsReviewCount: 0,
    ebbinghausReviewCount: 0,
    
    // 同义替换数据
    starredWords: [],
    star1Count: 0,
    star2Count: 0,
    spellingErrors: [],
    highFreqErrors: [],
    
    // 艾宾浩斯数据
    todayReview: [],
    ebbinghausErrors: [],
    masteredWords: []
  },

  onLoad() {
    this.loadReviewData();
  },

  onShow() {
    this.loadReviewData();
  },

  // 加载复习数据
  loadReviewData() {
    this.loadSynonymsData();
    this.loadEbbinghausData();
    this.calculateReviewCount();
  },

  // 加载同义替换数据
  loadSynonymsData() {
    const data = storage.getSynonymsData();
    const starred = data.starred || {};
    const errors = data.errors || [];
    
    // 统计标星词汇
    const star1Words = [];
    const star2Words = [];
    
    Object.keys(starred).forEach(word => {
      if (starred[word] === 1) {
        star1Words.push(word);
      } else if (starred[word] === 2) {
        star2Words.push(word);
      }
    });

    // 统计高频错误（出现3次以上）
    const errorCount = {};
    errors.forEach(err => {
      errorCount[err.word] = (errorCount[err.word] || 0) + 1;
    });
    const highFreq = Object.keys(errorCount).filter(word => errorCount[word] >= 3);

    this.setData({
      starredWords: [...star1Words, ...star2Words],
      star1Count: star1Words.length,
      star2Count: star2Words.length,
      spellingErrors: errors,
      highFreqErrors: highFreq
    });
  },

  // 加载艾宾浩斯数据
  loadEbbinghausData() {
    const data = storage.getEbbinghausData();
    const now = Date.now();
    
    // 今日待复习（复习时间已到）
    const todayReview = [];
    Object.keys(data.memory || {}).forEach(word => {
      const reviewTime = data.memory[word];
      if (reviewTime <= now) {
        const level = data.masterMap[word] || 0;
        todayReview.push({ word, level, reviewTime });
      }
    });
    
    // 按复习等级排序
    todayReview.sort((a, b) => a.level - b.level);

    // 已掌握词汇（7级）
    const mastered = Object.keys(data.masterMap || {}).filter(
      word => data.masterMap[word] >= 7
    );

    this.setData({
      todayReview,
      ebbinghausErrors: data.errors || [],
      masteredWords: mastered
    });
  },

  // 计算复习数量
  calculateReviewCount() {
    const { star1Count, star2Count, todayReview } = this.data;
    this.setData({
      synonymsReviewCount: star1Count + star2Count,
      ebbinghausReviewCount: todayReview.length
    });
  },

  // 切换标签
  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  // 复习1星词汇
  reviewStar1() {
    wx.navigateTo({
      url: '/pages/synonyms/synonyms?mode=review&star=1'
    });
  },

  // 复习2星词汇
  reviewStar2() {
    wx.navigateTo({
      url: '/pages/synonyms/synonyms?mode=review&star=2'
    });
  },

  // 复习拼写错误
  reviewSpellingErrors() {
    wx.navigateTo({
      url: '/pages/synonyms/synonyms?mode=review&errors=true'
    });
  },

  // 复习高频错误
  reviewHighFreq() {
    wx.navigateTo({
      url: '/pages/synonyms/synonyms?mode=review&highfreq=true'
    });
  },

  // 复习今日艾宾浩斯
  reviewToday() {
    if (this.data.todayReview.length === 0) return;
    wx.navigateTo({
      url: '/pages/ebbinghaus/ebbinghaus?mode=review&today=true'
    });
  },

  // 复习历史错题
  reviewHistoryErrors() {
    wx.navigateTo({
      url: '/pages/ebbinghaus/ebbinghaus?mode=review&errors=true'
    });
  },

  // 查看已掌握词汇
  viewMastered() {
    wx.navigateTo({
      url: '/pages/ebbinghaus/ebbinghaus?mode=view&mastered=true'
    });
  }
});
