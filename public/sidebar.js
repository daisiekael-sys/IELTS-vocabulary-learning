// ===== 全局侧边栏导航（index.html + dreamspace.html 共享） =====
// Auto-adapts to host page: detects which page it's on and adjusts tree accordingly.

(function() {
    'use strict';

    var sidebarPins = {};
    var sidebarTreeState = {};
    var sidebarShowAll = {}; // parentKey -> true: show all children; false/undefined: show only pinned
    var sidebarActiveKey = null;

    // 默认所有节点展开
    var DEFAULT_OPEN = true;

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
    // Handles two conventions:
    //   - Default-open nodes (home, modules, dreamspace, spaces): undefined = open
    //   - Default-closed nodes (creations): undefined = closed
    window.toggleTreeNode = function(key) {
        var el = document.getElementById('treeChildren_' + key);
        var chev = document.getElementById('treeChev_' + key);
        var currentlyOpen = el ? el.classList.contains('open') : false;
        var newOpen = !currentlyOpen;
        sidebarTreeState[key] = newOpen;
        if (el) el.classList.toggle('open', newOpen);
        if (chev) chev.classList.toggle('open', newOpen);
    };

    // ---- Toggle show all / only pinned children ----
    window.toggleShowAll = function(parentKey, ev) {
        if (ev) ev.stopPropagation();
        sidebarShowAll[parentKey] = !sidebarShowAll[parentKey];
        window.renderSidebar();
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

    // Helper: is a node open? (default open unless explicitly closed)
    function isNodeOpen(key, pinned) {
        if (pinned) return true;
        return sidebarTreeState[key] !== false; // undefined = open, true = open, false = closed
    }

    // Helper: should we show all children or only pinned ones?
    function shouldShowAllChildren(parentKey, childKeys) {
        // If no pinned children, show all
        var hasPinned = false;
        for (var i = 0; i < childKeys.length; i++) {
            if (sidebarPins[childKeys[i]]) { hasPinned = true; break; }
        }
        if (!hasPinned) return true; // no pinned → show all
        // If explicitly toggled to show all, show all
        if (sidebarShowAll[parentKey]) return true;
        // Default: only show pinned
        return false;
    }

    // Helper: is child visible under current pin-filtering?
    function isChildVisible(parentKey, childKey, childKeys) {
        var showAll = shouldShowAllChildren(parentKey, childKeys);
        if (showAll) return true;
        return !!sidebarPins[childKey];
    }

    // Helper: count pinned and unpinned children
    function countPinnedChildren(childKeys) {
        var pinned = 0, unpinned = 0;
        for (var i = 0; i < childKeys.length; i++) {
            if (sidebarPins[childKeys[i]]) pinned++;
            else unpinned++;
        }
        return { pinned: pinned, unpinned: unpinned };
    }

    // ---- Render sidebar tree ----
    window.renderSidebar = function() {
        var body = document.getElementById('sidebarBody');
        if (!body) return;
        var spaces = loadData();
        var html = '';

        // Home — top-level header button (not a sibling of modules)
        var homeKey = sidebarKey('home');
        var homePinned = !!sidebarPins[homeKey];
        var homeActive = isIndexPage() && !window.currentSpaceId;
        html += '<div class="tree-node tree-home">';
        html += '<div class="tree-row' + (homeActive ? ' active' : '') + '" id="treeRow_' + homeKey + '" onclick="sidebarNavigate(\'home\')">';
        html += '<div class="tree-chevron hidden"></div>';
        html += '<span class="tree-icon">🏠</span>';
        html += '<span class="tree-label">主页</span>';
        html += pinSvgForKey(homeKey, homePinned);
        html += '</div>';
        html += '</div>';

        // Divider
        html += '<div class="tree-divider"></div>';

        // Learning modules
        var modulesKey = sidebarKey('modules');
        var modulesPinned = !!sidebarPins[modulesKey];
        var modulesOpen = isNodeOpen(modulesKey, modulesPinned);
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
        // Build module child keys for pin-filtering
        var moduleChildKeys = [];
        for (var mci = 0; mci < moduleItems.length; mci++) {
            moduleChildKeys.push(sidebarKey('module', moduleItems[mci].url));
        }
        var modCounts = countPinnedChildren(moduleChildKeys);
        for (var mi = 0; mi < moduleItems.length; mi++) {
            var mod = moduleItems[mi];
            var modKey = sidebarKey('module', mod.url);
            var modPinned = !!sidebarPins[modKey];
            var modActive = window.location.pathname.endsWith(mod.url);
            if (!isChildVisible(modulesKey, modKey, moduleChildKeys)) continue;
            html += '<div class="tree-node">';
            html += '<div class="tree-row' + (modActive ? ' active' : '') + '" id="treeRow_' + modKey + '" onclick="sidebarNavigate(\'module\',\'' + mod.url + '\')">';
            html += '<div class="tree-chevron hidden"></div>';
            html += '<span class="tree-icon">' + mod.icon + '</span>';
            html += '<span class="tree-label">' + esc(mod.name) + '</span>';
            html += pinSvgForKey(modKey, modPinned);
            html += '</div></div>';
        }
        // Show toggle if some children are hidden
        if (modCounts.pinned > 0 && modCounts.unpinned > 0) {
            var modShowAll = shouldShowAllChildren(modulesKey, moduleChildKeys);
            html += '<div class="tree-show-all-toggle" onclick="toggleShowAll(\'' + modulesKey + '\',event)">' +
                (modShowAll ? '▾ 收起' : '▸ 其他' + modCounts.unpinned + '项') + '</div>';
        }
        html += '</div></div>';

        // Dreamspace — expandable parent node (click text → navigate, click arrow → toggle)
        var dsEntryKey = sidebarKey('dreamspace');
        var dsEntryPinned = !!sidebarPins[dsEntryKey];
        var dsEntryActive = isDreamspacePage() && !window.currentSpaceId;
        var dsHasChildren = spaces.length > 0;
        var dsOpen = isNodeOpen(dsEntryKey, dsEntryPinned);
        html += '<div class="tree-node">';
        html += '<div class="tree-row' + (dsEntryActive ? ' active' : '') + '" id="treeRow_' + dsEntryKey + '" onclick="sidebarNavigate(\'module\',\'dreamspace.html\')">';
        html += '<div class="tree-chevron' + (dsOpen ? ' open' : '') + (dsHasChildren ? '' : ' hidden') + '" id="treeChev_' + dsEntryKey + '" onclick="event.stopPropagation();toggleTreeNode(\'' + dsEntryKey + '\')">' + CHEVRON_SVG + '</div>';
        html += '<span class="tree-icon">🏵️</span>';
        html += '<span class="tree-label">创造空间</span>';
        html += pinSvgForKey(dsEntryKey, dsEntryPinned);
        html += '</div>';

        // Spaces as children of dreamspace
        if (dsHasChildren) {
            html += '<div class="tree-children' + (dsOpen ? ' open' : '') + '" id="treeChildren_' + dsEntryKey + '">';

            // Build space child keys for pin-filtering
            var spaceChildKeys = [];
            for (var sci = 0; sci < spaces.length; sci++) {
                spaceChildKeys.push(sidebarKey('space', spaces[sci].id));
            }
            var spCounts = countPinnedChildren(spaceChildKeys);

            for (var si = 0; si < spaces.length; si++) {
                var sp = spaces[si];
                var spKey = sidebarKey('space', sp.id);
                // Pin-filter: skip if not visible
                if (!isChildVisible(dsEntryKey, spKey, spaceChildKeys)) continue;
                var spPinned = !!sidebarPins[spKey];
                var spOpen = isNodeOpen(spKey, spPinned);
                var spHasCreations = (sp.creations && sp.creations.length > 0);
                var isActive = (window.currentSpaceId === sp.id);
                var spIcon = sp.icon || (sp.type === 'project' ? '⚙️' : '🌌');
                var spTag = sp.type === 'project' ? '项目式' : '主题式';

                html += '<div class="tree-node">';
                html += '<div class="tree-row' + (isActive ? ' active' : '') + '" id="treeRow_' + spKey + '" onclick="sidebarNavigate(\'space\',\'' + sp.id + '\')">';
                html += '<div class="tree-chevron' + (spOpen ? ' open' : '') + (spHasCreations ? '' : ' hidden') + '" id="treeChev_' + spKey + '" onclick="event.stopPropagation();toggleTreeNode(\'' + spKey + '\')">' + CHEVRON_SVG + '</div>';
                html += '<span class="tree-icon">' + spIcon + '</span>';
                html += '<span class="tree-label">' + esc(sp.name) + '</span>';
                html += '<span class="tree-tag">' + spTag + '</span>';
                html += pinSvgForKey(spKey, spPinned);
                html += '</div>';

                if (spHasCreations) {
                    html += '<div class="tree-children' + (spOpen ? ' open' : '') + '" id="treeChildren_' + spKey + '">';

                    var creations = sp.creations || [];
                    // Build creation child keys for pin-filtering
                    var creationChildKeys = [];
                    for (var cci = 0; cci < creations.length; cci++) {
                        creationChildKeys.push(sidebarKey('creation', sp.id, cci));
                    }
                    var cCounts = countPinnedChildren(creationChildKeys);

                    for (var ci = 0; ci < creations.length; ci++) {
                        var c = creations[ci];
                        var cKey = sidebarKey('creation', sp.id, ci);
                        // Pin-filter: skip if not visible
                        if (!isChildVisible(spKey, cKey, creationChildKeys)) continue;
                        var cPinned = !!sidebarPins[cKey];
                        var cOpen = sidebarTreeState[cKey] === true;
                        var frags = c.fragments || [];
                        var allTypes = getCreationTypes();
                        var ct = allTypes[c.type] || {icon:'⭐', label:c.type};
                        var cDisplayName = c.name || (ct.label || c.type);

                        html += '<div class="tree-node">';
                        html += '<div class="tree-row' + (sidebarActiveKey === cKey ? ' active' : '') + '" id="treeRow_' + cKey + '" onclick="sidebarNavigate(\'creation\',\'' + sp.id + '\',' + ci + ')">';
                        html += '<div class="tree-chevron' + (cOpen ? ' open' : '') + (frags.length > 0 ? '' : ' hidden') + '" id="treeChev_' + cKey + '" onclick="event.stopPropagation();toggleTreeNode(\'' + cKey + '\')">' + CHEVRON_SVG + '</div>';
                        html += '<span class="tree-icon">' + (ct.icon || '⭐') + '</span>';
                        html += '<span class="tree-label">' + esc(cDisplayName) + '</span>';
                        html += pinSvgForKey(cKey, cPinned);
                        html += '</div>';

                        if (frags.length > 0) {
                            html += '<div class="tree-children' + (cOpen ? ' open' : '') + '" id="treeChildren_' + cKey + '">';
                            // Build fragment child keys for pin-filtering
                            var fragChildKeys = [];
                            for (var fci = 0; fci < frags.length; fci++) {
                                fragChildKeys.push(sidebarKey('fragment', sp.id, ci, fci));
                            }
                            var fCounts = countPinnedChildren(fragChildKeys);

                            for (var fi = 0; fi < frags.length; fi++) {
                                var f = frags[fi];
                                var fKey = sidebarKey('fragment', sp.id, ci, fi);
                                // Pin-filter: skip if not visible
                                if (!isChildVisible(cKey, fKey, fragChildKeys)) continue;
                                var fPinned = !!sidebarPins[fKey];
                                // Use member color for dot when assigned
                                var dotColor = '#5a6480';
                                if (f.done) {
                                    // Done: use assignee color if available, else teal
                                    if (f.assignee && window.getMemberColor) {
                                        try { dotColor = window.getMemberColor(sp, f.assignee).glow; } catch(e) { dotColor = '#4ec9b0'; }
                                    } else { dotColor = '#4ec9b0'; }
                                } else if (f.assignee) {
                                    if (window.getMemberColor) {
                                        try { dotColor = window.getMemberColor(sp, f.assignee).glow; } catch(e) { dotColor = '#8299ff'; }
                                    } else { dotColor = '#8299ff'; }
                                }
                                html += '<div class="tree-node">';
                                html += '<div class="tree-row' + (sidebarActiveKey === fKey ? ' active' : '') + '" id="treeRow_' + fKey + '" onclick="sidebarNavigate(\'fragment\',\'' + sp.id + '\',' + ci + ',' + fi + ')">';
                                html += '<div class="tree-chevron hidden"></div>';
                                html += '<span class="tree-icon" style="color:' + dotColor + ';">●</span>';
                                html += '<span class="tree-label">' + esc(f.name || ('碎片' + (fi+1))) + '</span>';
                                if (f.done) html += '<span style="font-size:0.55rem;color:' + dotColor + ';">✓</span>';
                                html += pinSvgForKey(fKey, fPinned);
                                html += '</div></div>';
                            }
                            // Show toggle if some fragments are hidden
                            if (fCounts.pinned > 0 && fCounts.unpinned > 0) {
                                var fShowAll = shouldShowAllChildren(cKey, fragChildKeys);
                                html += '<div class="tree-show-all-toggle" onclick="toggleShowAll(\'' + cKey + '\',event)">' +
                                    (fShowAll ? '▾ 收起' : '▸ 其他' + fCounts.unpinned + '项') + '</div>';
                            }
                            html += '</div>';
                        }
                        html += '</div>';
                    }

                    // Show toggle if some creations are hidden
                    if (cCounts.pinned > 0 && cCounts.unpinned > 0) {
                        var cShowAll = shouldShowAllChildren(spKey, creationChildKeys);
                        html += '<div class="tree-show-all-toggle" onclick="toggleShowAll(\'' + spKey + '\',event)">' +
                            (cShowAll ? '▾ 收起' : '▸ 其他' + cCounts.unpinned + '项') + '</div>';
                    }

                    html += '</div>'; // end space children
                }
                html += '</div>'; // end space node
            }

            // Show toggle if some spaces are hidden
            if (spCounts.pinned > 0 && spCounts.unpinned > 0) {
                var spShowAll = shouldShowAllChildren(dsEntryKey, spaceChildKeys);
                html += '<div class="tree-show-all-toggle" onclick="toggleShowAll(\'' + dsEntryKey + '\',event)">' +
                    (spShowAll ? '▾ 收起' : '▸ 其他' + spCounts.unpinned + '项') + '</div>';
            }

            html += '</div>'; // end dreamspace children
        }
        html += '</div>'; // end dreamspace node

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
        if (!btn) return; // page-pin-btn removed; pin still works via sidebar tree
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
