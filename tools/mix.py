"""Sound effects + music + voices -> episodes/<id>/audio/mix.wav
Usage: python tools/mix.py <episode>

Cues come from the episode data (fx, sfx, ambience in script.json). Every named sound is
synthesised, BUT if assets/sfx/<name>.wav|mp3|ogg exists, the real file is used instead.
Music: first file in assets/music/ (looped, ducked under voices); otherwise a soft synth bed.
Sound names: pop whoosh pageflip chime shimmer baa clink dundun coins thud gasp laugh
Ambiences:  day night sea town desert indoor wind none
"""
import subprocess, shutil, sys, tempfile
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter
from common import ASSETS, find_episode, load_json

SR = 48000
rng = np.random.default_rng(11)

def decode(path: Path):
    """Any audio file -> mono float array at SR (via ffmpeg)."""
    with tempfile.TemporaryDirectory() as d:
        out = Path(d) / "x.wav"
        subprocess.run([shutil.which("ffmpeg") or "ffmpeg", "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", str(SR), str(out)], check=True)
        sr, a = wavfile.read(out)
    a = a.astype(np.float64)
    return a / 32768 if np.abs(a).max() > 2 else a

def real_sound(name):
    for ext in ("wav", "mp3", "ogg", "flac"):
        p = ASSETS / "sfx" / f"{name}.{ext}"
        if p.exists():
            return decode(p)
    return None

