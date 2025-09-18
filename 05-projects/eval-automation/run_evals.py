import argparse
import json
import subprocess
import os
from datetime import datetime

REPORT_DIR = 'reports'


def run(dataset: str):
    os.makedirs(REPORT_DIR, exist_ok=True)
    timestamp = datetime.utcnow().strftime('%Y%m%d-%H%M%S')
    json_path = os.path.join(REPORT_DIR, f'eval-{timestamp}.json')
    html_path = os.path.join(REPORT_DIR, f'eval-{timestamp}.html')

    subprocess.run([
        'promptfoo', 'eval', '--config', 'promptfoo.yaml', '--dataset', dataset,
        '--output', json_path,
        '--format', 'json'
    ], check=True)

    subprocess.run([
        'promptfoo', 'eval', '--config', 'promptfoo.yaml', '--dataset', dataset,
        '--output', html_path,
        '--format', 'html'
    ], check=True)

    print(f"Stored reports at {json_path} and {html_path}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dataset', default='scenarios.csv')
    args = parser.parse_args()
    run(args.dataset)


if __name__ == '__main__':
    main()
