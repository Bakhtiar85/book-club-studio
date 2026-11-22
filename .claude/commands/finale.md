---
description: Make the book's Finale Short (recap, final verdict, scoreboard, next-book vote)
argument-hint: "[book] [next-book options, e.g. 'Sherlock Holmes | Robinson Crusoe | Aesop']"
---
Make the Finale for the current book. $ARGUMENTS
1. Load memory (CLAUDE.md session start). Read every episode `notes.md` for this book and the scoreboard in `continuity.md`.
2. Next-book options: use the arguments, or suggest 3 (family-friendly, story-driven, popular; public-domain classics are a plus because quotes are free) and ask the user to pick the 2–3 to offer.
3. Create the episode with `python tools/new_episode.py <book-short>-finale --book <book>`. Same structure as always:
   - **hook:** Baba, e.g. "Seven parts… was it worth it?"
   - Noor's "…Look!"
   - **narrator recap:** 4–5 lines covering the WHOLE journey. Build simple recap scenes in this episode's own `scenes.tsx` from the book's `world.tsx` characters and places. **Don't import other episodes' scene components:** their word cues (`at(word, line)`) point at their own scripts and will throw here.
   - **back in the library:** the final verdict from each of them
   - the season result, e.g. Noor: "The comments say Team Noor won 4 to 3!"
   - a teaser: "Next month… you choose!"
   Set `question` to "Next book?" and `vote` to two of the options (put a third in the pinned comment).
4. Same approval stop, build, quality check and render as `/next-episode`. Then update all memory files, mark the Finale 🎬 in the plan, and mark the book **complete** in `series/continuity.md`.
5. Reply with the mp4, the publish pack (description lists the next-book options) and: "After uploading: `/published`, then at month end `/compile-book <book>`."
