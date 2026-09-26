'use strict';

// Planner-owned acceptance check for chain sweep2-academy-0926 (named *.acceptance.js so no
// normal test glob picks it up). Written before dispatch; the chain's check refuses any worker
// commit that edits this file.
//
// Defect: "Render Diagrams" has never passed. Run 32533412691 (main, 2026-08-21): job "Render
// Python Diagrams", step "Commit rendered diagrams" -> "remote: Permission to
// frankxai/ai-architect-academy.git denied to github-actions[bot]" (403). The repo's default
// GITHUB_TOKEN permission is read and the workflow grants none. The two jobs also each push
// from the same trigger commit, so whenever both render something the second push is refused.
//
// Built-ins only: the verifier runs this in a clean checkout with no node_modules.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const WORKFLOW = path.join(__dirname, '..', 'workflows', 'render-diagrams.yml');

function stripComment(line) {
    let quote = null;
    for (let k = 0; k < line.length; k++) {
        const c = line[k];
        if (quote) { if (c === quote) quote = null; continue; }
        if (c === '"' || c === "'") { quote = c; continue; }
        if (c === '#' && (k === 0 || /\s/.test(line[k - 1]))) return line.slice(0, k);
    }
    return line;
}

function unquote(s) {
    s = s.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
    return s;
}

function splitFlow(inner) {
    const out = [];
    let cur = '';
    let quote = null;
    for (const c of inner) {
        if (quote) { cur += c; if (c === quote) quote = null; continue; }
        if (c === '"' || c === "'") { quote = c; cur += c; continue; }
        if (c === ',') { out.push(cur); cur = ''; continue; }
        cur += c;
    }
    if (cur.trim()) out.push(cur);
    return out.map(unquote);
}

function scalar(s) {
    s = s.trim();
    if (s.startsWith('[') && s.endsWith(']')) return splitFlow(s.slice(1, -1));
    if (s === '{}') return {};
    if (s === 'true') return true;
    if (s === 'false') return false;
    return unquote(s);
}

const KEY_RE = /^("[^"]*"|'[^']*'|[^\s:'"][^:]*?):(?:\s+(.*))?$/;

