/**
 * sfx.js — 音效模块（Web Audio API，零依赖，零文件）
 * 
 * 全部音效通过 OscillatorNode 合成，无需加载外部音频文件。
 * 提供赌场式沉浸反馈：答对/答错/掌握/完成/MVP结算
 * 
 * 用法：
 *   SFX.correct()   — 答对（短促上升音）
 *   SFX.wrong()     — 答错（低沉短音）
 *   SFX.master()    — 掌握一个词（三音和弦，成就感）
 *   SFX.complete()  — 完成本轮测验（胜利旋律）
 *   SFX.mvp()       — MVP结算（隆重凯旋）
 *   SFX.tick()      — 轻微点击反馈
 *   SFX.enabled     — 是否开启音效（默认 true，读取 localStorage）
 */

(function() {
    let _ctx = null;

    function getCtx() {
        if (!_ctx) {
            _ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (_ctx.state === 'suspended') {
            _ctx.resume();
        }
        return _ctx;
    }

    function _isEnabled() {
        try {
            const d = JSON.parse(localStorage.getItem('ielts_learning_system') || '{}');
            return d.sfxEnabled !== false; // 默认开启
        } catch(e) { return true; }
    }

    function _setEnabled(v) {
        try {
            const d = JSON.parse(localStorage.getItem('ielts_learning_system') || '{}');
            d.sfxEnabled = v;
            localStorage.setItem('ielts_learning_system', JSON.stringify(d));
        } catch(e) {}
    }

    // 播放单个音调
    function _tone(freq, duration, type, volume, delay) {
        if (!_isEnabled()) return;
        try {
            const ctx = getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + (delay || 0));
            gain.gain.setValueAtTime(volume || 0.15, ctx.currentTime + (delay || 0));
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + (delay || 0));
            osc.stop(ctx.currentTime + (delay || 0) + duration);
        } catch(e) {}
    }

    // 播放噪声（用于 wrong 的沉闷感）
    function _noise(duration, volume, delay) {
        if (!_isEnabled()) return;
        try {
            const ctx = getCtx();
            const bufferSize = ctx.sampleRate * duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            const src = ctx.createBufferSource();
            src.buffer = buffer;
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, ctx.currentTime);
            gain.gain.setValueAtTime(volume || 0.08, ctx.currentTime + (delay || 0));
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (delay || 0) + duration);
            src.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            src.start(ctx.currentTime + (delay || 0));
            src.stop(ctx.currentTime + (delay || 0) + duration);
        } catch(e) {}
    }

    window.SFX = {
        /** 答对 — 短促上升音（C5→E5） */
        correct: function() {
            _tone(523, 0.1, 'sine', 0.12, 0);
            _tone(659, 0.12, 'sine', 0.10, 0.06);
        },

        /** 答错 — 低沉短音 + 微弱噪声 */
        wrong: function() {
            _tone(220, 0.15, 'triangle', 0.12, 0);
            _noise(0.12, 0.06, 0);
        },

        /** 掌握一个词 — 三音和弦 C-E-G（成就感，比 correct 更丰满） */
        master: function() {
            _tone(523, 0.25, 'sine', 0.12, 0);
            _tone(659, 0.25, 'sine', 0.10, 0.08);
            _tone(784, 0.35, 'sine', 0.13, 0.16);
        },

        /** 完成本轮 — 胜利短旋律 C-E-G-C(高) */
        complete: function() {
            _tone(523, 0.15, 'sine', 0.12, 0);
            _tone(659, 0.15, 'sine', 0.11, 0.12);
            _tone(784, 0.15, 'sine', 0.11, 0.24);
            _tone(1047, 0.35, 'sine', 0.14, 0.36);
        },

        /** MVP结算 — 隆重凯旋（C-E-G-C 高八度 + 和弦结尾） */
        mvp: function() {
            _tone(523, 0.2, 'sine', 0.12, 0);
            _tone(659, 0.2, 'sine', 0.11, 0.15);
            _tone(784, 0.2, 'sine', 0.11, 0.30);
            _tone(1047, 0.4, 'sine', 0.14, 0.45);
            // 和弦结尾
            _tone(1047, 0.6, 'sine', 0.08, 0.60);
            _tone(1319, 0.6, 'sine', 0.07, 0.60);
            _tone(1568, 0.6, 'sine', 0.09, 0.60);
        },

        /** 轻微点击 */
        tick: function() {
            _tone(880, 0.05, 'sine', 0.06, 0);
        },

        /** 纸飞机飞出 — 从低到高的"咻——"声（词从错词本移出） */
        fly: function() {
            if (!_isEnabled()) return;
            try {
                const ctx = getCtx();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                osc.type = 'sine';
                // 从 400Hz 滑升到 2000Hz，模拟"咻——"的飞行轨迹
                osc.frequency.setValueAtTime(400, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.4);
                // 带通滤波，让声音有"穿越"的空气感
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.4);
                filter.Q.setValueAtTime(2, ctx.currentTime);
                // 音量包络：快速起，缓慢消失
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.7);
            } catch(e) {}
        },

        /** 音效开关 */
        get enabled() { return _isEnabled(); },
        set enabled(v) { _setEnabled(v); },

        /** 切换开关 */
        toggle: function() {
            _setEnabled(!_isEnabled());
            return _isEnabled();
        }
    };
})();
