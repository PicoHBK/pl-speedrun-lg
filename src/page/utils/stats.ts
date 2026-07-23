// stats.ts — métricas derivadas de la liga a partir de los juegos parseados
import type { Juego } from "../landing/types/types";

/** Extrae el multiplicador de un nombre tipo "Juego [1.5]" → 1.5 (default 1) */
export function extraerMultiplicador(nombre: string): number {
  const match = nombre.match(/\[(\d+\.?\d*)\]$/);
  return match ? parseFloat(match[1]) : 1;
}

/** Convierte un nombre de juego en slug para la URL: "Dr.Mario [1.5]" → "dr-mario" */
export function slugify(nombre: string): string {
  return nombreSinMultiplicador(nombre)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Puntos base que otorga una posición en un juego con `totalRunners` corredores,
 * bajo la regla Beta: solo el podio (top 3) puntúa.
 */
export function puntosBasePosicion(posicion: number, totalRunners: number): number {
  return posicion <= 3 ? Math.min(10, Math.ceil(totalRunners / posicion)) : 0;
}

/** Puntos finales (con multiplicador) que reparte un juego en total. */
export function puntosEnJuego(juego: Juego): number {
  const mult = extraerMultiplicador(juego.nombre);
  const total = juego.runners.reduce(
    (acc, _r, idx) => acc + puntosBasePosicion(idx + 1, juego.runners.length) * mult,
    0
  );
  return Number.isInteger(total) ? total : parseFloat(total.toFixed(1));
}

export interface Duelo {
  juego: Juego;
  lider: string;
  rival: string;
  gapSegundos: number;
}

export interface LigaStats {
  totalJuegos: number;
  totalRunners: number;      // jugadores con al menos una run
  totalRuns: number;         // runs registradas en total
  segundosTotales: number;   // suma de todos los tiempos
  sinRival: number;          // juegos con un solo runner (récord libre)
  enDisputa: number;         // juegos con 2+ runners
  duelos: Duelo[];           // duelos más reñidos (gap 1º→2º más chico)
  masDisputados: Juego[];    // juegos con más runners
}

export function calcularStats(juegos: Juego[]): LigaStats {
  const runners = new Set<string>();
  let totalRuns = 0;
  let segundosTotales = 0;
  let sinRival = 0;

  const duelos: Duelo[] = [];

  for (const j of juegos) {
    totalRuns += j.runners.length;
    if (j.runners.length === 1) sinRival++;

    for (const r of j.runners) {
      runners.add(r.nombre);
      if (Number.isFinite(r.segundos)) segundosTotales += r.segundos;
    }

    // Duelo: diferencia entre el 1º y el 2º (runners ya viene ordenado)
    if (j.runners.length >= 2) {
      const gap = j.runners[1].segundos - j.runners[0].segundos;
      if (Number.isFinite(gap)) {
        duelos.push({
          juego: j,
          lider: j.runners[0].nombre,
          rival: j.runners[1].nombre,
          gapSegundos: gap,
        });
      }
    }
  }

  duelos.sort((a, b) => a.gapSegundos - b.gapSegundos);

  const masDisputados = [...juegos]
    .filter((j) => j.runners.length >= 2)
    .sort((a, b) => b.runners.length - a.runners.length);

  return {
    totalJuegos: juegos.length,
    totalRunners: runners.size,
    totalRuns,
    segundosTotales,
    sinRival,
    enDisputa: juegos.length - sinRival,
    duelos,
    masDisputados,
  };
}

/** 9345.2s → "2h 35m" · 754s → "12m 34s" */
export function formatDuracion(seg: number): string {
  const s = Math.round(seg);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s % 60}s`;
}

/** Gap con precisión real: 0.37 → "370ms" · 12.5 → "12.50s" · 95.5 → "1m 36s" */
export function formatGap(seg: number): string {
  if (seg < 1) return `${Math.round(seg * 1000)}ms`;
  if (seg < 60) return `${seg.toFixed(2)}s`;
  const m = Math.floor(seg / 60);
  const s = Math.round(seg % 60);
  return `${m}m ${s}s`;
}

export function nombreSinMultiplicador(nombre: string): string {
  return nombre.replace(/\s*\[\d+\.?\d*\]$/, "");
}

/** "01/08/2026" (DD/MM/YYYY) → días que faltan desde hoy; null si no parsea */
export function diasRestantes(fecha: string): number | null {
  let d: Date | null = null;
  const dmy = fecha.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  const iso = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dmy) {
    const year = dmy[3].length === 2 ? 2000 + Number(dmy[3]) : Number(dmy[3]);
    d = new Date(year, Number(dmy[2]) - 1, Number(dmy[1]));
  } else if (iso) {
    d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  if (!d || isNaN(d.getTime())) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - hoy.getTime()) / 86400000);
}
