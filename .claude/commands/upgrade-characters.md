---
description: Redraw Noor, Baba and/or a book's cast with more polish (same look, same code API)
argument-hint: "[who: hosts | <book-slug> | all]"
---
Upgrade the character art: $ARGUMENTS (default: hosts)

Goal: the SAME characters (same identity, outfits and colours as in `series/design.md` and the book's Cast table), drawn with more finish. **Don't change the props API**, because `engine/Main.tsx` and every episode's scenes rely on it.

- **Hosts** live in `app/src/engine/Library.tsx`:
  - `Noor({ t, mouth, talk, blink, brow, happy, gesture, book })`
  - `Baba({ t, mouth, talk, blink, brow, gesture })`
  Both are seated, origin at the seat, and Main.tsx places them at (300,1250)×1 and (790,1235)×1.1.
- **Book cast** lives in `app/src/books/<book>/world.tsx`. Keep each component's name and props (`walk`, `face`, `wave`, `sleep`, `reach`…), its origin (the feet) and roughly its size.

Upgrade checklist (follow `series/design.md`):
1. Better proportions (child 1:2.5, adult 1:3.5), cleaner silhouettes, consistent 5–6 px ink outline, flat colour + one shade + a small highlight.
2. Faces: three mouth shapes driven by `mouth` (closed, small, wide), eye highlights, expressive brows (`brow` −1..1), and happy closed eyes for `happy`.
3. Hands with simple mitten shapes. Fabric folds as 1–2 shade shapes. Hijab and beard with a little volume.
4. Idle breathing (1–2 px), a small head tilt while `talk` is on, and a blink when `blink` is true. Everything driven by `t`, nothing else.
5. Put shared parts (Eye, Mouth, Brow, Hand) in `app/src/engine/parts.tsx` and reuse them for every character.

Process:
- After each character, render stills and LOOK at them:
  - `cd app && npx remotion still Episode ../review/room.png --frame=60`
  - `npx remotion still BookSheet ../review/sheet.png`
  Fix overlaps, misplaced faces and broken limbs.
- Then `python tools/render.py 001 --draft` and check `contact.jpg`: the hosts must stay in their chairs, mouths only move on their own lines, and nothing enters the caption zone.
- ⏸ Show the user before/after stills and wait for approval. Once they approve, the new look is frozen: update the colours in `series/design.md` and the Cast table if any changed.
