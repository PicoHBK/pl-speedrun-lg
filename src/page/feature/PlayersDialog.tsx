import { useState, useMemo } from "react";
import { Users, Trophy, Clock, Timer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Juego } from "../landing/types/types";
import { tiempoASegundos } from "../utils/utils";
import { formatDuracion } from "../utils/stats";

interface PlayerRun {
  juego: Juego;
  esRecord: boolean;
  tiempo: string;
}

interface PlayerData {
  nombre: string;
  runs: PlayerRun[];
  records: number;
  segundosTotal: number;
}

interface PlayersDialogProps {
  juegos: Juego[];
  open: boolean;
  onClose: () => void;
}

function buildPlayers(juegos: Juego[]): PlayerData[] {
  const map = new Map<string, PlayerRun[]>();
  for (const juego of juegos) {
    for (const runner of juego.runners) {
      if (!map.has(runner.nombre)) map.set(runner.nombre, []);
      map.get(runner.nombre)!.push({ juego, esRecord: runner.esRecord, tiempo: runner.tiempo });
    }
  }
  return Array.from(map.entries())
    .map(([nombre, runs]) => {
      const records = runs.filter((r) => r.esRecord).length;
      const segundosTotal = runs.reduce((acc, r) => {
        const s = tiempoASegundos(r.tiempo);
        return acc + (Number.isFinite(s) ? s : 0);
      }, 0);
      return { nombre, runs, records, segundosTotal };
    })
    .sort((a, b) => b.records - a.records || b.runs.length - a.runs.length);
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ run, openDown }: { run: PlayerRun; openDown: boolean }) {
  const record = run.juego.runners[0];
  return (
    <div className="pointer-events-none" style={{ zIndex: 9999 }}>
      {openDown && (
        <div className="w-2.5 h-2.5 bg-popover border-l border-t border-border rotate-45 mx-auto mb-[-5px] relative z-10" />
      )}
      <div className="bg-popover border border-border rounded-xl px-3 py-2.5 shadow-2xl min-w-[190px]">
        <p className="font-bold text-foreground text-xs mb-2 max-w-[210px] truncate leading-tight">
          {run.juego.nombre}
        </p>
        {run.esRecord ? (
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-gold flex-shrink-0" />
            <span className="text-success font-mono font-bold text-xs">{run.tiempo}</span>
            <span className="text-muted-foreground text-xs">record</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Trophy className="w-3 h-3 text-gold" />
                {record.nombre}
              </span>
              <span className="text-success font-mono font-bold text-xs">{record.tiempo}</span>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-brand" />
                Tiempo
              </span>
              <span className="text-foreground font-mono font-bold text-xs">{run.tiempo}</span>
            </div>
          </div>
        )}
      </div>
      {!openDown && (
        <div className="w-2.5 h-2.5 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1.5" />
      )}
    </div>
  );
}

// ─── RunDot ───────────────────────────────────────────────────────────────────

