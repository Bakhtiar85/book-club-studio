import React from "react";
import { rnd } from "./kit";

const INK = "#2A1A12";
const SW = 6;

/* ---------------- the library set ---------------- */
const Books: React.FC<{ x: number; y: number; w: number; seed: number }> = ({ x, y, w, seed }) => {
  const cols = ["#C8445A", "#E8A23A", "#3E8A6E", "#3F6FB5", "#7A5AA8", "#D9644A", "#E0C27A", "#2F5D73"];
  const out: React.ReactNode[] = [];
  let cx = x;
  let i = 0;
  while (cx < x + w - 26) {
    const bw = 20 + Math.floor(rnd(seed + i) * 18);
    const bh = 78 + Math.floor(rnd(seed + i + 50) * 46);
    const lean = rnd(seed + i + 9) > 0.88;
    out.push(
      <g key={i} transform={lean ? `rotate(-12 ${cx} ${y})` : undefined}>
        <rect x={cx} y={y - bh} width={bw} height={bh} rx="3" fill={cols[(seed + i) % cols.length]} stroke={INK} strokeWidth="3" />
        <rect x={cx + 3} y={y - bh + 12} width={bw - 6} height="6" fill="#FFFFFF" opacity="0.35" />
      </g>,
    );
    cx += bw + 2 + (lean ? 14 : 0);
    i++;
  }
  return <>{out}</>;
};

export const Shelf: React.FC<{ x: number; w: number; seed: number }> = ({ x, w, seed }) => (
  <g>
    <rect x={x} y="120" width={w} height="1150" fill="#5E3A24" stroke={INK} strokeWidth={SW} />
    {[0, 1, 2, 3, 4, 5].map((r) => (
      <g key={r}>
        <rect x={x + 14} y={140 + r * 185} width={w - 28} height="165" fill="#3A2216" />
        <Books x={x + 20} y={300 + r * 185} w={w - 40} seed={seed + r * 17} />
        <rect x={x} y={300 + r * 185} width={w} height="20" fill="#7A4A2E" stroke={INK} strokeWidth="4" />
      </g>
    ))}
  </g>
);

