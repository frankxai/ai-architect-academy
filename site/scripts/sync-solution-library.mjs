import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const SITE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.resolve(process.argv[2]??'');
if(!process.argv[2]) throw new Error('Usage: node sync-solution-library.mjs PATH_TO_AI_ARCHITECT');
const sha=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
if(!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected immutable source revision');
if(execFileSync('git',['status','--porcelain'],{cwd:source,encoding:'utf8'}).trim()) throw new Error('Source must be committed before projection');
const kit=path.join(source,'solution-kit');
const spec=JSON.parse(fs.readFileSync(path.join(kit,'example.json'),'utf8'));
if(spec.fixture!==true||spec.visibility!=='public') throw new Error('Public synthetic fixture required');
const out=path.join(SITE,'public/solution-kit');
// The directory holds only this projection (every file is in its manifest), and the
// compiler refuses a directory holding the renamed sidecars of a previous run.
fs.rmSync(out,{recursive:true,force:true});
// Bind provenance in the specification before rendering so the single HTML export carries it.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'academy-solution-'));
try {
 const bound=path.join(temp,'solution.json');
 fs.writeFileSync(bound,JSON.stringify({...spec,source_revision:sha},null,2)+'\n');
 const {compile}=await import(pathToFileURL(path.join(kit,'compile.mjs')).href);
 compile(bound,out);
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
const PUBLISHED_MAP = {
  'Dockerfile': 'Dockerfile.txt',
  'LICENSE': 'LICENSE.txt',
  'nginx.conf': 'nginx.conf.txt',
};
const PUBLISHED_SUFFIX = { '.drawio': '.xml', '.mmd': '.txt' };
function publishedName(name) {
  if (PUBLISHED_MAP[name]) return PUBLISHED_MAP[name];
  for (const [ext, suff] of Object.entries(PUBLISHED_SUFFIX)) {
    if (name.endsWith(ext)) return name + suff;
  }
  return name;
}
for (const file of fs.readdirSync(out)) {
  const pName = publishedName(file);
  if (pName !== file) fs.renameSync(path.join(out, file), path.join(out, pName));
}

// Generated export keeps its independent Apache source and Google trademark boundaries.
const manifestPath=path.join(out,'manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.source_revision=sha; manifest.source_repository='https://github.com/frankxai/ai-architect';manifest.source_license='Apache-2.0';
manifest.upstream_fixture_sha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(kit,'example.json'))).digest('hex');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const htmlPath=path.join(out,'index.html');
const notice=`<details style="margin:20px 5%"><summary>Source, license and icon rights</summary><p>AI Architect / Frank Riemer. Source revision <a href="https://github.com/frankxai/ai-architect/tree/${sha}">${sha}</a>. Code: Apache-2.0. Google icons retain separate product and trademark rights; no partnership is implied.</p><pre>${escape(fs.readFileSync(path.join(out,'LICENSE.txt'),'utf8'))}</pre></details>`;
fs.writeFileSync(htmlPath,fs.readFileSync(htmlPath,'utf8').replace('https://github.com/frankxai/ai-architect/tree/main/guide',`https://github.com/frankxai/ai-architect/tree/${sha}/guide`).replace('</body>',notice+'</body>'));
manifest.projection_transform='bind specification source revision; append standalone license and attribution; pin book link; publish sidecars with classified extensions';
manifest.files = fs.readdirSync(out).filter(n => n !== 'manifest.json').sort().map(n => ({
  path: n,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(out, n))).digest('hex')
}));
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const href=p=>'https://github.com/frankxai/ai-architect/blob/'+sha+'/'+p;
const book=fs.readdirSync(path.join(source,'guide/manuscript')).filter(n=>n.endsWith('.md')).sort().map(n=>{
 const body=fs.readFileSync(path.join(source,'guide/manuscript',n),'utf8');
 return {title:body.split('\n')[0].replace(/^# /,''),href:href('guide/manuscript/'+n),words:body.replace(/```[\s\S]*?```/g,' ').replace(/`[^`]+`/g,' ').replace(/https?:\/\/\S+/g,' ').match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu)?.length??0};
});
const references=[['Delivery method','solution-kit/method.md'],['Encyclopedia','solution-kit/encyclopedia.md'],['Ecosystem and invention register','solution-kit/ecosystem.md'],['Source register','solution-kit/sources.json'],['Visual recipes','solution-kit/visual-recipes.md'],['Living design','solution-kit/living-design.md'],['Quality contract','solution-kit/practice.json'],['Design tokens','solution-kit/design.tokens.json'],['Execution sequence','solution-kit/execution-plan.md'],['Authorship and review','guide/editorial/ai-contribution.md']].map(([title,p])=>({title,href:href(p)}));
const practice=JSON.parse(fs.readFileSync(path.join(out,'practice.json'),'utf8'));
const data={schema:'academy-solution-library/v1',fixture:true,sourceRepository:'https://github.com/frankxai/ai-architect',sourceRevision:sha,license:'Apache-2.0; Google icons retain separate trademark rights',bookState:'working edition; author and specialist reviews pending',runtimeState:'portable demonstration; depicted workloads visualized',qualityGateCount:practice.gates.length,metricCount:practice.metrics.length,profiles:spec.profiles.map(p=>({id:p.id,provider:p.provider,title:p.title,maturity:p.maturity})),book,references};
fs.writeFileSync(path.join(SITE,'data/solution-library.json'),JSON.stringify(data,null,2)+'\n');
console.log(`Projected ${book.length} manuscript files from ${sha}; no capability or commercial grant.`);
