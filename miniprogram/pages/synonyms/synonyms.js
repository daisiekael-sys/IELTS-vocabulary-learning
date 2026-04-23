// 同义替换页面逻辑
const { vocabularyData } = require('../../utils/vocabularyData.js');
const storage = require('../../utils/storage.js');

Page({
  data: {
    unitOptions: ['全部单元', '第一单元', '第二单元', '第三单元', '第四单元', '第五单元', '第六单元', '第七单元', '第八单元', '第九单元', '第十单元'],
    unitIndex: 0,
    currentUnit: 'all',
    currentMode: 'normal',
    currentFilter: 'all',
    displayData: [],
    showScrollTop: false,
    scrollTop: 0
  },

  onLoad() {
    // 加载设置
    const settings = storage.getSettings();
    const unitIndex = settings.currentUnit === 'all' ? 0 : parseInt(settings.currentUnit) + 1;
    
    this.setData({
      currentUnit: settings.currentUnit || 'all',
      currentMode: settings.currentMode || 'normal',
      currentFilter: settings.currentFilter || 'all',
      unitIndex: unitIndex
    });
    
    this.renderVocabulary();
  },

  onShow() {
    this.renderVocabulary();
  },

  // 渲染词汇列表
  renderVocabulary() {
    const starredWords = storage.getStarredWords();
    const { currentUnit, currentFilter } = this.data;
    
    // 确定要显示的单元
    let unitsToRender = currentUnit === 'all' 
      ? vocabularyData 
      : [vocabularyData[parseInt(currentUnit)]];
    
    const displayData = unitsToRender.map((unit, unitIndex) => {
      const categories = unit.categories.map((category, groupIndex) => {
        const words = category.words.map(word => {
          const wordKey = word.en + '_' + word.cn;
          const starStatus = starredWords[wordKey] || '';
          
          return {
            ...word,
            wordKey,
            starClass: starStatus,
            starIcon: starStatus === 'starred' ? '🌟' : starStatus === 'starred-double' ? '🌟🌟' : '☆',
            revealed: false,
            show: this.shouldShowWord(starStatus, currentFilter)
          };
        });
        
        // 检查该分组是否有可见单词
        const hasVisibleWords = words.some(w => w.show);
        
        return {
          ...category,
          words,
          show: hasVisibleWords
        };
      });
      
      // 检查该单元是否有可见分组
      const hasVisibleCategories = categories.some(c => c.show);
      
      return {
        ...unit,
        unitIndex,
        categories,
        show: hasVisibleCategories
      };
    });
    
    this.setData({ displayData });
  },

  // 判断是否显示单词
  shouldShowWord(starStatus, filter) {
    if (filter === 'all') return true;
    if (filter === 'starred') return starStatus === 'starred' || starStatus === 'starred-double';
    if (filter === 'starred-single') return starStatus === 'starred';
    if (filter === 'starred-double') return starStatus === 'starred-double';
    return true;
  },

  // 单元选择变化
  onUnitChange(e) {
    const index = e.detail.value;
    const unitValue = index === 0 ? 'all' : String(index - 1);
    
    this.setData({
      unitIndex: index,
      currentUnit: unitValue
    });
    
    this.saveSettings();
    this.renderVocabulary();
  },

  // 设置模式
  setMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ currentMode: mode });
    this.saveSettings();
    
    // 重置所有单词的revealed状态
    this.resetRevealedState();
  },

  // 从指示器切换模式
  toggleMode() {
    const newMode = this.data.currentMode === 'hide-cn' ? 'normal' : 'hide-cn';
    this.setData({ currentMode: newMode });
    this.saveSettings();
    this.resetRevealedState();
  },

  // 重置revealed状态
  resetRevealedState() {
    const { displayData } = this.data;
    displayData.forEach(unit => {
      unit.categories.forEach(category => {
        category.words.forEach(word => {
          word.revealed = false;
        });
      });
    });
    this.setData({ displayData });
  },

  // 设置过滤
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.saveSettings();
    this.renderVocabulary();
  },

  // 切换单词显示（隐藏模式下点击）
  toggleWordReveal(e) {
    const word = e.currentTarget.dataset.word;
    if (this.data.currentMode !== 'hide-cn') return;
    
    const { displayData } = this.data;
    displayData.forEach(unit => {
      unit.categories.forEach(category => {
        category.words.forEach(w => {
          if (w.wordKey === word.wordKey) {
            w.revealed = !w.revealed;
          }
        });
      });
    });
    
    this.setData({ displayData });
  },

  // 切换星标
  toggleStar(e) {
    const word = e.currentTarget.dataset.word;
    const newStatus = storage.toggleStarWord(word.en, word.cn);
    
    // 更新显示
    const { displayData, currentFilter } = this.data;
    displayData.forEach(unit => {
      unit.categories.forEach(category => {
        category.words.forEach(w => {
          if (w.wordKey === word.wordKey) {
            w.starClass = newStatus;
            w.starIcon = newStatus === 'starred' ? '🌟' : newStatus === 'starred-double' ? '🌟🌟' : '☆';
            w.show = this.shouldShowWord(newStatus, currentFilter);
          }
        });
        // 更新分组可见性
        category.show = category.words.some(w => w.show);
      });
      // 更新单元可见性
      unit.show = unit.categories.some(c => c.show);
    });
    
    this.setData({ displayData });
  },

  // 重置星标
  resetStars() {
    wx.showModal({
      title: '确认重置',
      content: '确定要清除所有星标吗？',
      success: (res) => {
        if (res.confirm) {
          storage.saveStarredWords({});
          this.renderVocabulary();
          wx.showToast({
            title: '星标已重置',
            icon: 'success'
          });
        }
      }
    });
  },

  // 保存设置
  saveSettings() {
    storage.saveSettings({
      currentUnit: this.data.currentUnit,
      currentMode: this.data.currentMode,
      currentFilter: this.data.currentFilter
    });
  },

  // 滚动监听
  onPageScroll(e) {
    const showScrollTop = e.scrollTop > 300;
    if (showScrollTop !== this.data.showScrollTop) {
      this.setData({ showScrollTop });
    }
  },

  // 回到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '雅思高频同义替换 - 丰富你的写作表达',
      path: '/pages/synonyms/synonyms'
    };
  }
});
