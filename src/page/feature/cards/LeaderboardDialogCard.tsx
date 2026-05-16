import { motion } from "framer-motion";
import { Trophy, Medal, Award, Zap, Flame } from "lucide-react";

interface Jugador {
  nombre: string;
  puntos: number;
}

// ─── Misma lógica de tiers que LeaderboardCard ───────────────────────────────

const PODIUM_ICONS: Record<number, React.ReactNode> = {
  1: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)]" />,
  2: <Medal  className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />,
  3: <Award  className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]" />,
};

const TIER: Record<number, {
  card: string; rank: string; avatar: string;
  name: string; sub: string; score: string; badge: string;
}> = {
  1: {
    card:   "border border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]",
    rank:   "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-black italic",
    avatar: "bg-yellow-500 text-black font-black border-2 border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    name:   "text-yellow-400 font-black uppercase tracking-wider",
    sub:    "text-yellow-500/70 font-mono",
    score:  "text-yellow-300 font-black text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-mono",
    badge:  "bg-yellow-500 text-black font-black uppercase tracking-widest border border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)] rounded-full px-2.5",
  },
  2: {
    card:   "border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]",
    rank:   "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-black italic",
    avatar: "bg-cyan-400 text-black font-black border-2 border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.5)]",
    name:   "text-cyan-300 font-bold uppercase tracking-wider",
    sub:    "text-cyan-500/70 font-mono",
    score:  "text-cyan-300 font-black text-2xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-mono",
    badge:  "bg-cyan-400 text-black font-black uppercase tracking-widest border border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full px-2.5",
  },
  3: {
    card:   "border border-orange-500/50 bg-gradient-to-r from-orange-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]",
    rank:   "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] font-black italic",
    avatar: "bg-orange-500 text-black font-black border-2 border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
    name:   "text-orange-400 font-bold uppercase tracking-wider",
    sub:    "text-orange-500/70 font-mono",
    score:  "text-orange-400 font-black text-2xl drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] font-mono",
    badge:  "bg-orange-500 text-black font-black uppercase tracking-widest border border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)] rounded-full px-2.5",
  },
};

const DEFAULT = {
  card:   "border border-gray-700/50 bg-[#0d1117] hover:border-emerald-500/40 hover:bg-gradient-to-r hover:from-emerald-900/20 hover:to-[#0d1117] shadow-lg",
  rank:   "text-gray-500 font-black italic",
  avatar: "bg-gray-800 text-gray-400 font-bold border border-gray-700",
  name:   "text-gray-200 font-semibold uppercase tracking-wide",
  sub:    "text-gray-500 font-mono",
  score:  "text-emerald-400 font-black font-mono text-xl drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]",
  badge:  "bg-gray-800 text-gray-300 border border-gray-700 rounded-full px-2.5",
};

const BADGES = ["Primero", "Segundo", "Tercero"];

// Icono secundario del badge (igual al LeaderboardDialog original)
const BADGE_ICONS: Record<number, React.ReactNode> = {
  1: <Trophy className="w-3 h-3" />,
  2: <Zap    className="w-3 h-3" />,
  3: <Flame  className="w-3 h-3" />,
};

// ─── Componente ──────────────────────────────────────────────────────────────

export function LeaderboardDialogCard({
  jugador,
  rank,
  index,
}: {
  jugador: Jugador;
  rank: number;
  index: number;
}) {
  const t = TIER[rank] ?? DEFAULT;
  const esTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <div
        className={`flex items-center gap-3 sm:gap-4 px-4 py-4 w-full rounded-xl transition-all duration-300 ${t.card}`}
      >
        {/* Rank / ícono de podio */}
        <span className={`w-6 sm:w-7 flex items-center justify-center shrink-0 ${t.rank}`}>
          {esTop3 ? PODIUM_ICONS[rank] : <span className="text-xl">{rank}</span>}
        </span>

        {/* Avatar de iniciales */}
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-sm flex items-center justify-center text-sm shrink-0 ${t.avatar}`}
        >
          {jugador.nombre.slice(0, 2).toUpperCase()}
        </div>

        {/* Nombre + badge */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm sm:text-base truncate ${t.name}`}>{jugador.nombre}</p>

            {esTop3 && (
              <span
                className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] py-0.5 mt-0.5 ${t.badge}`}
              >
                {BADGE_ICONS[rank]}
                {BADGES[rank - 1]}
              </span>
            )}
          </div>

          {/* Sub-label: WRs en lugar de "N Runs" */}
          <p className={`text-xs mt-0.5 opacity-80 ${t.sub}`}>
            {jugador.puntos} {jugador.puntos === 1 ? "WR" : "WRs"}
          </p>
        </div>

        {/* Puntos */}
        <span className={`tabular-nums shrink-0 ${t.score}`}>{jugador.puntos}</span>
      </div>
    </motion.div>
  );
}