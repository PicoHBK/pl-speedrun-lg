import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trophy, Medal, Award } from "lucide-react";
import { nombreSinMultiplicador } from "../../utils/stats";

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
  1: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
  2: <Medal className="w-5 h-5 sm:w-6 sm:h-6" />,
  3: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const TIER: Record<number, {
  card: string; rank: string; avatar: string;
  name: string; sub: string; score: string;
  badge: string; expand: string; row: string;
}> = {
  1: {
    card: "border border-gold/50 bg-gradient-to-r from-gold/15 to-card shadow-[0_0_20px_-8px_var(--gold)] hover:shadow-[0_0_28px_-6px_var(--gold)]",
    rank: "text-gold font-black italic",
    avatar: "bg-gold text-brand-foreground font-black border-2 border-gold/60",
    name: "text-gold font-black uppercase tracking-wider",
    sub: "text-gold/70 font-mono",
    score: "text-gold font-black text-2xl font-mono",
    badge: "bg-gold text-brand-foreground font-black uppercase tracking-widest border border-gold/60 rounded-full px-2.5",
    expand: "border-x border-b border-gold/40 bg-card/95 backdrop-blur-md",
    row: "border-gold/25",
  },
  2: {
    card: "border border-accent2/50 bg-gradient-to-r from-accent2/15 to-card shadow-[0_0_20px_-8px_var(--accent2)] hover:shadow-[0_0_28px_-6px_var(--accent2)]",
    rank: "text-accent2 font-black italic",
    avatar: "bg-accent2 text-accent2-foreground font-black border-2 border-accent2/60",
    name: "text-accent2 font-bold uppercase tracking-wider",
    sub: "text-accent2/70 font-mono",
    score: "text-accent2 font-black text-2xl font-mono",
    badge: "bg-accent2 text-accent2-foreground font-black uppercase tracking-widest border border-accent2/60 rounded-full px-2.5",
    expand: "border-x border-b border-accent2/40 bg-card/95 backdrop-blur-md",
    row: "border-accent2/25",
  },
  3: {
    card: "border border-brand/50 bg-gradient-to-r from-brand/15 to-card shadow-[0_0_20px_-8px_var(--brand)] hover:shadow-[0_0_28px_-6px_var(--brand)]",
    rank: "text-brand font-black italic",
    avatar: "bg-brand text-brand-foreground font-black border-2 border-brand/60",
    name: "text-brand font-bold uppercase tracking-wider",
    sub: "text-brand/70 font-mono",
    score: "text-brand font-black text-2xl font-mono",
    badge: "bg-brand text-brand-foreground font-black uppercase tracking-widest border border-brand/60 rounded-full px-2.5",
    expand: "border-x border-b border-brand/40 bg-card/95 backdrop-blur-md",
    row: "border-brand/25",
  },
};

const DEFAULT = {
  card: "border border-border bg-card hover:border-brand/40 hover:bg-brand/5 shadow-lg",
  rank: "text-muted-foreground font-black italic",
  avatar: "bg-muted text-muted-foreground font-bold border border-border",
  name: "text-foreground font-semibold uppercase tracking-wide",
  sub: "text-muted-foreground font-mono",
  score: "text-success font-black font-mono text-xl",
  badge: "bg-muted text-muted-foreground border border-border rounded-full px-2.5",
  expand: "border-x border-b border-border bg-card/80",
  row: "border-border",
};

const BADGES = ["Primero", "Segundo", "Tercero"];

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
          <ChevronDown className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-foreground" />
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
                  className={`flex gap-3 p-3 rounded-lg bg-muted/40 border transition-colors hover:bg-muted/70 ${t.row}`}
                >
                  {/* Poster de cine vertical — solo si hay imagen */}
                  {d.img && (
                    <div className="shrink-0 w-10 self-stretch rounded-md overflow-hidden border border-border shadow-md">
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
                      <span className="font-semibold text-foreground text-sm leading-tight break-words flex-1">
                        {nombreSinMultiplicador(d.juego)}
                      </span>
                      <span className={`font-black text-sm shrink-0 ${t.rank}`}>
                        {d.ptsFinal} <span className="text-[10px] opacity-70 font-normal">PTS</span>
                      </span>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1.5 bg-muted/60 border border-border px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-muted-foreground">
                        <span className="opacity-60">POS</span>
                        <span className="font-bold text-foreground">
                          {d.posicion}<span className="opacity-50 font-normal">/{d.totalRunners}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-muted/60 border border-border px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-muted-foreground">
                        <span className="opacity-60">BASE</span>
                        <span className="font-bold text-foreground">{d.ptsBase}</span>
                      </div>

                      {d.multiplicador > 1 && (
                        <div className="flex items-center gap-1.5 bg-accent2/10 border border-accent2/30 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-mono text-accent2">
                          <span className="opacity-80">MULT</span>
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
              <span className="font-black tracking-widest text-foreground/90">TOTAL SCORE</span>
              <span className={`font-black text-lg ${t.score}`}>{jugador.puntos}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