def main():
    ep = find_episode(sys.argv[1] if len(sys.argv) > 1 else "latest")
    D = load_json(ep / "data" / "lines.json"); L = D["lines"]; END = D["duration"] + 2.4
    W = load_json(ep / "data" / "words.json")
    norm = lambda x: "".join(c for c in x.lower() if c.isalnum())
    wd = lambda w, i: next(x["s"] for x in W if x["line"] == i and norm(x["w"]) == norm(w))
    N = int(END * SR) + SR
    fx = np.zeros(N); mus = np.zeros(N)

    def add(buf, s, t, g):
        i = max(0, int(t * SR)); j = min(len(buf), i + len(s))
        if j > i: buf[i:j] += s[:j - i] * g
    def env(n, a, r):
        t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / r)
    def filt(x, lo=None, hi=None):
        if lo and hi: b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], "band")
        elif hi: b, a = butter(2, hi / (SR / 2), "low")
        else: b, a = butter(2, lo / (SR / 2), "high")
        return lfilter(b, a, x)
    noise = lambda d: rng.standard_normal(int(d * SR))
    def bell(f, d=1.0, r=0.3):
        n = int(d * SR); t = np.arange(n) / SR
        return (np.sin(2*np.pi*f*t) + 0.3*np.sin(2*np.pi*2.01*f*t) + 0.1*np.sin(2*np.pi*3*f*t)) * env(n, 0.003, r)

    # ---- synthesised sound library ----
    def s_pop(t, g=0.16):
        n = int(0.12*SR); tt = np.arange(n)/SR; f = 300+1500*tt/0.12
        add(fx, np.sin(2*np.pi*np.cumsum(f)/SR)*env(n, 0.002, 0.04), t, g)
    def s_whoosh(t, g=0.08, d=0.6):
        s = filt(noise(d), 300, 3500); n = len(s); x = np.arange(n)/n; add(fx, s*np.sin(np.pi*x)**2*(0.4+x), t, g)
    def s_pageflip(t, g=0.12):
        for k, (d, dl) in enumerate([(0.09, 0), (0.16, 0.07)]):
            s = filt(noise(d), 1500, 7000); add(fx, s*env(len(s), 0.004, d/3), t+dl, g*(1-0.3*k))
    def s_chime(t, g=0.07, base=784, k=5):
        for i, m in enumerate([1, 1.25, 1.5, 2, 2.5][:k]): add(fx, bell(base*m), t+i*0.07, g)
    def s_shimmer(t, g=0.05, d=1.0):
        for _ in range(18): add(fx, bell(1500+rng.random()*2800, 0.5, 0.12), t+rng.random()*d, g*rng.random())
    def s_baa(t, g=0.05, f0=340):
        d = 0.7; n = int(d*SR); tt = np.arange(n)/SR
        f = f0*(1+0.06*np.sin(2*np.pi*7*tt))*(1-0.1*tt); ph = 2*np.pi*np.cumsum(f)/SR
        saw = sum(np.sin(k*ph)/k for k in range(1, 14))
        s = filt(saw, 600, 1100)*1.6 + filt(saw, 2200, 3000)*0.8
        add(fx, s*np.minimum(1, tt/0.06)*np.minimum(1, (d-tt)/0.2), t, g)
    def s_clink(t, g=0.05):
        for f in (2637, 3520, 4186): add(fx, bell(f, 0.5, 0.08), t, g)
    def s_dundun(t, g=0.12):
        for f, dl in ((98, 0), (92.5, 0.38)):
            n = int(0.9*SR); tt = np.arange(n)/SR
            add(fx, sum(np.sin(2*np.pi*f*h*tt)/h for h in (1, 2, 3))*env(n, 0.005, 0.35), t+dl, g)
    def s_coins(t, g=0.05):
        for i in range(7): add(fx, bell(2500+rng.random()*2500, 0.4, 0.06), t+i*0.05+rng.random()*0.03, g)
    def s_thud(t, g=0.2):
        n = int(0.3*SR); tt = np.arange(n)/SR; add(fx, np.sin(2*np.pi*(90-40*tt)*tt)*env(n, 0.002, 0.08), t, g)
    def s_gasp(t, g=0.06):
        s = filt(noise(0.35), 800, 3000); add(fx, s*np.sin(np.pi*np.arange(len(s))/len(s)), t, g)
    def s_laugh(t, g=0.05):
        for i in range(4):
            n = int(0.12*SR); tt = np.arange(n)/SR; add(fx, filt(np.sin(2*np.pi*(420-i*20)*tt)*np.sin(np.pi*tt/0.12), 300, 2500), t+i*0.16, g)
    LIB = dict(pop=s_pop, whoosh=s_whoosh, pageflip=s_pageflip, chime=s_chime, shimmer=s_shimmer, baa=s_baa,
               clink=s_clink, dundun=s_dundun, coins=s_coins, thud=s_thud, gasp=s_gasp, laugh=s_laugh)
    real = {}
    def play(name, t, g=None):
        if name not in real: real[name] = real_sound(name)
        if real[name] is not None:
            add(fx, real[name], t, 0.5 if g is None else g * 3); return
        if name not in LIB: print(f"  (unknown sound '{name}' skipped)"); return
        LIB[name](t) if g is None else LIB[name](t, g)

    def amb(kind, t0, t1):
        if t1 <= t0 or kind in (None, "none"): return
        r = real_sound(f"amb_{kind}")
        def bed(s, g):
            n = len(s); e = np.minimum(1, np.minimum(np.arange(n), n-np.arange(n))/(0.4*SR)); add(fx, s*e, t0, g)
        if r is not None:
            reps = int(np.ceil((t1-t0)*SR/len(r))); bed(np.tile(r, reps)[:int((t1-t0)*SR)], 0.35); return
        d = t1 - t0
        if kind == "day":
            bed(filt(noise(d), 300, 1500), 0.01)
            for _ in range(int(d*2)):
                tb = t0+0.3+rng.random()*max(0.1, d-0.8)
                for k in range(rng.integers(2, 4)):
                    n = int(0.09*SR); tt = np.arange(n)/SR; f = 2800+900*np.sin(np.pi*tt/0.09)+rng.random()*600
                    add(fx, np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/0.09), tb+k*0.11, 0.03)
        elif kind == "night":
            bed(filt(noise(d), 150, 600), 0.01); t = t0
            while t < t1-0.3:
                for k in range(3):
                    n = int(0.03*SR); tt = np.arange(n)/SR; add(fx, np.sin(2*np.pi*4300*tt)*np.sin(np.pi*tt/0.03), t+k*0.045, 0.018)
                t += 0.4+rng.random()*0.3
        elif kind == "sea":
            s = filt(noise(d), 100, 900); lfo = 0.6+0.4*np.sin(2*np.pi*0.25*np.arange(len(s))/SR); bed(s*lfo, 0.02)
        elif kind in ("town", "market"):
            bed(filt(noise(d), 200, 1200), 0.012)
            for _ in range(int(d*3)): s_pop(t0+rng.random()*d, 0.02)
        elif kind in ("desert", "wind"):
            s = filt(noise(d), 200, 1200); lfo = 0.5+0.5*np.sin(2*np.pi*0.15*np.arange(len(s))/SR); bed(s*lfo, 0.016)
        elif kind == "indoor":
            bed(filt(noise(d), 80, 400), 0.006)

    # ---- timeline (mirrors app/src/engine/Main.tsx) ----
    nar = [l for l in L if l["who"] == "narrator"]
    after = L[L.index(nar[-1]) + 1]
    T1 = nar[0]["start"] - 0.5; T2 = after["start"] - 0.55; ENDAT = L[-1]["end"] + 0.15
    bo = D["book_open"]; BOOK = wd(bo["word"], bo["line"]) - 0.05
    # library room
    amb("indoor", 0, T1 + 0.3); amb("indoor", T2, END)
    t = 0.2
    while t < END - 0.3:
        if t < T1 or t > T2 + 0.6:
            s = filt(noise(0.015), 2000, 6000); add(fx, s*env(len(s), 0.001, 0.004), t, 0.02)
        t += 1.0
    play("clink", 0.05)
    play("pop", BOOK, 0.15); play("whoosh", BOOK, 0.07); play("chime", BOOK + 0.3, 0.08); play("shimmer", BOOK + 0.3, 0.05)
    play("whoosh", T1 - 0.1, 0.1)
    for i, l in enumerate(nar):
        s0 = T1 if i == 0 else l["start"] - 0.4
        s1 = T2 + 0.4 if i == len(nar) - 1 else nar[i + 1]["start"] - 0.4
        if i > 0: play("pageflip", s0, 0.14)
        amb(l.get("ambience"), s0, s1)
    play("whoosh", T2 - 0.1, 0.09); play("pageflip", T2 + 0.3, 0.1); play("pop", T2 + 0.95, 0.12)
    for l in L:
        for f in l.get("fx") or []:
            tt = wd(f["on"], l["i"])
            if f.get("punch") or f.get("shake"): play("whoosh", tt - 0.2, 0.05)
            if f.get("react"): play("pop", tt - 0.05, 0.16)
            if f.get("sound"): play(f["sound"], tt - 0.05)
        for f in l.get("sfx") or []:
            play(f["sound"], wd(f["on"], l["i"]) + 0.05)
    play("pop", ENDAT, 0.18); play("chime", ENDAT + 0.1, 0.07)

    # ---- music bed ----
    AUDIO = (".mp3", ".wav", ".ogg", ".flac", ".m4a")
    tracks = sorted(p for p in (ASSETS / "music").glob("*") if p.suffix.lower() in AUDIO) if (ASSETS / "music").exists() else []
    if tracks:
        m = decode(tracks[0]); m = np.tile(m, int(np.ceil(N / len(m))))[:N]
        mus = m / max(1e-6, np.abs(m).max()) * 0.25
        print(f"  music: {tracks[0].name}")
    else:
        bpm = 84; beat = 60 / bpm
        prog = [[261.63, 329.63, 392.0], [196.0, 246.94, 293.66], [220.0, 261.63, 329.63], [174.61, 220.0, 261.63]]
        def pluck(f, d=1.2):
            n = int(d*SR); t = np.arange(n)/SR
            return (np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*2*f*t)+0.08*np.sin(2*np.pi*3*f*t))*env(n, 0.004, 0.45)
        def pad(fs, d):
            n = int(d*SR); t = np.arange(n)/SR
            s = sum(np.sin(2*np.pi*f*t)+0.3*np.sin(2*np.pi*f*1.003*t) for f in fs)/len(fs)
            return s*np.minimum(1, t/0.4)*np.minimum(1, (d-t)/0.4)
        t = 0.0; bar = 0
        while t < END:
            ch = prog[bar % 4]; add(mus, pad([f/2 for f in ch], beat*4), t, 0.05)
            add(mus, pluck(ch[0]/4, beat*2), t, 0.12); add(mus, pluck(ch[0]/4, beat*2), t+beat*2, 0.09)
            for k, ix in enumerate([0, 1, 2, 1, 0, 2, 1, 2]):
                add(mus, pluck(ch[ix]*(2 if k % 4 == 2 else 1)), t+k*beat/2, 0.07*(1 if k % 2 == 0 else 0.75))
            t += beat*4; bar += 1
        mus = filt(mus, hi=3500)

    # ---- voices + ducking + master ----
    sr, v = wavfile.read(ep / "audio" / "dialogue.wav"); v = v.astype(np.float64)/32768
    v = np.interp(np.arange(int(len(v)*SR/sr))*sr/SR, np.arange(len(v)), v)
    voice = np.zeros(N); voice[:len(v)] = v[:N]
    hop = int(0.02*SR); ev = np.sqrt(np.convolve(voice**2, np.ones(hop)/hop, "same"))
    duck = 1-0.55*np.clip(ev/0.05, 0, 1); k = int(0.15*SR); duck = np.convolve(duck, np.ones(k)/k, "same")
    fade_in = np.ones(N); fi = int(1.0*SR); fade_in[:fi] = np.linspace(0.3, 1, fi)
    out = voice*0.95 + fx + mus*duck*fade_in*0.9
    out = np.tanh(out*1.05)/np.tanh(1.05); out = out[:int(END*SR)]
    fo = int(0.8*SR); out[-fo:] *= np.linspace(1, 0, fo)
    wavfile.write(ep / "audio" / "mix.wav", SR, (out*32000).astype(np.int16))
    print(f"mix.wav written ({END:.1f}s)")

if __name__ == "__main__":
    main()
