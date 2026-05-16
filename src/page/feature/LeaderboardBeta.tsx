import { useState } from "react";
import { Trophy, HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent,DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import type { Juego } from "../landing/types/types";
import { LeaderboardCard } from "./cards/LeaderboardCard";

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
  img?: string;
}

interface JugadorConDesglose {
  nombre: string;
  puntos: number;
  desglose: DesglosePorJuego[];
}

// ==========================================
// LÓGICA INTACTA - NO SE HA MODIFICADO NADA
// ==========================================
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
        img: juego.imagen,
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
// ==========================================

export function LeaderboardBeta({ juegos, open, onClose }: LeaderboardBetaProps) {
  const jugadores = calcularJugadoresBeta(juegos);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-6xl w-[96vw] border border-blue-500/30 text-white max-h-[90vh] flex flex-col rounded-2xl shadow-[0_0_30px_rgba(30,144,255,0.15)] overflow-hidden p-0"
        style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-6 pb-4 border-b border-blue-500/20 bg-blue-950/20">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-300 m-0">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span>Tabla de Clasificación</span>
              <span className="text-[10px] sm:text-xs font-black bg-gradient-to-r from-blue-500 to-cyan-400 text-black px-2 py-0.5 rounded-md tracking-widest uppercase w-fit">
                Beta
              </span>
            </div>

            {/* ACCIONES DEL HEADER */}
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-mono text-blue-400/60 bg-blue-950/40 border border-blue-500/10 px-2.5 py-1 rounded-full">
                {jugadores.length} RUNNERS
              </span>
              
              <button
                onClick={() => setMostrarInfo(true)}
                className="group flex items-center justify-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/20 transition-all duration-300"
                title="¿Cómo se calculan los puntos?"
              >
                <HelpCircle className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </button>
            </div>
          </DialogTitle>
        </div>

        {/* CONTENIDO (GRID DE JUGADORES) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {jugadores.map((j, i) => (
              <LeaderboardCard
                key={j.nombre}
                jugador={j}
                rank={i + 1}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-6 pt-4 border-t border-blue-500/20 bg-[#040910] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-blue-400/50">
          <div>
            ⚡ <span className="text-blue-300 font-bold">{jugadores[0]?.nombre || "Nadie"}</span> lidera con <span className="text-yellow-400 font-black">{jugadores[0]?.puntos || 0} PTS</span>
          </div>
          <div className="text-[10px] tracking-wider opacity-60 uppercase">
            Sistema de Puntuación Activo
          </div>
        </div>

        {/* MODAL INTERNO (POPUP DE INFO) */}
        <AnimatePresence>
          {mostrarInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-[#0b1626] border border-blue-500/40 p-6 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
              >
                <button
                  onClick={() => setMostrarInfo(false)}
                  className="absolute top-4 right-4 p-1 rounded-md text-blue-400/60 hover:text-white hover:bg-blue-500/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-3 mb-4">
                  <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/30">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-100 font-mono tracking-wide">
                    Sistema de Puntuación
                  </h3>
                </div>

                <div className="space-y-5 text-sm font-mono leading-relaxed">
                  {/* Regla 1 */}
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-wider text-blue-400/80 font-bold">1. Puntos Base</p>
                    <p className="text-blue-200 bg-blue-950/40 border border-blue-500/20 p-3 rounded-lg font-bold text-center shadow-inner">
                      min(10, ⌈ runners / posición ⌉)
                    </p>
                    <p className="text-xs text-blue-400/60 mt-1 leading-snug">
                      Se obtienen escalando dinámicamente según cuánta gente compitió en esa carrera específica. El tope máximo es de 10 puntos base.
                    </p>
                  </div>

                  {/* Regla 2 */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs uppercase tracking-wider text-fuchsia-400/80 font-bold">2. Multiplicadores</p>
                    <p className="text-blue-100/70 text-xs leading-snug">
                      Los juegos que incluyen una etiqueta <span className="text-fuchsia-400 font-bold bg-fuchsia-500/10 px-1 rounded">[x]</span> en su nombre (ej: <span className="italic text-white">"Juego [1.5]"</span>) multiplican directamente el puntaje base final obtenido.
                    </p>
                  </div>

                  {/* Cierre */}
                  <div className="pt-3 border-t border-blue-500/10 text-[10px] text-blue-400/40 text-center uppercase tracking-widest">
                    Haz clic en la cruz para volver
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}