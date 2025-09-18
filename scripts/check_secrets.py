#!/usr/bin/env python3
"""Check required secrets across project environments."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, List

ROOT = Path(__file__).resolve().parents[1]

PROJECTS: Dict[str, Dict[str, List[str]]] = {
    "eval-automation": {
        "env": ROOT / "05-projects" / "eval-automation" / ".env",
        "required": [
            "OPENAI_API_KEY",
            "ANTHROPIC_API_KEY",
            "LANGFUSE_PUBLIC_KEY",
            "LANGFUSE_SECRET_KEY",
        ],
    },
    "domain-rag-healthcare": {
        "env": ROOT / "05-projects" / "domain-rag-healthcare" / ".env",
        "required": [
            "OPENAI_API_KEY",
            "LANGFUSE_PUBLIC_KEY",
            "LANGFUSE_SECRET_KEY",
            "SUPABASE_URL",
            "SUPABASE_SERVICE_KEY",
        ],
    },
    "dashboard": {
        "env": ROOT / "dashboard" / ".env.local",
        "required": [
            "OPENAI_API_KEY",
            "ANTHROPIC_API_KEY",
            "NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY",
            "LANGFUSE_SECRET_KEY",
        ],
    },
}


def parse_env(path: Path) -> Dict[str, str]:
    values: Dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"')
    return values


def main() -> None:
    missing_any = False
    for name, config in PROJECTS.items():
        env_path = config["env"]
        required = config["required"]
        env_values = parse_env(env_path)

        print(f"\n[{name}] ({env_path.relative_to(ROOT) if env_path.exists() else 'env file not found'})")
        for key in required:
            value = env_values.get(key) or os.getenv(key)
            if value:
                print(f"  ? {key}")
            else:
                print(f"  ? {key} (missing)")
                missing_any = True

    if missing_any:
        raise SystemExit(1)

    print("\nAll required secrets found for the checked projects.")


if __name__ == "__main__":
    main()