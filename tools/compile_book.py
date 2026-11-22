"""Monthly long video: stitch every finished episode of a book (+ its finale) into one video.
Usage: python tools/compile_book.py <book> [--vertical]
  default    16:9 1920x1080 (vertical episodes centred on a blurred copy), best for a regular YouTube video
  --vertical keep 9:16
Output: compilations/<book>/<book>-full.mp4 + chapters.txt (paste into the YouTube description)
Each episode's 2.4 s vote card is cut, except on the last one.
"""
import json, shutil, subprocess, sys
from pathlib import Path
from common import ROOT, EPISODES, load_json, run

def dur(p):
    out = subprocess.run([shutil.which("ffprobe") or "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout
    return float(out.strip())

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit(__doc__)
    book = args[0]; vertical = "--vertical" in sys.argv
    eps = []
    for ep in sorted(p for p in EPISODES.iterdir() if p.is_dir() and p.name[:3].isdigit()):
        s = load_json(ep / "script.json")
        if (s.get("source") or {}).get("book") != book: continue
        mp4 = ep / "out" / f"{ep.name}.mp4"
        if not mp4.exists():
            print(f"  skip {ep.name}: no final render"); continue
        eps.append((ep, s.get("part") or ep.name, mp4))
    if not eps: sys.exit(f"No rendered episodes for '{book}'.")
    out_dir = ROOT / "compilations" / book; out_dir.mkdir(parents=True, exist_ok=True)
    W, H = (1080, 1920) if vertical else (1920, 1080)
    inputs, filters, chapters, t = [], [], [], 0.0
    for k, (ep, part, mp4) in enumerate(eps):
        d = dur(mp4) - (0 if k == len(eps) - 1 else 2.4)
        inputs += ["-t", f"{d:.3f}", "-i", str(mp4)]
        m, s_ = divmod(int(t), 60); h, m = divmod(m, 60)
        chapters.append((f"{h}:{m:02d}:{s_:02d}" if h else f"{m}:{s_:02d}") + f" {part}")
        if vertical:
            filters.append(f"[{k}:v]scale={W}:{H},setsar=1,fps=30[v{k}]")
        else:
            filters.append(f"[{k}:v]split[a{k}][b{k}];[a{k}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},boxblur=40:4,eq=brightness=-0.12[bg{k}];"
                           f"[b{k}]scale=-2:{H}[fg{k}];[bg{k}][fg{k}]overlay=(W-w)/2:0,setsar=1,fps=30[v{k}]")
        filters.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo[a{k}x]")
        t += d
    concat = "".join(f"[v{k}][a{k}x]" for k in range(len(eps))) + f"concat=n={len(eps)}:v=1:a=1[v][a]"
    out = out_dir / f"{book}-full.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filters + [concat]), "-map", "[v]", "-map", "[a]",
         "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)])
    if not chapters[0].startswith("0:00"): chapters[0] = "0:00" + chapters[0][chapters[0].index(" "):]
    (out_dir / "chapters.txt").write_text("\n".join(chapters) + "\n", encoding="utf-8")
    print(f"\n{out}  ({t / 60:.1f} min)\nChapters (paste into the description):\n" + "\n".join(chapters))

if __name__ == "__main__":
    main()
