/* ═══════════════════════════════════════════════
   APP — Main Application Controller
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Constants ─────────────────────────────
    const PAGES = ['ident', 'perf', 'prog', 'data', 'rsrch', 'link'];
    const CMD_ALIASES = {
        about: 'ident', ident: 'ident', identity: 'ident', me: 'ident',
        skills: 'perf', perf: 'perf', performance: 'perf',
        projects: 'prog', prog: 'prog', project: 'prog',
        experience: 'data', data: 'data', exp: 'data', edu: 'data', education: 'data', work: 'data',
        research: 'rsrch', rsrch: 'rsrch', paper: 'rsrch',
        contact: 'link', link: 'link', links: 'link',
    };

    // ── State ─────────────────────────────────
    let currentPage = 'ident';
    let currentLang = 'en';
    let cmdHistory = [];
    let historyIdx = -1;
    let navFocusIdx = 0;
    let booted = false;

    // ── DOM Refs ──────────────────────────────
    const bootScreen = document.getElementById('boot-screen');
    const bootLog = document.getElementById('boot-log');
    const cdu = document.getElementById('cdu');
    const content = document.getElementById('content');
    const pageLabel = document.getElementById('page-label');
    const clockEl = document.getElementById('clock');
    const langBtn = document.getElementById('lang-btn');
    const cmdInput = document.getElementById('cmd-input');
    const cmdOutput = document.getElementById('cmd-output');
    const navTabs = document.querySelectorAll('.nav-tab');
    const hintsEl = document.getElementById('hints');

    // ── Initialize ────────────────────────────
    function init() {
        // Check if boot was already shown this session
        const skipBoot = sessionStorage.getItem('cdu-booted');

        // Detect language preference
        const savedLang = localStorage.getItem('cdu-lang');
        if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
            currentLang = savedLang;
        } else if (navigator.language && navigator.language.startsWith('zh')) {
            currentLang = 'zh';
        }
        langBtn.textContent = currentLang.toUpperCase();
        document.documentElement.setAttribute('data-lang', currentLang);

        // Detect page from hash
        const hashPage = location.hash.slice(1);
        if (PAGES.includes(hashPage)) {
            currentPage = hashPage;
        }

        // Start clock
        updateClock();
        setInterval(updateClock, 1000);

        // Bind events
        bindEvents();

        // Update mobile hints
        updateHints();

        // Boot or skip
        if (skipBoot) {
            skipBootSequence();
        } else {
            runBootSequence();
        }
    }

    // ── Boot Sequence ─────────────────────────
    async function runBootSequence() {
        const lines = I18N[currentLang].boot;
        let skipRequested = false;

        const onSkip = () => { skipRequested = true; };
        document.addEventListener('keydown', onSkip, { once: false });
        document.addEventListener('click', onSkip, { once: false });
        document.addEventListener('touchstart', onSkip, { once: false });

        for (const line of lines) {
            if (skipRequested) break;
            appendBootLine(line.text, line.cls);
            await sleep(line.delay);
        }

        // Clean up skip listeners
        document.removeEventListener('keydown', onSkip);
        document.removeEventListener('click', onSkip);
        document.removeEventListener('touchstart', onSkip);

        // If skipped, show all remaining lines instantly
        if (skipRequested) {
            bootLog.innerHTML = '';
            for (const line of lines) {
                appendBootLine(line.text, line.cls);
            }
        }

        await sleep(skipRequested ? 200 : 600);
        finishBoot();
    }

    function appendBootLine(text, cls) {
        const div = document.createElement('div');
        div.className = cls || '';
        div.textContent = text;
        bootLog.appendChild(div);
        bootLog.scrollTop = bootLog.scrollHeight;
    }

    function skipBootSequence() {
        bootScreen.style.display = 'none';
        cdu.classList.remove('hidden');
        cdu.style.opacity = '1';
        booted = true;
        renderCurrentPage();
    }

    function finishBoot() {
        sessionStorage.setItem('cdu-booted', '1');
        bootScreen.classList.add('fade-out');
        cdu.classList.remove('hidden');
        setTimeout(() => { cdu.style.opacity = '1'; }, 50);
        setTimeout(() => {
            bootScreen.style.display = 'none';
            booted = true;
        }, 600);
        renderCurrentPage();
    }

    // ── Page Rendering ────────────────────────
    function renderCurrentPage() {
        const t = I18N[currentLang];
        const pageT = t[currentPage];

        // Update status bar
        pageLabel.textContent = t.pageLabels[currentPage];

        // Update nav tabs
        navTabs.forEach((tab, idx) => {
            const page = tab.dataset.page;
            tab.classList.toggle('active', page === currentPage);
            tab.setAttribute('aria-selected', page === currentPage);
            if (page === currentPage) navFocusIdx = idx;
        });

        // Update hash
        history.replaceState(null, '', '#' + currentPage);

        // Render content with transition
        content.classList.add('transitioning');
        setTimeout(() => {
            let html = '';
            const alertHtml = currentPage === 'ident' ? renderAlert(currentLang) : '';

            if (PageRenderers[currentPage]) {
                if (currentPage === 'ident') {
                    html = PageRenderers.ident(pageT, alertHtml);
                } else {
                    html = PageRenderers[currentPage](pageT);
                }
            }

            content.innerHTML = html;
            content.scrollTop = 0;
            content.classList.remove('transitioning');

            // Bind content interactions
            bindContentEvents();
        }, 150);
    }

    function navigateTo(page) {
        if (!PAGES.includes(page) || page === currentPage) return;
        currentPage = page;
        renderCurrentPage();
    }

    // ── Content Event Binding ─────────────────
    function bindContentEvents() {
        // Project expand/collapse
        content.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', () => toggleProject(item));
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleProject(item);
                }
            });
        });

        // Alert banner goto
        content.querySelectorAll('[data-goto]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                navigateTo(el.dataset.goto);
            });
        });
    }

    function toggleProject(item) {
        item.classList.toggle('expanded');
    }

    // ── Event Binding ─────────────────────────
    function bindEvents() {
        // Nav tabs
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => navigateTo(tab.dataset.page));
        });

        // Language toggle
        langBtn.addEventListener('click', toggleLang);

        // Command input
        cmdInput.addEventListener('keydown', handleCmdKeydown);

        // Global keyboard
        document.addEventListener('keydown', handleGlobalKeydown);

        // Hash change
        window.addEventListener('hashchange', () => {
            const p = location.hash.slice(1);
            if (PAGES.includes(p)) navigateTo(p);
        });

        // Touch swipe
        bindTouchSwipe();

        // Window resize
        window.addEventListener('resize', updateHints);
    }

    // ── Keyboard Handlers ─────────────────────
    function handleGlobalKeydown(e) {
        if (!booted) return;

        // If cmd input is focused, let it handle keys
        if (document.activeElement === cmdInput) return;

        // Number keys 1-6 → page navigation
        const num = parseInt(e.key);
        if (num >= 1 && num <= 6) {
            e.preventDefault();
            navigateTo(PAGES[num - 1]);
            return;
        }

        // '/' → focus command input
        if (e.key === '/') {
            e.preventDefault();
            cmdInput.focus();
            return;
        }

        // Tab → cycle nav (when not in cmd input)
        if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
                navFocusIdx = (navFocusIdx - 1 + PAGES.length) % PAGES.length;
            } else {
                navFocusIdx = (navFocusIdx + 1) % PAGES.length;
            }
            navigateTo(PAGES[navFocusIdx]);
            return;
        }

        // Arrow keys → scroll content
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            content.scrollBy({ top: 60, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            content.scrollBy({ top: -60, behavior: 'smooth' });
        }

        // Arrow left/right → prev/next page
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const idx = PAGES.indexOf(currentPage);
            if (idx > 0) navigateTo(PAGES[idx - 1]);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const idx = PAGES.indexOf(currentPage);
            if (idx < PAGES.length - 1) navigateTo(PAGES[idx + 1]);
        }

        // Escape → go to IDENT
        if (e.key === 'Escape') {
            e.preventDefault();
            navigateTo('ident');
        }
    }

    function handleCmdKeydown(e) {
        // Enter → execute command
        if (e.key === 'Enter') {
            e.preventDefault();
            const raw = cmdInput.value.trim();
            if (raw) {
                executeCommand(raw);
                cmdHistory.push(raw);
                historyIdx = -1;
            }
            cmdInput.value = '';
            return;
        }

        // Escape → blur
        if (e.key === 'Escape') {
            e.preventDefault();
            cmdInput.blur();
            return;
        }

        // Arrow up/down → command history
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0 && historyIdx < cmdHistory.length - 1) {
                historyIdx++;
                cmdInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx > 0) {
                historyIdx--;
                cmdInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
            } else {
                historyIdx = -1;
                cmdInput.value = '';
            }
            return;
        }

        // Tab → autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            const input = cmdInput.value.trim().toLowerCase();
            if (!input) return;
            const allCmds = ['help', 'clear', 'whoami', 'date', 'neofetch', 'theme',
                'lang', 'about', 'skills', 'projects', 'experience', 'research', 'contact'];
            const matches = allCmds.filter(c => c.startsWith(input));
            if (matches.length === 1) {
                cmdInput.value = matches[0];
            } else if (matches.length > 1) {
                appendCmdResponse(matches.join('  '), 'cyan');
            }
            return;
        }
    }

    // ── Command Execution ─────────────────────
    function executeCommand(raw) {
        const t = I18N[currentLang].cmd;

        // Echo the command
        appendCmdEcho('❯ ' + raw);

        const parts = raw.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : '';

        // Navigation aliases
        if (CMD_ALIASES[cmd] !== undefined) {
            navigateTo(CMD_ALIASES[cmd]);
            return;
        }

        // goto <page>
        if (cmd === 'goto' && arg) {
            if (CMD_ALIASES[arg] !== undefined) {
                navigateTo(CMD_ALIASES[arg]);
            } else if (PAGES.includes(arg)) {
                navigateTo(arg);
            } else {
                appendCmdResponse(t.unknown, 'error');
            }
            return;
        }

        switch (cmd) {
            case 'help':
                appendCmdResponse(t.helpHeader, 'amber');
                t.help.forEach(line => appendCmdResponse(line));
                break;

            case 'clear':
                cmdOutput.innerHTML = '';
                break;

            case 'whoami':
                appendCmdResponse(t.whoami, 'green');
                break;

            case 'date':
                appendCmdResponse(new Date().toString(), 'cyan');
                break;

            case 'ls':
                appendCmdResponse(PAGES.map((p, i) => `  [${i + 1}] ${p.toUpperCase()}`).join('\n'));
                break;

            case 'lang':
                if (arg === 'en' || arg === 'zh') {
                    setLang(arg);
                    appendCmdResponse(t.langSwitched + arg.toUpperCase(), 'green');
                } else {
                    appendCmdResponse('Usage: lang en|zh', 'amber');
                }
                break;

            case 'neofetch':
                appendCmdHtml(renderNeofetch());
                break;

            case 'theme':
                if (['green', 'amber', 'cyan'].includes(arg)) {
                    applyTheme(arg);
                    const tAfter = I18N[currentLang].cmd;
                    appendCmdResponse(tAfter.themeChanged + arg, 'green');
                } else {
                    appendCmdResponse(t.themeList, 'amber');
                }
                break;

            default:
                appendCmdResponse(t.unknown, 'error');
        }
    }

    function appendCmdEcho(text) {
        const div = document.createElement('div');
        div.className = 'cmd-echo';
        div.textContent = text;
        cmdOutput.appendChild(div);
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
    }

    function appendCmdResponse(text, cls = '') {
        const div = document.createElement('div');
        div.className = 'cmd-response' + (cls ? ' ' + cls : '');
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = text;
        cmdOutput.appendChild(div);
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
    }

    function appendCmdHtml(html) {
        const div = document.createElement('div');
        div.className = 'cmd-response';
        div.innerHTML = html;
        cmdOutput.appendChild(div);
        cmdOutput.scrollTop = cmdOutput.scrollHeight;
    }

    // ── Language ───────────────────────────────
    function toggleLang() {
        setLang(currentLang === 'en' ? 'zh' : 'en');
    }

    function setLang(lang) {
        currentLang = lang;
        localStorage.setItem('cdu-lang', lang);
        langBtn.textContent = lang.toUpperCase();
        document.documentElement.setAttribute('data-lang', lang);
        updateHints();
        renderCurrentPage();
    }

    // ── Theme ─────────────────────────────────
    function applyTheme(theme) {
        const root = document.documentElement;
        const themes = {
            green: { main: '#00ff41', dim: '#00cc33', dark: '#003d10' },
            amber: { main: '#ff8c00', dim: '#cc7000', dark: '#3d2200' },
            cyan:  { main: '#00d4ff', dim: '#0099bb', dark: '#003344' },
        };
        const t = themes[theme];
        if (!t) return;
        root.style.setProperty('--green', t.main);
        root.style.setProperty('--green-dim', t.dim);
        root.style.setProperty('--green-dark', t.dark);
    }

    // ── Clock ─────────────────────────────────
    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${h}:${m}:${s}`;
    }

    // ── Touch Swipe ───────────────────────────
    function bindTouchSwipe() {
        let startX = 0, startY = 0, startTime = 0;

        content.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
            startTime = Date.now();
        }, { passive: true });

        content.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].screenX - startX;
            const dy = e.changedTouches[0].screenY - startY;
            const dt = Date.now() - startTime;

            // Must be fast, mostly horizontal
            if (dt > 400 || Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;

            const idx = PAGES.indexOf(currentPage);
            if (dx < 0 && idx < PAGES.length - 1) {
                navigateTo(PAGES[idx + 1]);
            } else if (dx > 0 && idx > 0) {
                navigateTo(PAGES[idx - 1]);
            }
        }, { passive: true });
    }

    // ── Hints Update ──────────────────────────
    function updateHints() {
        const isMobile = window.innerWidth <= 768;
        const t = I18N[currentLang].ui;
        if (isMobile) {
            hintsEl.innerHTML = `
                <span class="hint">${t.hintsMobile[0]}</span>
                <span class="hint">${t.hintsMobile[1]}</span>
                <span class="hint">${t.hintsMobile[2]}</span>`;
        } else {
            hintsEl.innerHTML = `
                <span class="hint"><kbd>1-6</kbd> ${t.hintPage}</span>
                <span class="hint"><kbd>↑↓</kbd> ${t.hintScroll}</span>
                <span class="hint"><kbd>/</kbd> ${t.hintCmd}</span>
                <span class="hint"><kbd>Tab</kbd> ${t.hintNav}</span>`;
        }
    }

    // ── Utility ───────────────────────────────
    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    // ── Start ─────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
