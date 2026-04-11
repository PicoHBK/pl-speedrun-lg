import type { Juego, Jugador, RunnerTiempo, SheetData } from "../landing/types/types";

export function tiempoASegundos(t: string): number {
  if (!t || t === "0:00:00") return Infinity;
  const partes = t.split(":").map(Number);
  if (partes.length === 3) return partes[0] * 3600 + partes[1] * 60 + partes[2];
  if (partes.length === 2) return partes[0] * 60 + partes[1];
  return Infinity;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCSV(text: string): SheetData {
  const lines = text.trim().split("\n").map(parseCSVLine);

  const filaPlayers = lines[2] ?? [];
  const playerPorCol = new Map<number, string>();
  for (let c = 5; c < filaPlayers.length; c++) {
    const nombre = filaPlayers[c]?.trim();
    if (nombre) playerPorCol.set(c, nombre);
  }

  const juegos: Juego[] = [];

  for (let i = 3; i < lines.length; i++) {
    const row = lines[i];
    const nombre = row[1]?.trim();
    if (!nombre) continue;

    const imagen = row[0]?.trim() || undefined;
    const runners: RunnerTiempo[] = [];

    for (let c = 5; c < row.length; c++) {
      const tiempo = row[c]?.trim();
      if (!tiempo || tiempo === "0:00:00") continue;
      const nombrePlayer = playerPorCol.get(c);
      if (!nombrePlayer) continue;
      runners.push({
        nombre: nombrePlayer,
        tiempo,
        segundos: tiempoASegundos(tiempo),
        esRecord: false,
      });
    }

    if (runners.length === 0) continue;

    runners.sort((a, b) => a.segundos - b.segundos);
    runners[0].esRecord = true;

    juegos.push({
      nombre,
      record: runners[0].tiempo,
      quien: runners[0].nombre,
      runners,
      imagen,
    });
  }

  const puntosMap = new Map<string, number>();
  for (const juego of juegos) {
    puntosMap.set(juego.quien, (puntosMap.get(juego.quien) ?? 0) + 1);
  }

  const jugadores: Jugador[] = Array.from(puntosMap.entries())
    .map(([nombre, puntos]) => ({ nombre, puntos }))
    .sort((a, b) => b.puntos - a.puntos);

  return { juegos, jugadores };
}