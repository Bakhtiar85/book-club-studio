# Series bible: "Book Club with Noor & Baba"

Read this before writing anything. It is the fixed identity of the show; change it only when the user asks.

## Format
- YouTube Shorts: 1080×1920, 30 fps, **≤ 60 s** (target 45–55 s incl. the 2.4 s vote card).
- One **chunk** of a book per episode (never the whole book). Each book = a numbered series of parts (see `books/<book>.md`).
- Look & feel, venue, themes and new-character rules: see **`series/design.md`**.

## Episode structure (always)
1. **Hook (0.25 s):** Baba's most dramatic question about this chunk, with a punch-in + reaction. No intro, no title card.
2. **Noor: "…Look!"** → book flies from her lap and opens. Story visible by **~5 s**.
3. **Book world:** narrator tells the chunk over **4–6 scenes** (one narrator line = one scene, ~5 s each), page-turn between scenes.
4. **Back in the library:** Baba objects (skeptic), Noor defends (dreamer), 2–4 short lines, at least one punch-in + reaction.
5. **Teaser** for the next part (Baba worries, Noor teases) → **vote card** with the episode question.

## Hosts
| | Noor | Baba |
|---|---|---|
| Who | ~10-year-old daughter | her father |
| Role | the dreamer, optimistic, curious, loves the book | the practical skeptic, warm, dry humour |
| Look | pink hijab, yellow cardigan, blue dress, white sneakers, red velvet armchair (left), holds the book | neat dark beard with grey, rectangular glasses, cream kurta + brown sweater vest, grey trousers, green wingback chair (right), cup of chai |
| Voice | Kokoro `af_heart`, speed 0.94, pitch ×1.13 | Kokoro `am_fenrir`, speed 0.95 |
| Caption colour | `#FF8FC8` | `#8FE3B0` |
| Says | "Baba!", "Look!", "You always do, Baba!" | "beta", "That's a scam", "I have a bad feeling about this." |
- Narrator: Kokoro `bm_fable` (British storyteller), speed 0.95, caption colour `#FFD36B`. Heard only inside the book.
- Set: cozy library at dusk: arched window with moon, bookshelves both sides, floor lamp, red rug, side table with teapot.

## Audience (decided)
- **YouTube setting:** mark every video **"No, it's not made for kids"**, and set the same at channel level (Studio → Settings → Channel → Advanced settings). General audience: teens, adults and book-loving families. Kids may watch along, but they are not the target.
- **Content rules:** family-friendly and clean. No sexual or 18+ content, no profanity, no graphic violence, no mocking of religions or groups. Mild peril is fine (Santiago gets robbed); show violence only as a cartoon "poof" or off-screen.
- **Write for grown-ups:** debates with real-life stakes (money, career, risk, trust, family), Baba's dry humour, book-lover references. Avoid kid-targeting signals: no "Hey kids!", no nursery-rhyme music or sing-alongs, no toy/game tie-ins, no "ask your parents" calls.
- **The vote stays in the comments:** "Team Noor or Team Baba? 👇"

## Writing rules
- Talk like a real father and daughter: short, warm, funny lines. Each line ≤ ~15 words. Narrator lines ≤ ~25 words.
- **Accuracy:** every story fact must match the book. Check against the book plan notes; if unsure, look it up before writing.
- **Copyright / originality:** retell in our own words. If we have the book's PDF it is a fact source only; `tools/originality.py` blocks any line sharing 8+ consecutive words with the book. At most one short quote (≤ 15 words) per episode, marked `"quote"` in script.json.
- **Continuity in the book:** each episode starts exactly where the bookmark says the last one ended (`python tools/book.py where <book>`). No skipped events that matter, no repeats.
- Spoken numbers as words ("seven"). No slang that won't age.
- Each debate takes a real side; the question must be genuinely arguable (no obvious answer).
- Use `continuity.md`: call back running jokes, pay off last episode's teaser, keep the vote scoreboard going.
- Family-friendly always: no violence detail, no romance beyond the book's mildest, nothing scary for kids.

## Visual rules
- 2D, hand-drawn SVG in React (Remotion). Flat colours + one shade, ink outline `#2A1A12` 5–6 px, rounded friendly shapes.
- **No three.js, no AI images, no stock images.** Everything drawn in code.
- Captions sit at y ≈ 1530; keep y 1500–1650 free of key action. Top chip shows `Book · Part N: Title`.
- Book characters are reused across parts (`app/src/books/<book>/world.tsx`): same look every episode.

## Release calendar
| When | What | Command |
|---|---|---|
| **Every Monday + Thursday** | 1 new Short (the next part of the current book) | `/next-episode` → upload → `/published` |
| 2–3 days after each upload | log views + the vote | `/results` |
| **Last episode of the book** | the **Finale** Short: a recap and the final verdict, and viewers vote on the next book | `/finale` |
| **Last weekend of the month** | the **long video**: all parts of the book stitched into one 6–10 min video with chapters, uploaded as a normal YouTube video | `/compile-book <book>` |
| Right after | start the next book | `/new-book <title>` |

**Per week:** 2 Shorts. **Per month:** about 8 Shorts (one book = 6–7 parts + Finale) and 1 long video. If a book needs more parts, it can run into the next month; never rush or skip story to fit a month. If the user misses a slot, just continue; never double-post to catch up.

## Book cycle (what happens when a book ends)
1. **Finale (the last Short of the book):** Baba and Noor give their final verdict on the whole book, show the season scoreboard (Team Noor vs Team Baba from `continuity.md`), and ask viewers to vote on the next book from 2–3 options in the comments.
2. **Compilation:** `/compile-book` stitches the book's episodes (vote cards removed, except the last) into one long video and writes the chapter list for the description.
3. **Next book:** `/new-book` picks the winner of the viewer vote, or the user's choice. It plans 6–7 parts, designs the **new book world** (palette, places, new cast) following `design.md`, adds the book's sill prop, and **shows the character sheet for approval**.
4. **What stays:** Noor, Baba, the library, the voices, the episode format, running jokes, and the all-time scoreboard. **What's new:** the book's world, its characters, its sill prop, its bookmark and its part plan.
5. The new book's first episode opens with a quick callback to the previous book (one line max), e.g. Baba: "After that desert adventure, I need something calmer…"
