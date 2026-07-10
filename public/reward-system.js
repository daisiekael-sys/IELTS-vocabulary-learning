/**
 * reward-system.js — 小红花奖励 + 许愿兑换系统
 * 
 * 设计理念：把让我们健康的、变得更好的事情视为奖励
 * 
 * 小红花规则（S级翻倍制）：
 *   - 完成全部 🔴重要且紧急(IU) 任务 → 获得1朵 🏵️S级小红花
 *   - 基础倍率：每完成2个其他任务 = 1朵 🌸（向下取整）
 *   - S级翻倍：拿到S级后，每完成1个其他任务 = 1朵 🌸
 *   - 没完成IU也有花，只是S级后翻倍增值
 *   - 如果IU后来完成，之前完成的其他任务的花朵差额补发
 * 
 * 许愿兑换（事件驱动，非时间凑数）：
 *   - 出去玩：1朵/h（1小时1朵），回来登记实际时长，余数≥30min补1朵
 *   - 运动：1朵/30min，回来登记实际时长，余数≥15min补1朵
 *   - 日常积累单词：1朵/3词（余2词扣1朵，余1不扣）
 *   - 睡觉休息：1朵/h，回来登记实际时长，余数≥30min补1朵
 *   - 以上为默认愿望，可隐藏/恢复，也可完全自定义新增
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
            data._lastModified = new Date().toISOString();
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

    // 默认许愿类型定义（不可变基线，全删也能恢复）
    const DEFAULT_WISH_TYPES = {
        outing: {
            name: '出去玩', icon: '🌈', unit: 'h', unitLabel: '小时',
            costPerUnit: 1, minUnit: 1,
            description: '出去探索，感受这个世界最能带给你感觉的某种东西',
            guide: '出去走走，探索一点什么，或者感受什么在召唤你',
            registerLabel: '实际出去了多久（分钟）', registerUnit: 'min',
            costPerRegisterUnit: 1/60, registerRounding: 30
        },
        exercise: {
            name: '运动', icon: '💪', unit: '部位', unitLabel: '个部位',
            costPerUnit: 1, minUnit: 1,
            description: '闭眼感知全身，哪个部位最需要运动，就去练它',
            guide: '闭上眼睛感受一下，哪个部位最堵塞、最需要被照顾？每练一个部位=1朵',
            registerLabel: '实际练了几个部位', registerUnit: '部位',
            costPerRegisterUnit: 1, registerRounding: 0
        },
        dictionary: {
            name: '日常积累单词', icon: '📖', unit: '词', unitLabel: '个词',
            costPerUnit: 1/3, minUnit: 3,
            description: '随机翻三页，找到今日最有感觉的三个词——像塔罗牌一样',
            guide: '随机翻三次，选最有感觉的词。这不是背诵，是相遇',
            registerLabel: '实际翻到几个词', registerUnit: '词',
            costPerRegisterUnit: 1/3, registerRounding: -1
        },
        sleep: {
            name: '睡觉休息', icon: '😴', unit: 'h', unitLabel: '小时',
            costPerUnit: 1, minUnit: 1,
            description: '躺床上休息，什么都不想，身体会感谢你的',
            guide: '放下一切，躺平，让身体自己决定要休息多久',
            registerLabel: '实际躺了多久（分钟）', registerUnit: 'min',
            costPerRegisterUnit: 1/60, registerRounding: 30
        }
    };

    /**
     * 获取用户自定义愿望配置（从 localStorage 读取）
     * 结构: {
     *   displayMode: 'selected' | 'random',   // 展示模式
     *   selectedKeys: ['outing','exercise',...], // 手动模式下勾选展示的愿望
     *   customTypes: { key: {name,icon,...} },   // 用户自定义的愿望类型
     *   randomSeed: [key,key,key]               // 随机模式下当前抽中的3个（缓存，刷新不变）
     * }
     */
    function _loadWishConfig() {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            if (!d) return _defaultWishConfig();
            let data = JSON.parse(d);
            if (!data.wishConfig) return _defaultWishConfig();
            var cfg = data.wishConfig;
            // 兼容旧格式：如果没有 displayMode，迁移旧 activeTypes
            if (!cfg.displayMode) {
                cfg.displayMode = 'selected';
                cfg.selectedKeys = cfg.activeTypes || Object.keys(DEFAULT_WISH_TYPES);
                delete cfg.activeTypes;
            }
            if (!cfg.selectedKeys) cfg.selectedKeys = Object.keys(DEFAULT_WISH_TYPES);
            if (!cfg.customTypes) cfg.customTypes = {};
            if (!cfg.hiddenDefaults) cfg.hiddenDefaults = [];
            // 数据迁移：移除旧版 dreamspace key（已从默认类型中删除）
            cfg.selectedKeys = cfg.selectedKeys.filter(function(k) { return k !== 'dreamspace'; });
            if (cfg.hiddenDefaults) cfg.hiddenDefaults = cfg.hiddenDefaults.filter(function(k) { return k !== 'dreamspace'; });
            return cfg;
        } catch (e) {
            return _defaultWishConfig();
        }
    }

    function _defaultWishConfig() {
        return {
            displayMode: 'selected',
            selectedKeys: Object.keys(DEFAULT_WISH_TYPES),
            hiddenDefaults: [],
            customTypes: {},
            randomSeed: []
        };
    }

    function _saveWishConfig(config) {
        try {
            let d = localStorage.getItem(STORAGE_KEY);
            let data = d ? JSON.parse(d) : {};
            data.wishConfig = config;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[reward] save wish config error:', e);
        }
    }

    // 兼容旧代码的别名
    var WISH_TYPES = DEFAULT_WISH_TYPES;

    /**
     * 根据实际时长/数量计算最终花费（通用版）
     * @param {string} type - wish type
     * @param {number} actualUnits - 实际值（分钟/词数）
     * @returns {number} 花费花朵数
     */
    function _calcActualCost(type, actualUnits) {
        const allTypes = _getMergedTypes();
        const def = allTypes[type];
        if (!def) return 0;

        // 词典类特殊规则（registerRounding === -1）：余2扣1，余1不扣
        if (def.registerRounding === -1) {
            const perSet = def.costPerRegisterUnit ? Math.round(1 / def.costPerRegisterUnit) : 3;
            const fullSets = Math.floor(actualUnits / perSet);
            const remainder = actualUnits % perSet;
            let cost = fullSets;
            if (remainder === perSet - 1) cost += 1;
            return cost;
        }

        // 时间类：actualUnits 是分钟
        const divisor = def.costPerRegisterUnit ? Math.round(1 / def.costPerRegisterUnit) : 60;
        const rounding = def.registerRounding || Math.round(divisor / 2);
        const fullUnits = Math.floor(actualUnits / divisor);
        const remainder = actualUnits % divisor;
        let cost = fullUnits;
        if (remainder >= rounding) cost += 1;
        return cost;
    }

    /**
     * 合并所有愿望类型：默认 + 自定义
     */
    function _getMergedTypes() {
        const config = _loadWishConfig();
        var merged = {};
        // 默认类型（排除被用户隐藏的）
        for (var k in DEFAULT_WISH_TYPES) {
            if (config.hiddenDefaults && config.hiddenDefaults.indexOf(k) === -1) {
                merged[k] = DEFAULT_WISH_TYPES[k];
            }
        }
        // 自定义类型覆盖/新增
        for (var k in config.customTypes) {
            merged[k] = config.customTypes[k];
        }
        return merged;
    }

    window.RewardSystem = {
        /**
         * 获取当前小红花余额
         */
        getFlowers: function() {
            return _load().flowers || 0;
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
         * 核心逻辑：S级翻倍制
         * - IU未全部完成 → 基础倍率：每2个其他任务=1朵
         * - IU全部完成 → 1朵S级 + 翻倍：每1个其他任务=1朵
         * - IU后来完成时，差额自动补发
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
         * 获取所有许愿类型定义（默认+自定义）
         */
        getWishTypes: function() {
            return _getMergedTypes();
        },

        /**
         * 获取当前应展示的愿望类型列表
         * - selected 模式：返回 selectedKeys
         * - random 模式：返回 randomSeed（如无缓存则重新抽取）
         */
        getDisplayWishKeys: function() {
            var config = _loadWishConfig();
            if (config.displayMode === 'random') {
                if (!config.randomSeed || config.randomSeed.length === 0) {
                    config.randomSeed = this._drawRandom();
                    _saveWishConfig(config);
                }
                return config.randomSeed.slice();
            }
            // selected 模式：返回 selectedKeys 中未被隐藏的
            var sel = config.selectedKeys || Object.keys(DEFAULT_WISH_TYPES);
            var hidden = config.hiddenDefaults || [];
            return sel.filter(function(k) { return hidden.indexOf(k) === -1; });
        },

        /**
         * 随机从库中抽取3个愿望
         */
        _drawRandom: function() {
            var allTypes = _getMergedTypes();
            var keys = Object.keys(allTypes);
            // Fisher-Yates 洗牌取前3
            for (var i = keys.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = keys[i]; keys[i] = keys[j]; keys[j] = tmp;
            }
            return keys.slice(0, Math.min(3, keys.length));
        },

        /**
         * 重新抽取随机愿望（用户手动刷新）
         */
        refreshRandomWishes: function() {
            var config = _loadWishConfig();
            config.randomSeed = this._drawRandom();
            _saveWishConfig(config);
            return config.randomSeed;
        },

        /**
         * 获取被隐藏的默认愿望列表
         */
        getHiddenDefaultWishes: function() {
            var config = _loadWishConfig();
            return config.hiddenDefaults || [];
        },

        /**
         * 恢复被隐藏的默认愿望
         */
        restoreDefaultWish: function(key) {
            var config = _loadWishConfig();
            if (!DEFAULT_WISH_TYPES[key]) return;
            config.hiddenDefaults = (config.hiddenDefaults || []).filter(function(k) { return k !== key; });
            if (config.selectedKeys.indexOf(key) === -1) {
                config.selectedKeys.push(key);
            }
            _saveWishConfig(config);
        },

        /**
         * 获取默认愿望类型（不可删除的基线）
         */
        getDefaultWishTypes: function() {
            return DEFAULT_WISH_TYPES;
        },

        /**
         * 获取当前愿望配置
         */
        getWishConfig: function() {
            return _loadWishConfig();
        },

        /**
         * 更新愿望配置
         */
        saveWishConfig: function(config) {
            _saveWishConfig(config);
        },

        /**
         * 设置展示模式 'selected' | 'random'
         */
        setDisplayMode: function(mode) {
            var config = _loadWishConfig();
            config.displayMode = mode;
            if (mode === 'random') {
                config.randomSeed = this._drawRandom();
            }
            _saveWishConfig(config);
        },

        /**
         * 切换某个愿望的勾选状态（selected 模式下）
         * 默认类型：从展示中隐藏/恢复（hiddenDefaults 机制，可恢复）
         * 自定义类型：从 selectedKeys 中移除/添加
         */
        toggleWishSelection: function(key) {
            var config = _loadWishConfig();
            if (DEFAULT_WISH_TYPES[key]) {
                // 默认类型：切换 hiddenDefaults
                var hIdx = config.hiddenDefaults.indexOf(key);
                var sIdx = config.selectedKeys.indexOf(key);
                if (sIdx !== -1) {
                    // 当前在展示中 → 隐藏
                    config.selectedKeys.splice(sIdx, 1);
                    if (hIdx === -1) config.hiddenDefaults.push(key);
                } else {
                    // 当前隐藏 → 恢复
                    if (hIdx !== -1) config.hiddenDefaults.splice(hIdx, 1);
                    config.selectedKeys.push(key);
                }
            } else {
                // 自定义类型：从 selectedKeys 中移除/添加
                var idx = config.selectedKeys.indexOf(key);
                if (idx === -1) {
                    config.selectedKeys.push(key);
                } else {
                    config.selectedKeys.splice(idx, 1);
                }
            }
            _saveWishConfig(config);
        },

        /**
         * 添加自定义愿望类型（同时加入 selectedKeys）
         */
        addCustomWishType: function(key, def) {
            const config = _loadWishConfig();
            config.customTypes[key] = def;
            if (config.selectedKeys.indexOf(key) === -1) {
                config.selectedKeys.push(key);
            }
            _saveWishConfig(config);
        },

        /**
         * 删除自定义愿望类型（默认类型不可删除）
         */
        removeCustomWishType: function(key) {
            var config = _loadWishConfig();
            // 默认类型不可删除
            if (DEFAULT_WISH_TYPES[key]) return false;
            delete config.customTypes[key];
            config.selectedKeys = config.selectedKeys.filter(function(t) { return t !== key; });
            if (config.randomSeed) {
                config.randomSeed = config.randomSeed.filter(function(t) { return t !== key; });
            }
            _saveWishConfig(config);
            return true;
        },

        /**
         * 获取待登记的愿望列表
         */
        getPendingWishes: function() {
            return _load().pendingWishes;
        },

        /**
         * 第一步：出发兑换（预扣花朵）
         * @param {string} type - wish type key
         * @param {number} estUnits - 预估数量（小时/分钟/词数）
         * @returns {{ success, id, cost, message }}
         */
        depart: function(type, estUnits) {
            const allTypes = _getMergedTypes();
            const def = allTypes[type];
            if (!def) return { success: false, id: null, cost: 0, message: '未知愿望类型' };

            // 时间类（unit=h/min）：estUnits 可能是小时或分钟
            if (def.unit === 'h') {
                estUnits = Math.max(def.minUnit, Math.round(estUnits * 2) / 2);
            } else {
                estUnits = Math.max(def.minUnit, Math.round(estUnits));
            }

            // 通用花费计算
            var cost;
            if (def.costPerUnit >= 1) {
                // 1朵/1单位，直接取整
                cost = Math.max(1, Math.ceil(estUnits * def.costPerUnit));
            } else {
                // 1朵/N单位
                var perSet = Math.round(1 / def.costPerUnit);
                var fullSets = Math.floor(estUnits / perSet);
                var rem = estUnits % perSet;
                cost = fullSets;
                // 词典类 registerRounding === -1: 余2扣1，余1不扣
                if (def.registerRounding === -1) {
                    if (rem === perSet - 1) cost += 1;
                } else if (def.unit === 'h') {
                    // 小时制：余数转分钟判断
                    var remMin = (estUnits - Math.floor(estUnits)) * 60;
                    var roundMin = def.registerRounding || 30;
                    cost += (remMin >= roundMin ? 1 : 0);
                } else {
                    var roundVal = def.registerRounding || Math.round(perSet / 2);
                    cost += (rem >= roundVal ? 1 : 0);
                }
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
            const allTypes = _getMergedTypes();
            const def = allTypes[pending.type];
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

            let msg = (def ? def.name : pending.type) + '登记完成！';
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
