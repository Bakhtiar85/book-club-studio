---
description: Everything needed to fill YouTube Studio's upload form for an episode, in form order
argument-hint: "<episode number | episode folder | path to the mp4>  e.g. 001 or episodes\001-alchemist-p1-the-dream\out\001-alchemist-p1-the-dream.mp4"
---
Upload pack for: $ARGUMENTS

1. Resolve the episode: accept a number (001), a folder name, or any relative/absolute path inside episodes\<id>\ (Windows or / slashes). Read its publish.md, script.json, episode.json and series/books/<book>.md.
2. Check: out\<id>.mp4 exists and is the FINAL render (not draft), ≤ 60 s, 1080×1920; cover.jpg exists. If anything is missing, say what to run.
3. Print, in YouTube Studio's order, each value in its own copyable code block:
   DETAILS
   - Title (≤ 100 chars; use publish.md's title)
   - Description (publish.md description + hashtags on the last line)
   - Thumbnail: "Select from video" → which moment (timestamp + what's on screen, from cover.jpg), and the path of cover.jpg in case custom upload is offered
   - Playlist: "<Book> — Book Club with Noor & Baba" (tell me to create it if it doesn't exist yet)
   - Audience: No, it's not made for kids
   - Age restriction: No
   - Show more → Paid promotion: No · Altered content: No (clearly animated) · Tags (from publish.md) · Language: English · Category: Entertainment · Comments: On
   VIDEO ELEMENTS: nothing (Shorts can't use end screens/cards)
   CHECKS: just wait for "No issues found"
   VISIBILITY: Public now, or Schedule — suggest the next Mon/Thu slot from the release calendar that's not taken by another episode
   AFTER PUBLISHING
   - Pinned comment (from publish.md) — post it and pin it
   - Then run: /published <id> <shorts url>
4. Keep it short — values only, no explanations.
