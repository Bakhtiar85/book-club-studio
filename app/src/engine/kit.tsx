import React from "react";
import { interpolate, Easing } from "remotion";

export const W = 1080;
export const H = 1920;

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lerp = (t: number, a: number, b: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], { ...clampOpt, easing: ease });
export const pop = (t: number, at: number, dur = 0.45) =>
  interpolate(t, [at, at + dur], [0, 1], { ...clampOpt, easing: Easing.out(Easing.back(2.2)) });

// deterministic random
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------- palette ---------------- */
export const C = {
  skyTop: "#5EC8FF",
  skyBot: "#BDEBFF",
  sand: "#F6C98B",
  sandDark: "#E9A962",
  house: "#FFE0B0",
  houseShade: "#F3BE80",
  palmLeaf: "#3CC46B",
  palmLeafDark: "#23A355",
  trunk: "#B86B35",
  skin: "#F2B98E",
  skinShade: "#E09E72",
  hair: "#5A3416",
  tunic: "#FFFFFF",
  tunicShade: "#DCE7F7",
  sash: "#2DBE60",
  sashDark: "#1E9A4A",
  sandal: "#8A4A22",
  gold: "#FFC93C",
  goldDeep: "#E89B0C",
  night1: "#1B1F5E",
  night2: "#5B3AA8",
};

export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="tunicG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={C.tunicShade} />
      <stop offset="0.35" stopColor="#FFFFFF" />
      <stop offset="1" stopColor={C.tunicShade} />
    </linearGradient>
    <radialGradient id="hairG" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#7A4A24" />
      <stop offset="1" stopColor={C.hair} />
    </radialGradient>
    <radialGradient id="capG" cx="0.4" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#E3EAF5" />
    </radialGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF1A8" />
      <stop offset="0.5" stopColor="#FFC93C" />
      <stop offset="1" stopColor="#E08A00" />
    </linearGradient>
    <radialGradient id="glowG">
      <stop offset="0" stopColor="#FFF8D6" stopOpacity="1" />
      <stop offset="0.35" stopColor="#FFE38A" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="softWhite">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="sashG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#47D877" />
      <stop offset="1" stopColor={C.sashDark} />
    </linearGradient>
    <linearGradient id="jugG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#C8693A" />
      <stop offset="0.4" stopColor="#E98E55" />
      <stop offset="1" stopColor="#B65A2E" />
    </linearGradient>
  </defs>
);

/* ---------------- scenery ---------------- */
export const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx="0" cy="40" rx="150" ry="45" fill="#FFFFFF" />
    <circle cx="-70" cy="10" r="60" fill="#FFFFFF" />
    <circle cx="10" cy="-15" r="80" fill="#FFFFFF" />
    <circle cx="85" cy="15" r="55" fill="#FFFFFF" />
    <ellipse cx="0" cy="62" rx="140" ry="20" fill="#E4F4FF" />
  </g>
);

export const Sun: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="230" fill="url(#glowG)" opacity="0.7" />
    <g transform={`rotate(${t * 12})`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x="-10" y="-190" width="20" height="55" rx="10" fill="#FFE066" transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <circle r="115" fill="#FFD43B" />
    <circle r="95" fill="#FFE57A" />
    <circle cx="-30" cy="-35" r="28" fill="#FFF6C9" />
  </g>
);

