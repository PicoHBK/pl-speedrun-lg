// StatsStrip.tsx — banda compacta de métricas de la liga
import { Gamepad2, Users, Timer, Flag, Swords } from "lucide-react";
import type { LigaStats } from "../utils/stats";
import { formatDuracion } from "../utils/stats";

interface StatTileProps {
  icon: React.ReactNode;
  valor: string;
  label: string;
  accent?: string; // clase de color del icono/valor
}

function StatTile({ icon, valor, label, accent = "text-brand" }: StatTileProps) {
  return (
    <div className="flex items-center gap-2 bg-card/60 border border-border rounded-xl px-2.5 py-2 backdrop-blur-sm transition-colors hover:border-brand/40">
      <span className={`shrink-0 ${accent}`}>{icon}</span>
      <div className="flex flex-col min-w-0 leading-tight">
        <span className="text-base font-black tabular-nums text-foreground leading-none">
          {valor}
        </span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground truncate">
          {label}
        </span>
      </div>
    </div>
  );
}

export function StatsStrip({ stats }: { stats: LigaStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2">
      <StatTile icon={<Gamepad2 className="w-4 h-4" />} valor={String(stats.totalJuegos)} label="Juegos" />
      <StatTile icon={<Users className="w-4 h-4" />} valor={String(stats.totalRunners)} label="Runners" accent="text-accent2" />
      <StatTile icon={<Flag className="w-4 h-4" />} valor={String(stats.totalRuns)} label="Runs" accent="text-success" />
      <StatTile icon={<Timer className="w-4 h-4" />} valor={formatDuracion(stats.segundosTotales)} label="Tiempo corrido" accent="text-muted-foreground" />
      <StatTile icon={<Swords className="w-4 h-4" />} valor={String(stats.sinRival)} label="Récords libres" accent="text-gold" />
    </div>
  );
}
