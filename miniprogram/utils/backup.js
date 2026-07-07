/**
 * backup.js - 小程序端自动备份与恢复（防误删）
 * 删除 / 清空数据前会自动保存一份快照，可在「恢复备份」中一键还原。
 * 数据保存在微信本地 Storage，不依赖网络。
 */
const STORAGE_KEY = 'ielts_learning_system';
const BACKUP_KEY = 'ielts_backups';
const MAX_BACKUPS = 30;

// 获取备份列表
function getBackups() {
  try {
    return wx.getStorageSync(BACKUP_KEY) || [];
  } catch (e) {
    return [];
  }
}

// 保存备份列表
function saveBackupList(list) {
  try {
    wx.setStorageSync(BACKUP_KEY, list);
    return true;
  } catch (e) {
    console.error('[Backup] 保存备份列表失败', e);
    return false;
  }
}

// 创建备份（在破坏性操作前调用）
function createBackup(label) {
  try {
    const raw = wx.getStorageSync(STORAGE_KEY);
    if (!raw) return null;

    const list = getBackups();
    const backup = {
      id: 'b_' + Date.now(),
      timestamp: new Date().toISOString(),
      label: label || '自动备份',
      data: typeof raw === 'string' ? JSON.parse(raw) : raw
    };
    list.unshift(backup);
    while (list.length > MAX_BACKUPS) list.pop();
    saveBackupList(list);
    return backup;
  } catch (e) {
    console.error('[Backup] 创建备份失败', e);
    return null;
  }
}

// 恢复备份
function restoreBackup(id) {
  const list = getBackups();
  const b = list.find(function (x) { return x.id === id; });
  if (!b) return false;
  try {
    wx.setStorageSync(STORAGE_KEY, b.data);
    return true;
  } catch (e) {
    console.error('[Backup] 恢复备份失败', e);
    return false;
  }
}

// 删除单个备份
function deleteBackup(id) {
  const list = getBackups().filter(function (x) { return x.id !== id; });
  saveBackupList(list);
  return true;
}

// 清除所有备份
function clearAllBackups() {
  try {
    wx.removeStorageSync(BACKUP_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getBackups,
  createBackup,
  restoreBackup,
  deleteBackup,
  clearAllBackups
};
