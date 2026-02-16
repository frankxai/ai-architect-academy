# Hint

The student is requesting a hint for their current lab.

Read `.academy/progress.json` to determine which lab they are working on and their current checkpoint.

Read the lab's `.lab/config.json` to see how many hints are available.

**Hint Escalation Protocol:**
- **Hint 1 (Direction):** Point them toward the general area of the problem. "Look at line X-Y. What assumption does this code make about the input?"
- **Hint 2 (Narrowing):** Get more specific. "The chunk_size parameter — what happens when a document is 5000 characters?"
- **Hint 3 (Near-Answer):** Almost give it away. "The overlap parameter is 0. Research 'sliding window chunking' — what would a 200-char overlap do?"

After hint 3, if they're still stuck, offer to explain the concept (not write the code).

Track hint usage in `.academy/progress.json` under `labs.[id].hintsUsed`.

Never skip hint levels. Always start from the next unused hint.
