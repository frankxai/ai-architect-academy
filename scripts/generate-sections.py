#!/usr/bin/env python3
import os, re, json, sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    return s

entries = []

# Start Here
start = os.path.join(repo_root, 'START-HERE.md')
if os.path.exists(start):
    with open(start, 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('##'):
                title = line.strip('#').strip()
                entries.append({
                    'title': title,
                    'page': 'Start Here',
                    'url': './start-here.html#' + slugify(title),
                    'tags': ['start-here']
                })

# Patterns
patdir = os.path.join(repo_root, '01-design-patterns')
for fn in sorted(os.listdir(patdir)):
    if not fn.endswith('.md'): continue
    path = os.path.join(patdir, fn)
    with open(path, 'r', encoding='utf-8') as f:
        file_param = f'01-design-patterns/{fn}'
        page_title = None
        for line in f:
            if line.startswith('# '):
                page_title = line.strip('# ').strip()
                break
        f.seek(0)
        for line in f:
            if line.startswith('##'):
                title = line.strip('#').strip()
                entries.append({
                    'title': f"{page_title}: {title}" if page_title else title,
                    'page': page_title or fn,
                    'url': f'./pattern.html?file={file_param}#' + slugify(title),
                    'tags': ['pattern']
                })

# Topics (HTML): index h2/h3
topics_dir = os.path.join(repo_root, 'docs', 'topics')
for fn in sorted(os.listdir(topics_dir)):
    if not fn.endswith('.html') or fn == 'index.html':
        continue
    path = os.path.join(topics_dir, fn)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    heads = re.findall(r'<h([23])[^>]*>(.*?)</h[23]>', html, flags=re.I|re.S)
    for level, inner in heads:
        # strip tags inside
        text = re.sub('<[^<]+?>', '', inner).strip()
        if not text:
            continue
        slug = slugify(text)
        entries.append({
            'title': f"Topic: {text}",
            'page': fn.replace('.html',''),
            'url': f'./topics/{fn}#' + slug,
            'tags': ['topic']
        })

# Concepts
condir = os.path.join(repo_root, '12-concepts')
for fn in sorted(os.listdir(condir)):
    if not fn.endswith('.md'): continue
    path = os.path.join(condir, fn)
    with open(path, 'r', encoding='utf-8') as f:
        file_param = f'12-concepts/{fn}'
        page_title = None
        for line in f:
            if line.startswith('# '):
                page_title = line.strip('# ').strip()
                break
        f.seek(0)
        for line in f:
            if line.startswith('##'):
                title = line.strip('#').strip()
                entries.append({
                    'title': f"{page_title}: {title}" if page_title else title,
                    'page': page_title or fn,
                    'url': f'./concept.html?file={file_param}#' + slugify(title),
                    'tags': ['concept']
                })

out = os.path.join(repo_root, 'docs', 'data', 'sections.json')
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out, 'w', encoding='utf-8') as f:
    json.dump(entries, f, indent=2)
print(f'Wrote {len(entries)} entries to {out}')
