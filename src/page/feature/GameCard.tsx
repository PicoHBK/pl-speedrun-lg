import { useState } from "react";
import { Gamepad2, Clock, Trophy, User, Zap } from "lucide-react";
import type { Juego } from "../landing/types/types";

// ─── Keyframes — 10 tiers únicos ─────────────────────────────────────────────
const ANIMATION_STYLES = `
  /* Idle glow — escala de sutil a explosivo */
  @keyframes idle1  { 0%,100%{box-shadow:0 0 6px 1px rgba(113,113,122,0.3)}   50%{box-shadow:0 0 14px 3px rgba(113,113,122,0.55)} }
  @keyframes idle2  { 0%,100%{box-shadow:0 0 8px 2px rgba(34,197,94,0.35)}    50%{box-shadow:0 0 18px 4px rgba(34,197,94,0.65)} }
  @keyframes idle3  { 0%,100%{box-shadow:0 0 10px 2px rgba(6,182,212,0.4)}    50%{box-shadow:0 0 22px 5px rgba(6,182,212,0.75)} }
  @keyframes idle4  { 0%,100%{box-shadow:0 0 12px 2px rgba(59,130,246,0.4)}   50%{box-shadow:0 0 26px 6px rgba(59,130,246,0.8)} }
  @keyframes idle5  { 0%,100%{box-shadow:0 0 14px 3px rgba(99,102,241,0.45)}  50%{box-shadow:0 0 30px 7px rgba(99,102,241,0.85)} }
  @keyframes idle6  { 0%,100%{box-shadow:0 0 16px 3px rgba(139,92,246,0.5)}   50%{box-shadow:0 0 36px 8px rgba(139,92,246,0.9)} }
  @keyframes idle7  { 0%,100%{box-shadow:0 0 18px 4px rgba(217,70,239,0.5)}   50%{box-shadow:0 0 42px 10px rgba(217,70,239,0.9)} }
  @keyframes idle8  { 0%,100%{box-shadow:0 0 22px 4px rgba(244,63,94,0.5)}    50%{box-shadow:0 0 50px 12px rgba(244,63,94,0.9)} }
  @keyframes idle9  { 0%,100%{box-shadow:0 0 26px 5px rgba(251,146,60,0.55)}  50%{box-shadow:0 0 60px 14px rgba(251,146,60,0.95),0 0 90px 20px rgba(239,68,68,0.5)} }
  @keyframes idle10 {
    0%  {box-shadow:0 0 30px 6px rgba(239,68,68,0.6),0 0 60px 12px rgba(251,146,60,0.4)}
    33% {box-shadow:0 0 40px 8px rgba(251,146,60,0.7),0 0 80px 16px rgba(239,68,68,0.5)}
    66% {box-shadow:0 0 35px 7px rgba(239,68,68,0.65),0 0 70px 14px rgba(253,224,71,0.4)}
    100%{box-shadow:0 0 30px 6px rgba(239,68,68,0.6),0 0 60px 12px rgba(251,146,60,0.4)}
  }

  /* Hover glow explosivo — inset + outer */
  @keyframes hover1  { 0%,100%{box-shadow:inset 0 0 20px 4px rgba(113,113,122,0.2),0 0 30px 6px rgba(113,113,122,0.35)}  50%{box-shadow:inset 0 0 40px 8px rgba(113,113,122,0.35),0 0 55px 12px rgba(212,212,216,0.5)} }
  @keyframes hover2  { 0%,100%{box-shadow:inset 0 0 25px 5px rgba(34,197,94,0.25),0 0 40px 8px rgba(34,197,94,0.5)}       50%{box-shadow:inset 0 0 55px 12px rgba(34,197,94,0.45),0 0 70px 16px rgba(74,222,128,0.65)} }
  @keyframes hover3  { 0%,100%{box-shadow:inset 0 0 28px 6px rgba(6,182,212,0.28),0 0 45px 9px rgba(6,182,212,0.55)}      50%{box-shadow:inset 0 0 60px 14px rgba(6,182,212,0.5),0 0 80px 18px rgba(34,211,238,0.7)} }
  @keyframes hover4  { 0%,100%{box-shadow:inset 0 0 30px 6px rgba(59,130,246,0.28),0 0 50px 10px rgba(59,130,246,0.6)}    50%{box-shadow:inset 0 0 65px 15px rgba(59,130,246,0.5),0 0 90px 20px rgba(96,165,250,0.72)} }
  @keyframes hover5  { 0%,100%{box-shadow:inset 0 0 32px 7px rgba(99,102,241,0.3),0 0 55px 11px rgba(99,102,241,0.62)}    50%{box-shadow:inset 0 0 70px 16px rgba(99,102,241,0.52),0 0 95px 22px rgba(129,140,248,0.75)} }
  @keyframes hover6  { 0%,100%{box-shadow:inset 0 0 35px 8px rgba(139,92,246,0.32),0 0 58px 12px rgba(139,92,246,0.65)}   50%{box-shadow:inset 0 0 75px 18px rgba(139,92,246,0.55),0 0 100px 24px rgba(167,139,250,0.78)} }
  @keyframes hover7  { 0%,100%{box-shadow:inset 0 0 38px 8px rgba(217,70,239,0.32),0 0 62px 13px rgba(217,70,239,0.65)}   50%{box-shadow:inset 0 0 80px 20px rgba(217,70,239,0.56),0 0 110px 26px rgba(232,121,249,0.8)} }
  @keyframes hover8  { 0%,100%{box-shadow:inset 0 0 42px 10px rgba(244,63,94,0.35),0 0 68px 14px rgba(244,63,94,0.68)}    50%{box-shadow:inset 0 0 88px 22px rgba(244,63,94,0.6),0 0 120px 28px rgba(251,113,133,0.82)} }
  @keyframes hover9  {
    0%,100%{box-shadow:inset 0 0 50px 12px rgba(251,146,60,0.38),0 0 75px 16px rgba(251,146,60,0.72),0 0 120px 24px rgba(239,68,68,0.45)}
    50%    {box-shadow:inset 0 0 95px 24px rgba(251,146,60,0.62),0 0 130px 30px rgba(239,68,68,0.85),0 0 160px 36px rgba(251,146,60,0.5)}
  }
  @keyframes hover10 {
    0%  {box-shadow:inset 0 0 60px 14px rgba(239,68,68,0.42),0 0 80px 18px rgba(239,68,68,0.78),0 0 140px 30px rgba(251,146,60,0.5)}
    33% {box-shadow:inset 0 0 80px 18px rgba(251,146,60,0.55),0 0 110px 24px rgba(251,146,60,0.85),0 0 160px 36px rgba(253,224,71,0.45)}
    66% {box-shadow:inset 0 0 70px 16px rgba(239,68,68,0.5),0 0 95px 22px rgba(239,68,68,0.82),0 0 150px 32px rgba(251,146,60,0.48)}
    100%{box-shadow:inset 0 0 60px 14px rgba(239,68,68,0.42),0 0 80px 18px rgba(239,68,68,0.78),0 0 140px 30px rgba(251,146,60,0.5)}
  }

  /* Border glow inset imagen */
  @keyframes bg1  { 0%,100%{box-shadow:inset 0 0 8px 1px rgba(113,113,122,0.2)}   50%{box-shadow:inset 0 0 18px 4px rgba(113,113,122,0.45)} }
  @keyframes bg2  { 0%,100%{box-shadow:inset 0 0 10px 2px rgba(34,197,94,0.25)}    50%{box-shadow:inset 0 0 22px 5px rgba(34,197,94,0.55)} }
  @keyframes bg3  { 0%,100%{box-shadow:inset 0 0 12px 2px rgba(6,182,212,0.28)}    50%{box-shadow:inset 0 0 26px 6px rgba(6,182,212,0.6)} }
  @keyframes bg4  { 0%,100%{box-shadow:inset 0 0 12px 2px rgba(59,130,246,0.3)}    50%{box-shadow:inset 0 0 28px 6px rgba(59,130,246,0.65)} }
  @keyframes bg5  { 0%,100%{box-shadow:inset 0 0 14px 3px rgba(99,102,241,0.3)}    50%{box-shadow:inset 0 0 30px 7px rgba(99,102,241,0.68)} }
  @keyframes bg6  { 0%,100%{box-shadow:inset 0 0 14px 3px rgba(139,92,246,0.32)}   50%{box-shadow:inset 0 0 32px 7px rgba(139,92,246,0.7)} }
  @keyframes bg7  { 0%,100%{box-shadow:inset 0 0 16px 3px rgba(217,70,239,0.32)}   50%{box-shadow:inset 0 0 34px 8px rgba(217,70,239,0.72)} }
  @keyframes bg8  { 0%,100%{box-shadow:inset 0 0 18px 4px rgba(244,63,94,0.35)}    50%{box-shadow:inset 0 0 38px 9px rgba(244,63,94,0.75)} }
  @keyframes bg9  { 0%,100%{box-shadow:inset 0 0 20px 4px rgba(251,146,60,0.38)}   50%{box-shadow:inset 0 0 42px 10px rgba(251,146,60,0.78),inset 0 0 60px 14px rgba(239,68,68,0.4)} }
  @keyframes bg10 {
    0%  {box-shadow:inset 0 0 24px 5px rgba(239,68,68,0.42)}
    33% {box-shadow:inset 0 0 44px 11px rgba(251,146,60,0.55),inset 0 0 70px 16px rgba(253,224,71,0.3)}
    66% {box-shadow:inset 0 0 36px 8px rgba(239,68,68,0.48),inset 0 0 55px 13px rgba(251,146,60,0.38)}
    100%{box-shadow:inset 0 0 24px 5px rgba(239,68,68,0.42)}
  }

  /* Shimmer diagonal */
  @keyframes shimmer {
    0%   { transform: translateX(-150%) skewX(-20deg); }
    100% { transform: translateX(350%) skewX(-20deg); }
  }
`;

