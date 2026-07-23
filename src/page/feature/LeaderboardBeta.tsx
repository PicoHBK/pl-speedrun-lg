import { useState, useMemo } from "react";
import { Trophy, HelpCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import type { Juego } from "../landing/types/types";
import { LeaderboardCard } from "./cards/LeaderboardCard";
import { extraerMultiplicador } from "../utils/stats";

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
// LÓGICA DE PUNTUACIÓN
// - Solo el podio (top 3) suma puntos.
// - Base: min(10, ⌈runners/posición⌉), luego ×multiplicador.
// ==========================================
function calcularJugadoresBeta(juegos: Juego[]): JugadorConDesglose[] {
  const puntosMap = new Map<string, number>();
  const desgloseMap = new Map<string, DesglosePorJuego[]>();

  for (const juego of juegos) {
    const multiplicador = extraerMultiplicador(juego.nombre);
    const totalRunners = juego.runners.length;

    juego.runners.forEach((runner, idx) => {
      const posicion = idx + 1;
      // Solo los primeros 3 puestos reciben puntos
      const ptsBase = posicion <= 3 ? Math.min(10, Math.ceil(totalRunners / posicion)) : 0;
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
  const jugadores = useMemo(() => calcularJugadoresBeta(juegos), [juegos]);
  const conPuntos = jugadores.filter((j) => j.puntos > 0);
  const sinPuntos = jugadores.filter((j) => j.puntos === 0);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="panel-shell !max-w-6xl w-[96vw] border border-border text-foreground max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden p-0">
        {/* HEADER */}
        <div className="p-4 sm:p-6 pb-4 border-b border-border bg-brand/5">
          <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-wide text-foreground m-0">
            <div className="p-2 rounded-lg bg-gold/10 border border-gold/25">
              <Trophy className="w-6 h-6 text-gold" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span>Tabla de Clasificación</span>
              <span className="text-[10px] sm:text-xs font-black bg-gradient-to-r from-brand to-accent2 text-brand-foreground px-2 py-0.5 rounded-md tracking-widest uppercase w-fit">
                Beta
              </span>
            </div>

            {/* ACCIONES DEL HEADER */}
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground bg-muted/50 border border-border px-2.5 py-1 rounded-full">
                {jugadores.length} RUNNERS
              </span>

              <button
                onClick={() => setMostrarInfo(true)}
                className="group flex items-center justify-center p-2 rounded-lg bg-brand/10 border border-brand/25 hover:border-brand/50 hover:bg-brand/20 transition-all duration-300"
                title="¿Cómo se calculan los puntos?"
              >
                <HelpCircle className="w-5 h-5 text-brand group-hover:text-accent2 transition-colors" />
              </button>
            </div>
          </DialogTitle>
        </div>

        {/* CONTENIDO (GRID DE JUGADORES) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {conPuntos.map((j, i) => (
              <LeaderboardCard
                key={j.nombre}
                jugador={j}
                rank={i + 1}
                index={i}
              />
            ))}
          </div>

          {sinPuntos.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-6 mb-3.5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Participaron · sin puntaje ({sinPuntos.length})
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 opacity-70">
                {sinPuntos.map((j, i) => (
                  <LeaderboardCard
                    key={j.nombre}
                    jugador={j}
                    rank={conPuntos.length + i + 1}
                    index={i}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-6 pt-4 border-t border-border bg-card/40 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-muted-foreground">
          <div>
            ⚡ <span className="text-foreground font-bold">{jugadores[0]?.nombre || "Nadie"}</span> lidera con <span className="text-gold font-black">{jugadores[0]?.puntos || 0} PTS</span>
          </div>
          <div className="text-[10px] tracking-wider opacity-70 uppercase">
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
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-card border border-brand/40 p-6 rounded-xl max-w-md w-full shadow-2xl relative"
              >
                <button
                  onClick={() => setMostrarInfo(false)}
                  className="absolute top-4 right-4 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-border pb-3 mb-4">
                  <div className="p-1.5 rounded bg-brand/10 border border-brand/30">
                    <HelpCircle className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-mono tracking-wide">
                    Sistema de Puntuación
                  </h3>
                </div>

                <div className="space-y-5 text-sm font-mono leading-relaxed">
                  {/* Regla 1 */}
                  <div className="space-y-1.5">
                    <p className="text-xs uppercase tracking-wider text-gold font-bold">1. Solo el podio puntúa</p>
                    <p className="text-muted-foreground text-xs leading-snug">
                      Únicamente los <span className="text-gold font-bold">3 primeros puestos</span> de cada juego reciben puntos. Del 4º en adelante: <span className="text-foreground font-bold">0 pts</span>.
                    </p>
                  </div>

                  {/* Regla 2 */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs uppercase tracking-wider text-brand font-bold">2. Puntos Base</p>
                    <p className="text-foreground bg-brand/5 border border-brand/20 p-3 rounded-lg font-bold text-center">
                      min(10, ⌈ runners / posición ⌉)
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      Escalan según cuánta gente compitió en ese juego. El tope máximo es de 10 puntos base.
                    </p>
                  </div>

                  {/* Regla 3 */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs uppercase tracking-wider text-accent2 font-bold">3. Multiplicadores</p>
                    <p className="text-muted-foreground text-xs leading-snug">
                      Los juegos que incluyen una etiqueta <span className="text-accent2 font-bold bg-accent2/10 px-1 rounded">[x]</span> en su nombre (ej: <span className="italic text-foreground">"Juego [1.5]"</span>) multiplican directamente el puntaje base final obtenido.
                    </p>
                  </div>

                  {/* Cierre */}
                  <div className="pt-3 border-t border-border text-[10px] text-muted-foreground/70 text-center uppercase tracking-widest">
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
