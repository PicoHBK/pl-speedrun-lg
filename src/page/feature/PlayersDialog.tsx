import { useState } from "react";
import { Users, Trophy, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Juego } from "../landing/types/types";

interface PlayerRun {
  juego: Juego;
  esRecord: boolean;
  tiempo: string;
}

interface PlayerData {
  nombre: string;
  runs: PlayerRun[];
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
    .map(([nombre, runs]) => ({ nombre, runs }))
    .sort((a, b) => b.runs.filter((r) => r.esRecord).length - a.runs.filter((r) => r.esRecord).length);
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ run, openDown }: { run: PlayerRun; openDown: boolean }) {
  const record = run.juego.runners[0];
  return (
    <div className="pointer-events-none" style={{ zIndex: 9999 }}>
      {openDown && (
        <div className="w-2.5 h-2.5 bg-[#0d1b2e] border-l border-t border-blue-500/30 rotate-45 mx-auto mb-[-5px] relative z-10" />
      )}
      <div className="bg-[#0d1b2e] border border-blue-500/30 rounded-xl px-3 py-2.5 shadow-2xl shadow-blue-950/80 min-w-[190px]">
        <p className="font-bold text-blue-100 text-xs mb-2 max-w-[210px] truncate leading-tight">
          {run.juego.nombre}
        </p>
        {run.esRecord ? (
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0" />
            <span className="text-green-400 font-mono font-bold text-xs">{run.tiempo}</span>
            <span className="text-blue-400/60 text-xs">record</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400/60 text-xs flex items-center gap-1">
                <Trophy className="w-3 h-3 text-yellow-400" />
                {record.nombre}
              </span>
              <span className="text-green-400 font-mono font-bold text-xs">{record.tiempo}</span>
            </div>
            <div className="w-full h-px bg-blue-500/20" />
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400/60 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                Tiempo
              </span>
              <span className="text-blue-200 font-mono font-bold text-xs">{run.tiempo}</span>
            </div>
          </div>
        )}
      </div>
      {!openDown && (
        <div className="w-2.5 h-2.5 bg-[#0d1b2e] border-r border-b border-blue-500/30 rotate-45 mx-auto -mt-1.5" />
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
        run.esRecord ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]" : "bg-blue-900 border border-blue-700/60"
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
  const records = player.runs.filter((r) => r.esRecord).length;
  return (
    <div className={`rounded-xl px-3 py-2.5 border transition-colors ${
      isHighlighted
        ? "bg-yellow-500/10 border-yellow-400/30"
        : "bg-blue-500/5 border-blue-500/10"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-400/30 w-4">{index + 1}</span>
          <span className={`text-sm font-bold ${isHighlighted ? "text-yellow-300" : "text-blue-100"}`}>
            {isHighlighted && <Trophy className="w-3 h-3 text-yellow-400 inline mr-1 mb-0.5" />}
            {player.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            records > 0
              ? "bg-green-900/40 text-green-400 border border-green-500/30"
              : "bg-blue-900/30 text-blue-400/40 border border-blue-500/20"
          }`}>
            {records} WR
          </span>
          <span className="text-xs font-mono text-blue-400/40">{player.runs.length} runs</span>
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
  const records = player.runs.filter((r) => r.esRecord).length;
  return (
    <tr
      className={`border-b border-blue-500/10 last:border-0 transition-colors ${
        isHighlighted ? "bg-yellow-500/10 border-l-2 border-l-yellow-400/60" : "hover:bg-blue-500/5"
      }`}
      style={{ position: "relative", zIndex: 0 }}
      onMouseEnter={(e) => (e.currentTarget.style.zIndex = "50")}
      onMouseLeave={(e) => (e.currentTarget.style.zIndex = "0")}
    >
      <td className="py-3 px-3 text-xs text-blue-400/40 font-mono">{index + 1}</td>
      <td className={`py-3 px-3 font-semibold whitespace-nowrap ${isHighlighted ? "text-yellow-300" : "text-blue-100"}`}>
        {isHighlighted && <Trophy className="w-3 h-3 text-yellow-400 inline mr-1.5 mb-0.5" />}
        {player.nombre}
      </td>
      <td className="py-3 px-3 text-center">
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
          records > 0
            ? "bg-green-900/40 text-green-400 border border-green-500/30"
            : "bg-blue-900/30 text-blue-400/40 border border-blue-500/20"
        }`}>
          {records}
        </span>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-xs font-mono text-blue-400/50">{player.runs.length}</span>
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
    <div className="overflow-y-auto overflow-x-visible flex-1 pr-1">
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
        <thead className="sticky top-0" style={{ background: "#060f1a" }}>
          <tr className="text-left text-blue-400/50 text-xs border-b border-blue-500/20">
            <th className="pb-2 pt-1 px-3 font-medium w-8">#</th>
            <th className="pb-2 pt-1 px-3 font-medium">Player</th>
            <th className="pb-2 pt-1 px-3 font-medium text-center w-24">Records</th>
            <th className="pb-2 pt-1 px-3 font-medium text-center w-16">Runs</th>
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
    <DialogHeader className="border-b border-blue-500/20 pb-3">
      <DialogTitle className="flex items-center gap-2 text-blue-100 flex-wrap">
        <Users className="w-4 h-4 text-blue-400" />
        Players
        <span className="text-xs font-normal text-blue-400/50 font-mono ml-1">
          {count} runners
        </span>
        <div className="flex items-center gap-3 text-xs text-blue-400/50 font-mono ml-1 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            Tiene el record
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-900 border border-blue-700/60 inline-block" />
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
    <div className="border-t border-blue-500/20 pt-3 mt-1 flex items-center gap-4 text-xs text-blue-400/40 font-mono flex-wrap">
      <span>{juegos.length} juegos totales</span>
      <span>·</span>
      <span>{juegos.filter((j) => j.runners.length > 0).length} con runs</span>
    </div>
  );
}

// ─── PlayersDialog ────────────────────────────────────────────────────────────

export function PlayersDialog({ juegos, open, onClose }: PlayersDialogProps) {
  const players = buildPlayers(juegos);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-[95vw] w-[95vw] border border-blue-500/20 text-white max-h-[85vh] overflow-y-hidden flex flex-col"
        style={{ background: "#060f1a" }}
      >
        <PlayersHeader count={players.length} />
        <PlayersTable players={players} />
        <PlayersFooter juegos={juegos} />
      </DialogContent>
    </Dialog>
  );
}