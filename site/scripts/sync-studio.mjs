// Projects the AI Architect multi-cloud catalog into the Studio.
// Generated, never edited: data/studio-catalog.json and public/studio/**.
// Usage: node scripts/sync-studio.mjs PATH_TO_AI_ARCHITECT
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { publishedName } from '../lib/studio/catalog.ts';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw new Error('Usage: node scripts/sync-studio.mjs PATH_TO_AI_ARCHITECT');
const source = path.resolve(process.argv[2]);
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Expected an immutable source revision');
if (execFileSync('git', ['status', '--porcelain'], { cwd: source, encoding: 'utf8' }).trim()) throw new Error('Source must be committed before projection');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'academy-studio-'));
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
try {
  const { compile } = await import(pathToFileURL(path.join(source, 'catalog/compile.mjs')).href);
  const { bundle } = compile(temp, { revision: sha, ref: 'main' });

  const publicDir = path.join(SITE, 'public/studio');
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(publicDir, 'icons'), { recursive: true });
  fs.cpSync(path.join(temp, 'exports'), path.join(publicDir, 'exports'), { recursive: true });
  for (const dir of fs.readdirSync(path.join(publicDir, 'exports'))) {
    for (const file of fs.readdirSync(path.join(publicDir, 'exports', dir))) {
      const name = publishedName(file);
      if (name !== file) fs.renameSync(path.join(publicDir, 'exports', dir, file), path.join(publicDir, 'exports', dir, name));
    }
  }

  // Official Google Cloud icons: copied only when the bytes match the engine registry.
  const registry = JSON.parse(fs.readFileSync(path.join(source, 'solution-kit/icons/registry.json'), 'utf8'));
  const icons = {};
  for (const [key, item] of Object.entries(registry)) {
    const bytes = fs.readFileSync(path.join(source, 'solution-kit', item.path));
    if (sha256(bytes) !== item.sha256) throw new Error(`icon ${key}: hash mismatch`);
    fs.writeFileSync(path.join(publicDir, 'icons', `${key}.svg`), bytes);
    icons[key] = { href: `/studio/icons/${key}.svg`, sha256: item.sha256, rights: item.rights, source_page: item.source_page };
  }

  const files = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.push({ path: path.relative(publicDir, full).split(path.sep).join('/'), sha256: sha256(fs.readFileSync(full)) });
    }
  };
  walk(publicDir);
  files.sort((a, b) => a.path.localeCompare(b.path));

  const data = {
    ...bundle,
    schema: 'academy-studio/v1',
    projection: {
      source_repository: 'https://github.com/frankxai/ai-architect',
      source_revision: sha,
      license: 'Apache-2.0 for catalog content and exports; provider names are trademarks of their owners; Google Cloud icons retain Google rights',
      icons,
      files,
      transform: 'catalog/compile.mjs at the source revision; exports and verified icons copied byte for byte; .mmd and .dsl published as .txt, .drawio as .xml',
    },
  };
  fs.writeFileSync(path.join(SITE, 'data/studio-catalog.json'), JSON.stringify(data) + '\n');
  console.log(`Projected ${data.counts.patterns} patterns x ${data.counts.providers} providers from ${sha}: ${files.length} public files.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
