import argparse
import json
import os
from datetime import datetime

try:
    import promptfoo
except ImportError:
    promptfoo = None

REPORT_DIR = 'reports'


def run(dataset: str):
    if promptfoo is None:
        raise SystemExit('Install promptfoo to run automation: pip install promptfoo')
    if not os.path.exists(dataset):
        raise SystemExit(f'Dataset not found: {dataset}')

    os.makedirs(REPORT_DIR, exist_ok=True)
    timestamp = datetime.utcnow().strftime('%Y%m%d-%H%M%S')
    report_path = os.path.join(REPORT_DIR, f'eval-{timestamp}.json')

    result = promptfoo.eval.main(['eval', dataset, '--output', report_path])
    print(f'Evaluation complete. Stored JSON at {report_path}')

    summary_path = os.path.join(REPORT_DIR, 'healthcare_rag_summary.md')
    with open(report_path, encoding='utf-8') as f:
        scores = json.load(f)
    avg_score = scores.get('averages', {}).get('score')
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(f"# Healthcare RAG Evaluation\n\n- Dataset: {dataset}\n- Average score: {avg_score}\n- Report: {report_path}\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', default='eval/healthcare.json')
    args = parser.parse_args()
    run(args.dataset)


if __name__ == '__main__':
    main()
