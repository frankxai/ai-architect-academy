import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const docsDataDir = path.join(repoRoot, 'docs', 'data');
const outFile = path.join(docsDataDir, 'search-index.json');

const includeDirs = [
  '00-roadmap',
  '01-design-patterns',
  '02-learning-paths',
  '03-awesome',
  '04-templates',
  '05-projects',
  '06-toolchains',
  '07-evaluation',
  '08-governance',
  '09-articles',
  '10-resources',
  '11-hyperscalers',
  '12-concepts',
  '13-platforms',
  '14-ai-tools',
  '15-workflows',
  '16-collaboration',
];

const singleFiles = ['README.md', 'START-HERE.md'];

function titleCase(str) {
  return str
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ');
}

function humanizeSection(dirName) {
  const cleaned = dirName.replace(/^\d+[-_]?/, '').replace(/[-_]/g, ' ');
  return titleCase(cleaned);
}

async function* walkMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['.git', 'node_modules', 'docs', 'assets', '.github'].includes(entry.name)) continue;
      yield* walkMarkdownFiles(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      yield fullPath;
    }
  }
}

function extractTitle(markdownText, fallback) {
  const match = markdownText.match(/^#\s+(.+?)\s*$/m);
  if (match) return match[1].trim();
  return fallback;
}

function extractHeadings(markdownText) {
  const headings = [];
  const regex = /^(#{1,3})\s+(.+?)\s*$/gm;
  let m;
  while ((m = regex.exec(markdownText)) !== null) {
    headings.push({ level: m[1].length, text: m[2].trim() });
  }
  return headings;
}

function stripCodeFences(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toGithubHref(relativePath) {
  return 'https://github.com/frankxai/ai-architect-academy/blob/main/' + relativePath.replace(/\\/g, '/');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function collectFiles() {
  const files = [];
  for (const dirName of includeDirs) {
    const abs = path.join(repoRoot, dirName);
    try {
      const stat = await fs.stat(abs);
      if (!stat.isDirectory()) continue;
      for await (const md of walkMarkdownFiles(abs)) {
        files.push(md);
      }
    } catch {
      // ignore missing dirs
    }
  }
  for (const fileName of singleFiles) {
    const abs = path.join(repoRoot, fileName);
    try {
      const stat = await fs.stat(abs);
      if (stat.isFile()) files.push(abs);
    } catch {}
  }
  return Array.from(new Set(files)).sort();
}

async function buildIndex() {
  const files = await collectFiles();
  const records = [];
  for (const absPath of files) {
    const rel = path.relative(repoRoot, absPath);
    const section = humanizeSection(rel.split(path.sep)[0] || 'Root');
    const fileName = path.basename(absPath, '.md');
    const baseTitle = fileName.replace(/[-_]/g, ' ');
    try {
      const raw = await fs.readFile(absPath, 'utf8');
      const title = extractTitle(raw, titleCase(baseTitle));
      const headings = extractHeadings(raw);
      const content = stripCodeFences(raw).slice(0, 2000);
      records.push({
        id: rel,
        title,
        href: toGithubHref(rel),
        section,
        path: rel,
        headings,
        excerpt: content.slice(0, 320),
        content,
      });
    } catch (err) {
      console.warn('Failed to index', rel, err?.message);
    }
  }
  await ensureDir(docsDataDir);
  await fs.writeFile(outFile, JSON.stringify(records, null, 2), 'utf8');
  console.log(`Indexed ${records.length} markdown files -> ${path.relative(repoRoot, outFile)}`);
}

buildIndex().catch((err) => {
  console.error(err);
  process.exit(1);
});

