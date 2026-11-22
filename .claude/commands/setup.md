---
description: First-time setup of the studio on this computer
---
Set up the Book Club studio on this computer.

1. Run `python tools/setup.py` (use `py` on Windows if `python` is missing) and fix anything marked `!!`. For a missing Node or ffmpeg, tell the user the one install command and wait.
2. Run `python tools/voice.py 001`, then `python tools/mix.py 001`, then `python tools/render.py 001 --draft`.
3. Look at `episodes/001-alchemist-p1-the-dream/out/contact.jpg` and fix any broken frames (see the quality check in CLAUDE.md).
4. Tell the user "Studio ready", how long the draft render took, and that `/upgrade-characters` is available if they want more polished hosts.
