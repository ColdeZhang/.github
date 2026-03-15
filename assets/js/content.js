/* ═══════════════════════════════════════════════
   CONTENT — Page Renderers
   ═══════════════════════════════════════════════ */

const PageRenderers = {

    // ── IDENT Page ────────────────────────────
    ident(t, alertHtml) {
        return `
            ${alertHtml}
            <h1 class="page-title">${t.name}</h1>
            <div class="title-sub">${t.subtitle}</div>
            <div class="title-separator"></div>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionIdentity}</h2>
                ${dataRow(t.position, t.positionVal, 'green')}
                ${dataRow(t.location, t.locationVal)}
                ${dataRow(t.university, t.universityVal)}
                ${dataRow(t.classOf, t.classOfVal)}
                ${dataRow(t.status, t.statusVal, 'amber blink')}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionProfile}</h2>
                <p class="profile-text">${t.profileP1}</p>
                <p class="profile-text">${t.profileP2}</p>
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionLang}</h2>
                ${dataRow('中文', t.langZh)}
                ${dataRow('English', t.langEn)}
                ${dataRow('日本語', t.langJa)}
            </section>
        `;
    },

    // ── PERF Page ─────────────────────────────
    perf(t) {
        const skillsHtml = t.skills.map(s => {
            const filled = '█'.repeat(s.level);
            const empty = '░'.repeat(10 - s.level);
            return `
                <div class="skill-row">
                    <span class="skill-name">${esc(s.name)}</span>
                    <span class="skill-bar">
                        <span class="skill-filled">${filled}</span><span class="skill-empty">${empty}</span>
                    </span>
                </div>`;
        }).join('');

        const expertiseHtml = t.expertise.map(e =>
            `<div class="cdu-list-item">${esc(e)}</div>`
        ).join('');

        const certHtml = t.certs.map(c =>
            `<div class="cdu-list-item green">${esc(c)}</div>`
        ).join('');

        return `
            <h1 class="page-title">${t.title}</h1>
            <div class="title-separator"></div>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionProg}</h2>
                ${skillsHtml}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionExpertise}</h2>
                ${expertiseHtml}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionTools}</h2>
                <p class="profile-text">${esc(t.tools)}</p>
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionCert}</h2>
                ${certHtml}
            </section>
        `;
    },

    // ── PROG Page ─────────────────────────────
    prog(t) {
        const projectsHtml = t.projects.map(p => {
            const detailItems = p.details.map(d =>
                `<div class="list-item">▸ ${esc(d)}</div>`
            ).join('');
            const tags = p.tags.map(tag =>
                `<span class="tag">${esc(tag)}</span>`
            ).join('');

            return `
                <div class="project-item" tabindex="0" data-id="${p.id}">
                    <div class="project-header">
                        <span class="project-marker ${p.markerClass}">${p.marker}</span>
                        <span class="project-status ${p.statusClass}">[${esc(p.status)}]</span>
                        <span class="project-name">${esc(p.name)}</span>
                        <span class="project-toggle">▸</span>
                    </div>
                    <div class="project-summary">
                        ${esc(p.summary)}<br>
                        <span class="text-dim fs-sm">${esc(p.date)} | ${esc(p.role)}</span>
                    </div>
                    <div class="project-detail">
                        <div class="detail-content">
                            <p>${esc(p.desc)}</p>
                            <div class="detail-list">${detailItems}</div>
                            <div class="tag-row">${tags}</div>
                        </div>
                    </div>
                </div>`;
        }).join('');

        return `
            <h1 class="page-title">${t.title}</h1>
            <div class="title-separator"></div>
            <div class="text-dim fs-sm mb-8">${t.expandHint}</div>
            ${projectsHtml}
        `;
    },

    // ── DATA Page ─────────────────────────────
    data(t) {
        const activitiesHtml = t.activities.map(a =>
            `<div class="cdu-list-item">${esc(a)}</div>`
        ).join('');

        const jobsHtml = t.jobs.map(j => {
            const tasksHtml = j.tasks.map(task =>
                `<div class="cdu-list-item">${esc(task)}</div>`
            ).join('');
            const dotClass = j.current ? '' : 'past';
            return `
                <div class="timeline-item">
                    <div class="tl-dot ${dotClass}"></div>
                    <div class="timeline-org">${esc(j.org)}</div>
                    <div class="timeline-role">${esc(j.role)}</div>
                    <div class="timeline-date">${esc(j.date)}</div>
                    <div class="timeline-desc">${tasksHtml}</div>
                </div>`;
        }).join('');

        return `
            <h1 class="page-title">${t.title}</h1>
            <div class="title-separator"></div>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionEdu}</h2>
                <div class="edu-box">
                    <div class="edu-name">${esc(t.eduName)}</div>
                    <div class="edu-major">${esc(t.eduMajor)}</div>
                    <div class="edu-date">${esc(t.eduDate)}</div>
                </div>
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionActivities}</h2>
                ${activitiesHtml}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionWork}</h2>
                ${jobsHtml}
            </section>
        `;
    },

    // ── RSRCH Page ────────────────────────────
    rsrch(t) {
        const contribHtml = t.contributions.map((c, i) =>
            `<div class="cdu-list-item">${i + 1}. ${esc(c)}</div>`
        ).join('');

        const scopeHtml = t.scopeItems.map(s =>
            `<div class="cdu-list-item">${esc(s)}</div>`
        ).join('');

        const countdown = getDeadlineCountdown();

        return `
            <h1 class="page-title">${t.title}</h1>
            <div class="title-separator"></div>

            <div class="paper-badge prep">${t.badgeText}</div>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionPaper}</h2>
                <p class="profile-text text-green fw-500">${esc(t.paperTitle)}</p>
                ${dataRow(t.target, t.targetVal, 'cyan')}
                ${dataRow(t.statusLabel, t.statusVal, 'amber')}
                ${dataRow(t.deadline, t.deadlineVal)}
                <div class="countdown-box mt-8">
                    <span class="cd-icon">⏱</span>
                    <span>${t.countdown}: <strong>${countdown}</strong></span>
                </div>
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionContrib}</h2>
                ${contribHtml}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionAbstract}</h2>
                <p class="profile-text">${esc(t.abstract)}</p>
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionScope}</h2>
                ${scopeHtml}
            </section>
        `;
    },

    // ── LINK Page ─────────────────────────────
    link(t) {
        const linksHtml = t.links.map(l => `
            <a class="link-item" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
                <span class="link-num">${esc(l.num)}</span>
                <span class="link-label">${esc(l.label)}</span>
                <span class="link-value">${esc(l.value)}</span>
                <span class="link-arrow">→</span>
            </a>
        `).join('');

        const interestsHtml = t.interests.map(item => {
            if (item.url) {
                return `
                    <a class="link-item" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">
                        <span class="link-num">${item.icon}</span>
                        <span class="link-label">${esc(item.text)}</span>
                        <span class="link-value">${esc(item.link)}</span>
                        <span class="link-arrow">→</span>
                    </a>`;
            }
            return `
                <div class="link-item" style="cursor:default;border-color:var(--green-dark)">
                    <span class="link-num">${item.icon}</span>
                    <span class="link-label">${esc(item.text)}</span>
                </div>`;
        }).join('');

        return `
            <h1 class="page-title">${t.title}</h1>
            <div class="title-separator"></div>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionContact}</h2>
                ${dataRow(t.email, t.emailVal, 'cyan')}
                ${dataRow(t.qq, t.qqVal)}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionExternal}</h2>
                ${linksHtml}
            </section>

            <section class="cdu-section">
                <h2 class="section-header">${t.sectionInterests}</h2>
                ${interestsHtml}
            </section>
        `;
    },
};

