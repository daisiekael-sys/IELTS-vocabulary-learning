/**
 * study-log.js — 学习日志模块
 * 记录每日学习活动（学习量、掌握量、错误量），用于学习曲线图和日历打卡
 * 数据存储在 localStorage 'ielts_learning_system'.studyLog 中，与现有数据结构共享
 */

(function() {
    const STORAGE_KEY = 'ielts_learning_system';

    function getStudyLog() {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            if (!d) return {};
            let data = JSON.parse(d);
            if (!data.studyLog) {
                data.studyLog = {};
            }
            return data.studyLog;
        } catch (e) {
            console.error('[study-log] getStudyLog error:', e);
            return {};
        }
    }

    function setStudyLog(log) {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            let data = d ? JSON.parse(d) : {};
            if (!data.studyLog) data.studyLog = {};
            data.studyLog = log;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // 同步到云端
            if (typeof syncDataWithCloud === 'function') {
                syncDataWithCloud();
            }
            return true;
        } catch (e) {
            console.error('[study-log] setStudyLog error:', e);
            return false;
        }
    }

    function getTodayKey() {
        const now = new Date();
        return now.getFullYear() + '-' +
               String(now.getMonth() + 1).padStart(2, '0') + '-' +
               String(now.getDate()).padStart(2, '0');
    }

    /**
     * 记录一次学习活动
     * @param {string} module - 'ebbinghaus' 或 'synonyms'
     * @param {object} delta - { learned: 0, mastered: 0, errors: 0 }
     */
    window.StudyLog = {
        record: function(module, delta) {
            const log = getStudyLog();
            const today = getTodayKey();

            if (!log[today]) {
                log[today] = {
                    ebbinghaus: { learned: 0, mastered: 0, errors: 0 },
                    synonyms: { learned: 0, mastered: 0, errors: 0 }
                };
            }

            if (!log[today][module]) {
                log[today][module] = { learned: 0, mastered: 0, errors: 0 };
            }

            log[today][module].learned += (delta.learned || 0);
            log[today][module].mastered += (delta.mastered || 0);
            log[today][module].errors += (delta.errors || 0);

            setStudyLog(log);
        },

        /**
         * 获取最近 N 天的学习数据
         * @param {number} days - 天数
         * @returns {array} [{date, ebbinghaus:{learned,mastered,errors}, synonyms:{...}, total:{...}}]
         */
        getRecent: function(days) {
            const log = getStudyLog();
            const result = [];
            const now = new Date();

            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.getFullYear() + '-' +
                           String(d.getMonth() + 1).padStart(2, '0') + '-' +
                           String(d.getDate()).padStart(2, '0');

                const entry = log[key] || {
                    ebbinghaus: { learned: 0, mastered: 0, errors: 0 },
                    synonyms: { learned: 0, mastered: 0, errors: 0 }
                };

                const totalLearned = (entry.ebbinghaus?.learned || 0) + (entry.synonyms?.learned || 0);
                const totalMastered = (entry.ebbinghaus?.mastered || 0) + (entry.synonyms?.mastered || 0);
                const totalErrors = (entry.ebbinghaus?.errors || 0) + (entry.synonyms?.errors || 0);

                result.push({
                    date: key,
                    label: (d.getMonth() + 1) + '/' + d.getDate(),
                    ebbinghaus: entry.ebbinghaus || { learned: 0, mastered: 0, errors: 0 },
                    synonyms: entry.synonyms || { learned: 0, mastered: 0, errors: 0 },
                    total: { learned: totalLearned, mastered: totalMastered, errors: totalErrors }
                });
            }
            return result;
        },

        /**
         * 获取指定月份的打卡数据（用于日历热力图）
         * @param {number} year
         * @param {number} month - 0-based (0=January)
         * @returns {object} { 'YYYY-MM-DD': totalLearned }
         */
        getMonthCalendar: function(year, month) {
            const log = getStudyLog();
            const result = {};
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const key = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                if (log[key]) {
                    const totalLearned = (log[key].ebbinghaus?.learned || 0) + (log[key].synonyms?.learned || 0);
                    if (totalLearned > 0) {
                        result[key] = totalLearned;
                    }
                }
            }
            return result;
        },

        /**
         * 获取连续打卡天数
         */
        getStreak: function() {
            const log = getStudyLog();
            let streak = 0;
            const now = new Date();

            for (let i = 0; i < 365; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.getFullYear() + '-' +
                           String(d.getMonth() + 1).padStart(2, '0') + '-' +
                           String(d.getDate()).padStart(2, '0');

                if (log[key]) {
                    const total = (log[key].ebbinghaus?.learned || 0) + (log[key].synonyms?.learned || 0);
                    if (total > 0) {
                        streak++;
                    } else if (i > 0) {
                        break;
                    }
                } else if (i > 0) {
                    break;
                }
            }
            return streak;
        }
    };
})();
