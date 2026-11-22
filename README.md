# Book Club Studio: "Book Club with Noor & Baba"

A complete, self-contained workflow for a YouTube Shorts series made 100% in code (Remotion 2D + local Kokoro voices).
Claude Code runs it; you mostly type one command.

## First time (once per computer)
1. Unzip anywhere, open a terminal in this folder, start **Claude Code**.
2. Type **`/setup`**. It installs everything, downloads the voice models (~340 MB) and test-renders Episode 001.
3. Optional: **`/upgrade-characters`** redraws Noor, Baba or a book's cast with more polish (same look; you approve it).

Needs: Node 20+ (22 LTS recommended), Python 3.10–3.12, ffmpeg. `/setup` tells you the exact install command for anything missing.

## Every episode
| You type | What happens |
|---|---|
| `/book-status` | last upload, what's next, open promises |
| `/next-episode` | Claude writes the next part, **shows you the script once** (say OK or edit), then voices, animates, checks every frame and renders. You get the MP4, a cover frame and a ready-to-paste title, description and hashtags |
| *(upload to YouTube)* | |
| `/published 002 https://youtube.com/shorts/...` | logs the upload |
| `/results 002 views=900 noor=40 baba=25` | logs the vote and tells you what to tweak |
| `/finale` | the book's last Short: recap, verdict, scoreboard, vote for the next book |
| `/compile-book the-alchemist` | month end: one long video of the whole book, with chapters |
| `/new-book Robinson Crusoe` | plans the next book, designs its world and new characters (you approve the character sheet) |
| `/add-pdf the-alchemist C:\Books\alchemist.pdf` | adds the book's PDF: exact facts, page-accurate bookmark, originality check |

`/next-episode` also scores Baba's hook and writes the publish pack's title/thumbnail/SEO using the `yt-*` packaging skills (`.claude/skills/`); `/results --retention <csv>` reads a YouTube retention export; `/compile-book` validates its chapter list. These skills never publish anything themselves — they only write files you upload. Standalone skills `/yt-audit`, `/yt-comment`, `/yt-edit`, `/yt-plan`, `/yt-shorts`, `/yt-viral` are also available if you want them directly.

Each new episode reads the series bible, the **bookmark** (exact page and event where the last episode stopped), the continuity file (jokes, promises, scoreboard) and the last two episodes' notes, so the story and the banter carry on.

## Rhythm
**2 Shorts a week** (Mon + Thu reminders) → about **1 book a month** (6–7 parts + Finale) → **1 long video** at month end → next book. Noor, Baba and the library stay; each book brings its own world and characters.

## Where things are
- `series/`: the show's memory (bible, continuity, episode log, book plans)
- `episodes/NNN-*/`: one folder per episode (script, notes, publish pack, final video in `out/`)
- `app/`: the Remotion project. `npx remotion studio` inside `app/` previews the current episode
- `assets/sfx`, `assets/music`: drop real sound files here to replace the synthesized ones (names in CLAUDE.md)

Permissions are pre-approved in `.claude/settings.json` (python, npm/npx, node, ffmpeg, file edits), so Claude Code won't keep asking.
