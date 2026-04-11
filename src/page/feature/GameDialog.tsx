import { Gamepad2, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Juego } from "../landing/types/types";
import { tiempoASegundos } from "../utils/utils";

interface GameDialogProps {
  juego: Juego | null;
  open: boolean;
  onClose: () => void;
}

function formatGap(seg: number): string {
  if (seg < 60) return `+${seg}s`;
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `+${m}m${s > 0 ? `${s}s` : ""}`;
}

export function GameDialog({ juego, open, onClose }: GameDialogProps) {
  if (!juego) return null;

  const recordSeg = tiempoASegundos(juego.runners[0].tiempo);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-md w-[95vw] border border-blue-500/20 text-white max-h-[85vh] overflow-y-auto flex flex-col"
        style={{ background: "#060f1a" }}
      >
        <DialogHeader className="border-b border-blue-500/20 pb-3">
          <DialogTitle className="flex items-center gap-2 text-blue-100">
            <Gamepad2 className="w-4 h-4 text-violet-400" />
            {juego.nombre}
            <span className="text-xs font-normal text-blue-400/50 font-mono ml-1">
              {juego.runners.length} runners
            </span>
          </DialogTitle>
        </DialogHeader>



        {/* Column headers */}
        <div className="flex items-center gap-3 px-3 pt-1 pb-1 text-xs font-mono text-blue-400/30">
          <span className="w-4 text-center">#</span>
          <span className="flex-1">runner</span>
          <span className="w-16 text-center">gap</span>
          <span className="w-20 text-right">tiempo</span>
        </div>

        {/* Rows */}
        <div className="space-y-1.5 pb-2">
          {juego.runners.map((r, i) => {
            const thisSeg = tiempoASegundos(r.tiempo);
            const gap = i === 0 ? null : Math.round(thisSeg - recordSeg);

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  r.esRecord
                    ? "bg-violet-500/10 border border-violet-400/20"
                    : "bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10"
                }`}
              >
                {/* Rank */}
                <div className="w-4 flex-shrink-0 flex justify-center">
                  {r.esRecord ? (
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  ) : (
                    <span className="text-xs font-mono text-blue-400/30">{i + 1}</span>
                  )}
                </div>

                {/* Name */}
                <span className={`flex-1 text-sm font-bold truncate ${r.esRecord ? "text-violet-200" : "text-blue-200/60"}`}>
                  {r.nombre}
                </span>

                {/* Gap vs WR */}
                <div className="w-16 flex justify-center">
                  {gap !== null ? (
                    <span className={`text-xs font-mono font-bold ${
                      gap <= 30  ? "text-red-400/80"    :
                      gap <= 120 ? "text-orange-400/70" :
                      gap <= 300 ? "text-yellow-400/50" :
                                   "text-blue-400/30"
                    }`}>
                      {formatGap(gap)}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-violet-400/50">WR</span>
                  )}
                </div>

                {/* Tiempo */}
                <div className="w-20 flex justify-end">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    r.esRecord
                      ? "bg-violet-900/60 text-violet-300 border border-violet-500/40"
                      : "bg-blue-900/40 text-blue-400/60"
                  }`}>
                    {r.tiempo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-blue-500/20 pt-3 mt-1 flex items-center gap-2 text-xs text-blue-400/40 font-mono">
          <Trophy className="w-3 h-3 text-yellow-400" />
          <span>WR: <span className="text-violet-300">{juego.record}</span> por {juego.quien}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}