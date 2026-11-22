---
description: Re-render an episode after edits
argument-hint: "<episode number, e.g. 002> [--draft]"
---
Re-render episode $ARGUMENTS.
1. If `script.json` is newer than `data/lines.json`, run `python tools/voice.py <ep>` first.
2. Run `python tools/mix.py <ep>`, then `python tools/render.py <ep> --draft`. Check `contact.jpg` per CLAUDE.md and fix anything broken.
3. Run the final `python tools/render.py <ep>` (skip if the user passed `--draft`).
4. Reply with the output path and anything you fixed.
