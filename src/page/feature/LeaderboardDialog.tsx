import { Trophy, Zap, Flame } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Jugador } from "../landing/types/types";

interface LeaderboardDialogProps {
  jugadores: Jugador[];
  open: boolean;
  onClose: () => void;
}

function medalConfig(i: number) {
  if (i === 0) return {
    row: "bg-yellow-500/10 border border-yellow-400/20",
    rank: "text-yellow-400",
    name: "text-yellow-200",
    pts: "bg-yellow-400/20 text-yellow-300",
    icon: <Trophy className="w-3.5 h-3.5 text-yellow-400" />,
  };
  if (i === 1) return {
    row: "bg-gray-300/5 border border-gray-300/10",
    rank: "text-gray-300",
    name: "text-gray-200",
    pts: "bg-gray-300/10 text-gray-300",
    icon: <Zap className="w-3.5 h-3.5 text-gray-300" />,
  };
  if (i === 2) return {
    row: "bg-amber-500/10 border border-amber-500/20",
    rank: "text-amber-400",
    name: "text-amber-200",
    pts: "bg-amber-500/20 text-amber-400",
    icon: <Flame className="w-3.5 h-3.5 text-amber-400" />,
  };
  return {
    row: "bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10",
    rank: "text-blue-400/30",
    name: "text-blue-200/60",
    pts: "bg-blue-900/40 text-blue-400/60",
    icon: null,
  };
}

export function LeaderboardDialog({ jugadores, open, onClose }: LeaderboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-lg w-[95vw] border border-blue-500/20 text-white max-h-[85vh] overflow-y-auto flex flex-col"
        style={{ background: "#060f1a" }}
      >
        <DialogHeader className="border-b border-blue-500/20 pb-3">
          <DialogTitle className="flex items-center gap-2 text-blue-100">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Leaderboard
            <span className="text-xs font-normal text-blue-400/50 font-mono ml-1">
              {jugadores.length} runners
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Column headers */}
        <div className="flex items-center gap-3 px-4 pt-2 pb-1 text-xs font-mono text-blue-400/30">
          <span className="w-4 text-center">#</span>
          <span className="flex-1">runner</span>
          <span className="w-14 text-center">
            <span className="flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" />WRs
            </span>
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-1.5 pb-2">
          {jugadores.map((j, i) => {
            const m = medalConfig(i);
            return (
              <div
                key={j.nombre}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${m.row}`}
              >
                <div className="w-4 flex-shrink-0 flex justify-center">
                  {m.icon ?? (
                    <span className={`text-xs font-mono font-black ${m.rank}`}>{i + 1}</span>
                  )}
                </div>
                <span className={`flex-1 text-sm font-bold truncate ${m.name}`}>
                  {j.nombre}
                </span>
                <div className="w-14 flex justify-center">
                  <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${m.pts}`}>
                    {j.puntos}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-blue-500/20 pt-3 mt-1 flex items-center gap-4 text-xs text-blue-400/40 font-mono">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400/60" />
            {jugadores[0]?.nombre} lidera con {jugadores[0]?.puntos} WRs
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}