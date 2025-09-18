(function(){
  const overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.className = 'fixed inset-0 hidden items-start justify-center bg-black/30 p-4 z-50';
  overlay.innerHTML = `
    <div class="w-full max-w-2xl rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-700 shadow-lg">
      <div class="flex items-center gap-2 p-3 border-b dark:border-slate-700">
        <input id="search-input" type="text" placeholder="Search pages, topics, micro-modules..." autofocus
               class="w-full p-2 outline-none bg-transparent"/>
        <button id="search-close" class="text-slate-500 hover:text-slate-700 px-2">Esc</button>
      </div>
      <div id="search-results" class="max-h-96 overflow-auto divide-y dark:divide-slate-800"></div>
    </div>`;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay));

  let pages = [];
  let sections = [];
  let microModules = [];
  const base = location.pathname.includes('/topics/') ? '../' : './';
  fetch(base + 'data/search.json').then(r=>r.json()).then(j=>{ pages=j; }).catch(()=>{});
  fetch(base + 'data/sections.json').then(r=>r.json()).then(j=>{ sections=j; }).catch(()=>{});
  fetch(base + 'data/micro-learning.json')
    .then(r => r.json())
    .then(json => {
      microModules = (json.modules || []).map(mod => ({
        title: mod.title,
        description: `${mod.category} · ${mod.summary}`,
        url: (base === './' ? './' : base) + `micro-learning.html#${mod.id}`,
        type: 'Micro Module'
      }));
    }).catch(()=>{});

  function open(){ overlay.classList.remove('hidden'); const i=document.getElementById('search-input'); i.value=''; render(''); i.focus(); }
  function close(){ overlay.classList.add('hidden'); }
  function render(q){
    const results = document.getElementById('search-results');
    const term = (q||'').toLowerCase();
    const items = [...pages, ...sections, ...microModules].filter(it => {
      const hay = (it.title+' '+it.description+' '+(it.tags||[]).join(' ')).toLowerCase();
      return !term || hay.includes(term);
    }).slice(0, 40);
    results.innerHTML = items.map(it => {
      const badge = it.type ? `<span class="ml-2 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">${it.type}</span>` : '';
      return `
      <a href="${it.url}" class="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800">
        <div class="font-medium flex items-center">${it.title}${badge}</div>
        <div class="text-sm text-slate-500">${it.description || ''}</div>
      </a>`;
    }).join('') || '<div class="p-3 text-sm text-slate-500">No results</div>';
  }

  document.addEventListener('keydown', (e)=>{
    if(e.key === '/' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); open(); }
    if(e.key === 'Escape'){ close(); }
  });
  document.addEventListener('click', (e)=>{
    if(e.target.id==='search-close'){ close(); }
    if(e.target.id==='search-overlay'){ close(); }
  });
  document.addEventListener('input', (e)=>{
    if(e.target && e.target.id==='search-input'){ render(e.target.value); }
  });
})();
