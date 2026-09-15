# Academy Progress

Read `.academy/progress.json` and display the student's full progress.

Show:
1. **Overall stats**: Labs completed, total score, time spent
2. **Per-lab breakdown**: Status, score, hints used, time
3. **Skills developed**: Based on completed lab skill tags

The lab total is a count, not a typed number: it is the number of directories under `labs/` that contain a `.lab/config.json`. The hint total is the sum of each config's `hints` field. There is no certification and no score tier; never show one (see the flagship section of `CLAUDE.md`).

Format:
```
╔══════════════════════════════════════════════════════════════╗
║  AI ARCHITECT ACADEMY — Student Progress                    ║
╠══════════════════════════════════════════════════════════════╣
║  Labs Completed: X/N    |  Avg Score: XX/100                ║
║  Hints Used: X/M        |  Total Time: XXm                  ║
╠══════════════════════════════════════════════════════════════╣
║  Skills Earned:                                             ║
║  [x] RAG Systems  [ ] Multi-Agent  [ ] MCP Development     ║
║  [ ] Eval Harness [ ] Tool Authority                        ║
╚══════════════════════════════════════════════════════════════╝
```

If `.academy/progress.json` doesn't exist yet, create it with empty state and welcome the student.