export const LibrarySet: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <defs>
      <linearGradient id="libWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6A4632" />
        <stop offset="1" stopColor="#3E271C" />
      </linearGradient>
      <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2B3A7A" />
        <stop offset="0.65" stopColor="#B8607A" />
        <stop offset="1" stopColor="#F2A06B" />
      </linearGradient>
      <radialGradient id="warm">
        <stop offset="0" stopColor="#FFD98A" stopOpacity="0.75" />
        <stop offset="1" stopColor="#FFB347" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE2B0" stopOpacity="0.28" />
        <stop offset="1" stopColor="#FFE2B0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9A6640" />
        <stop offset="1" stopColor="#6B4128" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#libWall)" />
    {/* window */}
    <path d="M330 760 L330 360 Q540 150 750 360 L750 760 Z" fill="url(#dusk)" stroke={INK} strokeWidth={SW} />
    {Array.from({ length: 18 }).map((_, i) => {
      const tw = 0.5 + 0.5 * Math.sin(t * (1.5 + rnd(i) * 2) + i);
      return <circle key={i} cx={350 + rnd(i + 3) * 380} cy={300 + rnd(i + 5) * 260} r={2 + tw * 3} fill="#FFFBE0" opacity={tw} />;
    })}
    <circle cx="640" cy="380" r="44" fill="#FFF1C2" />
    <circle cx="660" cy="368" r="40" fill="#3A4486" />
    <path d="M540 205 L540 760 M330 520 L750 520" stroke="#7A4A2A" strokeWidth="18" />
    <path d="M330 760 L330 360 Q540 150 750 360 L750 760 Z" fill="none" stroke="#7A4A2A" strokeWidth="22" />
    <rect x="300" y="760" width="480" height="34" rx="8" fill="#8A5A3A" stroke={INK} strokeWidth={SW} />
    {/* curtains */}
    <path d="M300 200 Q350 480 300 800 L250 800 Q290 480 240 200 Z" fill="#9E2F45" stroke={INK} strokeWidth={SW} />
    <path d="M780 200 Q730 480 780 800 L840 800 Q790 480 840 200 Z" fill="#9E2F45" stroke={INK} strokeWidth={SW} />
    <rect x="220" y="185" width="640" height="22" rx="11" fill="#C99A3A" stroke={INK} strokeWidth="4" />
    {/* shelves */}
    <Shelf x={-20} w={250} seed={3} />
    <Shelf x={850} w={250} seed={41} />
    {/* light beam + dust */}
    <path d="M340 520 L740 520 L900 1500 L180 1500 Z" fill="url(#beam)" />
    {Array.from({ length: 26 }).map((_, i) => {
      const y = 600 + ((rnd(i + 70) * 900 + t * (12 + rnd(i) * 18)) % 900);
      const x = 300 + rnd(i + 80) * 480 + Math.sin(t * 0.8 + i) * 20;
      return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 90) * 3} fill="#FFF3D0" opacity={0.25 + 0.35 * Math.sin(t * 2 + i) ** 2} />;
    })}
    {/* floor */}
    <rect y="1240" width="1080" height="700" fill="url(#floorG)" />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M0 ${1290 + i * 95} L1080 ${1290 + i * 95}`} stroke="#5A3622" strokeWidth="4" opacity="0.5" />)}
    <rect y="1232" width="1080" height="16" fill="#4A2C1C" />
    <ellipse cx="540" cy="1470" rx="530" ry="150" fill="#8E2F3E" stroke={INK} strokeWidth={SW} />
    <ellipse cx="540" cy="1470" rx="450" ry="115" fill="none" stroke="#E8B23A" strokeWidth="10" strokeDasharray="28 18" />
    <ellipse cx="540" cy="1470" rx="300" ry="70" fill="#B23E52" />
    {/* floor lamp */}
    <g transform="translate(110 1260)">
      <circle cx="0" cy="-640" r={260 + Math.sin(t * 2) * 6} fill="url(#warm)" />
      <rect x="-6" y="-600" width="12" height="600" fill="#3A2A1E" stroke={INK} strokeWidth="3" />
      <ellipse cx="0" cy="0" rx="60" ry="14" fill="#3A2A1E" />
      <path d="M-80 -600 L80 -600 L55 -700 L-55 -700 Z" fill="#F2C46B" stroke={INK} strokeWidth={SW} />
    </g>
    {/* side table with chai */}
    <g transform="translate(548 1240)">
      <rect x="-10" y="-120" width="20" height="120" fill="#5E3A24" stroke={INK} strokeWidth="4" />
      <ellipse cx="0" cy="0" rx="70" ry="14" fill="#5E3A24" stroke={INK} strokeWidth="4" />
      <ellipse cx="0" cy="-124" rx="110" ry="26" fill="#7A4A2E" stroke={INK} strokeWidth={SW} />
      <path d="M-60 -150 Q-60 -200 -20 -205 Q20 -200 20 -150 Z" fill="#E8E4DA" stroke={INK} strokeWidth="5" />
      <path d="M20 -175 Q42 -180 44 -195" stroke={INK} strokeWidth="6" fill="none" />
      <rect x="35" y="-170" width="40" height="30" rx="8" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${48 + i * 8} -180 q-8 -14 0 -28 q8 -14 0 -28`} stroke="#FFFFFF" strokeWidth="4" fill="none" opacity={0.25 + 0.25 * Math.sin(t * 3 + i)} transform={`translate(0 ${-((t * 14 + i * 10) % 20)})`} />
      ))}
    </g>
  </g>
);

/* ---------------- hosts ---------------- */
export type Expr = { mouth: number; talk: boolean; blink: boolean; brow?: number; happy?: boolean; gesture?: number; t: number };

const Eye: React.FC<{ x: number; y: number; r?: number; look: number; blink: boolean; happy?: boolean }> = ({ x, y, r = 1, look, blink, happy }) =>
  happy ? (
    <path d={`M${x - 14 * r} ${y + 2} Q${x} ${y - 14 * r} ${x + 14 * r} ${y + 2}`} stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
  ) : (
    <g transform={`translate(${x} ${y}) scale(1 ${blink ? 0.12 : 1})`}>
      <ellipse rx={15 * r} ry={18 * r} fill="#FFFFFF" stroke={INK} strokeWidth="3.5" />
      <circle cx={look * 4 * r} cy={2} r={9 * r} fill="#3A2210" />
      <circle cx={look * 4 * r - 3} cy={-3} r={3.2 * r} fill="#FFFFFF" />
    </g>
  );

