"""Shared helpers for the Book Club studio tools. Works on Windows, macOS and Linux."""
import json, os, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"
EPISODES = ROOT / "episodes"
SERIES = ROOT / "series"
ASSETS = ROOT / "assets"
IS_WIN = os.name == "nt"


def config():
    cfg = json.loads((ROOT / "studio.config.json").read_text(encoding="utf-8"))
    cfg["kokoro_dir"] = str(Path(os.path.expanduser(cfg.get("kokoro_dir") or "~/.book-club/kokoro")))
    return cfg


def run(cmd, cwd=None, check=True):
    """Run a command list; resolves npx/npm/ffmpeg on Windows too."""
    exe = cmd[0]
    if IS_WIN and exe == "ffmpeg":
        # Try to find ffmpeg in common locations
        candidates = [
            r"C:\Program Files\ffmpeg\bin\ffmpeg.exe",
            r"C:\ffmpeg\bin\ffmpeg.exe",
            r"C:\Program Files\Softdeluxe\Free Download Manager\ffmpeg.exe",
        ]
        exe = next((c for c in candidates if Path(c).exists()), None) or shutil.which("ffmpeg") or cmd[0]
    else:
        exe = shutil.which(exe) or exe
    args = [exe, *[str(c) for c in cmd[1:]]]
    print("  $", " ".join(str(c) for c in cmd))
    if IS_WIN and exe.lower().endswith((".cmd", ".bat")):  # npm/npx on Windows are .cmd scripts
        return subprocess.run(subprocess.list2cmdline(args), cwd=cwd, check=check, shell=True)
    return subprocess.run(args, cwd=cwd, check=check)


def find_episode(ref: str) -> Path:
    """'latest', '001', '1', or a full folder name -> episode folder."""
    eps = sorted(p for p in EPISODES.iterdir() if p.is_dir() and re.match(r"^\d{3}-", p.name))
    if not eps:
        sys.exit("No episodes yet. Create one with: python tools/new_episode.py <slug>")
    if ref in ("latest", "", None):
        return eps[-1]
    if ref.isdigit():
        ref = f"{int(ref):03d}"
    for p in eps:
        if p.name == ref or p.name.startswith(ref + "-"):
            return p
    sys.exit(f"Episode '{ref}' not found. Have: {', '.join(p.name for p in eps)}")


def load_json(p: Path):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def save_json(p: Path, data):
    Path(p).write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding="utf-8")
