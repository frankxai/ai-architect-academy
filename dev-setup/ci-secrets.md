# CI Secrets Wiring Guide

Use this checklist to configure Promptfoo, Langfuse, and model provider keys for GitHub Actions or other CI/CD systems. The goal is to keep evaluations reproducible while protecting credentials.

## 1. Required Secrets
| Secret | Purpose | Where it is used |
| --- | --- | --- |
| `OPENAI_API_KEY` | Access to OpenAI chat/completions used by Promptfoo scenarios | `05-projects/eval-automation/run_evals.py`, Promptfoo config |
| `ANTHROPIC_API_KEY` | Anthropic models for comparison or grading | Promptfoo config |
| `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` | Telemetry + eval result sync | `05-projects/eval-automation`, other Langfuse integrations |
| `LANGFUSE_HOST` (optional) | Self-hosted Langfuse endpoint | `05-projects/eval-automation` |
| `PROMPTFOO_BIN` (optional) | Custom CLI path when using a managed runner | `05-projects/eval-automation/run_evals.py` |

## 2. GitHub Actions Setup
1. Navigate to **Settings ? Secrets and variables ? Actions**.
2. Add each secret listed above.
3. If using environment-specific secrets (e.g., `staging`, `prod`), duplicate the list per environment.
4. Store evaluation datasets or prompt packs in the repo; avoid embedding secrets in scenario files.

## 3. Workflow Snippet
```yaml
# .github/workflows/eval-check.yml
jobs:
  run-evals:
    runs-on: ubuntu-latest
    env:
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      LANGFUSE_PUBLIC_KEY: ${{ secrets.LANGFUSE_PUBLIC_KEY }}
      LANGFUSE_SECRET_KEY: ${{ secrets.LANGFUSE_SECRET_KEY }}
      LANGFUSE_HOST: ${{ secrets.LANGFUSE_HOST }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g promptfoo@latest
      - run: python -m venv .venv && source .venv/bin/activate && pip install -r 05-projects/eval-automation/requirements.txt
      - run: python 05-projects/eval-automation/check_env.py
      - run: python 05-projects/eval-automation/run_evals.py --dataset 05-projects/eval-automation/scenarios.csv
```

## 4. Local Parity
- Copy `.env.example` to `.env` in `05-projects/eval-automation` and populate the same keys.
- Use `python check_env.py` to confirm local developers match CI configuration.
- Version-control prompt packs, scorecards, and evaluation scenarios; do **not** commit `.env` or generated reports (already gitignored).

## 5. Secret Rotation Playbook
1. Rotate provider keys quarterly or after any suspected leak.
2. Update secrets in CI and share via secure vault (1Password, Bitwarden) with the AI ops team.
3. Re-run `python check_env.py` to validate environment sync.
4. Log rotation activity in `reports/creator/retro-<date>.md` or your ops journal.

## 6. Troubleshooting
- **Promptfoo not found:** define `PROMPTFOO_BIN` or ensure `npm install -g promptfoo@latest` runs in CI.
- **Missing keys:** workflow fails at `check_env.py`; inspect secrets or environment scope.
- **Langfuse connection errors:** verify region-specific host URL and allowlist CI runner IPs if self-hosting.
- **Cost controls:** set usage caps in provider dashboards and monitor via Langfuse budget alerts.

Keep this guide updated as new providers or evaluation tools are added.