interface GameCardProps {
  juego: Juego;
  onClick: () => void;
}

function extraerMultiplicador(nombre: string): number {
  const match = nombre.match(/\[(\d+\.?\d*)\]$/);
  return match ? parseFloat(match[1]) : 1;
}
function nombreSinMultiplicador(nombre: string): string {
  return nombre.replace(/\s*\[\d+\.?\d*\]$/, "");
}
function puntosMaximos(juego: Juego): number {
  const mult = extraerMultiplicador(juego.nombre);
  // +1 porque si el usuario entra, ya sería un runner más
  const ptsBase = Math.min(10, juego.runners.length + 1);
  return parseFloat((ptsBase * mult).toFixed(1));
}

interface TierConfig {
  borderStyle: string;         // color de borde inline
  idleAnimation: string;
  hoverGlowAnimation: string;
  borderGlowAnimation: string;
  shimmerColor: string;
  tagBg: string;
  tagShadow: string;
  tagTextColor: string;
  badgeBg: string;
  badgeTextColor: string;
  ptsBg: string;
  ptsTextColor: string;
  ptsShadow: string;
  titleColor: string;
  titleHoverColor: string;
}

// 10 tiers — gris apagado → verde → cyan → azul → índigo → violeta → fuchsia → rosa-rojo → naranja fuego → rojo/naranja/dorado
const TIERS: Record<number, TierConfig> = {
  1: {
    borderStyle: "#52525b",
    idleAnimation: "idle1 3s ease-in-out infinite",
    hoverGlowAnimation: "hover1 1.8s ease-in-out infinite",
    borderGlowAnimation: "bg1 3s ease-in-out infinite",
    shimmerColor: "rgba(200,200,210,0.15)",
    tagBg: "linear-gradient(90deg,#18181b,#52525b,#18181b)",
    tagShadow: "0 0 10px rgba(113,113,122,0.5)",
    tagTextColor: "#d4d4d8",
    badgeBg: "#3f3f46", badgeTextColor: "#fff",
    ptsBg: "#3f3f46", ptsTextColor: "#d4d4d8",
    ptsShadow: "3px 3px 0 #18181b",
    titleColor: "#d4d4d8", titleHoverColor: "#fff",
  },
  2: {
    borderStyle: "#16a34a",
    idleAnimation: "idle2 2.8s ease-in-out infinite",
    hoverGlowAnimation: "hover2 1.7s ease-in-out infinite",
    borderGlowAnimation: "bg2 2.8s ease-in-out infinite",
    shimmerColor: "rgba(74,222,128,0.2)",
    tagBg: "linear-gradient(90deg,#052e16,#16a34a,#052e16)",
    tagShadow: "0 0 14px rgba(34,197,94,0.8)",
    tagTextColor: "#fff",
    badgeBg: "#166534", badgeTextColor: "#fff",
    ptsBg: "#15803d", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #052e16",
    titleColor: "#bbf7d0", titleHoverColor: "#4ade80",
  },
  3: {
    borderStyle: "#0891b2",
    idleAnimation: "idle3 2.6s ease-in-out infinite",
    hoverGlowAnimation: "hover3 1.6s ease-in-out infinite",
    borderGlowAnimation: "bg3 2.6s ease-in-out infinite",
    shimmerColor: "rgba(34,211,238,0.22)",
    tagBg: "linear-gradient(90deg,#083344,#0891b2,#083344)",
    tagShadow: "0 0 16px rgba(6,182,212,0.9)",
    tagTextColor: "#fff",
    badgeBg: "#155e75", badgeTextColor: "#fff",
    ptsBg: "#0e7490", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #083344",
    titleColor: "#a5f3fc", titleHoverColor: "#22d3ee",
  },
  4: {
    borderStyle: "#2563eb",
    idleAnimation: "idle4 2.4s ease-in-out infinite",
    hoverGlowAnimation: "hover4 1.6s ease-in-out infinite",
    borderGlowAnimation: "bg4 2.4s ease-in-out infinite",
    shimmerColor: "rgba(96,165,250,0.22)",
    tagBg: "linear-gradient(90deg,#172554,#2563eb,#172554)",
    tagShadow: "0 0 18px rgba(59,130,246,0.9)",
    tagTextColor: "#fff",
    badgeBg: "#1e40af", badgeTextColor: "#fff",
    ptsBg: "#1d4ed8", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #172554",
    titleColor: "#bfdbfe", titleHoverColor: "#60a5fa",
  },
  5: {
    borderStyle: "#4338ca",
    idleAnimation: "idle5 2.2s ease-in-out infinite",
    hoverGlowAnimation: "hover5 1.5s ease-in-out infinite",
    borderGlowAnimation: "bg5 2.2s ease-in-out infinite",
    shimmerColor: "rgba(129,140,248,0.24)",
    tagBg: "linear-gradient(90deg,#1e1b4b,#4338ca,#1e1b4b)",
    tagShadow: "0 0 20px rgba(99,102,241,0.95)",
    tagTextColor: "#fff",
    badgeBg: "#312e81", badgeTextColor: "#fff",
    ptsBg: "#3730a3", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #1e1b4b",
    titleColor: "#c7d2fe", titleHoverColor: "#818cf8",
  },
  6: {
    borderStyle: "#7c3aed",
    idleAnimation: "idle6 2s ease-in-out infinite",
    hoverGlowAnimation: "hover6 1.5s ease-in-out infinite",
    borderGlowAnimation: "bg6 2s ease-in-out infinite",
    shimmerColor: "rgba(167,139,250,0.25)",
    tagBg: "linear-gradient(90deg,#2e1065,#7c3aed,#2e1065)",
    tagShadow: "0 0 22px rgba(139,92,246,1)",
    tagTextColor: "#fff",
    badgeBg: "#4c1d95", badgeTextColor: "#fff",
    ptsBg: "#5b21b6", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #2e1065",
    titleColor: "#ddd6fe", titleHoverColor: "#a78bfa",
  },
  7: {
    borderStyle: "#a21caf",
    idleAnimation: "idle7 1.9s ease-in-out infinite",
    hoverGlowAnimation: "hover7 1.4s ease-in-out infinite",
    borderGlowAnimation: "bg7 1.9s ease-in-out infinite",
    shimmerColor: "rgba(232,121,249,0.26)",
    tagBg: "linear-gradient(90deg,#4a044e,#a21caf,#4a044e)",
    tagShadow: "0 0 24px rgba(217,70,239,1),0 0 50px rgba(217,70,239,0.5)",
    tagTextColor: "#fff",
    badgeBg: "#701a75", badgeTextColor: "#fff",
    ptsBg: "#86198f", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #4a044e",
    titleColor: "#f5d0fe", titleHoverColor: "#e879f9",
  },
  8: {
    borderStyle: "#e11d48",
    idleAnimation: "idle8 1.8s ease-in-out infinite",
    hoverGlowAnimation: "hover8 1.4s ease-in-out infinite",
    borderGlowAnimation: "bg8 1.8s ease-in-out infinite",
    shimmerColor: "rgba(251,113,133,0.28)",
    tagBg: "linear-gradient(90deg,#4c0519,#e11d48,#4c0519)",
    tagShadow: "0 0 26px rgba(244,63,94,1),0 0 55px rgba(244,63,94,0.55)",
    tagTextColor: "#fff",
    badgeBg: "#881337", badgeTextColor: "#fff",
    ptsBg: "#9f1239", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #4c0519",
    titleColor: "#fecdd3", titleHoverColor: "#fb7185",
  },
  9: {
    borderStyle: "#ea580c",
    idleAnimation: "idle9 1.7s ease-in-out infinite",
    hoverGlowAnimation: "hover9 1.3s ease-in-out infinite",
    borderGlowAnimation: "bg9 1.7s ease-in-out infinite",
    shimmerColor: "rgba(253,186,116,0.3)",
    tagBg: "linear-gradient(90deg,#431407,#ea580c,#dc2626,#ea580c,#431407)",
    tagShadow: "0 0 28px rgba(251,146,60,1),0 0 60px rgba(239,68,68,0.6)",
    tagTextColor: "#fff",
    badgeBg: "#9a3412", badgeTextColor: "#fff",
    ptsBg: "#c2410c", ptsTextColor: "#fff",
    ptsShadow: "3px 3px 0 #431407",
    titleColor: "#fed7aa", titleHoverColor: "#fb923c",
  },
  10: {
    borderStyle: "#dc2626",
    idleAnimation: "idle10 1.5s ease-in-out infinite",
    hoverGlowAnimation: "hover10 1.2s ease-in-out infinite",
    borderGlowAnimation: "bg10 1.5s ease-in-out infinite",
    shimmerColor: "rgba(253,224,71,0.32)",
    tagBg: "linear-gradient(90deg,#7f1d1d,#dc2626,#f59e0b,#dc2626,#7f1d1d)",
    tagShadow: "0 0 30px rgba(239,68,68,1),0 0 70px rgba(251,146,60,0.7),0 0 100px rgba(239,68,68,0.4)",
    tagTextColor: "#fff",
    badgeBg: "#991b1b", badgeTextColor: "#fef08a",
    ptsBg: "#b91c1c", ptsTextColor: "#fef08a",
    ptsShadow: "3px 3px 0 #7f1d1d",
    titleColor: "#fef9c3", titleHoverColor: "#fde047",
  },
};

