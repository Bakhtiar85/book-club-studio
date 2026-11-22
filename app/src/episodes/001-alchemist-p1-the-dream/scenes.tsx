import React from "react";
import { Easing } from "remotion";
import { Cloud, Sun, Bird, House, SparkleField, Glow, lerp, pop } from "../../engine/kit";
import { at, SceneProps } from "../../engine/cues";
import { Frame, SkyG } from "../../engine/scene";
import { Santiago, SantiagoSleeping, Sheep, OldKing, Child, Pyramids, OliveTree, Church } from "../../books/the-alchemist/world";

type SP = SceneProps;

/** 1 — hills of Andalusia */
export const SceneHills: React.FC<SP> = ({ lt }) => {
  const pan = lt * 40;
  return (
    <Frame zoom={lerp(lt, 0, 5.5, 1.04, 1.1)}>
      <SkyG id="hSky" a="#7FD0FF" b="#FFE7B8" />
      <Sun x={820} y={420} t={lt} />
      <Cloud x={180 - pan * 0.2} y={330} s={0.9} />
      <Cloud x={700 - pan * 0.15} y={560} s={0.6} />
      {[0, 1].map((i) => <Bird key={i} x={300 + i * 80 + lt * 30} y={500 + i * 20} t={lt + i} s={0.7} />)}
      <g transform={`translate(${-pan * 0.3} 0)`}>
        <path d="M-300 1120 Q100 920 500 1060 Q800 940 1400 1080 L1400 1400 L-300 1400 Z" fill="#B8C87A" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${520 + i * 46} ${1010 - (i % 2) * 14})`}>
            <rect x="-20" y="-34" width="40" height="34" fill="#FFFFFF" />
            <path d="M-24 -34 L0 -52 L24 -34 Z" fill="#D9644A" />
          </g>
        ))}
      </g>
      <g transform={`translate(${-pan * 0.6} 0)`}>
        <path d="M-300 1180 Q200 1020 600 1130 Q1000 1040 1500 1160 L1500 1600 L-300 1600 Z" fill="#9DBA5E" />
        <OliveTree x={120} y={1150} s={0.9} />
        <OliveTree x={980} y={1160} s={1.1} />
      </g>
      <path d="M-300 1250 Q540 1160 1400 1250 L1400 2300 L-300 2300 Z" fill="#E7C877" />
      <path d="M-300 1520 Q540 1450 1400 1530 L1400 2300 L-300 2300 Z" fill="#D9B45E" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${130 + i * 125 - (i % 2) * 30} ${1360 + (i % 2) * 60}) scale(0.85)`}>
          <Sheep t={lt} ph={i} />
        </g>
      ))}
      <g transform="translate(770 1420) scale(1.1)">
        <Santiago walk={lt * 1.2} />
      </g>
    </Frame>
  );
};

/** 2 — sleeping in the ruined church */
export const SceneChurch: React.FC<SP> = ({ t, lt }) => (
  <Frame zoom={lerp(lt, 0, 5.4, 1.0, 1.08)} cy={1250}>
    <Church t={t} />
    <g transform="translate(170 1400) scale(0.7)"><Sheep t={lt} sleep face={-1} /></g>
    <g transform="translate(940 1410) scale(0.75)"><Sheep t={lt} sleep /></g>
    <g transform="translate(580 1420) scale(1.25)"><SantiagoSleeping t={lt} /></g>
  </Frame>
);

