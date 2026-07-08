/**
 * reward-system.js — 小红花奖励 + 许愿兑换系统
 * 
 * 设计理念：把让我们健康的、变得更好的事情视为奖励
 * 
 * 小红花规则（S级优先制）：
 *   - 完成全部 🔴重要且紧急(IU) 任务 → 获得1朵 🏵️S级小红花
 *   - S级获得后，每额外完成1个其他象限任务 → +1朵 🌸小红花
 *   - 如果先完成了不重要的任务，小花暂不发放
 *   - 当IU全部完成拿到S级后，之前已完成的其他任务的小花同时发放
 *   - 如果IU始终未完成，其他任务的花朵不会发放
 * 
 * 许愿兑换（事件驱动，非时间凑数）：
 *   - 出去玩：1朵/h（1小时1朵），回来登记实际时长，余数≥15min补1朵
 *   - 运动：1朵/30min，回来登记实际时长，余数≥15min补1朵
 *   - 翻词典：1朵/3词（余2词扣1朵，余1不扣）
 * 
 * 两步流程：
 *   1. 出发：预扣花朵，记录 pending wish
 *   2. 回来：登记实际时长/数量，多退少补
 * 
 * 数据存储在 localStorage 'ielts_learning_system'.rewards 中
 * 结构：
 *   rewards = {
 *     flowers: 0,
 *     history: [{ date, count, reason, aplus }],
 *     wishes: [{ date, type, cost, units, detail, status, actualUnits, refund, reflection }],
 *     pendingWishes: [{ id, type, estUnits, estCost, createdAt }]  // 待登记的
 *   }
 */

