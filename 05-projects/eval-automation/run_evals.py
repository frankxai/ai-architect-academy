import argparse
import csv
import json
import os
import shutil
import subprocess
from datetime import UTC, datetime
from typing import Dict, List

from dotenv import load_dotenv

REPORT_DIR = 'reports'

load_dotenv()
PROMPTFOO_BIN = os.getenv('PROMPTFOO_BIN') or shutil.which('promptfoo')
if not PROMPTFOO_BIN:
    PROMPTFOO_BIN = shutil.which('promptfoo.cmd')


def _fallback_results(rows: List[Dict[str, str]], json_path: str, html_path: str) -> None:
    timestamp = datetime.now(UTC).isoformat()
    results = []

    for row in rows:
        expected = row.get('expected', '').strip()
        context = row.get('context', '').strip()
        output = context if context else expected or '(no output generated)'

        results.append(
            {
                'input': row.get('input', ''),
                'expected': expected,
                'output': output,
                'context_used': bool(context),
                'status': 'SKIPPED (offline fallback)',
            }
        )

    summary = {
        'total': len(results),
        'passed': None,
        'failed': None,
        'generated_at': timestamp,
        'mode': 'offline-fallback',
    }

    payload = {'summary': summary, 'results': results}

    with open(json_path, 'w', encoding='utf-8') as jf:
        json.dump(payload, jf, indent=2)

    with open(html_path, 'w', encoding='utf-8') as hf:
        hf.write('<html><head><meta charset="utf-8"><title>Eval Summary</title></head><body>')
        hf.write(f"<h1>Evaluation Summary</h1><p>Generated at {timestamp}</p>")
        hf.write('<p>Promptfoo not available; outputs reflect offline fallback and are not graded.</p>')
        hf.write('<table border="1" cellpadding="6" cellspacing="0">')
        hf.write('<tr><th>Input</th><th>Output</th><th>Expected</th><th>Status</th></tr>')
        for item in results:
            hf.write('<tr>')
            hf.write(f"<td>{item['input']}</td>")
            hf.write(f"<td>{item['output']}</td>")
            hf.write(f"<td>{item['expected']}</td>")
            hf.write(f"<td>{item['status']}</td>")
            hf.write('</tr>')
        hf.write('</table></body></html>')

    print(f"Promptfoo unavailable; wrote offline summary to {json_path} and {html_path}")


def run(dataset: str) -> None:
    os.makedirs(REPORT_DIR, exist_ok=True)
    timestamp = datetime.now(UTC).strftime('%Y%m%d-%H%M%S')
    json_path = os.path.join(REPORT_DIR, f'eval-{timestamp}.json')
    html_path = os.path.join(REPORT_DIR, f'eval-{timestamp}.html')

    try:
        if not PROMPTFOO_BIN:
            raise FileNotFoundError('promptfoo CLI not found on PATH')

        base_cmd = [PROMPTFOO_BIN, 'eval', '--config', 'promptfoo.yaml', '--tests', dataset]
        subprocess.run(base_cmd + ['--output', json_path], check=True)
        subprocess.run(base_cmd + ['--output', html_path], check=True)
        print(f"Stored promptfoo reports at {json_path} and {html_path}")
    except (FileNotFoundError, subprocess.CalledProcessError) as exc:
        print(f"Promptfoo execution failed ({exc}); using offline evaluator.")
        with open(dataset, newline='', encoding='utf-8') as dataset_file:
            rows = list(csv.DictReader(dataset_file))
        _fallback_results(rows, json_path, html_path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', default='scenarios.csv')
    args = parser.parse_args()
    run(args.dataset)


if __name__ == '__main__':
    main()