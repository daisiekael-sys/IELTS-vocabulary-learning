/**
 * task-manager.js — 四象限任务管理 + 日历每日任务
 * 数据存储在 localStorage 'ielts_learning_system'.tasks 中
 * 
 * 四象限：
 *   IU = 重要且紧急 (Important & Urgent)
 *   IN = 重要不紧急 (Important, Not Urgent)
 *   NU = 不重要但紧急 (Not Important, Urgent)
 *   NN = 不重要不紧急 (Not Important, Not Urgent)
 * 
 * 每日数据结构：
 *   tasks[dateKey] = {
 *     items: [
 *       { id, text, quadrant:'IU'|'IN'|'NU'|'NN', done:false, createdAt }
 *     ],
 *     mood: '',     // 选填
 *     summary: ''   // 选填
 *   }
 */

(function() {
    const STORAGE_KEY = 'ielts_learning_system';

    function _load() {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            if (!d) return {};
            let data = JSON.parse(d);
            if (!data.tasks) data.tasks = {};
            return data.tasks;
        } catch (e) {
            console.error('[task-manager] load error:', e);
            return {};
        }
    }

    function _save(tasks) {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            let data = d ? JSON.parse(d) : {};
            data.tasks = tasks;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            if (typeof syncDataWithCloud === 'function') {
                syncDataWithCloud();
            }
        } catch (e) {
            console.error('[task-manager] save error:', e);
        }
    }

    function _todayKey() {
        const now = new Date();
        return now.getFullYear() + '-' +
               String(now.getMonth() + 1).padStart(2, '0') + '-' +
               String(now.getDate()).padStart(2, '0');
    }

    function _genId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    // 优先级排序权重
    const QUADRANT_ORDER = { IU: 0, IN: 1, NU: 2, NN: 3 };

    window.TaskManager = {
        /**
         * 获取指定日期的任务数据
         * @param {string} dateKey - 'YYYY-MM-DD'，不传则为今天
         */
        getDay: function(dateKey) {
            const key = dateKey || _todayKey();
            const tasks = _load();
            if (!tasks[key]) {
                tasks[key] = { items: [], mood: '', summary: '' };
                _save(tasks);
            }
            return tasks[key];
        },

        /**
         * 添加任务
         * @param {string} quadrant - 'IU'|'IN'|'NU'|'NN'
         * @param {string} text - 任务内容
         * @param {string} dateKey - 可选，默认今天
         */
        addTask: function(quadrant, text, dateKey) {
            const key = dateKey || _todayKey();
            const tasks = _load();
            if (!tasks[key]) tasks[key] = { items: [], mood: '', summary: '' };

            const item = {
                id: _genId(),
                text: text.trim(),
                quadrant: quadrant,
                done: false,
                createdAt: new Date().toISOString()
            };
            tasks[key].items.push(item);
            _save(tasks);
            return item;
        },

        /**
         * 切换任务完成状态
         */
        toggleTask: function(taskId, dateKey) {
            const key = dateKey || _todayKey();
            const tasks = _load();
            if (!tasks[key] || !tasks[key].items) return null;

            const item = tasks[key].items.find(i => i.id === taskId);
            if (item) {
                item.done = !item.done;
                _save(tasks);
            }
            return item;
        },

        /**
         * 删除任务
         */
        deleteTask: function(taskId, dateKey) {
            const key = dateKey || _todayKey();
            const tasks = _load();
            if (!tasks[key] || !tasks[key].items) return;

            tasks[key].items = tasks[key].items.filter(i => i.id !== taskId);
            _save(tasks);
        },

        /**
         * 更新心情/总结
         */
        updateDayMeta: function(dateKey, mood, summary) {
            const key = dateKey || _todayKey();
            const tasks = _load();
            if (!tasks[key]) tasks[key] = { items: [], mood: '', summary: '' };
            if (mood !== undefined) tasks[key].mood = mood;
            if (summary !== undefined) tasks[key].summary = summary;
            _save(tasks);
        },

        /**
         * 获取排好序的任务列表（IU > IN > NU > NN，未完成在前）
         */
        getSortedItems: function(dateKey) {
            const day = this.getDay(dateKey);
            return day.items.slice().sort((a, b) => {
                // 未完成优先
                if (a.done !== b.done) return a.done ? 1 : -1;
                // 同状态按象限排
                return (QUADRANT_ORDER[a.quadrant] || 0) - (QUADRANT_ORDER[b.quadrant] || 0);
            });
        },

        /**
         * 获取指定日期的统计
         * 返回 { total, done, iuTotal, iuDone, quadrantCounts: {IU:{total,done},...} }
         */
        getDayStats: function(dateKey) {
            const day = this.getDay(dateKey);
            const stats = {
                total: day.items.length,
                done: day.items.filter(i => i.done).length,
                iuTotal: day.items.filter(i => i.quadrant === 'IU').length,
                iuDone: day.items.filter(i => i.quadrant === 'IU' && i.done).length,
                quadrantCounts: {}
            };
            ['IU','IN','NU','NN'].forEach(q => {
                const qItems = day.items.filter(i => i.quadrant === q);
                stats.quadrantCounts[q] = {
                    total: qItems.length,
                    done: qItems.filter(i => i.done).length
                };
            });
            return stats;
        },

        /**
         * 获取本周每天的统计（用于折线图）
         * 返回 [{ dateKey, iuTotal, iuDone, totalDone }, ...] 共7天
         */
        getWeekStats: function() {
            const result = [];
            const now = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.getFullYear() + '-' +
                    String(d.getMonth() + 1).padStart(2, '0') + '-' +
                    String(d.getDate()).padStart(2, '0');
                const stats = this.getDayStats(key);
                result.push({
                    dateKey: key,
                    label: String(d.getMonth() + 1) + '/' + String(d.getDate()),
                    iuTotal: stats.iuTotal,
                    iuDone: stats.iuDone,
                    totalDone: stats.done
                });
            }
            return result;
        },

        /**
         * 计算今日奖励小红花
         * 规则：
         * - IU全部完成 = 1朵
         * - 超出IU还完成了其他象限 = 每超1个1朵 + A+标记
         * - 仅IU完成但无超出 = 1朵
         */
        calculateTodayReward: function() {
            const stats = this.getDayStats();
            if (stats.iuTotal === 0) return { flowers: 0, aplus: false };
            
            const iuAllDone = stats.iuDone >= stats.iuTotal;
            if (!iuAllDone) return { flowers: 0, aplus: false };

            const beyondIU = stats.done - stats.iuDone;
            const flowers = 1 + Math.max(0, beyondIU);
            const aplus = beyondIU > 0;

            return { flowers, aplus };
        }
    };
})();