function RunDot({ run, rowIndex, onHighlight }: {
  run: PlayerRun;
  rowIndex: number;
  onHighlight: (name: string | null) => void;
}) {
  const openDown = rowIndex <= 1;
  const recordHolder = run.juego.runners.find((r) => r.esRecord);
  return (
    <div
      className="relative group/dot flex-shrink-0 overflow-visible"
      style={{ zIndex: 0 }}
      onMouseEnter={() => { if (!run.esRecord && recordHolder) onHighlight(recordHolder.nombre); }}
      onMouseLeave={() => onHighlight(null)}
    >
      <div className={`w-3.5 h-3.5 rounded-full transition-transform duration-150 group-hover/dot:scale-125 cursor-default ${
        run.esRecord ? "bg-success shadow-[0_0_8px_var(--success)]" : "bg-muted border border-border"
      }`} />
      <div
        className="hidden group-hover/dot:block"
        style={{
          position: "absolute",
          ...(openDown ? { top: "100%", marginTop: "8px" } : { bottom: "100%", marginBottom: "12px" }),
          left: "50%", transform: "translateX(-50%)", zIndex: 9999,
        }}
      >
        <Tooltip run={run} openDown={openDown} />
      </div>
    </div>
  );
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function PlayerMobileCard({ player, index, isHighlighted, onHighlight }: {
  player: PlayerData;
  index: number;
  isHighlighted: boolean;
  onHighlight: (name: string | null) => void;
}) {
  const records = player.records;
  return (
    <div className={`rounded-xl px-3 py-2.5 border transition-colors ${
      isHighlighted
        ? "bg-gold/10 border-gold/30"
        : "bg-muted/40 border-border"
    }`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-muted-foreground w-4 shrink-0">{index + 1}</span>
          <span className={`text-sm font-bold truncate ${isHighlighted ? "text-gold" : "text-foreground"}`}>
            {isHighlighted && <Trophy className="w-3 h-3 text-gold inline mr-1 mb-0.5" />}
            {player.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            records > 0
              ? "bg-success/15 text-success border border-success/30"
              : "bg-muted/60 text-muted-foreground border border-border"
          }`}>
            {records} WR
          </span>
          <span className="flex items-center gap-1 text-xs font-mono text-gold" title="Tiempo total corrido">
            <Timer className="w-3 h-3" />
            {formatDuracion(player.segundosTotal)}
          </span>
          <span className="text-xs font-mono text-muted-foreground">{player.runs.length} runs</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 overflow-visible">
        {player.runs.map((run, j) => (
          <RunDot key={j} run={run} rowIndex={index} onHighlight={onHighlight} />
        ))}
      </div>
    </div>
  );
}

// ─── Desktop table row ────────────────────────────────────────────────────────

function PlayerRow({ player, index, isHighlighted, onHighlight }: {
  player: PlayerData;
  index: number;
  isHighlighted: boolean;
  onHighlight: (name: string | null) => void;
}) {
  const records = player.records;
  return (
    <tr
      className={`border-b border-border last:border-0 transition-colors ${
        isHighlighted ? "bg-gold/10 border-l-2 border-l-gold/60" : "hover:bg-muted/40"
      }`}
      style={{ position: "relative", zIndex: 0 }}
      onMouseEnter={(e) => (e.currentTarget.style.zIndex = "50")}
      onMouseLeave={(e) => (e.currentTarget.style.zIndex = "0")}
    >
      <td className="py-3 px-3 text-xs text-muted-foreground font-mono">{index + 1}</td>
      <td className={`py-3 px-3 font-semibold whitespace-nowrap ${isHighlighted ? "text-gold" : "text-foreground"}`}>
        {isHighlighted && <Trophy className="w-3 h-3 text-gold inline mr-1.5 mb-0.5" />}
        {player.nombre}
      </td>
      <td className="py-3 px-3 text-center">
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
          records > 0
            ? "bg-success/15 text-success border border-success/30"
            : "bg-muted/60 text-muted-foreground border border-border"
        }`}>
          {records}
        </span>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-xs font-mono text-muted-foreground">{player.runs.length}</span>
      </td>
      <td className="py-3 px-3 text-center whitespace-nowrap">
        <span className="text-xs font-mono font-bold text-gold tabular-nums">
          {formatDuracion(player.segundosTotal)}
        </span>
      </td>
      <td className="py-3 px-3 overflow-visible">
        <div className="flex flex-wrap gap-1.5 overflow-visible">
          {player.runs.map((run, j) => (
            <RunDot key={j} run={run} rowIndex={index} onHighlight={onHighlight} />
          ))}
        </div>
      </td>
    </tr>
  );
}

// ─── PlayersTable ─────────────────────────────────────────────────────────────

function PlayersTable({ players }: { players: PlayerData[] }) {
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null);

  return (
    <div className="overflow-y-auto overflow-x-visible flex-1 pr-1 custom-scrollbar">
      {/* Mobile */}
      <div className="flex flex-col gap-2 sm:hidden">
        {players.map((player, i) => (
          <PlayerMobileCard
            key={player.nombre}
            player={player}
            index={i}
            isHighlighted={highlightedPlayer === player.nombre}
            onHighlight={setHighlightedPlayer}
          />
        ))}
      </div>

      {/* Desktop */}
      <table className="hidden sm:table w-full text-sm overflow-visible">
        <thead className="sticky top-0 bg-card z-10">
          <tr className="text-left text-muted-foreground text-xs border-b border-border">
            <th className="pb-2 pt-1 px-3 font-medium w-8">#</th>
            <th className="pb-2 pt-1 px-3 font-medium">Player</th>
            <th className="pb-2 pt-1 px-3 font-medium text-center w-24">Records</th>
            <th className="pb-2 pt-1 px-3 font-medium text-center w-16">Runs</th>
            <th className="pb-2 pt-1 px-3 font-medium text-center w-24">Tiempo</th>
            <th className="pb-2 pt-1 px-3 font-medium">Games</th>
          </tr>
        </thead>
        <tbody className="overflow-visible">
          {players.map((player, i) => (
            <PlayerRow
              key={player.nombre}
              player={player}
              index={i}
              isHighlighted={highlightedPlayer === player.nombre}
              onHighlight={setHighlightedPlayer}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── PlayersHeader ────────────────────────────────────────────────────────────

function PlayersHeader({ count }: { count: number }) {
  return (
    <DialogHeader className="border-b border-border pb-3">
      <DialogTitle className="flex items-center gap-2 text-foreground flex-wrap">
        <Users className="w-4 h-4 text-brand" />
        Players
        <span className="text-xs font-normal text-muted-foreground font-mono ml-1">
          {count} runners
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono ml-1 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-success inline-block shadow-[0_0_6px_var(--success)]" />
            Tiene el record
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-muted border border-border inline-block" />
            Tiene una run
          </span>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}

// ─── PlayersFooter ────────────────────────────────────────────────────────────

function PlayersFooter({ juegos }: { juegos: Juego[] }) {
  return (
    <div className="border-t border-border pt-3 mt-1 flex items-center gap-4 text-xs text-muted-foreground font-mono flex-wrap">
      <span>{juegos.length} juegos totales</span>
      <span>·</span>
      <span>{juegos.filter((j) => j.runners.length > 0).length} con runs</span>
    </div>
  );
}

// ─── PlayersDialog ────────────────────────────────────────────────────────────

export function PlayersDialog({ juegos, open, onClose }: PlayersDialogProps) {
  const players = useMemo(() => buildPlayers(juegos), [juegos]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="panel-shell !max-w-[95vw] w-[95vw] border border-border text-foreground max-h-[85vh] overflow-y-hidden flex flex-col">
        <PlayersHeader count={players.length} />
        <PlayersTable players={players} />
        <PlayersFooter juegos={juegos} />
      </DialogContent>
    </Dialog>
  );
}
