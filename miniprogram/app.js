App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-d5g6nrhz02dddc1a8',
        traceUser: true
      });
    }
    
    // 初始化本地存储
    this.initStorage();
    console.log('小程序启动');
  },

  initStorage() {
    const storageKey = 'ielts_learning_system';
    let data = wx.getStorageSync(storageKey);
    
    if (!data) {
      // 初始化默认数据结构
      data = {
        ebbinghaus: {
          masterMap: {},
          stats: { totalError: 0, totalMaster: 0 },
          errors: [],
          memory: {}
        },
        synonyms: {
          starred: {}
        },
        settings: {
          currentUnit: 'all',
          currentMode: 'normal',
          currentFilter: 'all'
        }
      };
      wx.setStorageSync(storageKey, data);
    }
  },

  globalData: {
    userInfo: null
  }
});
