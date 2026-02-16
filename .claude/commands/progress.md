# Academy Progress

Read `.academy/progress.json` and display the student's full progress.

Show:
1. **Overall stats**: Labs completed, total score, time spent
2. **Per-lab breakdown**: Status, score, hints used, time
3. **Skills developed**: Based on completed lab skill tags
4. **Certification path**: Progress toward Associate/Professional/Expert

Format:
```
╔══════════════════════════════════════════════════════════════╗
║  AI ARCHITECT ACADEMY — Student Progress                    ║
╠══════════════════════════════════════════════════════════════╣
║  Labs Completed: X/3    |  Avg Score: XX/100                ║
║  Hints Used: X/9        |  Total Time: XXm                  ║
╠══════════════════════════════════════════════════════════════╣
║  Skills Earned:                                             ║
║  [x] RAG Systems  [ ] Multi-Agent  [ ] MCP Development     ║
╠══════════════════════════════════════════════════════════════╣
║  Certification: ASSOCIATE — X/3 requirements met            ║
╚══════════════════════════════════════════════════════════════╝
```

If `.academy/progress.json` doesn't exist yet, create it with empty state and welcome the student.
