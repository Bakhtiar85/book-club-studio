"""Originality check: flags any 8+ word run in the script that also appears in the book's text.
Usage: python tools/originality.py <episode>   (voice.py runs this automatically)

Allowed: ONE short direct quote per episode, marked on its line as  "quote": "exact words"  (max 15 words).
Exit code 1 if anything needs rewriting.
"""
import re, sys
from common import ROOT, find_episode, load_json

N = 8

def words(t):
    return re.findall(r"[a-z0-9']+", t.lower().replace("’", "'"))

def check(ep, verbose=True):
    S = load_json(ep / "script.json")
    book = (S.get("source") or {}).get("book")
    full = ROOT / "library" / (book or "") / "full.txt"
    if not book or not full.exists():
        if verbose: print("originality: no book text for this episode (skipped)")
        return True
    src = words(re.sub(r"=== page \d+ ===", " ", full.read_text(encoding="utf-8")))
    grams = {tuple(src[i:i + N]) for i in range(len(src) - N + 1)}
    problems, quotes = [], []
    for i, L in enumerate(S["lines"]):
        if L.get("quote"):
            q = words(L["quote"]); quotes.append(i)
            if len(q) > 15: problems.append(f"line {i}: quote is {len(q)} words (max 15)")
        w = words(L["text"]); allowed = words(L.get("quote", ""))
        hit = [False] * len(w)
        for k in range(len(w) - N + 1):
            if tuple(w[k:k + N]) in grams:
                for j in range(k, k + N): hit[j] = True
        k = 0
        while k < len(w):
            if hit[k]:
                j = k
                while j < len(w) and hit[j]: j += 1
                span = w[k:j]; s = " ".join(span)
                if not (allowed and s in " ".join(allowed)):
                    problems.append(f"line {i}: copies the book ({len(span)} words): \"{s}\"")
                k = j
            else:
                k += 1
    if len(quotes) > 1: problems.append(f"{len(quotes)} quotes marked (lines {quotes}); max one per episode")
    if verbose:
        print("originality: OK, no copied passages" if not problems else "originality: REWRITE NEEDED\n  " + "\n  ".join(problems))
    return not problems

if __name__ == "__main__":
    ok = check(find_episode(sys.argv[1] if len(sys.argv) > 1 else "latest"))
    sys.exit(0 if ok else 1)
