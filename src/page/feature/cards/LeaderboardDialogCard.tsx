import { motion } from "framer-motion";
import { Trophy, Medal, Award, Zap, Flame } from "lucide-react";

interface Jugador {
  nombre: string;
  puntos: number;
}

// ─── Misma lógica de tiers que LeaderboardCard ───────────────────────────────

const PODIUM_ICONS: Record<number, React.ReactNode> = {
  1: <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />,
  2: <Medal  className="w-5 h-5 sm:w-6 sm:h-6" />,
  3: <Award  className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const TIER: Record<number, {
  card: string; rank: string; avatar: string;
  name: string; sub: string; score: string; badge: string;
}> = {
  1: {
    card:   "border border-gold/50 bg-gradient-to-r from-gold/15 to-card shadow-[0_0_20px_-8px_var(--gold)] hover:shadow-[0_0_28px_-6px_var(--gold)]",
    rank:   "text-gold font-black italic",
    avatar: "bg-gold text-brand-foreground font-black border-2 border-gold/60",
    name:   "text-gold font-black uppercase tracking-wider",
    sub:    "text-gold/70 font-mono",
    score:  "text-gold font-black text-2xl font-mono",
    badge:  "bg-gold text-brand-foreground font-black uppercase tracking-widest border border-gold/60 rounded-full px-2.5",
  },
  2: {
    card:   "border border-accent2/50 bg-gradient-to-r from-accent2/15 to-card shadow-[0_0_20px_-8px_var(--accent2)] hover:shadow-[0_0_28px_-6px_var(--accent2)]",
    rank:   "text-accent2 font-black italic",
    avatar: "bg-accent2 text-accent2-foreground font-black border-2 border-accent2/60",
    name:   "text-accent2 font-bold uppercase tracking-wider",
    sub:    "text-accent2/70 font-mono",
    score:  "text-accent2 font-black text-2xl font-mono",
    badge:  "bg-accent2 text-accent2-foreground font-black uppercase tracking-widest border border-accent2/60 rounded-full px-2.5",
  },
  3: {
    card:   "border border-brand/50 bg-gradient-to-r from-brand/15 to-card shadow-[0_0_20px_-8px_var(--brand)] hover:shadow-[0_0_28px_-6px_var(--brand)]",
    rank:   "text-brand font-black italic",
    avatar: "bg-brand text-brand-foreground font-black border-2 border-brand/60",
    name:   "text-brand font-bold uppercase tracking-wider",
    sub:    "text-brand/70 font-mono",
    score:  "text-brand font-black text-2xl font-mono",
    badge:  "bg-brand text-brand-foreground font-black uppercase tracking-widest border border-brand/60 rounded-full px-2.5",
  },
};

const DEFAULT = {
  card:   "border border-border bg-card hover:border-brand/40 hover:bg-brand/5 shadow-lg",
  rank:   "text-muted-foreground font-black italic",
  avatar: "bg-muted text-muted-foreground font-bold border border-border",
  name:   "text-foreground font-semibold uppercase tracking-wide",
  sub:    "text-muted-foreground font-mono",
  score:  "text-success font-black font-mono text-xl",
  badge:  "bg-muted text-muted-foreground border border-border rounded-full px-2.5",
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
