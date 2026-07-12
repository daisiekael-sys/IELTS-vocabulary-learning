// ===== 全局侧边栏导航（index.html + dreamspace.html 共享） =====
// Auto-adapts to host page: detects which page it's on and adjusts tree accordingly.

(function() {
    'use strict';

    var sidebarPins = {};
    var sidebarTreeState = {};
    var sidebarActiveKey = null;

    // ---- Utilities ----
    function esc(s) {
        if (typeof window.esc === 'function') return window.esc(s);
        if (typeof window.escHtml === 'function') return window.escHtml(s);
        var d = document.createElement('div');
        d.textContent = s || '';
        return d.innerHTML;
    }

    function loadData() {
        if (typeof window.loadData === 'function') return window.loadData();
        try {
            var d = JSON.parse(localStorage.getItem('ielts_learning_system') || '{}');
            return d.dreamSpaces || [];
        } catch(e) { return []; }
    }

    function getCreationTypes() {
        if (typeof window.getCreationTypes === 'function') return window.getCreationTypes();
        // Fallback: return empty
        return {};
    }

    function isIndexPage() {
        return window.location.pathname.endsWith('index.html') ||
               window.location.pathname === '/' ||
               window.location.pathname.endsWith('/');
    }

    function isDreamspacePage() {
        return window.location.pathname.endsWith('dreamspace.html');
    }

    // ---- Pin persistence ----
    function loadSidebarPins() {
        try {
            var saved = localStorage.getItem('sidebar_pins');
            if (saved) sidebarPins = JSON.parse(saved);
        } catch(e) { sidebarPins = {}; }
    }
    function saveSidebarPins() {
        try { localStorage.setItem('sidebar_pins', JSON.stringify(sidebarPins)); } catch(e) {}
    }

    // ---- Key generator ----
    function sidebarKey(type, spaceId, cIdx, fIdx) {
        var parts = [type];
        if (spaceId) parts.push(spaceId);
        if (cIdx !== undefined) parts.push('c' + cIdx);
        if (fIdx !== undefined) parts.push('f' + fIdx);
        return parts.join('_');
    }

    // ---- Toggle sidebar open/close ----
    window.toggleSidebar = function(forceState) {
        var sb = document.getElementById('sidebar');
        var ov = document.getElementById('sidebarOverlay');
        if (!sb || !ov) return;
        var isOpen = forceState !== undefined ? forceState : !sb.classList.contains('open');
        if (isOpen) {
            sb.classList.add('open');
            ov.classList.add('show');
            window.renderSidebar();
        } else {
            sb.classList.remove('open');
            ov.classList.remove('show');
        }
    };

    // ---- Toggle tree node expand/collapse ----
    window.toggleTreeNode = function(key) {
        sidebarTreeState[key] = !sidebarTreeState[key];
        var el = document.getElementById('treeChildren_' + key);
        var chev = document.getElementById('treeChev_' + key);
        if (el) el.classList.toggle('open', sidebarTreeState[key]);
        if (chev) chev.classList.toggle('open', sidebarTreeState[key]);
    };

    // ---- Toggle pin ----
    window.togglePin = function(key, ev) {
        if (ev) ev.stopPropagation();
        if (sidebarPins[key]) {
            delete sidebarPins[key];
        } else {
            sidebarPins[key] = true;
            sidebarTreeState[key] = true;
        }
        saveSidebarPins();
        window.renderSidebar();
        updatePagePinBtn();
    };

    // ---- Navigate to a node ----
    window.sidebarNavigate = function(type, spaceId, cIdx, fIdx) {
        var key = sidebarKey(type, spaceId, cIdx, fIdx);
        sidebarActiveKey = key;
        // Update active highlight
        var rows = document.querySelectorAll('.tree-row');
        rows.forEach(function(r) { r.classList.remove('active'); });
        var activeRow = document.getElementById('treeRow_' + key);
        if (activeRow) activeRow.classList.add('active');

        switch(type) {
            case 'home':
                if (!isIndexPage()) {
                    location.href = 'index.html';
                }
                break;
            case 'module':
                location.href = spaceId; // spaceId is actually the URL here
                break;
            case 'space':
                if (isIndexPage()) {
                    location.href = 'dreamspace.html?space=' + spaceId;
                } else {
                    if (typeof window.openSpaceDetail === 'function' && window.currentSpaceId !== spaceId) {
                        window.openSpaceDetail(spaceId);
                    }
                }
                break;
            case 'blueprint':
                if (isIndexPage()) {
                    location.href = 'dreamspace.html?space=' + spaceId;
                } else if (typeof window.openSpaceDetail === 'function' && window.currentSpaceId !== spaceId) {
                    window.openSpaceDetail(spaceId);
                }
                if (typeof window.openSpaceDetail === 'function') {
                    setTimeout(function() {
                        var el = document.getElementById('blueprintView') || document.querySelector('.blueprint-bar');
                        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
                    }, isIndexPage() ? 500 : 100);
                }
                break;
            case 'laws':
                if (isIndexPage()) {
                    location.href = 'dreamspace.html?space=' + spaceId;
                } else if (typeof window.openSpaceDetail === 'function' && window.currentSpaceId !== spaceId) {
                    window.openSpaceDetail(spaceId);
                }
                if (typeof window.openSpaceDetail === 'function') {
                    setTimeout(function() {
                        var sec = document.querySelectorAll('.sub-section')[1];
                        if (sec) sec.scrollIntoView({behavior:'smooth', block:'start'});
                    }, isIndexPage() ? 500 : 100);
                }
                break;
            case 'creation':
                if (isIndexPage()) {
                    location.href = 'dreamspace.html?space=' + spaceId + '&creation=' + cIdx;
                } else {
                    if (typeof window.openSpaceDetail === 'function' && window.currentSpaceId !== spaceId) {
                        window.openSpaceDetail(spaceId);
                    }
                    setTimeout(function() {
                        var el = document.getElementById('creation_' + cIdx);
                        if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
                        else {
                            var list = document.getElementById('creationsList');
                            if (list) list.scrollIntoView({behavior:'smooth', block:'start'});
                        }
                    }, 100);
                }
                break;
            case 'fragment':
                if (isIndexPage()) {
                    location.href = 'dreamspace.html?space=' + spaceId + '&creation=' + cIdx + '&fragment=' + fIdx;
                } else {
                    if (typeof window.openSpaceDetail === 'function' && window.currentSpaceId !== spaceId) {
                        window.openSpaceDetail(spaceId);
                    }
                    setTimeout(function() {
                        if (typeof window.openFragmentTimeline === 'function') {
                            window.openFragmentTimeline(cIdx, fIdx);
                        }
                    }, 100);
                }
                break;
        }
        // On mobile, close sidebar after navigation
        if (window.innerWidth < 700) window.toggleSidebar(false);
    };

    // ---- Build pin SVG ----
    function pinSvgForKey(key, pinned) {
        return '<svg class="tree-pin' + (pinned ? ' pinned' : '') + '" onclick="togglePin(\'' + key + '\',event)" viewBox="0 0 24 24"><path d="M9 4h6l-1 7 3 3v2h-4v4l-1 1-1-1v-4H7v-2l3-3-1-7z" fill="' + (pinned ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    }

    // ---- Chevron SVG ----
    var CHEVRON_SVG = '<svg width="10" height="10" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';

    // ---- Render sidebar tree ----
    window.renderSidebar = function() {
        var body = document.getElementById('sidebarBody');
        if (!body) return;
        var spaces = loadData();
        var html = '';

        // Home node (links to index.html)
        var homeKey = sidebarKey('home');
        var homePinned = !!sidebarPins[homeKey];
        var homeActive = isIndexPage() && !window.currentSpaceId;
        html += '<div class="tree-node">';
        html += '<div class="tree-row' + (homeActive ? ' active' : '') + '" id="treeRow_' + homeKey + '" onclick="sidebarNavigate(\'home\')">';
        html += '<div class="tree-chevron hidden"></div>';
        html += '<span class="tree-icon">🏠</span>';
        html += '<span class="tree-label">主页</span>';
        html += pinSvgForKey(homeKey, homePinned);
        html += '</div>';
        html += '</div>';

        // Learning modules (only show on index page or as quick links)
        var modulesKey = sidebarKey('modules');
        var modulesPinned = !!sidebarPins[modulesKey];
        var modulesOpen = !!sidebarTreeState[modulesKey] || modulesPinned;
        var moduleItems = [
            {url:'ebbinghaus.html', icon:'📖', name:'艾宾浩斯宇宙版'},
            {url:'synonyms.html', icon:'🔄', name:'高频同义替换'},
            {url:'errorbook.html', icon:'⭐', name:'错词本'},
            {url:'spelling.html', icon:'✏️', name:'拼写练习'}
        ];

        html += '<div class="tree-node">';
        html += '<div class="tree-row' + (sidebarActiveKey === modulesKey ? ' active' : '') + '" id="treeRow_' + modulesKey + '" onclick="toggleTreeNode(\'' + modulesKey + '\')">';
        html += '<div class="tree-chevron' + (modulesOpen ? ' open' : '') + '" id="treeChev_' + modulesKey + '">' + CHEVRON_SVG + '</div>';
        html += '<span class="tree-icon">📚</span>';
        html += '<span class="tree-label">英语学习</span>';
        html += pinSvgForKey(modulesKey, modulesPinned);
        html += '</div>';
        html += '<div class="tree-children' + (modulesOpen ? ' open' : '') + '" id="treeChildren_' + modulesKey + '">';
        for (var mi = 0; mi < moduleItems.length; mi++) {
            var mod = moduleItems[mi];
            var modKey = sidebarKey('module', mod.url);
            var modPinned = !!sidebarPins[modKey];
            var modActive = window.location.pathname.endsWith(mod.url);
            html += '<div class="tree-node">';
            html += '<div class="tree-row' + (modActive ? ' active' : '') + '" id="treeRow_' + modKey + '" onclick="sidebarNavigate(\'module\',\'' + mod.url + '\')">';
            html += '<div class="tree-chevron hidden"></div>';
            html += '<span class="tree-icon">' + mod.icon + '</span>';
            html += '<span class="tree-label">' + esc(mod.name) + '</span>';
            html += pinSvgForKey(modKey, modPinned);
            html += '</div></div>';
        }
        html += '</div></div>';

        // Dreamspace entry
        var dsEntryKey = sidebarKey('dreamspace');
        var dsEntryPinned = !!sidebarPins[dsEntryKey];
        var dsEntryActive = isDreamspacePage() && !window.currentSpaceId;
        html += '<div class="tree-node">';
        html += '<div class="tree-row' + (dsEntryActive ? ' active' : '') + '" id="treeRow_' + dsEntryKey + '" onclick="sidebarNavigate(\'module\',\'dreamspace.html\')">';
        html += '<div class="tree-chevron hidden"></div>';
        html += '<span class="tree-icon">🏵️</span>';
        html += '<span class="tree-label">创造空间</span>';
        html += pinSvgForKey(dsEntryKey, dsEntryPinned);
        html += '</div></div>';

        // Spaces section (expandable group)
        if (spaces.length > 0) {
            var spacesGroupKey = sidebarKey('spacesgroup');
            var sgPinned = !!sidebarPins[spacesGroupKey];
            var sgOpen = !!sidebarTreeState[spacesGroupKey] || sgPinned;

            html += '<div class="tree-node">';
            html += '<div class="tree-row' + (sidebarActiveKey === spacesGroupKey ? ' active' : '') + '" id="treeRow_' + spacesGroupKey + '" onclick="toggleTreeNode(\'' + spacesGroupKey + '\')">';
            html += '<div class="tree-chevron' + (sgOpen ? ' open' : '') + '" id="treeChev_' + spacesGroupKey + '">' + CHEVRON_SVG + '</div>';
            html += '<span class="tree-icon">🌌</span>';
            html += '<span class="tree-label">我的空间 (' + spaces.length + ')</span>';
            html += pinSvgForKey(spacesGroupKey, sgPinned);
            html += '</div>';
            html += '<div class="tree-children' + (sgOpen ? ' open' : '') + '" id="treeChildren_' + spacesGroupKey + '">';

            for (var si = 0; si < spaces.length; si++) {
                var sp = spaces[si];
                var spKey = sidebarKey('space', sp.id);
                var spPinned = !!sidebarPins[spKey];
                var spOpen = !!sidebarTreeState[spKey] || spPinned;
                var hasChildren = (sp.creations && sp.creations.length > 0) || (sp.laws && sp.laws.length > 0) || (sp.blueprint || sp.vision);
                var isActive = (window.currentSpaceId === sp.id);

                html += '<div class="tree-node">';
                html += '<div class="tree-row' + (isActive ? ' active' : '') + '" id="treeRow_' + spKey + '" onclick="sidebarNavigate(\'space\',\'' + sp.id + '\')">';
                html += '<div class="tree-chevron' + (spOpen ? ' open' : '') + (hasChildren ? '' : ' hidden') + '" id="treeChev_' + spKey + '" onclick="toggleTreeNode(\'' + spKey + '\')">' + CHEVRON_SVG + '</div>';
                html += '<span class="tree-icon">' + (sp.type === 'project' ? '⚙️' : '🌌') + '</span>';
                html += '<span class="tree-label">' + esc(sp.name) + '</span>';
                html += pinSvgForKey(spKey, spPinned);
                html += '</div>';

                if (hasChildren) {
                    html += '<div class="tree-children' + (spOpen ? ' open' : '') + '" id="treeChildren_' + spKey + '">';

                    // Blueprint
                    if (sp.blueprint || sp.vision) {
                        var bpKey = sidebarKey('blueprint', sp.id);
                        html += '<div class="tree-node"><div class="tree-row' + (sidebarActiveKey === bpKey ? ' active' : '') + '" id="treeRow_' + bpKey + '" onclick="sidebarNavigate(\'blueprint\',\'' + sp.id + '\')">';
                        html += '<div class="tree-chevron hidden"></div><span class="tree-icon">🗺️</span><span class="tree-label">蓝图</span>';
                        html += pinSvgForKey(bpKey, !!sidebarPins[bpKey]);
                        html += '</div></div>';
                    }

                    // Laws
                    if (sp.laws && sp.laws.length > 0) {
                        var lawsKey = sidebarKey('laws', sp.id);
                        html += '<div class="tree-node"><div class="tree-row' + (sidebarActiveKey === lawsKey ? ' active' : '') + '" id="treeRow_' + lawsKey + '" onclick="sidebarNavigate(\'laws\',\'' + sp.id + '\')">';
                        html += '<div class="tree-chevron hidden"></div><span class="tree-icon">📜</span><span class="tree-label">世界法则 (' + sp.laws.length + ')</span>';
                        html += pinSvgForKey(lawsKey, !!sidebarPins[lawsKey]);
                        html += '</div></div>';
                    }

                    // Creations (创造盒子)
                    var creations = sp.creations || [];
                    var cbKey = sidebarKey('creationbox', sp.id);
                    var cbPinned = !!sidebarPins[cbKey];
                    var cbOpen = !!sidebarTreeState[cbKey] || cbPinned;

                    html += '<div class="tree-node">';
                    html += '<div class="tree-row' + (sidebarActiveKey === cbKey ? ' active' : '') + '" id="treeRow_' + cbKey + '" onclick="toggleTreeNode(\'' + cbKey + '\')">';
                    html += '<div class="tree-chevron' + (cbOpen ? ' open' : '') + (creations.length > 0 ? '' : ' hidden') + '" id="treeChev_' + cbKey + '">' + CHEVRON_SVG + '</div>';
                    html += '<span class="tree-icon">🎁</span><span class="tree-label">创造盒子 (' + creations.length + ')</span>';
                    html += pinSvgForKey(cbKey, cbPinned);
                    html += '</div>';

                    if (creations.length > 0) {
                        html += '<div class="tree-children' + (cbOpen ? ' open' : '') + '" id="treeChildren_' + cbKey + '">';
                        for (var ci = 0; ci < creations.length; ci++) {
                            var c = creations[ci];
                            var cKey = sidebarKey('creation', sp.id, ci);
                            var cPinned = !!sidebarPins[cKey];
                            var cOpen = !!sidebarTreeState[cKey] || cPinned;
                            var frags = c.fragments || [];
                            var allTypes = getCreationTypes();
                            var ct = allTypes[c.type] || {icon:'⭐', label:c.type};

                            html += '<div class="tree-node">';
                            html += '<div class="tree-row' + (sidebarActiveKey === cKey ? ' active' : '') + '" id="treeRow_' + cKey + '" onclick="sidebarNavigate(\'creation\',\'' + sp.id + '\',' + ci + ')">';
                            html += '<div class="tree-chevron' + (cOpen ? ' open' : '') + (frags.length > 0 ? '' : ' hidden') + '" id="treeChev_' + cKey + '" onclick="toggleTreeNode(\'' + cKey + '\')">' + CHEVRON_SVG + '</div>';
                            html += '<span class="tree-icon">' + (ct.icon || '⭐') + '</span>';
                            html += '<span class="tree-label">' + esc(c.name || '未命名') + '</span>';
                            html += pinSvgForKey(cKey, cPinned);
                            html += '</div>';

                            if (frags.length > 0) {
                                html += '<div class="tree-children' + (cOpen ? ' open' : '') + '" id="treeChildren_' + cKey + '">';
                                for (var fi = 0; fi < frags.length; fi++) {
                                    var f = frags[fi];
                                    var fKey = sidebarKey('fragment', sp.id, ci, fi);
                                    var fPinned = !!sidebarPins[fKey];
                                    var dotColor = f.done ? '#4ec9b0' : (f.assignee ? '#8299ff' : '#5a6480');
                                    html += '<div class="tree-node">';
                                    html += '<div class="tree-row' + (sidebarActiveKey === fKey ? ' active' : '') + '" id="treeRow_' + fKey + '" onclick="sidebarNavigate(\'fragment\',\'' + sp.id + '\',' + ci + ',' + fi + ')">';
                                    html += '<div class="tree-chevron hidden"></div>';
                                    html += '<span class="tree-icon" style="color:' + dotColor + ';">●</span>';
                                    html += '<span class="tree-label">' + esc(f.name || ('碎片' + (fi+1))) + '</span>';
                                    if (f.done) html += '<span style="font-size:0.55rem;color:#4ec9b0;">✓</span>';
                                    html += pinSvgForKey(fKey, fPinned);
                                    html += '</div></div>';
                                }
                                html += '</div>';
                            }
                            html += '</div>';
                        }
                        html += '</div>';
                    }
                    html += '</div>'; // end creationbox

                    html += '</div>'; // end space children
                }
                html += '</div>'; // end space node
            }
            html += '</div></div>'; // end spaces group
        }

        if (spaces.length === 0 && isIndexPage()) {
            // Don't show empty state if on index — spaces are in dreamspace
        }

        body.innerHTML = html;
    };

    // ---- Page pin button ----
    function getCurrentNavKey() {
        if (isIndexPage()) return sidebarKey('home');
        if (isDreamspacePage()) {
            if (!window.currentSpaceId) return sidebarKey('dreamspace');
            if (window._currentFragmentView && window._currentFragmentView.cIdx !== undefined) {
                return sidebarKey('fragment', window.currentSpaceId, window._currentFragmentView.cIdx, window._currentFragmentView.fIdx);
            }
            return sidebarKey('space', window.currentSpaceId);
        }
        // Other module pages
        var path = window.location.pathname.split('/').pop();
        return sidebarKey('module', path);
    }

    function updatePagePinBtn() {
        var btn = document.getElementById('pagePinBtn');
        if (!btn) return;
        var key = getCurrentNavKey();
        if (key && sidebarPins[key]) {
            btn.classList.add('pinned');
            btn.title = '已固定 — 点击取消固定';
        } else {
            btn.classList.remove('pinned');
            btn.title = '固定到侧边栏';
        }
    }

    window.toggleCurrentPagePin = function() {
        var key = getCurrentNavKey();
        if (!key) return;
        if (sidebarPins[key]) {
            delete sidebarPins[key];
        } else {
            sidebarPins[key] = true;
            sidebarTreeState[key] = true;
        }
        saveSidebarPins();
        updatePagePinBtn();
        window.renderSidebar();
    };

    window.updatePagePinBtn = updatePagePinBtn;

    // ---- Init ----
    function initSidebar() {
        loadSidebarPins();
        // Set active key based on current page
        sidebarActiveKey = getCurrentNavKey();
        updatePagePinBtn();
    }

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }

    // Expose for external calls
    window._sidebarSetActiveKey = function(key) {
        sidebarActiveKey = key;
        updatePagePinBtn();
    };
    window._sidebarKey = sidebarKey;
})();
