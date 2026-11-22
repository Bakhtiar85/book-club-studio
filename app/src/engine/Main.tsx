import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { LibrarySet, Noor, Baba, Reaction } from "./Library";
import { Sparkle } from "./kit";
import { META, L, WORDS, MOUTH, at, Who, Word } from "./cues";
import { SCENES } from "../current";
import { BookProp } from "../current/book";

loadFont({ family: "Fredoka", url: staticFile("fonts/fredoka-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: "Fredoka", url: staticFile("fonts/fredoka-latin-500-normal.woff2"), weight: "500" });

export const DURATION = META.duration + 2.4;
const linesData = META;

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (t: number, a: number, b: number, x: number, y: number, e = Easing.inOut(Easing.cubic)) => interpolate(t, [a, b], [x, y], { ...cl, easing: e });
const pop = (t: number, at0: number, d = 0.4) => interpolate(t, [at0, at0 + d], [0, 1], { ...cl, easing: Easing.out(Easing.back(2)) });

/* ---------------- timeline ---------------- */
const NAR = L.filter((l) => l.who === "narrator");
const FIRST_NAR = NAR[0];
const AFTER = L[L.indexOf(NAR[NAR.length - 1]) + 1];
const BOOK_FLY = at(META.book_open.word, META.book_open.line) - 0.05;
const T1 = FIRST_NAR.start - 0.5; // iris into the book
const T2 = AFTER.start - 0.55; // iris back to the library
const IRIS = 0.5;
const END_AT = L[L.length - 1].end + 0.15;
const PX = 540, PY = 600; // portal centre
const NOOR_POS = { x: 300, y: 1250, s: 1 };
const BABA_POS = { x: 790, y: 1235, s: 1.1 };

type ReactKind = "?!" | "!" | "stars" | "sweat" | "heart";
const FX = L.flatMap((l) => (l.fx ?? []).map((f) => ({ ...f, t: at(f.on, l.i), speaker: l.who })));
const PUNCH = FX.filter((f) => f.punch).map((f) => f.t);
const SHAKE = FX.filter((f) => f.shake).map((f) => f.t);
const REACT: { at: number; who: "noor" | "baba"; kind: ReactKind; dur: number }[] = FX.filter((f) => f.react).map((f) => ({
  at: f.t - 0.05,
  who: (f.who ?? (f.speaker === "narrator" ? "noor" : f.speaker)) as "noor" | "baba",
  kind: f.react as ReactKind,
  dur: f.react_dur ?? 1.5,
}));
const HAPPY = FX.filter((f) => f.happy).map((f) => ({ s: f.t, e: f.t + (f.happy ?? 1) }));

const talking = (t: number, who: Who) => L.some((l) => l.who === who && t >= l.start - 0.05 && t <= l.end + 0.1);
const lineOf = (t: number) => L.find((l) => t >= l.start - 0.05 && t <= l.end + 0.1);

/* ---------------- library room ---------------- */
const Room: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  let zoom = 1, sx = 0, sy = 0;
  for (const p of PUNCH) if (t >= p) zoom += 0.07 * Math.exp(-(t - p) * 5) * Math.min(1, (t - p) * 25);
  for (const p of SHAKE) if (t >= p && t < p + 0.4) { const k = (1 - (t - p) / 0.4) * 10; sx += Math.sin(t * 90) * k; sy += Math.cos(t * 77) * k; }
  const blinkN = (t + 0.4) % 3.3 < 0.12;
  const blinkB = (t + 1.9) % 3.9 < 0.12;
  const ln = lineOf(t);
  const nTalk = talking(t, "noor");
  const bTalk = talking(t, "baba");
  const bookOnLap = t < BOOK_FLY ? 1 : lerp(t, T2 + 0.9, T2 + 1.2, 0, 1, Easing.out(Easing.back(2)));
  const noorHappy = HAPPY.some((h) => t > h.s && t < h.e);
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${540 + sx} ${1000 + sy}) scale(${zoom}) translate(-540 -1000)`}>
        <LibrarySet t={t} />
        {/* this book's themed prop on the window sill */}
        <g transform="translate(415 762)"><BookProp t={t} /></g>
        <g transform={`translate(${BABA_POS.x} ${BABA_POS.y}) scale(${BABA_POS.s})`}>
          <Baba t={t} mouth={MOUTH.baba[frame] ?? 0} talk={bTalk} blink={blinkB} brow={bTalk ? 1 : 0.3} gesture={bTalk && ln ? 0.5 + 0.5 * Math.sin((t - ln.start) * 2.2) : 0} />
        </g>
        <g transform={`translate(${NOOR_POS.x} ${NOOR_POS.y}) scale(${NOOR_POS.s})`}>
          <Noor t={t} mouth={MOUTH.noor[frame] ?? 0} talk={nTalk} blink={blinkN} brow={nTalk ? 1 : 0} happy={noorHappy} book={bookOnLap}
            gesture={t > BOOK_FLY - 0.3 && t < BOOK_FLY + 0.5 ? 1 : nTalk && ln ? 0.4 + 0.4 * Math.sin((t - ln.start) * 2.5) : 0} />
        </g>
        {/* name tags */}
        {[{ x: 300, n: "NOOR", c: "#E86FA0" }, { x: 790, n: "BABA", c: "#3E8A6E" }].map((g) => (
          <g key={g.n} transform={`translate(${g.x} 1425)`}>
            <rect x="-80" y="-28" width="160" height="56" rx="28" fill={g.c} stroke="#2A1A12" strokeWidth="5" />
            <text y="12" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="32" fill="#FFFFFF">{g.n}</text>
          </g>
        ))}
        {REACT.map((r, i) => {
          if (t < r.at || t > r.at + r.dur) return null;
          const s = pop(t, r.at, 0.35) * lerp(t, r.at + r.dur - 0.25, r.at + r.dur, 1, 0);
          const pos = r.who === "baba" ? { x: 930, y: 610 } : { x: 170, y: 760 };
          return <Reaction key={i} x={pos.x} y={pos.y + Math.sin(t * 5) * 6} s={s} kind={r.kind} />;
        })}
      </g>
    </svg>
  );
};

/* ---------------- the flying book that opens the story ---------------- */
const FlyingBook: React.FC<{ t: number }> = ({ t }) => {
  const outP = lerp(t, BOOK_FLY, BOOK_FLY + 0.4, 0, 1, Easing.out(Easing.cubic));
  const backP = lerp(t, T2 + 0.55, T2 + 0.95, 0, 1, Easing.in(Easing.cubic));
  if (t < BOOK_FLY || t > T2 + 0.95 || (t > T1 + IRIS && t < T2)) return null;
  const p = t < (T1 + T2) / 2 ? outP : 1 - backP;
  const open = t < (T1 + T2) / 2 ? lerp(t, BOOK_FLY + 0.3, BOOK_FLY + 0.55, 0, 1) : lerp(t, T2 + 0.3, T2 + 0.55, 1, 0);
  const x = 380 + (PX - 380) * p, y = 1170 + (PY - 1170) * p - Math.sin(p * Math.PI) * 120;
  const s = 0.5 + p * 1.0;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="bookGlow">
          <stop offset="0" stopColor="#FFF1B0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${(1 - p) * -20})`}>
        <circle r={150 + open * 200} fill="url(#bookGlow)" opacity={0.4 + open * 0.6} />
        {open > 0.05 ? (
          <g>
            <path d={`M0 -110 Q${-100 * open} -130 ${-200 * open} -110 L${-200 * open} 110 Q${-100 * open} 90 0 110 Z`} fill="#FFFDF3" stroke="#2A1A12" strokeWidth="6" />
            <path d={`M0 -110 Q${100 * open} -130 ${200 * open} -110 L${200 * open} 110 Q${100 * open} 90 0 110 Z`} fill="#FFFDF3" stroke="#2A1A12" strokeWidth="6" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Sparkle key={i} x={Math.cos(i * 0.8 + t * 3) * 230 * open} y={-60 + Math.sin(i * 1.7 + t * 3) * 130} r={12 + 8 * Math.sin(t * 6 + i)} />
            ))}
          </g>
        ) : (
          <g>
            <rect x="-140" y="-110" width="280" height="220" rx="16" fill="#C8445A" stroke="#2A1A12" strokeWidth="6" />
            <rect x="-140" y="-110" width="30" height="220" fill="#9E2F45" />
            {META.book.toUpperCase().split(" ").reduce<string[]>((acc, w) => { const last = acc[acc.length - 1]; if (last && (last + " " + w).length <= 12) acc[acc.length - 1] = last + " " + w; else acc.push(w); return acc; }, []).slice(0, 3).map((ln, k, arr) => (
              <text key={k} x="10" y={12 + (k - (arr.length - 1) / 2) * 36} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="30" fill="#FFC93C">{ln}</text>
            ))}
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---------------- story world with page-turn transitions ---------------- */
const Story: React.FC<{ t: number }> = ({ t }) => {
  const r = t < (T1 + T2) / 2 ? lerp(t, T1, T1 + IRIS, 0, 1500, Easing.in(Easing.cubic)) : lerp(t, T2, T2 + IRIS, 1500, 0, Easing.out(Easing.cubic));
  if (r <= 1) return null;
  const layers: React.ReactNode[] = [];
  let edge: number | null = null;
  NAR.forEach((l, i) => {
    const s = i === 0 ? T1 : l.start - 0.4;
    const e = i === NAR.length - 1 ? T2 + IRIS : NAR[i + 1].start - 0.4 + 0.55;
    if (t < s || t > e) return;
    const C = SCENES[l.scene!];
    if (!C) throw new Error(`scene "${l.scene}" missing in this episode's scenes.tsx`);
    let clip: string | undefined;
    if (i > 0 && t < s + 0.55) {
      const p = lerp(t, s, s + 0.55, 0, 1, Easing.inOut(Easing.quad));
      const X = 1280 - p * 1600;
      clip = `polygon(${X + 200}px 0px, 1080px 0px, 1080px 1920px, ${X}px 1920px)`;
      edge = X;
    }
    layers.push(
      <AbsoluteFill key={i} style={{ clipPath: clip }}>
        <C t={t} lt={t - (l.start - 0.3)} s0={l.start - 0.3} />
      </AbsoluteFill>,
    );
  });
  const leak = 0.12 + 0.08 * Math.sin(t * 0.9);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${PX}px ${PY}px)` }}>
      {layers}
      {edge !== null && (
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="curl" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="0.55" stopColor="#000" stopOpacity="0.25" />
              <stop offset="0.6" stopColor="#FFF8E8" stopOpacity="1" />
              <stop offset="1" stopColor="#E8DCC0" stopOpacity="1" />
            </linearGradient>
          </defs>
          <polygon points={`${edge - 60},1920 ${edge + 140},0 ${edge + 230},0 ${edge + 30},1920`} fill="url(#curl)" />
        </svg>
      )}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + 40 * Math.sin(t * 0.4)}% 20%, rgba(255,190,110,${leak}) 0%, rgba(255,190,110,0) 45%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(40,20,10,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------- captions ---------------- */
type Chunk = { words: Word[]; s: number; e: number; who: Who };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const l of L) {
    const ws = WORDS.filter((w) => w.line === l.i);
    let cur: Word[] = [];
    ws.forEach((w, i) => {
      cur.push(w);
      if (/[,.!?]$/.test(w.w) || cur.length === 3 || i === ws.length - 1) {
        out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e, who: l.who });
        cur = [];
      }
    });
  }
  for (let i = 0; i < out.length - 1; i++) out[i].e = Math.min(out[i + 1].s, out[i].e + 0.4);
  return out;
})();
const HI: Record<Who, string> = { noor: "#FF8FC8", baba: "#8FE3B0", narrator: "#FFD36B" };
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const ch = CHUNKS.find((c) => t >= c.s - 0.05 && t < c.e + 0.02);
  if (!ch) return null;
  const p = pop(t, ch.s - 0.05, 0.22);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1530, textAlign: "center", fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, lineHeight: 1.1, scale: `${0.75 + 0.25 * p}` }}>
      {ch.words.map((w, i) => {
        const on = t >= w.s - 0.03 && t < w.e + 0.12;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: 24, color: on ? HI[ch.who] : "#FFFFFF", WebkitTextStroke: "16px #1A1030", paintOrder: "stroke fill", translate: on ? "0 -8px" : "0 0" }}>
            {w.w.replace(/[,.]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/* ---------------- end card ---------------- */
const VoteCard: React.FC<{ t: number }> = ({ t }) => {
  const v = pop(t, END_AT, 0.5);
  if (v <= 0) return null;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 470) scale(${v})`}>
        <rect x="-440" y="-190" width="880" height="380" rx="40" fill="#FFFDF3" stroke="#2A1A12" strokeWidth="8" />
        <text y="-105" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="66" fill="#2A1A12">{linesData.question.toUpperCase()}</text>
        <g transform={`translate(-205 10) scale(${1 + 0.04 * Math.sin(t * 6)})`}>
          <rect x="-185" y="-58" width="370" height="116" rx="58" fill="#E86FA0" stroke="#2A1A12" strokeWidth="6" />
          <text y="-2" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="44" fill="#FFFFFF">NOOR</text>
          <text y="36" textAnchor="middle" fontFamily="Fredoka" fontWeight={500} fontSize="28" fill="#FFFFFF">{META.vote.noor}</text>
        </g>
        <g transform={`translate(205 10) scale(${1 + 0.04 * Math.sin(t * 6 + 3)})`}>
          <rect x="-185" y="-58" width="370" height="116" rx="58" fill="#3E8A6E" stroke="#2A1A12" strokeWidth="6" />
          <text y="-2" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="44" fill="#FFFFFF">BABA</text>
          <text y="36" textAnchor="middle" fontFamily="Fredoka" fontWeight={500} fontSize="28" fill="#FFFFFF">{META.vote.baba}</text>
        </g>
        <text y="122" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="36" fill="#C8445A">Vote in the comments ↓</text>
        <text y="168" textAnchor="middle" fontFamily="Fredoka" fontWeight={500} fontSize="30" fill="#7A6A5A">{META.next}</text>
      </g>
    </svg>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inStory = t > T1 && t < T2 + IRIS;
  return (
    <AbsoluteFill style={{ backgroundColor: "#3E271C" }}>
      <Room t={t} frame={frame} />
      <Story t={t} />
      <FlyingBook t={t} />
      {/* series chip, always on */}
      <div style={{ position: "absolute", top: 92, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: "Fredoka", fontWeight: 700, fontSize: 38, color: "#FFFFFF", background: inStory ? "rgba(26,16,48,0.7)" : "rgba(42,26,18,0.85)", padding: "12px 34px", borderRadius: 40, border: "4px solid #E8B23A" }}>
          {linesData.book} · {linesData.part}
        </div>
      </div>
      <Captions t={t} />
      <VoteCard t={t} />
    </AbsoluteFill>
  );
};
