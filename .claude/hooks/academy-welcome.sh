#!/bin/bash
# Academy Welcome Hook — displays status on session start
# Adapted from ACOS v10 session-start pattern

PROGRESS_FILE=".academy/progress.json"

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "Welcome to the AI Architect Academy. Type /academy to get started."
  exit 0
fi

# Count completed labs
COMPLETED=$(grep -o '"status": "completed"' "$PROGRESS_FILE" 2>/dev/null | wc -l)
IN_PROGRESS=$(grep -o '"status": "in_progress"' "$PROGRESS_FILE" 2>/dev/null | wc -l)
TOTAL=3

# Find current lab
CURRENT="none"
if [ "$IN_PROGRESS" -gt 0 ]; then
  CURRENT=$(python3 -c "
import json, sys
try:
    with open('$PROGRESS_FILE') as f:
        data = json.load(f)
    for lab_id, lab in data.get('labs', {}).items():
        if lab.get('status') == 'in_progress':
            print(lab_id)
            break
except:
    print('unknown')
" 2>/dev/null || echo "unknown")
fi

echo "Academy | ${COMPLETED}/${TOTAL} labs completed | Current: ${CURRENT} | Type /academy for menu"
