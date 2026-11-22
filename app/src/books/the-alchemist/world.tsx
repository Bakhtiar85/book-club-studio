import React from "react";
import { Sparkle, rnd } from "../../engine/kit";
import { SkyG } from "../../engine/scene";

const SKIN = "#E8B48A";
const HAIR = "#2B1A10";

/* ---------------- book characters ---------------- */
export const Santiago: React.FC<{ walk?: number; face?: 1 | -1; wave?: number; staff?: boolean }> = ({ walk = 0, face = 1, wave = 0, staff = true }) => {
  const st = Math.sin(walk * Math.PI * 2);
  const bob = walk ? -Math.abs(st) * 8 : 0;
  return (
    <g transform={`translate(0 ${bob}) scale(${face} 1)`}>
      <ellipse cx="0" cy={-bob + 6} rx="95" ry="14" fill="#000" opacity="0.18" />
      {/* legs */}
      <g transform={`translate(-28 0) rotate(${st * 14} 0 -120)`}>
        <rect x="-18" y="-125" width="36" height="120" rx="16" fill="#6B4A2E" />
        <rect x="-22" y="-14" width="48" height="16" rx="8" fill="#4A2E1A" />
      </g>
      <g transform={`translate(28 0) rotate(${-st * 14} 0 -120)`}>
        <rect x="-18" y="-125" width="36" height="120" rx="16" fill="#6B4A2E" />
        <rect x="-22" y="-14" width="48" height="16" rx="8" fill="#4A2E1A" />
      </g>
      {/* back arm */}
      <g transform={`translate(-62 -280) rotate(${-st * 18 + 8})`}>
        <rect x="-18" y="0" width="36" height="120" rx="18" fill="#E9D5AE" />
        <circle cx="0" cy="124" r="20" fill={SKIN} />
      </g>
      {/* tunic + vest */}
      <path d="M-70 -300 Q0 -318 70 -300 L88 -110 Q0 -96 -88 -110 Z" fill="#F3E3C3" />
      <path d="M-70 -300 L-30 -300 L-40 -112 L-88 -110 Z" fill="#8A5A33" />
      <path d="M70 -300 L30 -300 L40 -112 L88 -110 Z" fill="#8A5A33" />
      <rect x="-86" y="-170" width="172" height="16" rx="8" fill="#C9A26B" />
      {/* satchel */}
      <path d="M-60 -298 L70 -150" stroke="#5A3A1E" strokeWidth="10" />
      <rect x="45" y="-170" width="62" height="58" rx="14" fill="#7A4A26" />
      {/* staff */}
      {staff && (
        <g transform={`translate(78 -200) rotate(${st * 4})`}>
          <path d="M0 200 L0 -230 Q0 -275 -35 -270" stroke="#9A6B3C" strokeWidth="13" fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* front arm (waves) */}
      <g transform={`translate(62 -280) rotate(${wave ? -150 + Math.sin(wave * 12) * 20 : st * 18 - 12})`}>
        <rect x="-18" y="0" width="36" height="120" rx="18" fill="#F3E3C3" />
        <circle cx="0" cy="124" r="20" fill={SKIN} />
      </g>
      {/* head */}
      <rect x="-16" y="-330" width="32" height="40" rx="12" fill="#D79E73" />
      <circle cx="0" cy="-385" r="72" fill={SKIN} />
      <ellipse cx="-62" cy="-380" rx="14" ry="18" fill="#D79E73" />
      {[[-50, -430, 34], [-15, -452, 36], [25, -448, 34], [55, -425, 28], [-62, -400, 22], [40, -460, 22]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={HAIR} />
      ))}
      <ellipse cx="18" cy="-385" rx="7" ry="10" fill="#2B1A10" />
      <ellipse cx="48" cy="-385" rx="7" ry="10" fill="#2B1A10" />
      <circle cx="20" cy="-389" r="2.5" fill="#FFF" />
      <circle cx="50" cy="-389" r="2.5" fill="#FFF" />
      <path d="M8 -404 Q20 -412 30 -404 M40 -404 Q50 -412 60 -404" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 -355 Q36 -342 52 -355" stroke="#8A3B2A" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="64" cy="-362" rx="12" ry="7" fill="#F08A80" opacity="0.6" />
    </g>
  );
};