// A reader for the block-style YAML subset GitHub workflows use: mappings, sequences,
// flow sequences, quoted scalars and | / > block scalars. It throws on anything it cannot place.
function parseYaml(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n').map((raw) => ({ raw }));
    const indentOf = (l) => l.raw.match(/^ */)[0].length;
    const content = (l) => stripComment(l.raw).trim();
    let i = 0;
    const skip = () => { while (i < lines.length && content(lines[i]) === '') i++; };
    const isItem = (t) => t === '-' || t.startsWith('- ');

    function parseBlock() {
        skip();
        if (i >= lines.length) return null;
        return isItem(content(lines[i])) ? parseSeq(indentOf(lines[i])) : parseMap(indentOf(lines[i]));
    }

    function parseValue(rest, indent) {
        if (rest === undefined || rest.trim() === '') {
            skip();
            if (i >= lines.length) return null;
            const n = lines[i];
            if (indentOf(n) > indent || (indentOf(n) === indent && isItem(content(n)))) return parseBlock();
            return null;
        }
        if (/^[|>][-+]?$/.test(rest.trim())) {
            const out = [];
            let base = null;
            while (i < lines.length) {
                const l = lines[i];
                if (l.raw.trim() === '') { out.push(''); i++; continue; }
                if (indentOf(l) <= indent) break;
                if (base === null) base = indentOf(l);
                out.push(l.raw.slice(base));
                i++;
            }
            return out.join('\n');
        }
        return scalar(rest);
    }

    function parseMap(indent) {
        const obj = {};
        for (;;) {
            skip();
            if (i >= lines.length) break;
            const l = lines[i];
            const ind = indentOf(l);
            if (ind < indent) break;
            if (ind > indent) throw new Error(`unexpected indent at line ${i + 1}`);
            const t = content(l);
            if (isItem(t)) break;
            const m = t.match(KEY_RE);
            if (!m) throw new Error(`cannot parse line ${i + 1}: ${t}`);
            i++;
            obj[unquote(m[1])] = parseValue(m[2], indent);
        }
        return obj;
    }

    function parseSeq(indent) {
        const arr = [];
        for (;;) {
            skip();
            if (i >= lines.length) break;
            const l = lines[i];
            const ind = indentOf(l);
            if (ind < indent) break;
            if (ind > indent) throw new Error(`unexpected indent at line ${i + 1}`);
            const t = content(l);
            if (!isItem(t)) break;
            const item = t === '-' ? '' : t.slice(2).trim();
            if (item === '') { i++; arr.push(parseValue('', indent)); continue; }
            if (KEY_RE.test(item) && !/^["']/.test(item)) {
                const dash = l.raw.indexOf('-');
                l.raw = l.raw.slice(0, dash) + ' ' + l.raw.slice(dash + 1);
                arr.push(parseMap(indentOf(l)));
                continue;
            }
            i++;
            arr.push(scalar(item));
        }
        return arr;
    }

    const doc = parseBlock();
    skip();
    if (i < lines.length) throw new Error(`unparsed content from line ${i + 1}`);
    return doc;
}

function load() {
    assert.ok(fs.existsSync(WORKFLOW), '.github/workflows/render-diagrams.yml must still exist');
    const wf = parseYaml(fs.readFileSync(WORKFLOW, 'utf8'));
    assert.ok(wf && typeof wf === 'object' && wf.jobs && typeof wf.jobs === 'object', 'workflow must declare jobs');
    return wf;
}

function stepsOf(job) { return Array.isArray(job && job.steps) ? job.steps.filter((s) => s && typeof s === 'object') : []; }
function usesOf(step) { return typeof step.uses === 'string' ? step.uses : ''; }
function runOf(step) { return typeof step.run === 'string' ? step.run : ''; }

function isCommitStep(step) {
    return /^stefanzweifel\/git-auto-commit-action@/i.test(usesOf(step))
        || /\bgit\s+push\b/.test(runOf(step))
        || /^(EndBug\/add-and-commit|actions-js\/push|ad-m\/github-push-action)@/i.test(usesOf(step));
}
const rendersD2 = (step) => /(^|\s)d2\s/m.test(runOf(step)) && /diagrams\/d2|\.d2\b/.test(runOf(step));
const rendersPython = (step) => /\bpython3?\b/.test(runOf(step)) && /diagrams\/python/.test(runOf(step));

function grantsContentsWrite(perms) {
    if (perms === 'write-all') return true;
    return !!perms && typeof perms === 'object' && perms.contents === 'write';
}

function truthy(v) { return v === true || (typeof v === 'string' && v.trim() !== '' && v.trim() !== 'false'); }

function needsClosure(jobs, id, seen = new Set()) {
    const n = jobs[id] && jobs[id].needs;
    for (const d of (Array.isArray(n) ? n : typeof n === 'string' ? [n] : [])) {
        if (!seen.has(d)) { seen.add(d); needsClosure(jobs, d, seen); }
    }
    return seen;
}

function globToRegExp(g) {
    return new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '.*').replace(/\?/g, '.').replace(/\u0000/g, '.*') + '$');
}
function pathspecCovers(spec, target) {
    return spec.split(/\s+/).filter(Boolean).some((tok) => {
        const t = tok.replace(/^\.\//, '');
        if (t === '.' || t === '*') return true;
        if (target.startsWith(t.replace(/\/$/, '') + '/')) return true;
        return globToRegExp(t).test(target);
    });
}

function commitSteps(wf) {
    const out = [];
    for (const [id, job] of Object.entries(wf.jobs)) {
        stepsOf(job).forEach((step, index) => { if (isCommitStep(step)) out.push({ id, job, step, index }); });
    }
    return out;
}

test('the workflow parses and still renders both D2 and Python diagrams on the same triggers', () => {
    const wf = load();
    const on = wf.on || wf.true;
    assert.ok(on && typeof on === 'object', 'workflow must keep its "on" triggers');
    assert.ok('workflow_dispatch' in on, 'workflow_dispatch trigger must stay');
    const paths = (on.push && on.push.paths) || [];
    assert.ok(Array.isArray(paths), 'on.push.paths must stay a list');
    assert.ok(paths.includes('diagrams/**/*.d2'), 'on.push.paths must still include diagrams/**/*.d2');
    assert.ok(paths.includes('diagrams/**/*.py'), 'on.push.paths must still include diagrams/**/*.py');
    const all = Object.values(wf.jobs).flatMap(stepsOf);
    assert.ok(all.some(rendersD2), 'some step must still run d2 over the diagrams/d2 sources');
    assert.ok(all.some(rendersPython), 'some step must still run python over diagrams/python');
});

test('exactly one step pushes per run, so the jobs cannot race each other to the branch', () => {
    const wf = load();
    const commits = commitSteps(wf);
    assert.equal(commits.length, 1, `expected exactly one commit/push step, found ${commits.length} (${commits.map((c) => c.id).join(', ')})`);
});

test('the pushing job holds contents: write and runs after every render', () => {
    const wf = load();
    const commits = commitSteps(wf);
    assert.equal(commits.length, 1);
    const { id, job, index } = commits[0];
    const effective = job.permissions !== undefined && job.permissions !== null ? job.permissions : wf.permissions;
    assert.ok(grantsContentsWrite(effective), `job ${id} must be granted contents: write (the push fails 403 on the read-only default token)`);

    const upstream = needsClosure(wf.jobs, id);
    for (const [rid, rjob] of Object.entries(wf.jobs)) {
        const steps = stepsOf(rjob);
        steps.forEach((s, k) => {
            if (!rendersD2(s) && !rendersPython(s)) return;
            if (rid === id) assert.ok(k < index, `render step ${k} in ${rid} must run before the commit step`);
            else assert.ok(upstream.has(rid), `commit job ${id} must need render job ${rid}`);
        });
    }
});

test('the push commits both the SVG and PNG outputs', () => {
    const wf = load();
    const [{ step }] = commitSteps(wf);
    if (/git-auto-commit-action@/i.test(usesOf(step))) {
        const spec = step.with && typeof step.with.file_pattern === 'string' ? step.with.file_pattern : '.';
        assert.ok(pathspecCovers(spec, 'assets/diagrams/example.svg'), `file_pattern "${spec}" must cover assets/diagrams/*.svg`);
        assert.ok(pathspecCovers(spec, 'assets/diagrams/example.png'), `file_pattern "${spec}" must cover assets/diagrams/*.png`);
    } else {
        assert.match(runOf(step), /git\s+add\s+(-A|--all|\.(\s|$)|assets\/diagrams)/, 'the push step must stage assets/diagrams');
    }
});

test('a failing push is not hidden', () => {
    const wf = load();
    const [{ id, job, step }] = commitSteps(wf);
    assert.ok(!truthy(job['continue-on-error']), `job ${id} must not set continue-on-error`);
    assert.ok(!truthy(step['continue-on-error']), 'the commit step must not set continue-on-error');
    assert.doesNotMatch(runOf(step), /\|\|\s*(true|:|exit 0)\b/, 'the push must not be masked with || true');
});
