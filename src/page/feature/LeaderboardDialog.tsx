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
      <DialogContent className="panel-shell !max-w-lg w-[95vw] border border-border text-foreground max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden p-0">
        {/* HEADER */}
        <div className="p-4 sm:p-5 pb-4 border-b border-border bg-brand/5">
          <DialogTitle className="flex items-center gap-3 text-xl font-black tracking-wide text-foreground m-0">
            <div className="p-2 rounded-lg bg-gold/10 border border-gold/25">
              <Trophy className="w-5 h-5 text-gold" />
            </div>
            Tabla Anual
            <span className="text-[10px] font-mono font-normal text-muted-foreground ml-1 self-end pb-0.5">
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
        <div className="p-4 sm:p-5 pt-4 border-t border-border bg-card/40 flex justify-between items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5 min-w-0">
            <Flame className="w-3 h-3 text-gold shrink-0" />
            <span className="text-foreground font-bold truncate">{jugadores[0]?.nombre || "Nadie"}</span>
            <span className="shrink-0">lidera con</span>
            <span className="text-gold font-black shrink-0">{jugadores[0]?.puntos || 0} WRs</span>
          </div>
          <div className="text-[10px] tracking-wider opacity-70 uppercase shrink-0">
            World Records
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
