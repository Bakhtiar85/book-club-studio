# Design guide: look, feel, venue and themes

Read this before drawing anything: a new character, a scene, a prop or a set change. The show must look like **one consistent cartoon** across every book.

## 1. House style (everything on screen)
- **2D vector, hand-built SVG in React.** No AI images, stock art, photos or three.js.
- **Ink outline** `#2A1A12`, 5–6 px on characters and props, 3–4 px on small details. Backgrounds may drop outlines for depth.
- **Flat colour + one shade** (a darker version of the same hue on the shadow side) + an optional small highlight. No gradients on characters; soft gradients are fine for skies, light and glows.
- **Shapes:** rounded and friendly. No sharp spikes except where the story needs them (a crown, a knife shown as a simple shape).
- **Lighting mood:** warm (golden lamp light, sunsets, candle glow). Night scenes are deep blue/purple, never black.
- **Motion:** gentle bobbing, breathing and blinking; snappy "pop" entrances (overshoot ease); slow camera drifts (zoom 1.00 → 1.08); punch-ins only on key words.
- **Sound:** music stays calm lo-fi/acoustic, never nursery-style jingles or sing-alongs (see `series/bible.md` → Audience (decided)).

## 2. Character proportions and faces
| Type | Head : body | Notes |
|---|---|---|
| Child (Noor, kids in books) | 1 : 2.5 | big round head, big eyes |
| Adult (Baba, Santiago, most cast) | 1 : 3.5 | |
| Elder | 1 : 3.5, slight stoop | white/grey hair, lines at the eyes |
| Animal / creature | head about 40% of body | chibi, cute, never scary |
- **Faces:** white eyes with an ink outline, dark iris, one white highlight; simple curved brows; small nose; rosy cheeks (`#F08A9A`, 60% opacity).
- **Mouths:** closed smile, small "o" and wide open, driven by `mouth.json` for anyone who speaks on screen.
- **Expressions every speaking character needs:** neutral, happy, surprised, worried, skeptical, sad.
- **Skin tones:** natural, varied and true to the book's setting and characters. Never stereotyped.
- **Clothing:** true to the book's place and era, simplified to 2–3 colour blocks. Every character keeps exactly the same outfit and colours in every episode (record them in the book plan's "Cast" table).
- **Family-friendly:** villains are grumpy or sneaky, never gory or frightening. Violence happens off-screen or as a cartoon "poof".

## 3. The venue: the library (permanent)
- A cozy reading room at dusk: an arched window with a moon and stars, red curtains, tall bookshelves on both sides (colourful spines), a warm floor lamp on the left, a round red rug, and a small side table with a teapot and cup.
- **Seats:** Noor in the small red velvet armchair (left); Baba in the big green wingback (right).
- **Always visible:** the top chip (`Book · Part N: Title`), the name tags NOOR / BABA, dust in the window light.
- **Per-book theme prop:** each book adds ONE small prop on the window sill (`BookProp` in its `world.tsx`). The Alchemist has a golden pyramid and an alchemist's flask. It's the only part of the set that changes between books.
- **Seasonal touches** (optional, only when the user asks): e.g. lanterns at Ramadan or snow outside the window in winter. They're temporary and never change the layout.

## 4. Hosts (never change without the user's OK)
| | Noor | Baba |
|---|---|---|
| Look | ~10, pink hijab, yellow cardigan, blue dress, white sneakers, holds the book | dark beard with grey streaks, rectangular glasses, cream kurta, brown sweater vest, grey trousers, brown shoes, cup of chai |
| Palette | `#E86FA0` hijab · `#FFC23C` cardigan · `#8FD0FF` dress | `#2B2420` beard · `#8A5A3C` vest · `#F1E9DA` kurta · chair `#2F6B55` |
| Energy | bouncy, gestures a lot, beams when excited | calm, dry raised eyebrow, sips chai, points when making a point |

## 5. Each book's world (a new "theme" every month)
Every book gets a **world style**, written in its plan (`series/books/<book>.md` → "World style") and drawn in `app/src/books/<book>/world.tsx`:
- **Palette:** 5–7 colours that feel like that book (The Alchemist: desert golds, sky blue, sunset coral, olive green).
- **Places:** the 3–6 recurring locations as reusable components (e.g. hills, ruined church, market, desert, oasis).
- **Cast:** every recurring character as a component with its props (`face`, `walk`, `wave`, `sleep`…), plus a one-line description and colours in the Cast table.
- **Story scenes** must clearly differ from the library: brighter or more saturated, the world of the book. A slight warm vignette shows we're "inside the book".

## 6. Adding new characters (each new book)
1. Write the Cast table first: name, role, age, look, outfit colours, expressions needed.
2. Draw them in `world.tsx` in the house style above, reusing shared parts (eyes, hands) for consistency.
3. Add them to `CharacterSheet` in `world.tsx` and render it: `cd app && npx remotion still BookSheet ../review/sheet.png`.
4. **⏸ Show the user the sheet and wait for approval** before using a new character in an episode. Change only what they ask.
5. Once approved, a character's look is frozen. Write its colours in the Cast table, and only change it if the user asks.

## 7. Quick checklist before rendering
- Does every new element have the ink outline and the flat + shade colouring?
- Is anything in the caption zone (y 1500–1650) or behind the top chip?
- Do characters look the same as in earlier episodes (compare with the BookSheet)?
- Is anything scary, gory or unkind for a 7-year-old viewer? Remove it.
