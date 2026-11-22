import React from "react";
import { Noor, Baba, Shelf } from "../engine/Library";

const INK = "#2A1A12";
const GOLD = "#E8B23A";
const W = 2560, H = 1440;
const CX = W / 2, CY = H / 2;
// YouTube's channel-art safe area: centred, 1546x423, visible on every device.
const SAFE_W = 1546, SAFE_H = 423;

/** 2560x1440 channel banner: the library, wide. Title sits in the centred safe area;
 * Noor and Baba flank it in their chairs, kept clear of the safe area's left/right edges. */
export const ChannelBanner: React.FC = () => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
    <defs>
      <linearGradient id="bWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6A4632" />
        <stop offset="1" stopColor="#3E271C" />
      </linearGradient>
      <linearGradient id="bDusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2B3A7A" />
        <stop offset="0.65" stopColor="#B8607A" />
        <stop offset="1" stopColor="#F2A06B" />
      </linearGradient>
      <linearGradient id="bFloor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9A6640" />
        <stop offset="1" stopColor="#6B4128" />
      </linearGradient>
      <radialGradient id="bWarm">
        <stop offset="0" stopColor="#FFD98A" stopOpacity="0.7" />
        <stop offset="1" stopColor="#FFB347" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width={W} height={H} fill="url(#bWall)" />

    {/* bookshelves tiling both sides, clear of the centre safe area */}
    <Shelf x={-60} w={300} seed={3} />
    <Shelf x={240} w={300} seed={19} />
    <Shelf x={W - 540} w={300} seed={41} />
    <Shelf x={W - 240} w={300} seed={57} />

    {/* arched window, centred */}
    <path d={`M${CX - 210} 700 L${CX - 210} 300 Q${CX} 86 ${CX + 210} 300 L${CX + 210} 700 Z`} fill="url(#bDusk)" stroke={INK} strokeWidth="8" />
    <circle cx={CX + 100} cy="320" r="38" fill="#FFF1C2" />
    <circle cx={CX + 118} cy="308" r="34" fill="#3A4486" />
    <path d={`M${CX} 170 L${CX} 700 M${CX - 210} 460 L${CX + 210} 460`} stroke="#7A4A2A" strokeWidth="16" />
    <path d={`M${CX - 210} 700 L${CX - 210} 300 Q${CX} 86 ${CX + 210} 300 L${CX + 210} 700 Z`} fill="none" stroke="#7A4A2A" strokeWidth="20" />
    <rect x={CX - 240} y="700" width="480" height="30" rx="8" fill="#8A5A3A" stroke={INK} strokeWidth="8" />

    {/* floor + rug */}
    <rect y="1150" width={W} height={H - 1150} fill="url(#bFloor)" />
    <rect y="1144" width={W} height="14" fill="#4A2C1C" />
    <ellipse cx={CX} cy={H - 55} rx="640" ry="110" fill="#8E2F3E" stroke={INK} strokeWidth="8" />
    <ellipse cx={CX} cy={H - 55} rx="540" ry="82" fill="none" stroke={GOLD} strokeWidth="10" strokeDasharray="28 18" />

    {/* floor lamp, far left, clear of the shelves and the safe area */}
    <g transform="translate(150 1150)">
      <circle cx="0" cy="-480" r="190" fill="url(#bWarm)" />
      <rect x="-6" y="-450" width="12" height="450" fill="#3A2A1E" stroke={INK} strokeWidth="3" />
      <ellipse cx="0" cy="0" rx="46" ry="11" fill="#3A2A1E" />
      <path d="M-62 -450 L62 -450 L42 -525 L-42 -525 Z" fill="#F2C46B" stroke={INK} strokeWidth="6" />
    </g>

    {/* Noor, left of the safe area */}
    <g transform="translate(340 1210) scale(0.82)">
      <Noor t={0} mouth={0} talk={false} blink={false} happy gesture={0.15} book={0} />
    </g>
    {/* Baba, right of the safe area */}
    <g transform="translate(2230 1200) scale(0.9)">
      <Baba t={0} mouth={0} talk={false} blink={false} brow={0.3} gesture={0.1} />
    </g>

    {/* title panel, centred inside the 1546x423 safe area */}
    <g transform={`translate(${CX} ${CY})`}>
      <rect x={-SAFE_W / 2 + 40} y={-SAFE_H / 2 + 10} width={SAFE_W - 80} height={SAFE_H - 20} rx="36" fill="#1A1030" stroke={GOLD} strokeWidth="6" />
      <text y="-30" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="92" fill="#FFFFFF">Book Club with Noor &amp; Baba</text>
      <text y="60" textAnchor="middle" fontFamily="Fredoka" fontWeight={500} fontSize="46" fill="#FFD36B">New Shorts every Mon &amp; Thu</text>
    </g>
  </svg>
);
