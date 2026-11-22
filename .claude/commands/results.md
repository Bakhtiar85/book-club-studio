---
description: Log views and the vote result for an episode
argument-hint: "<episode> views=1200 noor=34 baba=21 [notes] [--retention <csv path>]"
---
Results: $ARGUMENTS
1. Save them under `"results"` in the episode's `episode.json` (`views`, `likes`, `comments`, `vote_noor`, `vote_baba`, plus any notes).
2. Update the scoreboard row in `series/continuity.md` with the winner. If viewers left a notable comment or a recurring request, add it under "Promises / open threads" so a future episode can reply to it on screen.
3. **If a retention CSV was provided** (`--retention <path>`, exported from YouTube Studio → Analytics → Engagement → Audience Retention): run `python .claude/skills/yt-retention/retention.py <path> --duration 60`. Add its single biggest-leak takeaway as one line under "Promises / open threads" in `series/continuity.md" (e.g. "hook leak at 0-5s — tighten Baba's opening punch-in").
4. Run `python tools/status.py`.
5. Give a 2-line takeaway: what's working, and one concrete tweak for the next episode (hook, length, debate topic). Be honest.
