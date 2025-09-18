// Theme persistence and toggler
(function(){
  try {
    const t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch {}
})();

function toggleTheme(){
  const e = document.documentElement;
  const d = e.classList.toggle('dark');
  try { localStorage.setItem('theme', d ? 'dark' : 'light'); } catch {}
}

// Primary navigation links
const NAV_LINKS = [
  { label: 'Home', path: 'index.html' },
  { label: 'Experience', path: 'experience.html' },
  { label: 'Start Here', path: 'start-here.html' },
  { label: 'Projects', path: 'projects.html' },
  { label: 'Patterns', path: 'patterns.html' },
  { label: 'Platforms', path: 'platforms.html' },
  { label: 'Resources', path: 'resources.html' },
  { label: 'Topics', path: 'topics/index.html' },
  { label: 'Collaborate', path: 'collaborate.html' },
];

const PATH_ALIASES = {
  'pattern.html': 'patterns.html',
  'concept.html': 'concepts.html',
  'topics/index.html': 'topics/index.html',
};

function computeNavContext(){
  const base = '/ai-architect-academy/';
  let rel = window.location.pathname || '';
  const idx = rel.indexOf(base);
  if (idx >= 0) rel = rel.slice(idx + base.length);
  rel = rel.replace(/^\//, '').split(/[?#]/)[0];
  if (!rel || rel === '') rel = 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const segments = rel.split('/');
  const depth = segments.length > 1 ? segments.length - 1 : 0;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  return { rel, prefix };
}

function isActiveLink(current, target){
  const normalisedCurrent = PATH_ALIASES[current] || current;
  if (normalisedCurrent === target) return true;
  if (target.endsWith('index.html')) {
    const base = target.slice(0, -'index.html'.length);
    if (base && normalisedCurrent.startsWith(base)) return true;
  }
  if (target === 'topics/index.html' && normalisedCurrent.startsWith('topics/')) return true;
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const nav = document.querySelector('[data-site-nav]');
    if (nav) {
      const { rel, prefix } = computeNavContext();
      nav.innerHTML = '';
      NAV_LINKS.forEach((link) => {
        const a = document.createElement('a');
        a.textContent = link.label;
        a.href = prefix + link.path;
        a.className = 'hover:text-cyan-600';
        if (isActiveLink(rel, link.path)) {
          a.setAttribute('aria-current', 'page');
          a.className += ' text-cyan-600 font-semibold';
        }
        nav.appendChild(a);
      });
    }

    const actions = document.querySelector('[data-site-actions]');
    if (actions) {
      const clone = actions.querySelector('[data-clone]');
      if (clone) {
        clone.href = 'https://github.com/frankxai/ai-architect-academy/archive/refs/heads/main.zip';
      }
      const github = actions.querySelector('[data-github]');
      if (github) {
        github.href = 'https://github.com/frankxai/ai-architect-academy';
      }
      const search = actions.querySelector('[data-search]');
      if (search) {
        search.addEventListener('click', () => {
          document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
        });
      }
    }
  } catch (err) {
    console.warn('Navigation bootstrap failed', err);
  }
});

// Accessibility: add skip link and ensure a #main target exists
document.addEventListener('DOMContentLoaded', () => {
  try {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    const skip = document.createElement('a');
    skip.href = '#main';
    skip.textContent = 'Skip to content';
    skip.className = 'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded px-3 py-2';
    document.body.prepend(skip);
  } catch {}
});

// Add ids to h2/h3 for deep linking on static pages
document.addEventListener('DOMContentLoaded', () => {
  try {
    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
    document.querySelectorAll('main h2, main h3').forEach(h => {
      if (!h.id) h.id = slugify(h.textContent||'');
    });
  } catch {}
});

// DX: inject an "Edit" link to edit this page on GitHub
document.addEventListener('DOMContentLoaded', () => {
  try {
    const header = document.querySelector('header .max-w-6xl');
    if (!header) return;
    const edit = document.createElement('a');
    edit.textContent = 'Edit';
    edit.className = 'px-2 py-1 border rounded text-xs mr-2';
    // Compute repo edit URL for current docs page
    const repo = 'https://github.com/frankxai/ai-architect-academy/edit/main/';
    const path = window.location.pathname;
    // Try to find the docs path segment
    const idx = path.indexOf('/ai-architect-academy/');
    let rel = path;
    if (idx >= 0) rel = path.slice(idx + '/ai-architect-academy/'.length);
    if (rel.startsWith('/')) rel = rel.slice(1);
    if (!rel) rel = 'index.html';
    // If already under docs in local, ensure prefix
    if (!rel.startsWith('docs/')) rel = 'docs/' + rel;
    edit.href = repo + rel;
    edit.target = '_blank'; edit.rel = 'noopener';
    const themeBtn = Array.from(header.querySelectorAll('button')).find(b => b.textContent.trim().toLowerCase() === 'theme');
    if (themeBtn && themeBtn.parentElement === header) {
      header.insertBefore(edit, themeBtn);
    } else {
      header.appendChild(edit);
    }
  } catch {}
});