/** Noor, ~10, hijab, sitting in a red armchair facing right. Origin = seat. */
export const Noor: React.FC<Expr & { book?: number }> = ({ mouth, talk, blink, brow = 0, happy, gesture = 0, t, book = 1 }) => {
  const tilt = talk ? Math.sin(t * 6) * 3 : Math.sin(t * 1.3) * 1.5;
  const arm = -20 - gesture * 120 + (talk ? Math.sin(t * 7) * 8 : 0);
  return (
    <g>
      {/* chair */}
      <rect x="-160" y="-360" width="320" height="380" rx="70" fill="#C8445A" stroke={INK} strokeWidth={SW} />
      <rect x="-120" y="-320" width="240" height="300" rx="50" fill="#D9566C" />
      <rect x="-185" y="-180" width="80" height="250" rx="34" fill="#B23A50" stroke={INK} strokeWidth={SW} />
      <rect x="-150" y="-40" width="300" height="80" rx="30" fill="#E06A80" stroke={INK} strokeWidth={SW} />
      <rect x="-150" y="30" width="300" height="80" rx="16" fill="#B23A50" stroke={INK} strokeWidth={SW} />
      <rect x="-130" y="108" width="22" height="40" rx="6" fill="#4A2C1C" />
      <rect x="108" y="108" width="22" height="40" rx="6" fill="#4A2C1C" />
      {/* legs dangling */}
      <path d="M20 -30 L120 -30 L130 120" stroke="#3F6FB5" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M0 -10 L95 -10 L100 135" stroke="#35609E" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx="148" cy="150" rx="38" ry="20" fill="#FFFFFF" stroke={INK} strokeWidth="5" />
      <ellipse cx="118" cy="165" rx="38" ry="20" fill="#FFFFFF" stroke={INK} strokeWidth="5" />
      {/* torso: dress + yellow cardigan */}
      <path d="M-70 -250 Q0 -270 70 -250 L90 -20 L-80 -20 Z" fill="#8FD0FF" stroke={INK} strokeWidth={SW} />
      <path d="M-70 -250 Q-30 -262 -5 -258 L10 -20 L-80 -20 Z" fill="#FFC23C" stroke={INK} strokeWidth="5" />
      <path d="M70 -250 Q50 -258 30 -256 L55 -20 L90 -20 Z" fill="#FFC23C" stroke={INK} strokeWidth="5" />
      {/* back arm to the book */}
      <path d="M-45 -220 Q-40 -120 40 -90" stroke="#FFC23C" strokeWidth="40" strokeLinecap="round" fill="none" />
      <circle cx="48" cy="-90" r="20" fill="#E8B48A" stroke={INK} strokeWidth="4" />
      {/* the book on her lap */}
      {book > 0 && (
        <g transform={`translate(80 -80) scale(${book})`}>
          <path d="M-70 -10 L0 0 L0 40 L-70 30 Z" fill="#FFFDF3" stroke={INK} strokeWidth="4" />
          <path d="M70 -10 L0 0 L0 40 L70 30 Z" fill="#FFFDF3" stroke={INK} strokeWidth="4" />
          <path d="M-74 30 L0 42 L74 30 L74 38 L0 50 L-74 38 Z" fill="#C8445A" stroke={INK} strokeWidth="4" />
        </g>
      )}
      {/* front arm (gestures) */}
      <g transform={`translate(55 -225) rotate(${arm})`}>
        <rect x="-20" y="0" width="40" height="125" rx="20" fill="#FFC23C" stroke={INK} strokeWidth="5" />
        <circle cx="0" cy="132" r="20" fill="#E8B48A" stroke={INK} strokeWidth="4" />
      </g>
      {/* head with hijab */}
      <g transform={`rotate(${tilt} 0 -250)`}>
        <path d="M-108 -300 Q-125 -200 -95 -228 Q0 -205 100 -235 Q120 -220 108 -300 Z" fill="#D9558F" stroke={INK} strokeWidth={SW} />
        <circle cx="0" cy="-345" r="108" fill="#E86FA0" stroke={INK} strokeWidth={SW} />
        <path d="M-80 -420 Q-20 -455 50 -430" stroke="#F59AC0" strokeWidth="10" fill="none" strokeLinecap="round" />
        <ellipse cx="18" cy="-330" rx="72" ry="82" fill="#E8B48A" stroke={INK} strokeWidth="5" />
        <path d="M-52 -380 Q18 -430 88 -380" stroke="#E86FA0" strokeWidth="26" fill="none" />
        <ellipse cx="-22" cy="-300" rx="15" ry="10" fill="#F08A9A" opacity="0.6" />
        <ellipse cx="70" cy="-300" rx="15" ry="10" fill="#F08A9A" opacity="0.6" />
        <Eye x={-2} y={-335} look={1} blink={blink} happy={happy} />
        <Eye x={52} y={-335} look={1} blink={blink} happy={happy} />
        <path d={`M-20 ${-362 - brow * 10} Q-4 ${-372 - brow * 12} 12 ${-363 - brow * 10}`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d={`M38 ${-363 - brow * 10} Q54 ${-372 - brow * 12} 70 ${-362 - brow * 10}`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M30 -318 Q36 -306 28 -302" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        {mouth > 0.08 ? (
          <g transform="translate(26 -281)">
            <ellipse rx={13 + mouth * 6} ry={4 + mouth * 13} fill="#7A2030" stroke={INK} strokeWidth="3.5" />
            <ellipse cy={3 + mouth * 6} rx={7 + mouth * 3} ry={2 + mouth * 4} fill="#FF7E9A" />
          </g>
        ) : (
          <path d={happy ? "M8 -288 Q26 -266 44 -288 Z" : "M10 -285 Q26 -272 42 -285"} stroke={INK} strokeWidth="5" fill={happy ? "#7A2030" : "none"} strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};

/** Baba, bearded, glasses, kurta + sweater vest, in a green wingback chair facing left. Origin = seat. */
export const Baba: React.FC<Expr & { cup?: boolean }> = ({ mouth, talk, blink, brow = 0, gesture = 0, t }) => {
  const tilt = talk ? Math.sin(t * 5) * 2.5 : Math.sin(t * 1.1 + 1) * 1.2;
  const arm = 18 + gesture * 50 + (talk ? Math.sin(t * 6) * 10 : 0);
  return (
    <g>
      {/* wingback chair */}
      <path d="M-200 -20 L-205 -470 Q-200 -540 -120 -545 L120 -545 Q200 -540 205 -470 L200 -20 Z" fill="#2F6B55" stroke={INK} strokeWidth={SW} />
      <path d="M-160 -60 L-160 -460 Q-150 -500 -100 -505 L100 -505 Q150 -500 160 -460 L160 -60 Z" fill="#3E8A6E" />
      {[-90, 0, 90].map((x) => [-430, -330, -230].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="#245443" />))}
      <path d="M-235 -250 Q-240 -330 -185 -330 L-150 -330 L-150 80 L-235 80 Z" fill="#285C49" stroke={INK} strokeWidth={SW} />
      <rect x="-190" y="-40" width="380" height="90" rx="30" fill="#4C9A7C" stroke={INK} strokeWidth={SW} />
      <rect x="-190" y="45" width="380" height="80" rx="14" fill="#285C49" stroke={INK} strokeWidth={SW} />
      <rect x="-170" y="122" width="24" height="44" rx="6" fill="#3A2216" />
      <rect x="146" y="122" width="24" height="44" rx="6" fill="#3A2216" />
      {/* torso: kurta + sweater vest */}
      <path d="M-105 -330 Q0 -350 105 -330 L118 -10 Q0 10 -118 -10 Z" fill="#F1E9DA" stroke={INK} strokeWidth={SW} />
      <path d="M-105 -330 Q-50 -345 -25 -342 L0 -220 L25 -342 Q50 -345 105 -330 L112 -90 Q0 -70 -112 -90 Z" fill="#8A5A3C" stroke={INK} strokeWidth="5" />
      {[-190, -150, -110].map((y) => <circle key={y} cx="0" cy={y} r="6" fill="#E8C27A" stroke={INK} strokeWidth="2" />)}
      {/* legs */}
      <path d="M10 -20 L-150 -10 L-165 150" stroke="#5E626E" strokeWidth="62" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40 10 L-110 20 L-118 165" stroke="#6B6F7A" strokeWidth="62" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-215 170 Q-210 140 -160 145 L-130 150 L-130 182 L-215 182 Z" fill="#6B3A1E" stroke={INK} strokeWidth="5" />
      <path d="M-170 185 Q-165 155 -115 160 L-85 165 L-85 197 L-170 197 Z" fill="#7A4424" stroke={INK} strokeWidth="5" />
      {/* right arm resting with chai */}
      <path d="M95 -300 Q150 -200 150 -110" stroke="#8A5A3C" strokeWidth="54" strokeLinecap="round" fill="none" />
      <g transform="translate(150 -110)">
        <rect x="-26" y="-36" width="52" height="44" rx="10" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
        <path d="M26 -26 Q44 -20 26 -6" stroke={INK} strokeWidth="5" fill="none" />
        <circle cx="0" cy="10" r="24" fill="#C98E66" stroke={INK} strokeWidth="4" />
      </g>
      {/* head */}
      <g transform={`rotate(${tilt} 0 -330)`}>
        <rect x="-34" y="-370" width="68" height="50" rx="16" fill="#B47A52" />
        <circle cx="-5" cy="-440" r="92" fill="#C98E66" stroke={INK} strokeWidth={SW} />
        {/* hair */}
        <path d="M-85 -470 Q-80 -545 0 -545 Q80 -540 88 -455 Q70 -480 40 -495 Q-20 -510 -85 -470 Z" fill="#2B2420" stroke={INK} strokeWidth="5" />
        <path d="M60 -500 Q85 -480 88 -440" stroke="#9A948E" strokeWidth="10" fill="none" />
        <ellipse cx="78" cy="-430" rx="16" ry="22" fill="#B47A52" stroke={INK} strokeWidth="4" />
        {/* beard */}
        <path d="M-95 -440 Q-100 -330 -20 -320 Q60 -315 80 -400 Q70 -380 40 -385 Q-10 -395 -60 -385 Q-85 -395 -95 -440 Z" fill="#2B2420" stroke={INK} strokeWidth="5" />
        <path d="M-40 -340 Q-20 -332 0 -340 M20 -350 Q40 -345 55 -360" stroke="#8A8580" strokeWidth="5" fill="none" />
        {/* mouth inside the beard */}
        {mouth > 0.08 ? (
          <ellipse cx="-38" cy="-383" rx={15 + mouth * 6} ry={4 + mouth * 12} fill="#6E1E24" stroke="#1A1410" strokeWidth="3" />
        ) : (
          <path d="M-55 -385 Q-38 -380 -20 -386" stroke="#1A1410" strokeWidth="5" fill="none" />
        )}
        <path d="M-75 -398 Q-38 -416 -5 -398" stroke="#2B2420" strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M-62 -440 Q-82 -415 -60 -410" stroke={INK} strokeWidth="5" fill="#B47A52" strokeLinecap="round" />
        {/* eyes + glasses */}
        <Eye x={-82} y={-452} r={0.85} look={-1} blink={blink} />
        <Eye x={-22} y={-452} r={0.85} look={-1} blink={blink} />
        <rect x="-112" y="-478" width="58" height="48" rx="14" fill="#BFE4FF" fillOpacity="0.18" stroke="#1A1410" strokeWidth="6" />
        <rect x="-50" y="-478" width="58" height="48" rx="14" fill="#BFE4FF" fillOpacity="0.18" stroke="#1A1410" strokeWidth="6" />
        <path d="M-54 -460 L-50 -460 M8 -458 L70 -446" stroke="#1A1410" strokeWidth="6" />
        {/* brows: one raised when skeptical */}
        <path d={`M-112 ${-492 - brow * 4} L-60 ${-496 - brow * 4}`} stroke="#2B2420" strokeWidth="11" strokeLinecap="round" />
        <path d={`M-46 ${-498 - brow * 16} L4 ${-490 - brow * 22}`} stroke="#2B2420" strokeWidth="11" strokeLinecap="round" />
      </g>
      {/* front arm (gestures) */}
      <g transform={`translate(-90 -300) rotate(${arm})`}>
        <rect x="-26" y="0" width="52" height="160" rx="26" fill="#8A5A3C" stroke={INK} strokeWidth="5" />
        <rect x="-24" y="140" width="48" height="26" rx="10" fill="#F1E9DA" stroke={INK} strokeWidth="4" />
        <circle cx="0" cy="180" r="24" fill="#C98E66" stroke={INK} strokeWidth="4" />
      </g>
    </g>
  );
};

/** small speech-reaction bubble */
export const Reaction: React.FC<{ x: number; y: number; s: number; kind: "?!" | "!" | "stars" | "sweat" | "heart" }> = ({ x, y, s, kind }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {kind === "sweat" ? (
      <path d="M0 -40 Q30 0 0 30 Q-30 0 0 -40 Z" fill="#7FD3FF" stroke={INK} strokeWidth="5" />
    ) : kind === "stars" || kind === "heart" ? (
      [0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${(i - 1) * 55} ${i === 1 ? -30 : 0}) rotate(${(i - 1) * 15})`}>
          {kind === "stars" ? (
            <path d="M0 -26 L8 -8 L27 -7 L12 6 L17 25 L0 15 L-17 25 L-12 6 L-27 -7 L-8 -8 Z" fill="#FFD23C" stroke={INK} strokeWidth="4" />
          ) : (
            <path d="M0 18 C-36 -6 -26 -36 -7 -30 C-3 -28 0 -24 0 -20 C0 -24 3 -28 7 -30 C26 -36 36 -6 0 18 Z" fill="#FF6B8B" stroke={INK} strokeWidth="4" />
          )}
        </g>
      ))
    ) : (
      <g>
        <circle r="56" fill="#FFFFFF" stroke={INK} strokeWidth="6" />
        <text y="22" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="64" fill={kind === "!" ? "#E2504F" : "#3F6FB5"}>{kind}</text>
      </g>
    )}
  </g>
);
