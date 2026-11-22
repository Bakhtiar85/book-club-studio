---
description: Mark an episode as uploaded
argument-hint: "<episode> <youtube url>"
---
Episode upload: $ARGUMENTS
1. In that episode's `episode.json`, set `"status": "published"`, `"published_on"` to today's date (YYYY-MM-DD) and `"url"`.
2. Run `python tools/status.py`.
3. Reply in one line: "Logged. Next up: <next part title>. Run /next-episode when ready." If 3+ episodes are already rendered but unpublished, remind the user to upload those first.
