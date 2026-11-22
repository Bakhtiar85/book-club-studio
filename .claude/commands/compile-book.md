---
description: Make the monthly long video from all parts of a book
argument-hint: "<book-slug> [--vertical]"
---
Compile the book: $ARGUMENTS
1. Check that every part in `series/books/<book>.md` (including the Finale) has a final render. List any missing ones and offer to render them first.
2. Run `python tools/compile_book.py <book>`. The default is 16:9 for a regular YouTube video; use `--vertical` if the user asks.
3. Grab 4 frames (start, two middles, end) with ffmpeg and look at them: the blur background is fine, nothing is cut off, and the audio is continuous.
3b. **Validate chapters:** run `python .claude/skills/yt-chapters/chapters.py <path to transcript/SRT>` (or pass `compilations/<book>/chapters.txt` if it's already in a compatible format) and check it reports valid — first entry 00:00, ≥3 chapters, each ≥10s. Fix any chapter it flags before writing publish.md.
4. Write `compilations/<book>/publish.md`:
   - a title: "<Book> — the whole story with Noor & Baba"
   - a description with a 2-line hook and the chapters from `chapters.txt`
   - 8–10 tags
   - a pinned comment: "Which part was your favourite?"
5. Reply with the file path, its length and the publish pack. Remind the user: "Next: `/new-book <winner of the vote>`."
