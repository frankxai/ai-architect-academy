import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const SITE=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,SITE));
const data=JSON.parse(read('data/solution-library.json'));
const manifest=JSON.parse(read('public/solution-kit/manifest.json'));
const spec=JSON.parse(read('public/solution-kit/solution.json'));
test('library binds one immutable upstream source with separate code and icon rights',()=>{
 assert.match(data.sourceRevision,/^[a-f0-9]{40}$/);assert.equal(manifest.source_revision,data.sourceRevision);
 assert.equal(spec.source_revision,data.sourceRevision);
 assert.ok(read('public/solution-kit/index.html').toString().includes('"source_revision":"'+data.sourceRevision+'"'));
 assert.ok(read('public/solution-kit/index.html').toString().includes('Source, license and icon rights'));
 assert.ok(read('public/solution-kit/index.html').toString().includes('Apache License'));
 assert.equal(manifest.source_license,'Apache-2.0');assert.match(data.license,/Google/);
 assert.ok(read('public/solution-kit/LICENSE.txt').toString().includes('Apache License'));
 for(const item of [...data.book,...data.references]){
  const u=new URL(item.href);assert.equal(u.hostname,'github.com');assert.ok(u.pathname.startsWith('/frankxai/ai-architect/blob/'+data.sourceRevision+'/'));
 }
 assert.ok(data.book.every(c=>Number.isInteger(c.words)&&c.words>0));
 for(const file of ['practice.html','guide.html','guide.md'])assert.ok(read('public/solution-kit/'+file).toString().includes(data.sourceRevision),file);
 assert.ok(!/\]\(\.\.\//.test(read('public/solution-kit/guide.md').toString()));
 const practice=JSON.parse(read('public/solution-kit/practice.json'));
 assert.equal(data.qualityGateCount,practice.gates.length);assert.equal(data.metricCount,practice.metrics.length);
 assert.ok(practice.metrics.every(m=>m.observed===null));
});
test('all portable files match the evidence manifest and retain synthetic workload limits',()=>{
 assert.equal(spec.fixture,true);assert.equal(spec.visibility,'public');assert.equal(manifest.provider_deployment,null);assert.equal(manifest.model_run,null);
 for(const file of manifest.files)assert.equal(crypto.createHash('sha256').update(read('public/solution-kit/'+file.path)).digest('hex'),file.sha256,file.path);
 assert.deepEqual(data.profiles.map(p=>[p.id,p.maturity]),spec.profiles.map(p=>[p.id,p.maturity]));
 assert.ok(spec.profiles.every(p=>p.maturity==='visualized'&&p.receipts.length===0));
 assert.equal(JSON.parse(read('public/solution-kit/icon-registry.json')).cloud_run.generation,'official-legacy-console');
});
