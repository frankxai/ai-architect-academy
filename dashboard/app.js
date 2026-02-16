/**
 * AI Architect Academy — Progress Dashboard
 * Reads .academy/progress.json and renders learning metrics
 */

const PROGRESS_FILE = '../.academy/progress.json';
const REFRESH_INTERVAL = 5000;

// ─── Skill Domains for Radar Chart ──────────────────────────────
const SKILL_DOMAINS = [
    { name: 'RAG & Knowledge', key: 'rag', color: '#43bfe3' },
    { name: 'Agents & Orchestration', key: 'agents', color: '#ab47c7' },
    { name: 'MCP & Integration', key: 'mcp', color: '#10b981' },
    { name: 'Multi-Cloud', key: 'cloud', color: '#f59e0b' },
    { name: 'Enterprise & Security', key: 'security', color: '#ef4444' },
    { name: 'Evaluation & Production', key: 'eval', color: '#8b5cf6' },
];

let progress = null;

// ─── Load Progress ──────────────────────────────────────────────
async function loadProgress() {
    try {
        const response = await fetch(PROGRESS_FILE);
        if (response.ok) {
            progress = await response.json();
            render();
        }
    } catch (err) {
        console.log('Progress file not available:', err.message);
        renderEmptyState();
    }
}

// ─── Render ─────────────────────────────────────────────────────
function render() {
    if (!progress) return;
    renderStats();
    renderLabs();
    renderRadar();
    renderPaths();
    renderCertification();
    renderActivity();
    renderPlatform();
}

function renderEmptyState() {
    setText('labs-completed', '0');
    setText('avg-score', '—');
    setText('skills-activated', '0');
    setText('time-invested', '0h');
    setText('cert-level', '—');
}

function renderStats() {
    const labs = progress.labs || {};
    const completed = Object.values(labs).filter(l => l.status === 'completed').length;
    const scores = Object.values(labs).filter(l => l.score !== null).map(l => l.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    setText('labs-completed', String(completed));
    setText('avg-score', avgScore !== null ? avgScore + '/100' : '—');
    setText('skills-activated', String(progress.skills?.skills_activated || 0));
    setText('time-invested', formatTime(progress.student?.total_time_minutes || 0));
    setText('cert-level', progress.certification?.level || '—');
}

function renderLabs() {
    const labs = progress.labs || {};
    const labMap = {
        '01-rag-pipeline': '01',
        '02-multi-agent-system': '02',
        '03-mcp-server': '03'
    };

    for (const [labId, num] of Object.entries(labMap)) {
        const lab = labs[labId];
        if (!lab) continue;

        const statusEl = document.getElementById('lab-' + num + '-status');
        const progressEl = document.getElementById('lab-' + num + '-progress');
        const scoreEl = document.getElementById('lab-' + num + '-score');

        // Status dot
        const dot = statusEl.querySelector('.status-dot');
        dot.className = 'status-dot ' + lab.status.replace('_', '-');
        const statusText = statusEl.querySelector('span:last-child');
        statusText.textContent = formatStatus(lab.status);

        // Progress bar
        let progressPct = 0;
        if (lab.status === 'completed') progressPct = 100;
        else if (lab.status === 'in_progress') progressPct = Math.max(25, (lab.checkpoints?.length || 0) * 33);
        progressEl.style.width = progressPct + '%';

        // Score
        scoreEl.textContent = lab.score !== null ? lab.score + '/100' : '—';
        if (lab.score >= 85) scoreEl.style.color = '#10b981';
        else if (lab.score >= 70) scoreEl.style.color = '#43bfe3';
        else if (lab.score !== null) scoreEl.style.color = '#f59e0b';
    }
}

function renderRadar() {
    const canvas = document.getElementById('skill-radar');
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const maxR = Math.min(cx, cy) - 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const n = SKILL_DOMAINS.length;
    const angleStep = (Math.PI * 2) / n;

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
        const r = (maxR / 5) * ring;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const angle = angleStep * i - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.stroke();
    }

    // Labels
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    for (let i = 0; i < n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const lx = cx + (maxR + 24) * Math.cos(angle);
        const ly = cy + (maxR + 24) * Math.sin(angle);
        ctx.fillText(SKILL_DOMAINS[i].name, lx, ly + 4);
    }

    // Skill values (deterministic based on progress)
    const domains = progress?.skills?.domains_explored || [];
    const labsDone = Object.values(progress?.labs || {}).filter(l => l.status === 'completed').length;
    const values = SKILL_DOMAINS.map((d, idx) => {
        const base = 10 + (idx * 3); // Deterministic base per domain
        const domainBonus = domains.includes(d.key) ? 40 : 0;
        const labBonus = labsDone * 8;
        return Math.min(95, base + domainBonus + labBonus);
    });

    // Filled area
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = angleStep * idx - Math.PI / 2;
        const r = (maxR / 100) * values[idx];
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.fillStyle = 'rgba(67, 191, 227, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(67, 191, 227, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (let i = 0; i < n; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const r = (maxR / 100) * values[i];
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = SKILL_DOMAINS[i].color;
        ctx.fill();
    }

    // Legend (safe DOM construction)
    const legendEl = document.getElementById('radar-legend');
    legendEl.textContent = ''; // Clear safely
    SKILL_DOMAINS.forEach(d => {
        const item = document.createElement('span');
        item.className = 'radar-legend-item';

        const dot = document.createElement('span');
        dot.className = 'radar-legend-dot';
        dot.style.background = d.color;

        item.appendChild(dot);
        item.appendChild(document.createTextNode(' ' + d.name));
        legendEl.appendChild(item);
    });
}

