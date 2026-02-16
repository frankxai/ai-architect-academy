#!/bin/bash
# Open the AI Architect Academy progress dashboard
DASHBOARD_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-3721}"

echo "Starting AI Architect Academy Dashboard on http://localhost:$PORT"

# Use Python's built-in HTTP server
if command -v python3 &> /dev/null; then
    cd "$DASHBOARD_DIR"
    echo "Dashboard running at http://localhost:$PORT"
    echo "Press Ctrl+C to stop"
    python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
    cd "$DASHBOARD_DIR"
    echo "Dashboard running at http://localhost:$PORT"
    echo "Press Ctrl+C to stop"
    python -m http.server "$PORT"
elif command -v npx &> /dev/null; then
    cd "$DASHBOARD_DIR"
    npx serve -p "$PORT" .
else
    echo "Error: Requires python3, python, or npx. Install one and try again."
    exit 1
fi