export const SantiagoSleeping: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <ellipse cx="0" cy="10" rx="230" ry="22" fill="#000" opacity="0.25" />
    <path d="M-120 0 Q-130 -90 0 -95 Q150 -95 170 -10 L170 0 Z" fill="#8A5A33" />
    <path d="M-60 -60 Q40 -100 150 -50" stroke="#6B4A2E" strokeWidth="8" fill="none" opacity="0.6" />
    <circle cx="-175" cy="-55" r="62" fill={SKIN} />
    {[[-215, -95, 30], [-180, -110, 30], [-140, -95, 26], [-228, -60, 22]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={HAIR} />
    ))}
    <path d="M-185 -50 Q-175 -42 -165 -50 M-160 -50 Q-150 -42 -140 -50" stroke={HAIR} strokeWidth="5" fill="none" strokeLinecap="round" />
    <rect x="-270" y="-20" width="110" height="30" rx="15" fill="#C9A26B" />
    {[0, 1, 2].map((i) => {
      const p = ((t * 0.6 + i / 3) % 1);
      return (
        <text key={i} x={-140 + p * 90} y={-130 - p * 160} fontFamily="Fredoka" fontWeight={700} fontSize={36 + p * 30} fill="#FFFFFF" opacity={Math.sin(p * Math.PI)}>
          z
        </text>
      );
    })}
  </g>
);

export const Sheep: React.FC<{ t: number; ph?: number; face?: 1 | -1; sleep?: boolean }> = ({ t, ph = 0, face = 1, sleep }) => {
  const bob = sleep ? 0 : Math.abs(Math.sin(t * 4 + ph)) * 6;
  return (
    <g transform={`translate(0 ${-bob}) scale(${face} 1)`}>
      <ellipse cx="0" cy={bob + 4} rx="80" ry="12" fill="#000" opacity="0.15" />
      {!sleep && [-45, -18, 18, 45].map((x, i) => <rect key={i} x={x - 8} y="-50" width="16" height="52" rx="7" fill="#3B2F2F" />)}
      {[[-40, -80, 40], [0, -95, 46], [40, -80, 40], [-20, -60, 38], [25, -58, 38], [-55, -55, 28], [58, -55, 28]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={sleep ? y + 40 : y} r={r} fill={i % 2 ? "#F4F1EA" : "#FFFFFF"} />
      ))}
      <g transform={`translate(78 ${sleep ? -45 : -95}) rotate(${sleep ? 20 : Math.sin(t * 2 + ph) * 6})`}>
        <ellipse cx="0" cy="0" rx="30" ry="38" fill="#3B2F2F" />
        <ellipse cx="-26" cy="-18" rx="18" ry="9" fill="#3B2F2F" transform="rotate(-30 -26 -18)" />
        <ellipse cx="26" cy="-18" rx="18" ry="9" fill="#3B2F2F" transform="rotate(30 26 -18)" />
        {sleep ? (
          <path d="M-14 -4 Q-9 2 -4 -4 M4 -4 Q9 2 14 -4" stroke="#FFF" strokeWidth="4" fill="none" />
        ) : (
          <>
            <circle cx="-10" cy="-5" r="7" fill="#FFF" />
            <circle cx="10" cy="-5" r="7" fill="#FFF" />
            <circle cx="-9" cy="-4" r="3.5" fill="#111" />
            <circle cx="11" cy="-4" r="3.5" fill="#111" />
          </>
        )}
        <circle cx="0" cy="-36" r="14" fill="#FFFFFF" />
      </g>
    </g>
  );
};

