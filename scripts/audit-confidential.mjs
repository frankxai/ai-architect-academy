#!/usr/bin/env node
// Confidential-material audit gate.
// Scans the working tree (excluding node_modules/.git) for named-customer /
// confidential markers. Fails the build on a hard match; reports (without
// failing) generic Oracle/OCI mentions so they can be triaged separately.

import { readdir, readFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SKIP_DIR_NAMES = new Set(['node_modules', '.git']);
const MAX_CONTENT_SCAN_BYTES = 5 * 1024 * 1024; // 5 MiB
// This file itself spells out the confidential-material pattern, which
// otherwise trips the very check it defines.
const SELF_PATH = 'scripts/audit-confidential.mjs';

// Named-customer / confidential material. Any hit here is a hard fail.
const CONFIDENTIAL_PATTERN = /canon europe|morrisons|nhs sccl|pearson ada|vodafone/i;
const SOURCE_DOCUMENTS_PATH = /source-documents/i;

// Vendor-mention markers. Report-only — these are not confidential by
// themselves, just worth knowing about.
const ORACLE_PATTERN = /\boracle\b/i;
const OCI_PATTERN = /\bOCI\b/;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      yield fullPath;
    }
  }
}

function isLikelyBinary(buffer) {
  const sampleLength = Math.min(buffer.length, 8000);
  for (let i = 0; i < sampleLength; i += 1) {
    if (buffer[i] === 0) return true;
  }
  return false;
}

async function main() {
  const failures = [];
  let oracleFileCount = 0;
  let ociFileCount = 0;
  let scannedFiles = 0;

  for await (const absPath of walk(repoRoot)) {
    const relPath = path.relative(repoRoot, absPath).split(path.sep).join('/');

    if (SOURCE_DOCUMENTS_PATH.test(relPath)) {
      failures.push(`${relPath}:0: path contains "source-documents"`);
    }

    let stat;
    try {
      stat = await lstat(absPath);
    } catch {
      continue;
    }
    if (!stat.isFile() || stat.size === 0 || stat.size > MAX_CONTENT_SCAN_BYTES) continue;

    let buffer;
    try {
      buffer = await readFile(absPath);
    } catch {
      continue;
    }
    if (isLikelyBinary(buffer)) continue;

    scannedFiles += 1;
    const text = buffer.toString('utf8');

    const lines = text.split(/\r?\n/);
    let hasOracle = false;
    let hasOci = false;
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (relPath !== SELF_PATH && CONFIDENTIAL_PATTERN.test(line)) {
        failures.push(`${relPath}:${i + 1}: matches confidential-material pattern`);
      }
      if (!hasOracle && ORACLE_PATTERN.test(line)) hasOracle = true;
      if (!hasOci && OCI_PATTERN.test(line)) hasOci = true;
    }
    if (hasOracle) oracleFileCount += 1;
    if (hasOci) ociFileCount += 1;
  }

  console.log(`Confidential audit: scanned ${scannedFiles} text files.`);
  console.log(`Report (non-failing): ${oracleFileCount} file(s) match /\\boracle\\b/i.`);
  console.log(`Report (non-failing): ${ociFileCount} file(s) match /\\bOCI\\b/.`);

  if (failures.length > 0) {
    console.error(`\nConfidential audit FAILED — ${failures.length} issue(s):`);
    for (const failure of failures) {
      console.error(`  ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('\nConfidential audit passed — no confidential-material markers found.');
}

main().catch((error) => {
  console.error('Confidential audit crashed:', error);
  process.exitCode = 1;
});
