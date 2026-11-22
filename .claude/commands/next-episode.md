---
description: Write, voice, animate, render and log the next episode
argument-hint: "[optional: book or part, e.g. 'alchemist part 3']"
---
Make the next episode of the series. $ARGUMENTS

1. **Load memory:** follow "Start of EVERY session" in CLAUDE.md, including the last two episodes' notes.md.
2. **Find where we left off:** run `python tools/book.py where <book>`. The new episode starts exactly at `next_start_page` / `next_hint`. If the book has a PDF, read from there with `python tools/book.py pages <book> <a>-<b>` until you reach a natural stopping point (aim for the 📝 part in the plan, but the text decides). If the next 📝 part is the **Finale**, follow `/finale` instead. If the book is complete, say so and suggest `/compile-book <book>`, then `/new-book`.
3. **Create the folder:** `python tools/new_episode.py <book-short>-p<N>-<title-slug> --book <book-slug>`
4. **Write `script.json`** per the bible:
   - a hook line from Baba
   - Noor's "…Look!"
   - 4–6 narrator lines, one scene each
   - 2–4 debate lines
   - a teaser and a vote question
   Pay off last episode's promise, use one running joke, and check every story fact against the book: the PDF pages if we have them, otherwise web search. Fill in `"source"` (book, pages, ends_at). Write everything in your own words (see Originality in CLAUDE.md). Add fx, ambience and sfx cues.
5. **Score the hook:** run `python3 .claude/skills/yt-script/hookscore.py --hook "<Baba's hook line>"`. If it bands WEAK (or WORKABLE but barely), write one stronger alternative using the weakest-property fix it suggests, score that too, and bring both to the approval stop.
6. **⏸ The one approval stop:** show the user the script as a short table (who | line | scene/effect) plus the vote question, and the hook score(s) from step 5. Ask "Build it?" and wait. Apply any edits they ask for.
7. Run `python tools/voice.py <ep>`. It first runs the originality check; if it flags lines, rewrite them in your own words and re-run. If total > 60 s, trim lines and re-run.
8. **Build `app/src/episodes/<ep>/scenes.tsx`** (follow `series/design.md`): one component per scene id, reusing `books/<book>/world.tsx`. Add any new character or place to `world.tsx` in the house style and to its `CharacterSheet`. A brand-new recurring character needs the user's OK on the sheet (design.md §6) before the final render.
9. Run `python tools/mix.py <ep>`, then `python tools/render.py <ep> --draft`. Do the full quality check from CLAUDE.md, fix, re-check.
10. Final render: `python tools/render.py <ep>`.
11. Write the memory files from "After every episode" in CLAUDE.md (notes.md with the pages covered, continuity.md, book plan, episode.json). For `publish.md`, use the **yt-package** skill against `episodes/<ep>/out/cover.jpg` for the title + thumbnail brief, and the **yt-seo** skill for the description, tags and pinned comment — both read `~/.claude/youtube/voice.md` for the show's voice. Leave the "Upload checklist" section (already in the template) as-is unless this episode needs an exception. **Move the bookmark** with `python tools/book.py advance <book> --episode <ep> --pages <a-b> --event "…" --next "…"`, then run `python tools/status.py`.
12. Reply with:
    - the path of the final mp4 and of cover.jpg
    - the publish pack (title, description, hashtags, pinned comment), ready to copy
    - the **Upload checklist** from `publish.md` (Audience / Age restriction / Altered content disclosure / Comments)
    - "Run `/upload-pack <ep>` when you're ready to upload."
