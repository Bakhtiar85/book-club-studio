---
description: Plan a new book as a numbered series of parts
argument-hint: "<book title>"
---
Plan the book: $ARGUMENTS
0. Read `series/continuity.md`. If a Finale asked viewers to vote on the next book, use the winner unless the user says otherwise. Noor, Baba, the library and the format stay the same; only the book world is new.
0b. **Audience check (see `series/bible.md` → Audience (decided)):** the show is for teens/adults, not kids.
   - Only plan books suitable for that audience. If the book has sexual content or 18+ material in the parts we'd actually cover, **skip those specific passages/parts** and say so plainly in the plan (e.g. "Part 5 skips pages X–Y, [reason], jumps to Z").
   - If the book carries heavy themes overall (war, abuse, and similar), mark it **"⚠️ needs care"** at the top of `series/books/<slug>.md` and **stop and ask the user first** before planning further — don't draw a world or design a cast until they say go.
1. If the user gave a PDF path (or `library/<slug>/source.pdf` exists), run `python tools/book.py ingest <slug> <pdf>` and plan from the actual text, with page ranges per part. Otherwise research the plot with web search, using reliable summaries; don't rely on memory for details. Then create `library/<slug>/bookmark.json` at page 1 by running `python tools/book.py where <slug>` once (it creates it) and setting `next_hint` to Part 1's opening event.
2. Create `series/books/<slug>.md` in the same format as `the-alchemist.md` (add a Pages column when there's a PDF): 5–8 parts, each a self-contained chunk with a clear event and a genuinely arguable debate question (Noor vs Baba). Mark Part 1 📝.
3. **Design the book's world, following `series/design.md`:**
   - add a "World style" section to the plan (palette, places, sill prop) and a "Cast" table (every recurring character's look and colours)
   - create `app/src/books/<slug>/world.tsx` (model it on `books/the-alchemist/world.tsx`). It must export the cast and places as components, plus `BookProp` (the window-sill prop) and `CharacterSheet` (every cast member, labelled)
   - temporarily point the app at it (or create the first episode folder) and render the sheet: `cd app && npx remotion still BookSheet ../review/<slug>-sheet.png`
   - **⏸ show the user the sheet and wait for approval** (design.md §6). Apply only the changes they ask for.
4. Keep it family-friendly and clean throughout (see the bible's Audience (decided) section): no profanity, no graphic violence, no mocking of religions or groups — violence only off-screen or as a cartoon "poof". If a key event needs softening to fit that, say how you'll do it.
5. Add a Finale row as the last part, and plan a one-line callback to the previous book for Part 1.
6. Show the user the plan table and ask if it's good to start with `/next-episode`.