/** 3 — the recurring dream of the pyramids */
export const SceneDream: React.FC<SP> = ({ t, lt, s0 }) => {
  const tTreasure = at("treasure", 4) - s0;
  const tPyr = at("pyramids", 4) - s0;
  const bub = lerp(lt, 0.1, 1.0, 0, 1, Easing.out(Easing.back(1.2)));
  const chest = pop(lt, tTreasure - 0.1, 0.5);
  const walk = lerp(lt, 1.2, tPyr + 0.3, -280, 40);
  return (
    <Frame>
      <rect x="-300" y="-300" width="1680" height="2520" fill="#120F33" />
      <g opacity="0.55"><Church t={t} /></g>
      <g transform="translate(580 1420) scale(1.25)"><SantiagoSleeping t={lt} /></g>
      {/* bubble trail */}
      {[0, 1, 2].map((i) => <circle key={i} cx={330 + i * 45} cy={1320 - i * 50} r={(10 + i * 7) * Math.min(1, bub * 2)} fill="#FFFFFF" />)}
      <defs>
        <clipPath id="dreamClip"><circle cx="540" cy="760" r={440 * bub} /></clipPath>
        <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB86B" />
          <stop offset="1" stopColor="#FFE9B0" />
        </linearGradient>
      </defs>
      <circle cx="540" cy="760" r={450 * bub} fill="#FFFFFF" />
      <g clipPath="url(#dreamClip)">
        <rect x="0" y="300" width="1080" height="1100" fill="url(#dSky)" />
        <circle cx="780" cy="560" r="90" fill="#FFF4C2" />
        <g transform={`translate(560 ${980}) scale(${lerp(lt, 0, 7, 0.95, 1.08)})`}><Pyramids /></g>
        <path d="M0 980 Q300 930 600 990 Q850 1040 1080 970 L1080 1400 L0 1400 Z" fill="#F7D28F" />
        <path d="M0 1100 Q400 1050 1080 1120 L1080 1400 L0 1400 Z" fill="#EEC074" />
        <g transform={`translate(${540 + walk} 1130) scale(0.9)`}><Child t={lt} /></g>
        {chest > 0 && (
          <g transform={`translate(760 1150) scale(${chest})`}>
            <circle r="160" cy="-50" fill="url(#glowG)" />
            <rect x="-80" y="-70" width="160" height="90" rx="12" fill="#A8622F" />
            <path d="M-80 -70 Q0 -150 80 -70 Z" fill="#C97A3E" />
            <rect x="-80" y="-40" width="160" height="14" fill="#FFC93C" />
            <rect x="-14" y="-52" width="28" height="30" rx="6" fill="#FFC93C" />
            <SparkleField t={lt} n={10} x={-140} y={-220} w={280} h={200} seed={9} size={22} />
          </g>
        )}
      </g>
      <circle cx="540" cy="760" r={450 * bub} fill="none" stroke="#FFFFFF" strokeWidth="18" />
    </Frame>
  );
};

/** 4 — the mysterious old king */
export const SceneKing: React.FC<SP> = ({ lt, s0 }) => {
  const tPL = at("Personal", 5) - s0;
  const ban = pop(lt, tPL - 0.1, 0.55);
  return (
    <Frame zoom={lerp(lt, 0, 6.6, 1.0, 1.06)} cy={1200}>
      <SkyG id="kSky" a="#6CC6FF" b="#D8F1FF" />
      <Cloud x={220 + lt * 10} y={320} s={0.8} />
      <House x={150} y={1120} w={260} h={420} tint="#FFFFFF" />
      <House x={930} y={1120} w={280} h={460} tint="#FFFFFF" dome />
      <House x={540} y={1040} w={240} h={300} tint="#F7F3EA" />
      <path d="M-300 1100 L1400 1100 L1400 2300 L-300 2300 Z" fill="#E9D6B0" />
      {Array.from({ length: 24 }).map((_, i) => (
        <rect key={i} x={(i % 6) * 190 - 40 + ((Math.floor(i / 6)) % 2) * 95} y={1140 + Math.floor(i / 6) * 90} width="170" height="70" rx="14" fill="#DCC69C" />
      ))}
      {/* bench */}
      <rect x="140" y="1330" width="360" height="30" rx="12" fill="#9A6B3C" />
      <rect x="170" y="1360" width="22" height="70" fill="#7A4A26" />
      <rect x="450" y="1360" width="22" height="70" fill="#7A4A26" />
      <g transform="translate(330 1440) scale(1.05)"><OldKing t={lt} reach={lerp(lt, tPL - 0.6, tPL, 0, 1)} /></g>
      <g transform="translate(800 1450) scale(1.05)"><Santiago face={-1} /></g>
      {/* Personal Legend ribbon */}
      <g transform={`translate(540 760) scale(${ban}) rotate(-3)`}>
        <Glow x={0} y={0} r={360} o={0.9} />
        <path d="M-430 -70 L430 -70 L470 0 L430 70 L-430 70 L-470 0 Z" fill="#E2504F" />
        <text y="22" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="74" fill="#FFF3C4" letterSpacing="3">PERSONAL LEGEND</text>
        <SparkleField t={lt} n={12} x={-460} y={-160} w={920} h={320} seed={7} size={24} />
      </g>
    </Frame>
  );
};

