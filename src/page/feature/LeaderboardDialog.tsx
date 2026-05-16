import { Trophy, Flame } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Jugador } from "../landing/types/types";
import { LeaderboardDialogCard } from "./cards/LeaderboardDialogCard";

interface LeaderboardDialogProps {
  jugadores: Jugador[];
  open: boolean;
  onClose: () => void;
}

export function LeaderboardDialog({ jugadores, open, onClose }: LeaderboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-lg w-[95vw] border border-blue-500/20 text-white max-h-[85vh] flex flex-col rounded-2xl shadow-[0_0_30px_rgba(30,144,255,0.15)] overflow-hidden p-0"
        style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 pb-4 border-b border-blue-500/20 bg-blue-950/20">
          <DialogTitle className="flex items-center gap-3 text-xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-300 m-0">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            </div>
            Tabla Anual
            <span className="text-[10px] font-mono font-normal text-blue-400/50 ml-1 self-end pb-0.5">
              {jugadores.length} runners
            </span>
          </DialogTitle>
        </div>

        {/* ROWS */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex flex-col gap-2">
            {jugadores.map((j, i) => (
              <LeaderboardDialogCard
                key={j.nombre}
                jugador={j}
                rank={i + 1}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 pt-4 border-t border-blue-500/20 bg-[#040910] flex justify-between items-center gap-2 text-xs font-mono text-blue-400/50">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-orange-400/60" />
            <span className="text-blue-300 font-bold">{jugadores[0]?.nombre || "Nadie"}</span>
            <span>lidera con</span>
            <span className="text-yellow-400 font-black">{jugadores[0]?.puntos || 0} WRs</span>
          </div>
          <div className="text-[10px] tracking-wider opacity-60 uppercase">
            World Records
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}