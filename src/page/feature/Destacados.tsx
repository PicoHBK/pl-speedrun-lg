// Destacados.tsx — lo mejor de la data: podio de WRs, duelos reñidos y juegos más disputados
import { Trophy, Medal, Award, Swords, Flame } from "lucide-react";
import type { Jugador, Juego } from "../landing/types/types";
import type { LigaStats } from "../utils/stats";
import { formatGap, nombreSinMultiplicador } from "../utils/stats";

// ─── Card contenedora ────────────────────────────────────────────────────────

function PanelCard({ icon, titulo, children, onClick, cta }: {
  icon: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
  onClick?: () => void;
  cta?: string;
}) {
  return (
    <div className="flex flex-col bg-card/60 border border-border rounded-xl backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            {titulo}
          </span>
        </div>
        {onClick && cta && (
          <button
            onClick={onClick}
            className="text-[9px] font-mono uppercase tracking-wider text-brand hover:text-accent2 transition-colors"
          >
            {cta} →
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1 p-2">{children}</div>
    </div>
  );
}

// ─── Podio ───────────────────────────────────────────────────────────────────

const PODIO = [
  { icon: <Trophy className="w-4 h-4" />, color: "text-gold", bg: "bg-gold/10 border-gold/30" },
  { icon: <Medal className="w-4 h-4" />, color: "text-accent2", bg: "bg-accent2/10 border-accent2/30" },
  { icon: <Award className="w-4 h-4" />, color: "text-brand", bg: "bg-brand/10 border-brand/30" },
];

function PodioRow({ jugador, pos, maxPuntos }: { jugador: Jugador; pos: number; maxPuntos: number }) {
  const p = PODIO[pos];
  const pct = maxPuntos > 0 ? Math.max(8, (jugador.puntos / maxPuntos) * 100) : 0;
  return (
    <div className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 ${p.bg}`}>
      <span className={`shrink-0 ${p.color}`}>{p.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-bold text-foreground truncate">{jugador.nombre}</span>
          <span className={`text-sm font-black font-mono tabular-nums shrink-0 ${p.color}`}>
            {jugador.puntos} <span className="text-[9px] font-normal opacity-70">WR</span>
          </span>
        </div>
        <div className="mt-1 h-1 rounded-full bg-muted/60 overflow-hidden">
          <div className={`h-full rounded-full ${pos === 0 ? "bg-gold" : pos === 1 ? "bg-accent2" : "bg-brand"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Duelos ──────────────────────────────────────────────────────────────────

function DueloRow({ duelo, onSelect }: { duelo: LigaStats["duelos"][number]; onSelect: (j: Juego) => void }) {
  return (
    <button
      onClick={() => onSelect(duelo.juego)}
      className="group flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-left transition-colors hover:border-destructive/40 hover:bg-destructive/5"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate leading-tight">
          {nombreSinMultiplicador(duelo.juego.nombre)}
        </p>
        <p className="text-[10px] font-mono text-muted-foreground truncate leading-tight">
          <span className="text-foreground/90">{duelo.lider}</span>
          <span className="mx-1 text-destructive">vs</span>
          <span>{duelo.rival}</span>
        </p>
      </div>
      <span className="shrink-0 text-xs font-mono font-black text-destructive tabular-nums">
        +{formatGap(duelo.gapSegundos)}
      </span>
    </button>
  );
}

// ─── Más disputados ──────────────────────────────────────────────────────────

function DisputadoRow({ juego, maxRunners, onSelect }: { juego: Juego; maxRunners: number; onSelect: (j: Juego) => void }) {
  const pct = maxRunners > 0 ? (juego.runners.length / maxRunners) * 100 : 0;
  return (
    <button
      onClick={() => onSelect(juego)}
      className="group flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2.5 py-1.5 text-left transition-colors hover:border-accent2/40 hover:bg-accent2/5"
    >
      {juego.imagen && (
        <img
          src={juego.imagen}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          className="w-6 h-8 rounded object-cover border border-border shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate leading-tight">
          {nombreSinMultiplicador(juego.nombre)}
        </p>
        <div className="mt-1 h-1 rounded-full bg-muted/60 overflow-hidden">
          <div className="h-full rounded-full bg-accent2" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="shrink-0 text-xs font-mono font-black text-accent2 tabular-nums">
        {juego.runners.length} <span className="text-[9px] font-normal opacity-70">run.</span>
      </span>
    </button>
  );
}

// ─── Sección ─────────────────────────────────────────────────────────────────

interface DestacadosProps {
  jugadores: Jugador[];
  stats: LigaStats;
  onVerTabla: () => void;
  onSelectJuego: (j: Juego) => void;
}

export function Destacados({ jugadores, stats, onVerTabla, onSelectJuego }: DestacadosProps) {
  const top3 = jugadores.slice(0, 3);
  const maxPuntos = top3[0]?.puntos ?? 0;
  const duelos = stats.duelos.slice(0, 3);
  const disputados = stats.masDisputados.slice(0, 3);
  const maxRunners = disputados[0]?.runners.length ?? 0;

  if (top3.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <PanelCard
        icon={<Trophy className="w-4 h-4 text-gold" />}
        titulo="Podio de récords"
        onClick={onVerTabla}
        cta="Tabla completa"
      >
        {top3.map((j, i) => (
          <PodioRow key={j.nombre} jugador={j} pos={i} maxPuntos={maxPuntos} />
        ))}
      </PanelCard>

      {duelos.length > 0 && (
        <PanelCard icon={<Swords className="w-4 h-4 text-destructive" />} titulo="Duelos al rojo vivo">
          {duelos.map((d) => (
            <DueloRow key={d.juego.nombre} duelo={d} onSelect={onSelectJuego} />
          ))}
        </PanelCard>
      )}

      {disputados.length > 0 && (
        <PanelCard icon={<Flame className="w-4 h-4 text-accent2" />} titulo="Los más disputados">
          {disputados.map((j) => (
            <DisputadoRow key={j.nombre} juego={j} maxRunners={maxRunners} onSelect={onSelectJuego} />
          ))}
        </PanelCard>
      )}
    </div>
  );
}