export const Bird: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const flap = Math.sin(t * 14) * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-40 ${flap} Q-20 -14 0 4 Q20 -14 40 ${flap}`} stroke="#3B4A7A" strokeWidth="9" fill="none" strokeLinecap="round" />
    </g>
  );
};

export const Palm: React.FC<{ x: number; y: number; s?: number; t: number; ph?: number }> = ({ x, y, s = 1, t, ph = 0 }) => {
  const sway = Math.sin(t * 1.6 + ph) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 0 Q-30 -180 10 -360 L34 -356 Q6 -180 18 0 Z" fill={C.trunk} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d="M0 -10 L0 -26" stroke="#9A5528" strokeWidth="6" transform={`translate(${-6 + i * 3} ${-40 - i * 52}) rotate(${8 - i * 3})`} />
      ))}
      <g transform={`translate(22 -360) rotate(${sway})`}>
        {[-150, -110, -60, -20, 25, 70].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <path d="M0 0 Q90 -45 190 10 Q95 -10 0 12 Z" fill={i % 2 ? C.palmLeafDark : C.palmLeaf} />
          </g>
        ))}
        <circle cx="0" cy="8" r="14" fill="#7A3E17" />
        <circle cx="16" cy="12" r="12" fill="#8E4A1C" />
      </g>
    </g>
  );
};

export const House: React.FC<{ x: number; y: number; w: number; h: number; dome?: boolean; door?: boolean; tint?: string }> = ({
  x, y, w, h, dome, door = true, tint = C.house,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h} width={w} height={h} rx="26" fill={tint} />
    <rect x={w / 2 - w * 0.22} y={-h} width={w * 0.22} height={h} rx="20" fill={C.houseShade} opacity="0.55" />
    {dome && <path d={`M${-w * 0.32} ${-h + 4} Q0 ${-h - w * 0.55} ${w * 0.32} ${-h + 4} Z`} fill={tint} />}
    <rect x={-w / 2 - 6} y={-h - 4} width={w + 12} height="22" rx="11" fill={C.houseShade} />
    <rect x={-w * 0.3} y={-h * 0.75} width={w * 0.16} height={w * 0.16} rx="10" fill="#7FC8F0" />
    <rect x={w * 0.12} y={-h * 0.75} width={w * 0.16} height={w * 0.16} rx="10" fill="#7FC8F0" />
    {door && <path d={`M${-w * 0.12} 0 L${-w * 0.12} ${-h * 0.32} Q0 ${-h * 0.48} ${w * 0.12} ${-h * 0.32} L${w * 0.12} 0 Z`} fill="#A8622F" />}
  </g>
);

export const Kaaba: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="8" rx="190" ry="26" fill="#000" opacity="0.12" />
    <path d="M-150 0 L-150 -230 L40 -230 L40 0 Z" fill="#1E1E28" />
    <path d="M40 0 L40 -230 L130 -262 L130 -30 Z" fill="#111118" />
    <path d="M-150 -230 L-60 -262 L130 -262 L40 -230 Z" fill="#2C2C38" />
    <path d="M-150 -185 L40 -185 L40 -160 L-150 -160 Z" fill="#E8B23A" />
    <path d="M40 -185 L130 -217 L130 -192 L40 -160 Z" fill="#C9951F" />
    <rect x="-80" y="-120" width="50" height="90" rx="6" fill="#C9951F" />
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; r: number; o?: number; rot?: number; color?: string }> = ({
  x, y, r, o = 1, rot = 0, color = "#FFF4B0",
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <path d={`M0 ${-r} Q${r * 0.18} ${-r * 0.18} ${r} 0 Q${r * 0.18} ${r * 0.18} 0 ${r} Q${-r * 0.18} ${r * 0.18} ${-r} 0 Q${-r * 0.18} ${-r * 0.18} 0 ${-r} Z`} fill={color} />
  </g>
);

/** a field of twinkling sparkles */
export const SparkleField: React.FC<{ t: number; n: number; x: number; y: number; w: number; h: number; seed?: number; o?: number; size?: number; color?: string }> = ({
  t, n, x, y, w, h, seed = 1, o = 1, size = 22, color,
}) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const k = seed * 100 + i;
      const tw = 0.5 + 0.5 * Math.sin(t * (2 + rnd(k) * 3) + rnd(k + 7) * 6.28);
      return (
        <Sparkle key={i} x={x + rnd(k + 1) * w} y={y + rnd(k + 2) * h - ((t * 30 * rnd(k + 3)) % 60)} r={size * (0.5 + rnd(k + 4)) * (0.4 + 0.6 * tw)} o={tw} rot={t * 40} color={color} />
      );
    })}
  </g>
);

export const Heart: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 30 C-60 -10 -45 -60 -12 -50 C-4 -47 0 -40 0 -34 C0 -40 4 -47 12 -50 C45 -60 60 -10 0 30 Z" fill="#FF6B8B" />
    <ellipse cx="-20" cy="-30" rx="9" ry="6" fill="#FFC2CF" />
  </g>
);

export const Glow: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <circle cx={x} cy={y} r={r} fill="url(#glowG)" opacity={o} />
);
