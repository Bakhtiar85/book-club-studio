"""Render an episode end to end.
Usage: python tools/render.py <episode> [--draft]
  --draft  half-size quick render (episodes/<id>/out/draft.mp4), for checking
Produces episodes/<id>/out/<id>.mp4 (+ contact.jpg sheet, cover.jpg thumbnail frame)
"""
import datetime, sys
from pathlib import Path
from common import APP, config, find_episode, load_json, save_json, run
from use_episode import use

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    draft = "--draft" in sys.argv
    ep = use(args[0] if args else "latest")
    cfg = config()
    out = ep / "out"; out.mkdir(exist_ok=True)
    if not (ep / "audio" / "mix.wav").exists():
        run([sys.executable, str(Path(__file__).parent / "mix.py"), ep.name])
    silent = out / ("draft_silent.mp4" if draft else "silent.mp4")
    cmd = ["npx", "remotion", "render", "src/index.ts", "Episode", str(silent), "--crf=18"]
    if draft: cmd.append("--scale=0.5")
    if cfg.get("render_concurrency"): cmd.append(f"--concurrency={cfg['render_concurrency']}")
    if cfg.get("remotion_gl"): cmd.append(f"--gl={cfg['remotion_gl']}")
    if cfg.get("browser_executable"): cmd.append(f"--browser-executable={cfg['browser_executable']}")
    run(cmd, cwd=APP)
    final = out / (f"draft.mp4" if draft else f"{ep.name}.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", silent, "-i", ep / "audio" / "mix.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", final])
    run(["ffmpeg", "-v", "error", "-y", "-i", final, "-vf", "fps=2,scale=150:-1,tile=12x9", "-frames:v", "1", out / "contact.jpg"])
    D = load_json(ep / "data" / "lines.json")
    nar = [l for l in D["lines"] if l["who"] == "narrator"]
    cover_t = (nar[0]["start"] + 2.0) if nar else 2.0
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{cover_t:.2f}", "-i", final, "-frames:v", "1", out / "cover.jpg"])
    silent.unlink(missing_ok=True)
    if not draft:
        meta_p = ep / "episode.json"
        meta = load_json(meta_p) if meta_p.exists() else {}
        if meta.get("status") != "published":
            meta["status"] = "rendered"
        meta["rendered_at"] = datetime.date.today().isoformat()
        save_json(meta_p, meta)
    print(f"\nDone: {final}\nCheck: {out / 'contact.jpg'}")

if __name__ == "__main__":
    main()
