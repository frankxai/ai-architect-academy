#!/usr/bin/env bash
set -euo pipefail
python3 -m http.server --directory docs 8080
