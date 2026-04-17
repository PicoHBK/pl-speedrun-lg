import { useState } from "react";
import { Trophy, Zap, Flame, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Juego, Jugador } from "../landing/types/types";

interface LeaderboardBetaProps {
  juegos: Juego[];
  open: boolean;
  onClose: () => void;
}

interface DesglosePorJuego {
  juego: string;
  posicion: number;
  totalRunners: number;
  ptsBase: number;
  multiplicador: number;
  ptsFinal: number;
}

interface JugadorConDesglose extends Jugador {
  desglose: DesglosePorJuego[];
}

function extraerMultiplicador(nombre: string): number {
  const match = nombre.match(/\[(\d+\.?\d*)\]$/);
  return match ? parseFloat(match[1]) : 1;
}

function calcularJugadoresBeta(juegos: Juego[]): JugadorConDesglose[] {
  const puntosMap = new Map<string, number>();
  const desgloseMap = new Map<string, DesglosePorJuego[]>();

  for (const juego of juegos) {
    const multiplicador = extraerMultiplicador(juego.nombre);
    const totalRunners = juego.runners.length;
    juego.runners.forEach((runner, idx) => {
      const posicion = idx + 1;
      const ptsBase = Math.min(10, Math.ceil(totalRunners / posicion));
      const ptsFinal = ptsBase * multiplicador;

      puntosMap.set(runner.nombre, (puntosMap.get(runner.nombre) ?? 0) + ptsFinal);

      const desglose = desgloseMap.get(runner.nombre) ?? [];
      desglose.push({
        juego: juego.nombre,
        posicion,
        totalRunners,
        ptsBase,
        multiplicador,
        ptsFinal: Number.isInteger(ptsFinal) ? ptsFinal : parseFloat(ptsFinal.toFixed(1)),
      });
      desgloseMap.set(runner.nombre, desglose);
    });
  }

  return Array.from(puntosMap.entries())
    .map(([nombre, puntos]) => ({
      nombre,
      puntos: Number.isInteger(puntos) ? puntos : parseFloat(puntos.toFixed(1)),
      desglose: desgloseMap.get(nombre) ?? [],
    }))
    .sort((a, b) => b.puntos - a.puntos);
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

function nombreSinMultiplicador(nombre: string): string {
  return nombre.replace(/\s*\[\d+\.?\d*\]$/, "");
}

export function LeaderboardBeta({ juegos, open, onClose }: LeaderboardBetaProps) {
  const jugadores = calcularJugadoresBeta(juegos);
  const [expandido, setExpandido] = useState<string | null>(null);

  const toggleExpandido = (nombre: string) => {
    setExpandido((prev) => (prev === nombre ? null : nombre));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-2xl w-[95vw] border border-blue-500/20 text-white max-h-[85vh] overflow-y-auto flex flex-col"
        style={{ background: "#060f1a" }}
      >
        <DialogHeader className="border-b border-blue-500/20 pb-3">
          <DialogTitle className="flex items-center gap-2 text-blue-100">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Leaderboard
            <span className="text-xs font-normal text-blue-400/50 font-mono ml-1">
              {jugadores.length} runners
            </span>
            <span className="ml-auto text-xs font-mono text-blue-500/40 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
              BETA
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Leyenda explicativa */}
        <div className="mx-1 mt-2 mb-1 rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 py-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400/60 mb-0.5">
            <Info className="w-3 h-3 text-blue-400/50" />
            <span className="text-blue-400/70 font-bold">¿Cómo se calculan los puntos?</span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-violet-300">
              <Zap className="w-3 h-3" />
            </span>
            <div>
              <p className="text-xs font-bold text-violet-300 font-mono">Multiplicador de juego</p>
              <p className="text-xs text-blue-400/50 font-mono leading-relaxed">
                Algunos juegos tienen un multiplicador indicado entre corchetes, por ejemplo{" "}
                <span className="text-violet-300/80">[2]</span> o{" "}
                <span className="text-violet-300/80">[1.5]</span>. Los puntos obtenidos en ese juego
                se multiplican por ese valor, premiando los juegos más difíciles o relevantes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-300">
              <Trophy className="w-3 h-3" />
            </span>
            <div>
              <p className="text-xs font-bold text-blue-300 font-mono">Puntos por posición y cantidad de runners</p>
              <p className="text-xs text-blue-400/50 font-mono leading-relaxed">
                Cuantos más runners compiten en un juego, más puntos hay en juego. El 1° recibe más
                puntos que el último, calculados como{" "}
                <span className="text-blue-300/80">min(10, ⌈runners / posición⌉)</span>. Ganarle a
                más gente vale más.
              </p>
            </div>
          </div>
        </div>

        {/* Header columnas */}
        <div className="flex items-center gap-3 px-4 pt-2 pb-1 text-xs font-mono text-blue-400/30">
          <span className="w-4 text-center">#</span>
          <span className="flex-1">runner</span>
          <span className="w-14 text-center">PTS</span>
          <span className="w-5" />
        </div>

        <div className="space-y-1.5 pb-2">
          {jugadores.map((j, i) => {
            const m = medalConfig(i);
            const abierto = expandido === j.nombre;

            return (
              <div key={j.nombre} className="flex flex-col">
                {/* Fila principal */}
                <button
                  onClick={() => toggleExpandido(j.nombre)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors w-full text-left ${m.row} ${abierto ? "rounded-b-none" : ""}`}
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
                  <div className="w-5 flex justify-center text-blue-400/30">
                    {abierto
                      ? <ChevronUp className="w-3.5 h-3.5" />
                      : <ChevronDown className="w-3.5 h-3.5" />
                    }
                  </div>
                </button>

                {/* Desglose expandible */}
                {abierto && (
                  <div className="border border-t-0 border-blue-500/10 rounded-b-xl bg-blue-950/30 px-3 py-2">
                    {/* Header tabla */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-3 px-2 pb-1 text-xs font-mono text-blue-400/30 border-b border-blue-500/10 mb-1">
                      <span>juego</span>
                      <span className="text-center w-12">pos</span>
                      <span className="text-center w-10">base</span>
                      <span className="text-center w-12">mult</span>
                      <span className="text-center w-10">pts</span>
                    </div>

                    {j.desglose.map((d, di) => (
                      <div
                        key={di}
                        className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-3 px-2 py-1.5 text-xs font-mono items-center border-b border-blue-500/5 last:border-0"
                      >
                        <span className="text-blue-200/60 truncate" title={nombreSinMultiplicador(d.juego)}>
                          {nombreSinMultiplicador(d.juego)}
                        </span>
                        {/* posición / total runners */}
                        <span className="text-center w-12 text-blue-400/40">
                          {d.posicion}/{d.totalRunners}
                        </span>
                        {/* pts base (sin multiplicador) */}
                        <span className="text-center w-10 text-blue-300/50">
                          {d.ptsBase}
                        </span>
                        {/* multiplicador */}
                        <span className="text-center w-12">
                          {d.multiplicador > 1
                            ? <span className="text-violet-400/80 font-bold">×{d.multiplicador}</span>
                            : <span className="text-blue-400/20">—</span>
                          }
                        </span>
                        {/* pts finales de ese juego */}
                        <span className="text-center w-10 font-bold text-blue-200/80">
                          {d.ptsFinal}
                        </span>
                      </div>
                    ))}

                    {/* Fila total */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-3 px-2 pt-1.5 mt-0.5 border-t border-blue-500/15 text-xs font-mono items-center">
                      <span className="text-blue-400/40 font-bold tracking-widest">TOTAL</span>
                      <span className="w-12" />
                      <span className="w-10" />
                      <span className="w-12" />
                      <span className="text-center w-10 font-black text-blue-100">{j.puntos}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-blue-500/20 pt-3 mt-1 flex items-center gap-4 text-xs text-blue-400/40 font-mono">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400/60" />
            {jugadores[0]?.nombre} lidera con {jugadores[0]?.puntos} pts
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}