// ── Helper: Data Row ──────────────────────────
function dataRow(label, value, valueClass = '') {
    return `
        <div class="data-row">
            <span class="data-label">${esc(label)}</span>
            <span class="data-dots"></span>
            <span class="data-value ${valueClass}">${esc(value)}</span>
        </div>`;
}

// ── Helper: HTML Escape ───────────────────────
function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── Helper: Deadline Countdown ────────────────
function getDeadlineCountdown() {
    const deadline = new Date('2026-05-11T23:59:59Z');
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) return 'DEADLINE PASSED';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}D ${hours}H`;
}

// ── Helper: Alert Banner ──────────────────────
function renderAlert(lang) {
    const t = I18N[lang].alert;
    const deadline = new Date('2026-05-11T23:59:59Z');
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) return '';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `
        <div class="alert-banner">
            <span class="alert-icon">⚠</span>
            <span>${t.paperDeadline}: ${days} ${t.daysRemaining}</span>
            <a class="alert-action" data-goto="rsrch">${t.viewResearch}</a>
        </div>`;
}

// ── Neofetch Renderer ─────────────────────────
function renderNeofetch() {
    return `<pre class="neofetch">
<span class="nf-logo">  ╔═══╗</span>
<span class="nf-logo">  ║CDU║</span>   <span class="nf-label">ZHANG YUHENG</span> <span class="nf-sep">@</span> <span class="nf-value">CDU v2.0</span>
<span class="nf-logo">  ╚═══╝</span>   <span class="nf-sep">────────────────────────</span>
           <span class="nf-label">Host:</span>    <span class="nf-value">GitHub Pages</span>
           <span class="nf-label">Engine:</span>  <span class="nf-value">Static HTML / CSS / JS</span>
           <span class="nf-label">Lang:</span>    <span class="nf-value">Python | C++ | CUDA | Java</span>
           <span class="nf-label">Role:</span>    <span class="nf-value">Data & Algorithm Engineer</span>
           <span class="nf-label">Loc:</span>     <span class="nf-value">Chengdu, CN</span>
           <span class="nf-label">Uptime:</span>  <span class="nf-value">3+ Years Experience</span>
           <span class="nf-label">Theme:</span>   <span class="nf-value">OLED Dark</span>
</pre>`;
}
