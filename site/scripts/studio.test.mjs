import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { publishedName } from '../lib/studio/catalog.ts';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(SITE, p));
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const data = JSON.parse(read('data/studio-catalog.json'));
const ENGINE = 'https://github.com/frankxai/ai-architect';

test('the projection names one immutable engine revision and its license', () => {
  assert.equal(data.schema, 'academy-studio/v1');
  assert.match(data.projection.source_revision, /^[a-f0-9]{40}$/);
  assert.equal(data.source_revision, data.projection.source_revision);
  assert.equal(data.projection.source_repository, ENGINE);
  assert.match(data.projection.license, /Apache-2\.0/);
  assert.match(data.projection.license, /Google/);
});

test('every public Studio file is listed with its hash, and nothing else is on disk', () => {
  const root = path.join(SITE, 'public/studio');
  const onDisk = [];
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else onDisk.push(path.relative(root, full).split(path.sep).join('/'));
    }
  };
  walk(root);
  assert.deepEqual(onDisk.sort(), data.projection.files.map(f => f.path).sort());
  for (const f of data.projection.files) assert.equal(sha256(read(`public/studio/${f.path}`)), f.sha256, f.path);
});

test('official icons match their recorded bytes and appear only on Google Cloud bindings', () => {
  for (const [key, icon] of Object.entries(data.projection.icons)) {
    assert.equal(icon.href, `/studio/icons/${key}.svg`);
    assert.equal(sha256(read(`public${icon.href}`)), icon.sha256, key);
    assert.match(icon.rights, /trademark/i);
  }
  for (const p of data.patterns) for (const r of Object.values(p.realizations)) for (const b of Object.values(r.bindings)) {
    if (!b?.icon) continue;
    assert.equal(r.provider, 'gcp', `${p.id}/${r.provider}/${b.id}`);
    assert.ok(data.projection.icons[b.icon], `${b.icon} is not a verified icon`);
  }
});

test('every export the workbench links to exists for every pattern and provider', () => {
  for (const p of data.patterns) {
    for (const file of ['workspace.dsl', 'journey.sequence.mmd']) assert.ok(fs.existsSync(path.join(SITE, 'public/studio/exports', p.id, publishedName(file))), `${p.id}/${file}`);
    for (const pr of data.providers) for (const ext of ['svg', 'drawio', 'reactflow.json', 'mmd']) {
      assert.ok(fs.existsSync(path.join(SITE, 'public/studio/exports', p.id, publishedName(`${pr.id}.${ext}`))), `${p.id}/${pr.id}.${ext}`);
    }
  }
});

test('counts are derived from the projected records, never typed', () => {
  assert.equal(data.counts.patterns, data.patterns.length);
  assert.equal(data.counts.providers, data.providers.length);
  assert.equal(data.counts.templates, data.templates.length);
  assert.equal(data.counts.sources, data.sources.length);
  assert.equal(data.counts.realizations, data.patterns.length * data.providers.length);
  for (const p of data.patterns) assert.deepEqual(Object.keys(p.realizations).sort(), data.providers.map(x => x.id).sort(), p.id);
  const pages = ['app/studio/page.tsx', 'app/studio/[pattern]/page.tsx', 'app/studio/partners/page.tsx', 'app/studio/inventions/page.tsx'].map(f => read(f).toString());
  for (const src of pages) {
    for (const n of [data.counts.patterns, data.counts.providers, data.counts.services, data.counts.sources, data.counts.realizations, data.counts.partners, data.counts.field_inventions, data.counts.contributions]) {
      assert.ok(!new RegExp(`>[^<{]*\\b${n}\\b[^<{]*<`).test(src), `literal ${n} in page text`);
    }
  }
});

test('deploy buttons and source links point at the engine, at a path that is projected', () => {
  for (const t of data.templates) {
    assert.ok(t.source_url.startsWith(`${ENGINE}/tree/${data.deploy_ref}/${t.path}`), t.id);
    assert.ok(t.deploy_url.includes(encodeURIComponent(ENGINE)) || t.deploy_url.includes(ENGINE), t.id);
    assert.ok(t.not_verified.length > 0, `${t.id} must say what is not verified`);
    assert.ok(data.providers.some(p => p.id === t.provider), t.id);
  }
});

test('the Studio states its maturity and carries no screen percentages or fabricated receipts', () => {
  assert.match(data.state, /no provider deployment receipts/);
  for (const p of data.patterns) for (const s of p.screens) assert.ok(!JSON.stringify(s.blocks).includes('%'), `${p.id}/${s.id}`);
});

test('every public file is a format the repository media policy classifies', () => {
  const allowed = new Set(['.svg', '.json', '.txt', '.xml']);
  for (const f of data.projection.files) assert.ok(allowed.has(path.extname(f.path)), f.path);
});

test('the partner register claims no relationship it cannot reference, and covers every provider', () => {
  const reg = data.partners;
  assert.equal(reg.schema, 'ai-architect-partners/v1');
  assert.equal(data.counts.partners, reg.partners.length);
  for (const p of data.providers) assert.equal(reg.partners.filter(e => e.provider === p.id).length, 1, p.id);
  const sources = new Set(data.sources.map(s => s.id));
  for (const e of reg.partners) {
    assert.ok(reg.statuses.includes(e.relationship.status), e.id);
    if (e.relationship.status === 'none') assert.equal(e.relationship.reference, null, e.id);
    else assert.ok(e.relationship.reference, `${e.id} needs a reference`);
    assert.ok(e.sources.length && e.sources.every(id => sources.has(id)), `${e.id} sources`);
    if (e.program) assert.ok(e.sources.includes(e.program.source), `${e.id} program source`);
    assert.doesNotMatch(`${e.contributes} ${e.fit} ${e.next_step}`, /\b(certified|endorsed by|official partner|partnered with)\b/i, e.id);
    if (e.footprint) assert.equal(e.footprint.realizations, data.patterns.length, e.id);
  }
});

test('the invention register cites primary records and names files the engine holds', () => {
  const reg = data.inventions;
  assert.equal(reg.schema, 'ai-architect-inventions/v1');
  assert.equal(data.counts.field_inventions, reg.field.length);
  assert.equal(data.counts.contributions, reg.ours.length);
  const roles = new Set(data.roles.map(r => r.id));
  const patterns = new Set(data.patterns.map(p => p.id));
  const dates = reg.field.map(f => f.date);
  assert.deepEqual(dates, [...dates].sort(), 'timeline is in date order');
  for (const f of reg.field) {
    assert.match(f.record.url, /^https:\/\//, f.id);
    if (f.arxiv) assert.equal(f.record.url, `https://arxiv.org/abs/${f.arxiv.id}`, f.id);
    assert.ok(f.roles.every(r => roles.has(r)), f.id);
    assert.ok(f.patterns.every(p => patterns.has(p)), f.id);
  }
  for (const c of reg.ours) {
    assert.ok(['implemented', 'partial', 'proposed'].includes(c.status), c.id);
    assert.equal(c.status === 'proposed', c.implemented_in.length === 0, c.id);
    assert.doesNotMatch(`${c.mechanism} ${c.evidence}`, /\b(novel|patent(ed)?|first[- ]ever|breakthrough)\b/i, c.id);
  }
});

test('register routes cannot be shadowed by a pattern id', () => {
  for (const route of ['partners', 'inventions']) {
    assert.ok(fs.existsSync(path.join(SITE, 'app/studio', route, 'page.tsx')), route);
    assert.ok(!data.patterns.some(p => p.id === route), `pattern id ${route} collides with a Studio route`);
  }
});
