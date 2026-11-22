"""Book library + reading position (bookmark).

  python tools/book.py ingest  <book> <file.pdf>   copy the PDF into library/<book>/ and extract its text by page
  python tools/book.py where   <book>              where we left off + what comes next
  python tools/book.py pages   <book> 33-41        print those pages (to read the next chunk)
  python tools/book.py find    <book> "Tangier"    which pages mention a word/phrase
  python tools/book.py advance <book> --episode 002 --pages 33-48 --event "..." --next "..."
                                                   move the bookmark after an episode is made

<book> is the slug used in series/books/<book>.md, e.g. the-alchemist.
The PDF and extracted text stay private on this computer (git-ignored, never shown in videos).
"""
import datetime, re, shutil, sys
from pathlib import Path
from common import ROOT, load_json, save_json

LIB = ROOT / "library"

def bdir(book):
    d = LIB / book; d.mkdir(parents=True, exist_ok=True); return d

def bookmark(book):
    p = bdir(book) / "bookmark.json"
    if p.exists(): return load_json(p)
    return {"book": book, "has_pdf": False, "pages": None, "last_episode": None, "covered_to_page": None,
            "next_start_page": 1, "last_event": None, "next_hint": None, "history": []}

def save_bookmark(book, bm):
    save_json(bdir(book) / "bookmark.json", bm)

def ingest(book, pdf):
    from pypdf import PdfReader
    d = bdir(book); src = d / "source.pdf"
    if Path(pdf).resolve() != src.resolve(): shutil.copy(pdf, src)
    reader = PdfReader(str(src))
    tdir = d / "text"; tdir.mkdir(exist_ok=True)
    full, empty, chapters = [], 0, []
    chap_re = re.compile(r"^\s*(chapter|part|book|prologue|epilogue)\b.*$|^\s*[IVXLC]{1,6}\.?\s*$", re.I)
    for i, page in enumerate(reader.pages, 1):
        txt = (page.extract_text() or "").strip()
        if len(txt) < 40: empty += 1
        (tdir / f"p{i:04d}.txt").write_text(txt, encoding="utf-8")
        full.append(f"\n=== page {i} ===\n{txt}")
        for line in txt.splitlines()[:6]:
            if chap_re.match(line) and len(line) < 60:
                chapters.append({"title": line.strip(), "page": i}); break
    (d / "full.txt").write_text("".join(full), encoding="utf-8")
    n = len(reader.pages)
    save_json(d / "index.json", {"pages": n, "empty_pages": empty, "chapters": chapters,
                                 "ingested": datetime.date.today().isoformat()})
    bm = bookmark(book); bm["has_pdf"] = True; bm["pages"] = n; save_bookmark(book, bm)
    print(f"{book}: {n} pages, {len(chapters)} chapter headings found, {empty} pages without text")
    if empty > n * 0.3:
        print("WARNING: many pages have no text. This looks like a scanned PDF and needs OCR first "
              "(e.g. `ocrmypdf in.pdf out.pdf`), then ingest again.")
    for c in chapters[:40]: print(f"  p.{c['page']:>4}  {c['title']}")

def pages(book, rng):
    a, _, b = rng.partition("-"); a = int(a); b = int(b or a)
    for i in range(a, b + 1):
        f = LIB / book / "text" / f"p{i:04d}.txt"
        if f.exists(): print(f"\n=== page {i} ===\n" + f.read_text(encoding="utf-8"))

def find(book, phrase):
    tdir = LIB / book / "text"
    if not tdir.exists(): sys.exit("No text yet: ingest the PDF first.")
    q = phrase.lower(); hits = 0
    for f in sorted(tdir.glob("p*.txt")):
        t = f.read_text(encoding="utf-8"); low = t.lower(); k = low.find(q)
        if k >= 0:
            hits += 1; snip = t[max(0, k - 60):k + len(q) + 60].replace("\n", " ")
            print(f"p.{int(f.stem[1:]):>4}: …{snip}…")
    print(f"{hits} page(s)")

def where(book):
    bm = bookmark(book)
    if not (bdir(book) / "bookmark.json").exists(): save_bookmark(book, bm)
    print(f"Book: {book}   PDF: {'yes, ' + str(bm['pages']) + ' pages' if bm['has_pdf'] else 'no (working from the plan only)'}")
    print(f"Last episode: {bm['last_episode'] or '-'}")
    print(f"Covered up to: page {bm['covered_to_page'] or '-'}, \"{bm['last_event'] or '-'}\"")
    print(f"Continue from: page {bm['next_start_page'] or '-'}, next: \"{bm['next_hint'] or '-'}\"")
    if bm["has_pdf"] and bm["next_start_page"]:
        idx = load_json(LIB / book / "index.json")
        nxt = [c for c in idx["chapters"] if c["page"] >= bm["next_start_page"]][:2]
        if nxt: print("Upcoming headings: " + "; ".join(f"p.{c['page']} {c['title']}" for c in nxt))

def advance(book, args):
    def opt(k):
        return args[args.index(k) + 1] if k in args else None
    bm = bookmark(book); ep = opt("--episode"); rng = opt("--pages")
    a = b = None
    if rng:
        a, _, b = rng.partition("-"); a = int(a); b = int(b or a)
    bm["history"] = [h for h in bm["history"] if h.get("episode") != ep] + [
        {"episode": ep, "pages": rng, "event": opt("--event"), "date": datetime.date.today().isoformat()}]
    bm["last_episode"] = ep; bm["last_event"] = opt("--event") or bm["last_event"]
    bm["next_hint"] = opt("--next") or bm["next_hint"]
    if b: bm["covered_to_page"] = b; bm["next_start_page"] = b + 1
    save_bookmark(book, bm); where(book)

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    cmd, book = a[0], a[1]
    if cmd == "ingest": ingest(book, a[2])
    elif cmd == "pages": pages(book, a[2])
    elif cmd == "find": find(book, " ".join(a[2:]))
    elif cmd == "where": where(book)
    elif cmd == "advance": advance(book, a[2:])
    else: sys.exit(__doc__)
