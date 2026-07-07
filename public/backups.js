/**
 * backups.js - 本地自动备份与恢复（防误删）
 * 删除 / 清空数据前会自动保存一份快照，可在「恢复备份」中一键还原。
 * 数据保存在浏览器 localStorage，不依赖网络，永久有效。
 */
(function () {
  const BACKUP_KEY = 'ielts_backups';
  const DATA_KEY = 'ielts_learning_system';
  const MAX_BACKUPS = 30;

  function getBackups() {
    try {
      return JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveBackups(list) {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(list));
  }

  // 在破坏性操作前调用：保存当前数据快照
  function createBackup(label) {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (!raw) return null;
      const list = getBackups();
      const backup = {
        id: 'b_' + Date.now(),
        timestamp: new Date().toISOString(),
        label: label || '自动备份',
        data: JSON.parse(raw)
      };
      list.unshift(backup);
      while (list.length > MAX_BACKUPS) list.pop();
      saveBackups(list);
      return backup;
    } catch (e) {
      console.error('[Backup] 创建备份失败', e);
      return null;
    }
  }

  function restoreBackup(id) {
    const list = getBackups();
    const b = list.find(function (x) { return x.id === id; });
    if (!b) return false;
    localStorage.setItem(DATA_KEY, JSON.stringify(b.data));
    return true;
  }

  function deleteBackup(id) {
    const list = getBackups().filter(function (x) { return x.id !== id; });
    saveBackups(list);
    return true;
  }

  window.BackupManager = {
    getBackups: getBackups,
    createBackup: createBackup,
    restoreBackup: restoreBackup,
    deleteBackup: deleteBackup
  };
})();
