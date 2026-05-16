import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trophy, Medal, Award } from "lucide-react";

interface DesglosePorJuego {
  juego: string;
  posicion: number;
  totalRunners: number;
  ptsBase: number;
  multiplicador: number;
  ptsFinal: number;
  img?: string;
}

interface JugadorConDesglose {
  nombre: string;
  puntos: number;
  desglose: DesglosePorJuego[];
}

const PODIUM_ICONS: Record<number, React.ReactNode> = {
  1: <Trophy className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)]" />,
  2: <Medal className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />,
  3: <Award className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]" />,
};

const TIER: Record<number, {
  card: string; rank: string; avatar: string;
  name: string; sub: string; score: string;
  badge: string; expand: string; row: string;
}> = {
  1: {
    card: "border border-yellow-500/50 bg-gradient-to-r from-yellow-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)]",
    rank: "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-black italic",
    avatar: "bg-yellow-500 text-black font-black border-2 border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    name: "text-yellow-400 font-black uppercase tracking-wider",
    sub: "text-yellow-500/70 font-mono",
    score: "text-yellow-300 font-black text-2xl drop-shadow-[0_0_8px_rgba(234,179,8,0.8)] font-mono",
    badge: "bg-yellow-500 text-black font-black uppercase tracking-widest border border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)] rounded-full px-2.5",
    expand: "border-x border-b border-yellow-500/40 bg-[#050505]/95 backdrop-blur-md",
    row: "border-yellow-500/30",
  },
  2: {
    card: "border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]",
    rank: "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-black italic",
    avatar: "bg-cyan-400 text-black font-black border-2 border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.5)]",
    name: "text-cyan-300 font-bold uppercase tracking-wider",
    sub: "text-cyan-500/70 font-mono",
    score: "text-cyan-300 font-black text-2xl drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-mono",
    badge: "bg-cyan-400 text-black font-black uppercase tracking-widest border border-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full px-2.5",
    expand: "border-x border-b border-cyan-400/40 bg-[#050505]/95 backdrop-blur-md",
    row: "border-cyan-400/30",
  },
  3: {
    card: "border border-orange-500/50 bg-gradient-to-r from-orange-500/20 to-[#0a0a0a] shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_25px_rgba(249,115,22,0.3)]",
    rank: "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] font-black italic",
    avatar: "bg-orange-500 text-black font-black border-2 border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)]",
    name: "text-orange-400 font-bold uppercase tracking-wider",
    sub: "text-orange-500/70 font-mono",
    score: "text-orange-400 font-black text-2xl drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] font-mono",
    badge: "bg-orange-500 text-black font-black uppercase tracking-widest border border-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.5)] rounded-full px-2.5",
    expand: "border-x border-b border-orange-500/40 bg-[#050505]/95 backdrop-blur-md",
    row: "border-orange-500/30",
  },
};

const DEFAULT = {
  card: "border border-gray-700/50 bg-[#0d1117] hover:border-emerald-500/40 hover:bg-gradient-to-r hover:from-emerald-900/20 hover:to-[#0d1117] shadow-lg",
  rank: "text-gray-500 font-black italic",
  avatar: "bg-gray-800 text-gray-400 font-bold border border-gray-700",
  name: "text-gray-200 font-semibold uppercase tracking-wide",
  sub: "text-gray-500 font-mono",
  score: "text-emerald-400 font-black font-mono text-xl drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]",
  badge: "bg-gray-800 text-gray-300 border border-gray-700 rounded-full px-2.5",
  expand: "border-x border-b border-gray-700/50 bg-[#090c10]",
  row: "border-gray-700/50",
};

const BADGES = ["Primero", "Segundo", "Tercero"];

function nombreSinMultiplicador(nombre: string) {
  return nombre.replace(/\s*\[\d+\.?\d*\]$/, "");
}

export function LeaderboardCard({ jugador, rank, index }: {
  jugador: JugadorConDesglose;
  rank: number;
  index: number;
}) {
  const [abierto, setAbierto] = useState(false);
  const t = TIER[rank] ?? DEFAULT;
  const esTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="flex flex-col mb-3"
    >
      {/* Card principal */}
      <button
        onClick={() => setAbierto(p => !p)}
        className={`group flex items-center gap-3 sm:gap-4 px-4 py-4 w-full text-left rounded-xl transition-all duration-300 ${abierto ? "rounded-b-none border-b-0" : ""} ${t.card}`}
      >
        <span className={`w-6 sm:w-7 flex items-center justify-center shrink-0 ${t.rank}`}>
          {esTop3 ? PODIUM_ICONS[rank] : <span className="text-xl">{rank}</span>}
        </span>

        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-sm flex items-center justify-center text-sm shrink-0 transition-transform group-hover:scale-110 duration-300 ${t.avatar}`}>
          {jugador.nombre.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm sm:text-base truncate ${t.name}`}>{jugador.nombre}</p>
            {esTop3 && (
              <span className={`inline-block text-[9px] sm:text-[10px] py-0.5 mt-0.5 ${t.badge}`}>
                {BADGES[rank - 1]}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 opacity-80 ${t.sub}`}>
            {jugador.desglose.length} Runs
          </p>
        </div>

        <span className={`tabular-nums shrink-0 ${t.score}`}>
          {jugador.puntos}
        </span>
        <div className={`shrink-0 transition-transform duration-300 ${abierto ? "rotate-180" : ""} ${t.sub}`}>
          <ChevronDown className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-white" />
        </div>
      </button>

      {/* Desglose expandible */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden rounded-b-xl px-3 py-3 ${t.expand}`}
          >
            <div className="flex flex-col gap-2">
              {jugador.desglose.map((d, di) => (
                <div
                  key={di}
                  className={`flex gap-3 p-3 rounded-lg bg-black/40 border transition-colors hover:bg-white/5 ${t.row}`}
                >
                  {/* Poster de cine vertical — solo si hay imagen */}
                  {d.img && (
                    <div className="shrink-0 w-10 self-stretch rounded-md overflow-hidden border border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                      <img
                        src={d.img}
                        alt={nombreSinMultiplicador(d.juego)}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Info del juego */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {/* Nombre + puntos */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-semibold text-gray-200 text-sm leading-tight break-words flex-1">
                        {nombreSinMultiplicador(d.juego)}
                      </span>
                      <span className={`font-black text-sm shrink-0 ${t.rank}`}>
                        {d.ptsFinal} <span className="text-[10px] opacity-70 font-normal">PTS</span>
                      </span>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-gray-300">
                        <span className="opacity-50">POS</span>
                        <span className="font-bold text-white">
                          {d.posicion}<span className="opacity-40 font-normal">/{d.totalRunners}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-gray-300">
                        <span className="opacity-50">BASE</span>
                        <span className="font-bold text-white">{d.ptsBase}</span>
                      </div>

                      {d.multiplicador > 1 && (
                        <div className="flex items-center gap-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-fuchsia-300 shadow-[0_0_8px_rgba(232,121,249,0.15)]">
                          <span className="opacity-70">MULT</span>
                          <span className="font-black animate-pulse">×{d.multiplicador}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer total */}
            <div className={`flex justify-between items-center px-2 pt-3 mt-2 border-t text-sm font-mono ${t.row}`}>
              <span className="font-black tracking-widest text-white/90">TOTAL SCORE</span>
              <span className={`font-black text-lg ${t.score}`}>{jugador.puntos}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}