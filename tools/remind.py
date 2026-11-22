"""Desktop reminder (run by the OS scheduler, Mon + Thu). Usage: python tools/remind.py
Shows a small pop-up with what's next. Uses only the Python standard library (tkinter)."""
import datetime, re
from common import EPISODES, SERIES, load_json

def summary():
    eps = sorted(p for p in EPISODES.iterdir() if p.is_dir() and re.match(r"^\d{3}-", p.name))
    pub, rendered = [], []
    for ep in eps:
        m = load_json(ep / "episode.json") if (ep / "episode.json").exists() else {}
        if m.get("published_on"): pub.append(m["published_on"])
        if m.get("status") == "rendered": rendered.append(ep.name[:3])
    nxt = ""
    for f in sorted((SERIES / "books").glob("*.md")):
        for line in f.read_text(encoding="utf-8").splitlines():
            if "📝" in line and line.startswith("|"):
                cells = [c.strip() for c in line.strip("|").split("|")]
                nxt = f"{f.stem.replace('-', ' ').title()} · Part {cells[0]}: {cells[1]}"; break
        if nxt: break
    lines = ["🎬 Book Club time!"]
    if nxt: lines.append(f"Next up: {nxt}")
    else: lines.append("Book finished! Month-end: /compile-book <book>, then /new-book <next title>")
    for bmf in sorted((SERIES.parent / "library").glob("*/bookmark.json")):
        bm = load_json(bmf)
        if bm.get("last_event"):
            pg = f" (p.{bm['covered_to_page']})" if bm.get("covered_to_page") else ""
            lines.append(f"Left off: {bm['last_event']}{pg}")
            break
    if rendered: lines.append(f"Ready to upload: episode {', '.join(rendered)} (then /published)")
    if pub:
        days = (datetime.date.today() - max(datetime.date.fromisoformat(d) for d in pub)).days
        lines.append(f"Last upload: {days} day{'s' if days != 1 else ''} ago")
    lines.append("Open Claude Code in book-club-studio → /next-episode")
    return "\n".join(lines)

if __name__ == "__main__":
    msg = summary()
    try:
        import tkinter as tk
        from tkinter import messagebox
        root = tk.Tk(); root.withdraw(); root.attributes("-topmost", True)
        messagebox.showinfo("Book Club with Noor & Baba", msg); root.destroy()
    except Exception:
        print(msg)
