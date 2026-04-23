// 首页逻辑
const storage = require('../../utils/storage.js');

Page({
  data: {
    // 页面数据
  },

  onLoad() {
    console.log('首页加载');
  },

  onShow() {
    // 页面显示时刷新
  },

  // 跳转到艾宾浩斯页面
  goToEbbinghaus() {
    wx.switchTab({
      url: '/pages/ebbinghaus/ebbinghaus'
    });
  },

  // 跳转到同义替换页面
  goToSynonyms() {
    wx.switchTab({
      url: '/pages/synonyms/synonyms'
    });
  },

  // 导出数据
  exportData() {
    const data = storage.getStorageData();
    const dataStr = JSON.stringify(data, null, 2);
    
    wx.showModal({
      title: '导出数据',
      content: '数据已准备好，请在开发者工具中查看控制台输出',
      showCancel: false,
      success: () => {
        console.log('=== 导出数据 ===');
        console.log(dataStr);
        wx.showToast({
          title: '已导出到控制台',
          icon: 'success'
        });
      }
    });
  },

  // 导入数据
  importData() {
    wx.showModal({
      title: '导入数据',
      content: '此功能需要在开发者工具中使用。请粘贴JSON数据到控制台导入。',
      showCancel: false
    });
  },

  // 清除所有数据
  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有学习数据吗？此操作不可恢复！',
      confirmColor: '#ff6464',
      success: (res) => {
        if (res.confirm) {
          storage.clearAllData();
          // 重新初始化
          getApp().initStorage();
          wx.showToast({
            title: '数据已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '雅思词汇学习中心 - 高效记忆雅思词汇',
      path: '/pages/index/index'
    };
  }
});