export const OldKing: React.FC<{ t: number; reach?: number }> = ({ t, reach = 0 }) => (
  <g>
    <ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity="0.18" />
    <path d="M-85 -300 Q0 -320 85 -300 L115 0 L-115 0 Z" fill="#5B3A8A" />
    <path d="M-50 -300 L50 -300 L40 -160 L-40 -160 Z" fill="#E8B23A" />
    {[[-20, -260, "#E2504F"], [20, -260, "#2EC4B6"], [-20, -210, "#5EC8FF"], [20, -210, "#7BD46A"]].map(([x, y, c], i) => (
      <circle key={i} cx={x as number} cy={y as number} r="13" fill={c as string} stroke="#FFF3C4" strokeWidth="3" />
    ))}
    <g transform={`translate(70 -285) rotate(${-20 - reach * 60})`}>
      <rect x="-20" y="0" width="40" height="130" rx="20" fill="#6E4AA0" />
      <circle cx="0" cy="134" r="20" fill={SKIN} />
    </g>
    <g transform="translate(-95 -230)">
      <path d="M0 230 L0 -190" stroke="#9A6B3C" strokeWidth="12" strokeLinecap="round" />
    </g>
    <circle cx="0" cy="-380" r="68" fill={SKIN} />
    <path d="M-70 -400 Q-75 -330 -55 -310 L-48 -380 Z M70 -400 Q75 -330 55 -310 L48 -380 Z" fill="#F2F2F2" />
    <path d="M-52 -360 Q0 -330 52 -360 Q45 -250 0 -225 Q-45 -250 -52 -360 Z" fill="#FFFFFF" />
    <path d="M-20 -345 Q0 -335 20 -345" stroke="#C9C9C9" strokeWidth="5" fill="none" />
    <circle cx="-22" cy="-385" r="6" fill="#2B1A10" />
    <circle cx="22" cy="-385" r="6" fill="#2B1A10" />
    <path d="M-38 -402 Q-22 -410 -8 -402 M8 -402 Q22 -410 38 -402" stroke="#E6E6E6" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d={`M-45 -440 L-45 -475 L-22 -455 L0 -485 L22 -455 L45 -475 L45 -440 Z`} fill="#FFC93C" stroke="#E89A12" strokeWidth="4" />
    <circle cx="0" cy="-468" r={6 + Math.sin(t * 4) * 1.5} fill="#E2504F" />
  </g>
);

export const Child: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <circle r="120" cy="-130" fill="url(#glowG)" opacity={0.7 + 0.2 * Math.sin(t * 4)} />
    <path d="M-40 0 L-30 -140 Q0 -155 30 -140 L40 0 Z" fill="#FFF6D5" />
    <g transform={`translate(28 -130) rotate(${-70 + Math.sin(t * 3) * 5})`}>
      <rect x="-12" y="0" width="24" height="90" rx="12" fill="#FFF6D5" />
    </g>
    <circle cx="0" cy="-185" r="42" fill="#FFF6D5" />
  </g>
);

export const Pyramids: React.FC = () => (
  <g>
    <path d="M-330 0 L-130 -300 L70 0 Z" fill="#F2B866" />
    <path d="M-130 -300 L70 0 L-40 0 Z" fill="#D9963E" />
    <path d="M20 0 L250 -380 L480 0 Z" fill="#F7C67A" />
    <path d="M250 -380 L480 0 L350 0 Z" fill="#DE9F48" />
    <path d="M-520 0 L-400 -170 L-280 0 Z" fill="#F2B866" />
    <path d="M-400 -170 L-280 0 L-350 0 Z" fill="#D9963E" />
  </g>
);


/* ---------------- places ---------------- */
export const OliveTree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 0 Q-20 -80 0 -130 L14 -130 Q4 -80 14 0 Z" fill="#7A5230" />
    <circle cx="-40" cy="-160" r="55" fill="#6E8F45" />
    <circle cx="30" cy="-175" r="62" fill="#7FA250" />
    <circle cx="0" cy="-215" r="50" fill="#8BB05B" />
  </g>
);

