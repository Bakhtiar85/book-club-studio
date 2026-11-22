"""Create the next episode folder (numbered automatically).
Usage: python tools/new_episode.py <slug> [--book the-alchemist]
e.g.   python tools/new_episode.py alchemist-p2-tangier --book the-alchemist
"""
import datetime, re, sys
from common import APP, EPISODES, load_json, save_json

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit(__doc__)
    slug = re.sub(r"[^a-z0-9-]", "-", args[0].lower()).strip("-")
    book = sys.argv[sys.argv.index("--book") + 1] if "--book" in sys.argv else ""
    eps = sorted(p for p in EPISODES.iterdir() if p.is_dir() and re.match(r"^\d{3}-", p.name))
    num = int(eps[-1].name[:3]) + 1 if eps else 1
    ep = EPISODES / f"{num:03d}-{slug}"
    for d in ("data", "audio", "out"): (ep / d).mkdir(parents=True, exist_ok=True)
    prev = load_json(eps[-1] / "script.json") if eps else None
    script = {
        "book": prev["book"] if prev else "", "author": prev["author"] if prev else "",
        "part": "", "question": "", "vote": {"noor": "", "baba": ""}, "next": "",
        "source": {"book": book, "pages": "", "ends_at": ""},
        "book_open": {"line": 1, "word": "Look"},
        "speakers": prev["speakers"] if prev else {},
        "lines": [],
    }
    bm_p = EPISODES.parent / "library" / book / "bookmark.json"
    if book and bm_p.exists():
        bm = load_json(bm_p)
        script["source"]["pages"] = f"{bm['next_start_page']}-" if bm.get("next_start_page") else ""
        pg = f"page {bm['next_start_page']}, " if bm.get("next_start_page") else ""
        print(f"Bookmark: continue from {pg}next: {bm.get('next_hint')}")
    save_json(ep / "script.json", script)
    save_json(ep / "episode.json", {"id": ep.name, "book": book, "status": "planned", "created": datetime.date.today().isoformat()})
    (ep / "notes.md").write_text(f"# {ep.name}\n\n## Story covered\n\n## Debate (Noor vs Baba)\n\n## Running jokes / callbacks used\n\n## Promised for next episode\n", encoding="utf-8")
    (ep / "publish.md").write_text(
        "# Publish pack\n\n**Title:**\n\n**Description:**\n\n**Hashtags:**\n\n**Pinned comment:**\n\n"
        "## Upload checklist\n"
        "- Audience: No, it's not made for kids\n"
        "- Age restriction: No\n"
        "- Altered/synthetic content disclosure: not needed (clearly animated)\n"
        "- Comments: on; pin the vote comment\n",
        encoding="utf-8")
    sc = APP / "src" / "episodes" / ep.name; sc.mkdir(parents=True, exist_ok=True)
    (sc / "scenes.tsx").write_text('''import React from "react";
import { SceneProps } from "../../engine/cues";
// Build this episode's story scenes here. Reuse characters/places from src/books/<book>/world.tsx
// and helpers from src/engine/kit.tsx + src/engine/scene.tsx. Cue moments with at(word, lineIndex) - s0.

export const SCENES: Record<string, React.FC<SceneProps>> = {};
''', encoding="utf-8")
    print(f"Created {ep}\n  + {sc / 'scenes.tsx'}")

if __name__ == "__main__":
    main()
