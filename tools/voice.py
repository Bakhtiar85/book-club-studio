"""Generate all voices + timing data for an episode.
Usage: python tools/voice.py <episode: latest|001|folder-name>
Reads  episodes/<id>/script.json
Writes episodes/<id>/audio/dialogue.wav, episodes/<id>/data/{lines,words,mouth}.json
"""
import re, sys
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from common import config, find_episode, load_json, save_json

SR, FPS = 24000, 30
LEAD, GAP, OUTRO = 0.25, 0.32, 0.3

def trim(x, thr=0.008):
    i = np.where(np.abs(x) > thr)[0]
    return x[max(0, i[0] - 240):min(len(x), i[-1] + 720)] if len(i) else x

def main():
    ep = find_episode(sys.argv[1] if len(sys.argv) > 1 else "latest")
    S = load_json(ep / "script.json")
    from originality import check
    if not check(ep) and "--force" not in sys.argv:
        sys.exit("Fix the lines above (rewrite in your own words), then run voice.py again.")
    from kokoro_onnx import Kokoro
    kd = Path(config()["kokoro_dir"])
    k = Kokoro(str(kd / "kokoro-v1.0.onnx"), str(kd / "voices-v1.0.bin"))

    t = LEAD; segs = []; lines = []
    for i, L in enumerate(S["lines"]):
        sp = S["speakers"][L["who"]]
        lang = "en-gb" if sp["voice"].startswith("b") else "en-us"
        a = np.asarray(k.create(L["text"], voice=sp["voice"], speed=sp.get("speed", 1.0), lang=lang)[0], dtype=np.float64)
        a = trim(a)
        if sp.get("pitch"):  # resample: higher pitch (younger voice)
            a = np.interp(np.arange(0, len(a), sp["pitch"]), np.arange(len(a)), a)
        segs.append((t, a)); d = len(a) / SR
        lines.append({k2: v for k2, v in {"i": i, "who": L["who"], "scene": L.get("scene"), "text": L["text"],
                      "start": round(t, 3), "end": round(t + d, 3), "fx": L.get("fx"), "ambience": L.get("ambience"),
                      "sfx": L.get("sfx")}.items() if v is not None})
        t += d + L.get("gap", GAP)
        print(f"  {lines[-1]['start']:6.2f}  {L['who']:8} {L['text']}")
    dur = t + OUTRO
    out = np.zeros(int(dur * SR))
    for s, a in segs:
        out[int(s * SR):int(s * SR) + len(a)] += a
    out = out / max(1e-6, np.abs(out).max()) * 0.9
    (ep / "audio").mkdir(exist_ok=True); (ep / "data").mkdir(exist_ok=True)
    wavfile.write(ep / "audio" / "dialogue.wav", SR, (out * 32000).astype(np.int16))

    nf = int(np.ceil(dur * FPS)); hop = SR // FPS
    mouth = {w: [0.0] * nf for w in S["speakers"]}
    for L, (s, a) in zip(lines, segs):
        for f in range(int(s * FPS), min(nf, int((s + len(a) / SR) * FPS) + 1)):
            seg = out[f * hop:(f + 1) * hop]
            mouth[L["who"]][f] = float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0
    for w in mouth:
        m = np.array(mouth[w]); mx = np.percentile(m[m > 0], 95) if (m > 0).any() else 1
        mouth[w] = [round(min(1, x / mx), 3) for x in m]

    words = []
    for L in lines:  # spread words through the line by length (+ pauses on punctuation)
        ws = L["text"].split()
        wl = [len(re.sub(r"\W", "", w)) + 1 + (4 if re.search(r"[,.!?]$", w) else 0) for w in ws]
        tot = sum(wl); c = L["start"]; D = L["end"] - L["start"]
        for w, l in zip(ws, wl):
            d = D * l / tot
            words.append({"w": w, "line": L["i"], "who": L["who"], "s": round(c, 3), "e": round(c + d * 0.85, 3)}); c += d

    meta = {k2: S[k2] for k2 in ("book", "author", "part", "question", "vote", "next", "book_open")}
    meta.update({"id": ep.name, "duration": round(dur, 3), "lines": lines})
    save_json(ep / "data" / "lines.json", meta)
    save_json(ep / "data" / "words.json", words)
    save_json(ep / "data" / "mouth.json", mouth)
    # validate cue words exist
    norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
    bad = []
    for L in lines:
        for f in (L.get("fx") or []) + (L.get("sfx") or []):
            if not any(w["line"] == L["i"] and norm(w["w"]) == norm(f["on"]) for w in words):
                bad.append(f"line {L['i']}: '{f['on']}'")
    bo = S["book_open"]
    if not any(w["line"] == bo["line"] and norm(w["w"]) == norm(bo["word"]) for w in words):
        bad.append(f"book_open: '{bo['word']}' not in line {bo['line']}")
    print(f"\nDuration {dur:.1f}s (+2.4s end card = {dur + 2.4:.1f}s)")
    if dur + 2.4 > 60:
        print("WARNING: over 60s — trim the script for Shorts.")
    if bad:
        sys.exit("Cue words not found: " + "; ".join(bad))

if __name__ == "__main__":
    main()
