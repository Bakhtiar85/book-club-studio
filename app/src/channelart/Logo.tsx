import React from "react";
import { Defs, Sparkle } from "../engine/kit";
import { Noor, Baba } from "../engine/Library";

const INK = "#2A1A12";
const GOLD = "#E8B23A";

/** 800x800 channel icon: Noor & Baba peeking over a glowing book, inside a circular badge.
 * Everything is clipped to the central circle so it reads cleanly at 98x98 (YouTube's small size). */
export const ChannelLogo: React.FC = () => (
  <svg viewBox="0 0 800 800" width={800} height={800}>
    <Defs />
    <defs>
      <radialGradient id="badgeBG" cx="0.4" cy="0.32" r="0.95">
        <stop offset="0" stopColor="#7A5238" />
        <stop offset="1" stopColor="#3E271C" />
      </radialGradient>
      <clipPath id="badgeClip"><circle cx="400" cy="400" r="368" /></clipPath>
    </defs>

    {/* badge ring + background, all inside the circle */}
    <circle cx="400" cy="400" r="380" fill={INK} />
    <circle cx="400" cy="400" r="368" fill="url(#badgeBG)" />

    <g clipPath="url(#badgeClip)">
      {/* warm glow behind the book */}
      <circle cx="400" cy="500" r="270" fill="url(#glowG)" opacity="0.9" />

      {/* Noor peeking left — eyes land just above the book's top edge, shoulders tuck behind it */}
      <g transform="translate(235 658) scale(0.62)">
        <Noor t={0} mouth={0} talk={false} blink={false} happy book={0} gesture={0} />
      </g>
      {/* Baba peeking right */}
      <g transform="translate(565 715) scale(0.62)">
        <Baba t={0} mouth={0} talk={false} blink={false} brow={0.3} gesture={0} />
      </g>

      {/* glowing open book, drawn over their shoulders so only heads show above it */}
      <g transform="translate(400 586)">
        <circle r="210" fill="url(#glowG)" opacity="0.65" />
        <path d="M0 -80 Q-120 -92 -246 -78 L-246 92 Q-120 78 0 90 Z" fill="#FFFDF3" stroke={INK} strokeWidth="8" />
        <path d="M0 -80 Q120 -92 246 -78 L246 92 Q120 78 0 90 Z" fill="#FFFDF3" stroke={INK} strokeWidth="8" />
        <path d="M0 -80 L0 90" stroke={GOLD} strokeWidth="12" />
        {[0, 1, 2].map((i) => (
          <path key={`l${i}`} d={`M${-205 + i * 4} ${-50 + i * 30} Q${-120} ${-64 + i * 30} ${-20} ${-52 + i * 30}`} stroke="#E8DCC0" strokeWidth="5" fill="none" opacity="0.65" />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={`r${i}`} d={`M${205 - i * 4} ${-50 + i * 30} Q${120} ${-64 + i * 30} ${20} ${-52 + i * 30}`} stroke="#E8DCC0" strokeWidth="5" fill="none" opacity="0.65" />
        ))}
        <Sparkle x={-150} y={-250} r={20} color="#FFE9A8" />
        <Sparkle x={160} y={-235} r={18} color="#FFE9A8" rot={20} />
        <Sparkle x={0} y={-280} r={16} color="#FFF4C2" rot={-10} />
      </g>
    </g>

    {/* gold accent ring on top, bold enough to read at 98px */}
    <circle cx="400" cy="400" r="368" fill="none" stroke={GOLD} strokeWidth="20" />
  </svg>
);