function renderPaths() {
    const labs = progress.labs || {};

    const foundationPct = labs['01-rag-pipeline']?.status === 'completed' ? 40 :
                          labs['01-rag-pipeline']?.status === 'in_progress' ? 15 : 0;
    document.getElementById('path-foundation').style.width = foundationPct + '%';

    const agentPct = labs['02-multi-agent-system']?.status === 'completed' ? 35 :
                     labs['02-multi-agent-system']?.status === 'in_progress' ? 10 : 0;
    document.getElementById('path-agent').style.width = agentPct + '%';

    const cloudPct = Math.min(100, (progress.skills?.skills_activated || 0) * 5);
    document.getElementById('path-cloud').style.width = cloudPct + '%';

    document.getElementById('path-enterprise').style.width = '0%';

    const bootcampPct = Math.round((foundationPct + agentPct + cloudPct) / 3);
    document.getElementById('path-bootcamp').style.width = bootcampPct + '%';
}

function renderCertification() {
    const labs = progress.labs || {};
    const completed = Object.values(labs).filter(l => l.status === 'completed').length;
    const scores = Object.values(labs).filter(l => l.score !== null).map(l => l.score);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    if (completed >= 2 && avgScore >= 70) {
        const el = document.querySelector('#cert-associate .cert-icon');
        el.className = 'cert-icon unlocked associate';
    }
    if (completed >= 3) {
        const el = document.querySelector('#cert-professional .cert-icon');
        el.className = 'cert-icon unlocked professional';
    }
    if (completed >= 3 && avgScore >= 85) {
        const el = document.querySelector('#cert-expert .cert-icon');
        el.className = 'cert-icon unlocked expert';
    }
}

function renderActivity() {
    const listEl = document.getElementById('activity-list');
    const commands = progress?.skills?.commands_used || [];

    if (commands.length === 0) return;

    listEl.textContent = ''; // Clear safely
    commands.slice(-10).reverse().forEach(cmd => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        const time = document.createElement('span');
        time.className = 'activity-time';
        time.textContent = cmd.time || '';

        const text = document.createElement('span');
        text.className = 'activity-text';
        text.textContent = cmd.action || String(cmd);

        item.appendChild(time);
        item.appendChild(text);
        listEl.appendChild(item);
    });
}

function renderPlatform() {
    const platform = progress?.student?.platform || 'claude-code';
    const names = {
        'claude-code': 'Claude Code',
        'cline': 'Cline',
        'cursor': 'Cursor',
        'windsurf': 'Windsurf'
    };
    setText('platform-badge', names[platform] || platform);
}

// ─── Utilities ──────────────────────────────────────────────────

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function formatTime(minutes) {
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? hours + 'h ' + mins + 'm' : hours + 'h';
}

function formatStatus(status) {
    const map = {
        'not_started': 'Not Started',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'failed': 'Needs Work'
    };
    return map[status] || status;
}

// ─── Initialize ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    setInterval(loadProgress, REFRESH_INTERVAL);
});