function getTier(pts: number): TierConfig {
  const key = Math.min(10, Math.max(1, Math.floor(pts)));
  return TIERS[key] ?? TIERS[1];
}

export function GameCard({ juego, onClick }: GameCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mult = extraerMultiplicador(juego.nombre);
  const maxPts = puntosMaximos(juego);
  const tier = getTier(maxPts);

  return (
    <>
      <style>{ANIMATION_STYLES}</style>

      <div
        className="relative"
        style={{ padding: "16px 12px 8px 12px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          onClick={onClick}
          className="group relative bg-zinc-950 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300"
          style={{
            borderColor: tier.borderStyle,
            animation: hovered ? tier.hoverGlowAnimation : tier.idleAnimation,
          }}
        >

          {/* TAG SUPERIOR CENTRAL */}
          <div
            className="absolute z-40 font-black text-[11px] uppercase tracking-widest select-none text-center"
            style={{
              top: "-1px",
              left: "50%",
              transform: "translateX(-50%)",
              background: tier.tagBg,
              boxShadow: tier.tagShadow,
              color: tier.tagTextColor,
              padding: "5px 16px",
              borderRadius: "0 0 6px 6px",
              border: "2px solid rgba(255,255,255,0.18)",
              borderTop: "none",
              letterSpacing: "0.08em",
              minWidth: "120px",
              whiteSpace: "nowrap",
            }}
          >
            Potencial: {maxPts} pts
          </div>

          {/* BADGE MULTIPLICADOR */}
          <div className="absolute top-8 left-0 z-30">
            <div
              className="px-3 py-1 flex items-center gap-1 font-black italic text-xs"
              style={{
                background: mult >= 2 ? "#d97706" : mult > 1 ? "#7c3aed" : mult < 1 ? "#dc2626" : "#3f3f46",
                color: mult >= 2 ? "#000" : "#fff",
                clipPath: "polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%)",
                paddingRight: "18px",
              }}
            >
              <Zap className="w-3 h-3 fill-current" />
              X{mult}
            </div>
          </div>

          {/* BADGE PUNTOS */}
          <div className="absolute top-8 right-2 z-30">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-sm font-black text-sm"
              style={{
                background: tier.ptsBg,
                color: tier.ptsTextColor,
                boxShadow: tier.ptsShadow,
              }}
            >
              {maxPts} pts
            </div>
          </div>

          {/* IMAGEN */}
          <div
            className="relative w-full overflow-hidden bg-zinc-900"
            style={{
              aspectRatio: "12/16",
              animation: tier.borderGlowAnimation,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent z-10 pointer-events-none" />

            {/* Shimmer diagonal en hover */}
            <div
              className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
              style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "40%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${tier.shimmerColor}, transparent)`,
                  animation: hovered ? "shimmer 1.6s ease-in-out infinite" : "none",
                }}
              />
            </div>

            {/* Imagen sin ningún filtro */}
            {juego.imagen && !imgError ? (
              <img
                src={juego.imagen}
                alt={juego.nombre}
                onError={() => setImgError(true)}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-zinc-800" strokeWidth={1} />
              </div>
            )}

            {/* Info flotante */}
            <div className="absolute bottom-3 left-3 right-3 z-30 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="bg-cyan-500 text-black p-1 rounded-sm">
                  <Clock className="w-3 h-3 stroke-[3px]" />
                </div>
                <span className="text-white font-black text-sm tracking-widest drop-shadow-md">
                  {juego.record}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-zinc-200 text-black p-1 rounded-sm">
                  <Trophy className="w-3 h-3" />
                </div>
                <span className="text-zinc-200 font-bold text-[11px] uppercase tracking-tight truncate">
                  {juego.quien}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-900 relative z-30">
            <h3
              className="font-black text-sm leading-tight line-clamp-1 uppercase tracking-tighter transition-all duration-300"
              style={{ color: hovered ? tier.titleHoverColor : tier.titleColor }}
            >
              {nombreSinMultiplicador(juego.nombre)}
            </h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                <User className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-bold text-zinc-400">{juego.runners.length} RUNNERS</span>
              </div>
              <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-400 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}