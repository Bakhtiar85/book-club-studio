"""First-time setup. Safe to re-run. Usage: python tools/setup.py"""
import subprocess, sys, shutil, urllib.request
from pathlib import Path
from common import ROOT, APP, config, run

MODELS = {
    "kokoro-v1.0.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx",
    "voices-v1.0.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
ok = True
def line(name, good, msg):
    global ok
    ok = ok and good
    print(f"[{'OK' if good else '!!'}] {name}: {msg}")

def ver(cmd):
    try:
        return subprocess.run([shutil.which(cmd[0]) or cmd[0], *cmd[1:]], capture_output=True, text=True).stdout.strip().splitlines()[0]
    except Exception:
        return None

v = ver(["node", "--version"])
line("node", bool(v) and int(v.lstrip("v").split(".")[0]) >= 20, v or "missing — install Node 20+ from nodejs.org")
line("ffmpeg", bool(ver(["ffmpeg", "-version"])), "found" if ver(["ffmpeg", "-version"]) else "missing — Windows: winget install Gyan.FFmpeg | macOS: brew install ffmpeg")
line("python", sys.version_info >= (3, 9), sys.version.split()[0])

print("\nInstalling Python packages (kokoro-onnx, numpy, scipy, soundfile, pypdf)...")
if subprocess.run([sys.executable, "-m", "pip", "--version"], capture_output=True).returncode != 0:
    subprocess.run([sys.executable, "-m", "ensurepip", "--upgrade"])  # some Pythons ship without pip
r = subprocess.run([sys.executable, "-m", "pip", "install", "-q", "kokoro-onnx", "numpy", "scipy", "soundfile", "pypdf"])
if r.returncode != 0:
    r = subprocess.run([sys.executable, "-m", "pip", "install", "-q", "--break-system-packages", "kokoro-onnx", "numpy", "scipy", "soundfile", "pypdf"])
line("python packages", r.returncode == 0, "installed" if r.returncode == 0 else "pip failed — see output above")

kd = Path(config()["kokoro_dir"]); kd.mkdir(parents=True, exist_ok=True)
for name, url in MODELS.items():
    f = kd / name
    if f.exists() and f.stat().st_size > 1_000_000:
        line(name, True, f"present ({f.stat().st_size // 1_000_000} MB)"); continue
    print(f"Downloading {name} ...")
    try:
        urllib.request.urlretrieve(url, f)
        line(name, True, f"downloaded to {f}")
    except Exception as e:
        line(name, False, f"download failed ({e}); download it manually from {url} into {kd}")

if not (APP / "node_modules").exists():
    print("\nInstalling Remotion app dependencies (npm install)...")
    r = run(["npm", "install"], cwd=APP, check=False)
    line("npm install", r.returncode == 0, "done" if r.returncode == 0 else "failed")
else:
    line("npm install", True, "node_modules present")

fonts_src = APP / "node_modules" / "@fontsource" / "fredoka" / "files"
fonts_dst = APP / "public" / "fonts"; fonts_dst.mkdir(parents=True, exist_ok=True)
for w in ("500", "700"):
    name = f"fredoka-latin-{w}-normal.woff2"
    if (fonts_src / name).exists() and not (fonts_dst / name).exists():
        shutil.copy(fonts_src / name, fonts_dst / name)
line("fonts", all((fonts_dst / f"fredoka-latin-{w}-normal.woff2").exists() for w in ("500", "700")), str(fonts_dst))

print("\nAll set." if ok else "\nSome items need attention (marked !!).")