export const Church: React.FC<{ t: number }> = ({ t }) => (
  <>
    <SkyG id="cSky" a="#1A1F5C" b="#4B3A9A" />
    {Array.from({ length: 50 }).map((_, i) => {
      const tw = 0.5 + 0.5 * Math.sin(t * (2 + rnd(i) * 3) + i);
      return <Sparkle key={i} x={rnd(i + 1) * 1080} y={rnd(i + 2) * 900} r={3 + rnd(i + 3) * 9 * tw} o={0.4 + 0.6 * tw} color="#FFFBE0" />;
    })}
    <g transform="translate(860 300)">
      <circle r="90" fill="url(#glowG)" opacity="0.4" />
      <circle r="60" fill="#FFF1A8" />
      <circle cx="26" cy="-14" r="52" fill="#1A1F5C" />
    </g>
    {/* ruined walls */}
    <path d="M80 1500 L80 820 L170 760 L230 800 L230 1500 Z" fill="#8C7E9E" />
    <path d="M850 1500 L850 760 L930 700 L1000 780 L1000 1500 Z" fill="#7C6E90" />
    <path d="M80 820 L300 640 L330 700 L230 800 Z" fill="#8C7E9E" />
    <path d="M1000 780 L780 600 L740 650 L850 760 Z" fill="#7C6E90" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i % 2 ? 100 : 130} y={880 + i * 100} width="80" height="40" rx="6" fill="#9E92AE" opacity="0.5" />)}
    <path d="M410 760 L410 640 Q470 560 530 640 L530 760" fill="none" stroke="#9E92AE" strokeWidth="18" opacity="0.6" />
    {/* the sycamore growing through */}
    <path d="M500 1520 Q470 1200 520 950 Q540 820 600 700 L650 710 Q600 830 600 960 Q590 1220 620 1520 Z" fill="#6B4A2E" />
    <circle cx="560" cy="560" r="170" fill="#3E7A4E" />
    <circle cx="420" cy="620" r="120" fill="#356B43" />
    <circle cx="720" cy="600" r="130" fill="#407F52" />
    <circle cx="600" cy="430" r="110" fill="#4A8A5B" />
    {/* floor */}
    <path d="M-300 1330 L1400 1330 L1400 2300 L-300 2300 Z" fill="#3A2F5E" />
    <ellipse cx="540" cy="1350" rx="600" ry="60" fill="#4A3D72" />
  </>
);


/* ---------------- book theme: prop shown in the library while this book is read ---------------- */
/** small item on the library window sill (origin = bottom centre, ~90px tall) */
export const BookProp: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <ellipse cx="0" cy="2" rx="62" ry="8" fill="#000" opacity="0.25" />
    {/* little golden pyramid */}
    <path d="M-60 0 L-25 -60 L10 0 Z" fill="#E8B23A" stroke="#2A1A12" strokeWidth="4" />
    <path d="M-25 -60 L10 0 L-10 0 Z" fill="#C9951F" />
    {/* alchemist's flask with a glowing drop */}
    <path d="M30 -70 L48 -70 L48 -48 Q70 -30 62 -8 Q56 2 39 2 Q22 2 16 -8 Q8 -30 30 -48 Z" fill="#BFE4FF" fillOpacity="0.75" stroke="#2A1A12" strokeWidth="4" />
    <path d="M14 -20 Q39 -10 64 -20 Q62 -2 39 0 Q16 -2 14 -20 Z" fill="#FFC93C" opacity={0.75 + 0.25 * Math.sin(t * 3)} />
    <rect x="27" y="-80" width="24" height="12" rx="4" fill="#8A5A3A" stroke="#2A1A12" strokeWidth="3" />
  </g>
);

/* ---------------- character sheet (render: npx remotion still BookSheet) ---------------- */
const Label: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="34" fill="#2A1A12">{text}</text>
);
export const CharacterSheet: React.FC<{ t: number }> = ({ t }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width="1080" height="1920" fill="#FFF6E6" />
    <text x="540" y="110" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="56" fill="#2A1A12">The Alchemist · characters</text>
    <g transform="translate(270 640)"><Santiago /></g><Label x={270} y={700} text="Santiago" />
    <g transform="translate(270 1240) scale(0.9)"><Santiago walk={0.25} face={-1} /></g><Label x={270} y={1300} text="Santiago · walk" />
    <g transform="translate(800 640)"><OldKing t={t} /></g><Label x={800} y={700} text="The Old King" />
    <g transform="translate(800 1240) scale(1.2)"><Sheep t={t} /></g><Label x={800} y={1300} text="Sheep" />
    <g transform="translate(330 1600) scale(0.9)"><SantiagoSleeping t={t} /></g><Label x={300} y={1680} text="Santiago · sleeping" />
    <g transform="translate(800 1620)"><BookProp t={t} /></g><Label x={800} y={1680} text="Library prop" />
  </svg>
);