/** 5 — sells his sheep, sails for Africa */
export const SceneSail: React.FC<SP> = ({ lt, s0 }) => {
  const tSail = at("sails", 6) - s0;
  const boatX = lerp(lt, tSail - 0.6, 4.3, 330, 760, Easing.inOut(Easing.quad));
  const shore = lerp(lt, tSail - 0.6, 4.3, 0, -160);
  return (
    <Frame>
      <SkyG id="sSky" a="#FF8A6B" b="#FFD59A" />
      <circle cx="540" cy="1080" r="200" fill="#FFE07A" />
      <circle cx="540" cy="1080" r="300" fill="url(#glowG)" opacity="0.6" />
      <Cloud x={200} y={420} s={0.7} o={0.7} />
      <Cloud x={860} y={560} s={0.5} o={0.6} />
      {/* Africa on the horizon */}
      <path d="M760 1110 Q860 1040 960 1080 Q1040 1050 1180 1100 L1180 1130 L760 1130 Z" fill="#B85C6B" opacity={lerp(lt, 1.5, 3.0, 0.3, 1)} />
      <text x="960" y="1020" textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize="40" fill="#FFFFFF" opacity={lerp(lt, 2.2, 2.8, 0, 0.95)}>AFRICA</text>
      {/* sea */}
      <rect x="-300" y="1110" width="1680" height="1200" fill="#3E8FD8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M-300 ${1170 + i * 110} ${Array.from({ length: 14 }).map((_, k) => `Q${-260 + k * 120 + ((lt * 60 + i * 40) % 120)} ${1150 + i * 110} ${-200 + k * 120 + ((lt * 60 + i * 40) % 120)} ${1170 + i * 110}`).join(" ")}`} stroke="#8FD0FF" strokeWidth="8" fill="none" opacity={0.7 - i * 0.1} />
      ))}
      {/* Spanish shore with sheep left behind */}
      <g transform={`translate(${shore} 0)`}>
        <path d="M-300 1220 Q100 1180 260 1300 L260 2300 L-300 2300 Z" fill="#E7C877" />
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${30 + i * 75} ${1300 + i * 60}) scale(0.6)`}><Sheep t={lt} ph={i} face={1} /></g>)}
      </g>
      {/* boat */}
      <g transform={`translate(${boatX} ${1330 + Math.sin(lt * 2.5) * 10}) rotate(${Math.sin(lt * 2) * 3})`}>
        <path d="M-200 -20 L200 -20 L150 60 L-150 60 Z" fill="#8A4A22" />
        <rect x="-200" y="-30" width="400" height="20" rx="8" fill="#A8622F" />
        <rect x="-8" y="-420" width="16" height="400" fill="#6B3A1A" />
        <path d="M14 -400 Q180 -260 14 -60 Z" fill="#FFF7E8" />
        <path d="M-14 -360 Q-130 -230 -14 -100 Z" fill="#F3E3C3" />
        <g transform="translate(-110 -25) scale(0.5)"><Santiago staff={false} wave={lt < tSail + 1.5 ? lt : 0} face={-1} /></g>
      </g>
    </Frame>
  );
};


/** scene id (from script.json "scene") -> component */
export const SCENES: Record<string, React.FC<SP>> = { hills: SceneHills, church: SceneChurch, dream: SceneDream, king: SceneKing, sail: SceneSail };