(function() {
    const STORAGE_KEY = 'ielts_learning_system';

    function _load() {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            if (!d) return _default();
            let data = JSON.parse(d);
            if (!data.rewards) data.rewards = _default();
            if (!data.rewards.pendingWishes) data.rewards.pendingWishes = [];
            return data.rewards;
        } catch (e) {
            console.error('[reward] load error:', e);
            return _default();
        }
    }

    function _default() {
        return { flowers: 0, sFlowers: 0, history: [], wishes: [], pendingWishes: [] };
    }

    function _save(rewards) {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            let data = d ? JSON.parse(d) : {};
            data.rewards = rewards;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            if (typeof syncDataWithCloud === 'function') {
                syncDataWithCloud();
            }
        } catch (e) {
            console.error('[reward] save error:', e);
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

    // 许愿类型定义
    const WISH_TYPES = {
        outing: {
            name: '出去玩',
            icon: '🌈',
            unit: 'h',
            unitLabel: '小时',
            costPerUnit: 1,   // 1朵/h
            minUnit: 1,
            description: '出去探索，感受这个世界最能带给你感觉的某种东西',
            guide: '出去走走，探索一点什么，或者感受什么在召唤你',
            registerLabel: '实际出去了多久（分钟）',
            registerUnit: 'min',
            costPerRegisterUnit: 1/60,  // 60min=1朵
            registerRounding: 30        // 余数≥30min进1朵
        },
        exercise: {
            name: '运动',
            icon: '💪',
            unit: 'min',
            unitLabel: '分钟',
            costPerUnit: 1/30,  // 30min=1朵
            minUnit: 30,
            description: '闭眼感知全身，哪个部位最需要运动，就去练它',
            guide: '闭上眼睛感受一下，哪个部位最堵塞、最需要被照顾？',
            registerLabel: '实际运动了多久（分钟）',
            registerUnit: 'min',
            costPerRegisterUnit: 1/30,
            registerRounding: 15
        },
        dictionary: {
            name: '翻词典',
            icon: '📖',
            unit: '词',
            unitLabel: '个词',
            costPerUnit: 1/3,  // 3词=1朵
            minUnit: 3,
            description: '随机翻开三页，找到今日最有感觉的三个词——像塔罗牌一样，它们代表此刻的你',
            guide: '随机翻三次，选最有感觉的词。这不是背诵，是相遇',
            registerLabel: '实际翻到几个词',
            registerUnit: '词',
            costPerRegisterUnit: 1/3,
            registerRounding: -1  // 特殊：余2词扣1朵，余1不扣
        },
        sleep: {
            name: '睡觉休息',
            icon: '😴',
            unit: 'h',
            unitLabel: '小时',
            costPerUnit: 1,   // 1朵/h
            minUnit: 1,
            description: '躺床上休息，什么都不想，身体会感谢你的',
            guide: '放下一切，躺平，让身体自己决定要休息多久',
            registerLabel: '实际躺了多久（分钟）',
            registerUnit: 'min',
            costPerRegisterUnit: 1/60,
            registerRounding: 30
        }
    };

    /**
     * 根据实际时长/数量计算最终花费
     * @param {string} type - wish type
     * @param {number} actualUnits - 实际值（分钟/词数）
     * @returns {number} 花费花朵数
     */
    function _calcActualCost(type, actualUnits) {
        const def = WISH_TYPES[type];
        if (!def) return 0;

        if (type === 'dictionary') {
            // 翻词典特殊规则：每3词1朵，余2扣1，余1不扣
            const fullSets = Math.floor(actualUnits / 3);
            const remainder = actualUnits % 3;
            let cost = fullSets;
            if (remainder === 2) cost += 1;
            return cost;
        }

        // 出去玩 / 运动：时间制，actualUnits 是分钟
        let minutes = actualUnits;
        let divisor, rounding;
        if (type === 'outing') {
            divisor = 60;   // 60min=1朵
            rounding = 30;  // 余数≥30min进1朵
        } else {
            divisor = 30;   // 30min=1朵
            rounding = 15;  // 余数≥15min进1朵
        }
        const fullUnits = Math.floor(minutes / divisor);
        const remainder = minutes % divisor;
        let cost = fullUnits;
        if (remainder >= rounding) cost += 1;
        return cost;
    }

    window.RewardSystem = {
        /**
         * 获取当前小红花余额
         */
        getFlowers: function() {
            return _load().flowers;
        },

        /**
         * 获取完整奖励数据
         */
        getData: function() {
            return _load();
        },

        /**
         * 发放今日奖励
         */
        award: function(count, reason, sCount) {
            if (count <= 0) return;
            const rewards = _load();
            rewards.flowers += count;
            if (sCount > 0) rewards.sFlowers = (rewards.sFlowers || 0) + sCount;
            rewards.history.push({
                date: _todayKey(),
                count: count,
                sFlower: sCount || 0,
                reason: reason || '完成今日任务'
            });
            _save(rewards);
        },

        /**
         * 获取S级小红花总数
         */
        getSFlowers: function() {
            return _load().sFlowers || 0;
        },

        /**
         * 重新计算今日奖励（可重复调用，自动修正差额）
         * 核心逻辑：根据当前任务完成状态，实时计算应得小红花
         * - IU全部完成 → 1朵S级 + 每个其他已完成任务1朵
         * - IU未全部完成 → 0朵（先做其他任务不给花）
         * - 如果IU后来完成，之前完成的其他任务的花朵同时发放
         */
        recalculateToday: function() {
            if (!window.TaskManager) return 0;
            const rewards = _load();
            const today = _todayKey();

            // 计算当前任务状态应得的花朵
            const result = TaskManager.calculateTodayReward();
            const targetFlowers = result.flowers;
            const targetSFlowers = result.sFlower;

            // 查找今日已有的结算记录
            let settleEntry = rewards.history.find(h => h.date === today && h.reason === '每日任务结算');

            const currentAwarded = settleEntry ? (settleEntry.count || 0) : 0;
            const currentS = settleEntry ? (settleEntry.sFlower || 0) : 0;

            const diff = targetFlowers - currentAwarded;
            const sDiff = targetSFlowers - currentS;

            if (diff === 0 && sDiff === 0) return 0; // 无变化

            // 调整花朵余额
            rewards.flowers += diff;
            rewards.sFlowers = (rewards.sFlowers || 0) + sDiff;

            // 更新或创建结算记录
            if (settleEntry) {
                settleEntry.count = targetFlowers;
                settleEntry.sFlower = targetSFlowers;
            } else {
                rewards.history.push({
                    date: today,
                    count: targetFlowers,
                    sFlower: targetSFlowers,
                    reason: '每日任务结算'
                });
            }

            _save(rewards);
            return diff;
        },

        /**
         * 获取许愿类型定义
         */
        getWishTypes: function() {
            return WISH_TYPES;
        },

        /**
         * 获取待登记的愿望列表
         */
        getPendingWishes: function() {
            return _load().pendingWishes;
        },

        /**
         * 第一步：出发兑换（预扣花朵）
         * @param {string} type - 'outing'|'exercise'|'dictionary'
         * @param {number} estUnits - 预估数量（小时/分钟/词数）
         * @returns {{ success, id, cost, message }}
         */
        depart: function(type, estUnits) {
            const def = WISH_TYPES[type];
            if (!def) return { success: false, id: null, cost: 0, message: '未知愿望类型' };

            estUnits = Math.max(def.minUnit, type === 'outing' ? Math.round(estUnits * 2) / 2 : Math.round(estUnits));
            let cost;

            if (type === 'dictionary') {
                const fullSets = Math.floor(estUnits / 3);
                const rem = estUnits % 3;
                cost = fullSets + (rem >= 2 ? 1 : 0);
                cost = Math.max(1, cost);
            } else if (type === 'outing') {
                // estUnits 是小时，0.5h 步进
                const fullHours = Math.floor(estUnits);
                const remMin = (estUnits - fullHours) * 60;
                cost = fullHours + (remMin >= 30 ? 1 : 0);
                cost = Math.max(1, cost);
            } else if (type === 'exercise') {
                // estUnits 是分钟
                const fullUnits = Math.floor(estUnits / 30);
                const rem = estUnits % 30;
                cost = fullUnits + (rem >= 15 ? 1 : 0);
                cost = Math.max(1, cost);
            }

            const rewards = _load();
            if (rewards.flowers < cost) {
                return { success: false, id: null, cost: cost, message: '小红花不足，需要 ' + cost + ' 朵，当前 ' + rewards.flowers + ' 朵' };
            }

            const id = _genId();
            rewards.flowers -= cost;
            rewards.pendingWishes.push({
                id: id,
                type: type,
                estUnits: estUnits,
                estCost: cost,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            _save(rewards);

            return { success: true, id: id, cost: cost, message: def.name + '出发！预扣 ' + cost + ' 朵，回来记得登记哦' };
        },

        /**
         * 第二步：回来登记（多退少补）
         * @param {string} id - pending wish id
         * @param {number} actualUnits - 实际值
         * @param {string} reflection - 感受记录
         * @returns {{ success, refund, finalCost, message }}
         */
        register: function(id, actualUnits, reflection) {
            const rewards = _load();
            const pending = rewards.pendingWishes.find(p => p.id === id);
            if (!pending) return { success: false, refund: 0, finalCost: 0, message: '找不到这条待登记记录' };

            actualUnits = Math.max(0, Math.round(actualUnits));
            const def = WISH_TYPES[pending.type];
            const actualCost = _calcActualCost(pending.type, actualUnits);

            let refund = pending.estCost - actualCost;
            if (refund > 0) {
                rewards.flowers += refund;
            } else if (refund < 0) {
                // 需要补扣
                const extraNeeded = -refund;
                if (rewards.flowers >= extraNeeded) {
                    rewards.flowers -= extraNeeded;
                } else {
                    // 余额不足补扣，扣到0
                    rewards.flowers = 0;
                    refund = -(rewards.flowers + extraNeeded); // 实际未退
                }
            }

            // 从 pending 移除
            rewards.pendingWishes = rewards.pendingWishes.filter(p => p.id !== id);

            // 记录到 wishes
            rewards.wishes.push({
                date: _todayKey(),
                type: pending.type,
                estUnits: pending.estUnits,
                estCost: pending.estCost,
                actualUnits: actualUnits,
                finalCost: actualCost,
                refund: refund,
                reflection: reflection || '',
                status: 'completed'
            });
            _save(rewards);

            let msg = def.name + '登记完成！';
            if (refund > 0) msg += ' 退还 ' + refund + ' 朵';
            else if (refund < 0) msg += ' 补扣 ' + (-refund) + ' 朵';
            else msg += ' 花费正好 ' + actualCost + ' 朵';

            return { success: true, refund: refund, finalCost: actualCost, message: msg };
        },

        /**
         * 取消待登记的愿望（退还预扣花朵）
         */
        cancelPending: function(id) {
            const rewards = _load();
            const pending = rewards.pendingWishes.find(p => p.id === id);
            if (!pending) return { success: false, message: '找不到这条记录' };

            rewards.flowers += pending.estCost;
            rewards.pendingWishes = rewards.pendingWishes.filter(p => p.id !== id);
            _save(rewards);

            return { success: true, message: '已取消，退还 ' + pending.estCost + ' 朵' };
        },

        /**
         * 获取本周获得的花朵数
         */
        getWeekFlowers: function() {
            const rewards = _load();
            const now = new Date();
            let total = 0;
            const dayOfWeek = now.getDay() || 7;
            const monday = new Date(now);
            monday.setDate(monday.getDate() - dayOfWeek + 1);
            monday.setHours(0, 0, 0, 0);

            rewards.history.forEach(h => {
                const d = new Date(h.date);
                if (d >= monday) total += h.count;
            });
            return total;
        },

        /**
         * 获取A+天数（本周）
         */
        getWeekAplus: function() {
            const rewards = _load();
            const now = new Date();
            const dayOfWeek = now.getDay() || 7;
            const monday = new Date(now);
            monday.setDate(monday.getDate() - dayOfWeek + 1);
            monday.setHours(0, 0, 0, 0);

            let count = 0;
            rewards.history.forEach(h => {
                if (h.sFlower) {
                    const d = new Date(h.date);
                    if (d >= monday) count++;
                }
            });
            return count;
        },

        /**
         * 获取兑换历史
         */
        getWishHistory: function() {
            return _load().wishes;
        }
    };
})();
