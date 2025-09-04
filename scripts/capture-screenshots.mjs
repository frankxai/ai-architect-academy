import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, 'docs');
const outDir = path.join(root, 'assets', 'screenshots');

const mime = (p) => {
  const ext = path.extname(p).toLowerCase();
  return (
    {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.json': 'application/json; charset=utf-8',
      '.txt': 'text/plain; charset=utf-8',
    }[ext] || 'application/octet-stream'
  );
};

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function staticServer(dir) {
  return http.createServer(async (req, res) => {
    try {
      let reqPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      const filePath = path.join(dir, reqPath.replace(/^\/+/, ''));
      const resolved = path.resolve(filePath);
      if (!resolved.startsWith(dir)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const data = await fs.readFile(resolved);
      res.writeHead(200, { 'content-type': mime(resolved) });
      res.end(data);
    } catch (e) {
      res.writeHead(404); res.end('Not Found');
    }
  });
}

async function screenshot(url, outPath, opts = {}) {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: opts.width || 1360, height: opts.height || 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Try to wait for a stable hero/header
    try { await page.waitForSelector('header, h1', { timeout: 5000 }); } catch {}
    await page.screenshot({ path: outPath, fullPage: false });
  } finally {
    await browser.close();
  }
}

async function main() {
  const server = staticServer(docsDir);
  await ensureDir(outDir);
  await new Promise((r) => server.listen(8787, r));
  const base = 'http://localhost:8787';
  console.log('Serving', docsDir, 'at', base);
  try {
    await screenshot(`${base}/index.html`, path.join(outDir, 'index.png'));
    await screenshot(`${base}/projects.html`, path.join(outDir, 'projects.png'));
    // Optional: more pages if needed
    // await screenshot(`${base}/collaborate.html`, path.join(outDir, 'collaborate.png'));
  } finally {
    server.close();
  }
  console.log('Screenshots saved to', outDir);
}

main().catch((err) => { console.error(err); process.exit(1); });

