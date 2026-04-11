import { useEffect, useState } from "react";
import { Gamepad2, Clock, User, Trophy, Zap, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SHEET_ID = "1mrXf73gNSpp1miUVkQ-_au6vCl1jtO7RT6JpZKh5QWU";
const GID = "2138027932";

interface RunnerTiempo {
  nombre: string;
  tiempo: string;
  esRecord: boolean;
}

interface Juego {
  nombre: string;
  record: string;
  quien: string;
  runners: RunnerTiempo[];
}

interface Jugador {
  nombre: string;
  puntos: number;
}

interface SheetData {
  juegos: Juego[];
  jugadores: Jugador[];
}

function idxConValor(row: unknown[]): number[] {
  return row.reduce((acc: number[], cell: unknown, i: number) => {
    if (cell !== null && cell !== undefined) {
      const c = cell as { v?: unknown };
      if (c.v !== null && c.v !== undefined) acc.push(i);
    }
    return acc;
  }, []);
}

function parseSheet(json: { table: { rows: { c: { v?: unknown; f?: string }[] }[] } }): SheetData {
  const rows = json.table.rows;
  let idxQuien = -1;
  let idxRecord = -1;

  const fila1 = rows[1]?.c ?? [];
  for (let c = 0; c < fila1.length; c++) {
    const v = String(fila1[c]?.v ?? "").trim().toLowerCase();
    if (v === "quien") { idxQuien = c; idxRecord = c - 1; break; }
  }

  if (idxQuien === -1) {
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i]?.c ?? [];
      const nombre = String(row[1]?.v ?? "").trim();
      if (!nombre) continue;
      const idxs = idxConValor(row);
      if (idxs.length >= 3) {
        idxQuien  = idxs[idxs.length - 1];
        idxRecord = idxs[idxs.length - 2];
        break;
      }
    }
  }

  if (idxQuien === -1) return { juegos: [], jugadores: [] };

  const colANombre: Map<number, string> = new Map();

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]?.c ?? [];
    const quien = String(row[idxQuien]?.v ?? "").trim();
    if (!quien || quien === "#N/A") continue;

    for (let c = 2; c < idxRecord; c++) {
      const cell = row[c];
      const f = String(cell?.f ?? "").trim();
      if (f && f !== "0:00:00" && !colANombre.has(c)) {
        const colsConDato = [];
        for (let cc = 2; cc < idxRecord; cc++) {
          const cf = String(rows[i]?.c?.[cc]?.f ?? "").trim();
          const cv = rows[i]?.c?.[cc]?.v;
          if ((cf && cf !== "0:00:00") || (typeof cv === "number" && cv > 0)) {
            colsConDato.push(cc);
          }
        }
        if (colsConDato.length === 1 && colsConDato[0] === c) {
          colANombre.set(c, quien);
        }
      }
    }
  }

  let cambio = true;
  while (cambio) {
    cambio = false;
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i]?.c ?? [];
      const quien = String(row[idxQuien]?.v ?? "").trim();
      if (!quien || quien === "#N/A") continue;

      const colsConTiempo: number[] = [];
      for (let c = 2; c < idxRecord; c++) {
        const cell = row[c];
        const f = String(cell?.f ?? "").trim();
        const v = cell?.v;
        if ((f && f !== "0:00:00") || (typeof v === "number" && v > 0)) {
          colsConTiempo.push(c);
        }
      }

      const sinNombre = colsConTiempo.filter((c) => !colANombre.has(c));
      if (sinNombre.length === 1) {
        const colQuien = sinNombre[0];
        const yaAsignado = [...colANombre.values()].includes(quien);
        if (!yaAsignado) {
          colANombre.set(colQuien, quien);
          cambio = true;
        }
      }
    }
  }

  const juegos: Juego[] = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]?.c ?? [];
    const nombre = String(row[1]?.v ?? "").trim();
    if (!nombre) continue;

    const record = String(row[idxRecord]?.f ?? "").trim();
    const quien  = String(row[idxQuien]?.v ?? "").trim();
    if (!record || record === "0:00:00" || !quien || quien === "#N/A") continue;

    const runners: RunnerTiempo[] = [];
    for (const [col, nombreJug] of colANombre.entries()) {
      const cell = row[col];
      const f = String(cell?.f ?? "").trim();
      const v = cell?.v;
      const tiempo = f || (typeof v === "number" && v > 0 ? String(v) : "");
      if (!tiempo || tiempo === "0:00:00") continue;
      runners.push({ nombre: nombreJug, tiempo, esRecord: nombreJug === quien });
    }

    runners.sort((a, b) => {
      if (a.esRecord) return -1;
      if (b.esRecord) return 1;
      return a.tiempo.localeCompare(b.tiempo);
    });

    juegos.push({ nombre, record, quien, runners });
  }

  const puntosMap = new Map<string, number>();
  for (const juego of juegos) {
    if (!juego.quien || juego.quien === "#N/A") continue;
    puntosMap.set(juego.quien, (puntosMap.get(juego.quien) ?? 0) + 1);
  }

  const jugadores: Jugador[] = Array.from(puntosMap.entries())
    .map(([nombre, puntos]) => ({ nombre, puntos }))
    .sort((a, b) => b.puntos - a.puntos);

  return { juegos, jugadores };
}

function GameCard({ juego, onClick }: { juego: Juego; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-violet-500 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="bg-gray-950 h-32 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 group-hover:border-violet-500/50 transition-colors">
          <Gamepad2 className="w-8 h-8 text-gray-600 group-hover:text-violet-400 transition-colors" strokeWidth={1.5} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 min-h-[2.5rem] tracking-wide">
          {juego.nombre}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-cyan-400 font-mono font-semibold">
          <Clock className="w-3 h-3" />
          {juego.record}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <User className="w-3 h-3" />
          {juego.quien}
        </div>
        {juego.runners.length > 1 && (
          <div className="mt-2 text-xs text-gray-600">
            +{juego.runners.length - 1} runner{juego.runners.length > 2 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function GameDialog({ juego, open, onClose }: { juego: Juego | null; open: boolean; onClose: () => void }) {
  if (!juego) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Gamepad2 className="w-4 h-4 text-violet-400" />
            {juego.nombre}
          </DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-700">
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">Runner</th>
              <th className="pb-2 font-medium text-right">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {juego.runners.map((r, i) => (
              <tr key={i} className="border-b border-gray-800 last:border-0">
                <td className="py-2 text-xs text-gray-500">{i + 1}</td>
                <td className="py-2 font-medium text-white">
                  <span className="flex items-center gap-1">
                    {r.esRecord && <Trophy className="w-3 h-3 text-yellow-400" />}
                    {r.nombre}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    r.esRecord
                      ? "bg-violet-900/60 text-violet-300 border border-violet-500/40"
                      : "bg-gray-800 text-gray-400"
                  }`}>
                    {r.tiempo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}

function LeaderboardDialog({ jugadores, open, onClose }: { jugadores: Jugador[]; open: boolean; onClose: () => void }) {
  const medal = (i: number) => {
    if (i === 0) return { color: "text-yellow-400", bg: "bg-yellow-400/10 border border-yellow-400/30" };
    if (i === 1) return { color: "text-gray-300", bg: "bg-gray-300/10 border border-gray-300/20" };
    if (i === 2) return { color: "text-amber-500", bg: "bg-amber-500/10 border border-amber-500/30" };
    return { color: "text-gray-600", bg: "bg-gray-800/40" };
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gray-900 border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-1">
          {jugadores.map((j, i) => {
            const m = medal(i);
            return (
              <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${m.bg}`}>
                <span className={`text-sm font-black w-5 text-center ${m.color}`}>{i + 1}</span>
                <span className="flex-1 font-semibold text-sm text-white">{j.nombre}</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                  i === 0 ? "bg-yellow-400/20 text-yellow-300" :
                  i === 1 ? "bg-gray-300/10 text-gray-300" :
                  i === 2 ? "bg-amber-500/20 text-amber-400" :
                  "bg-gray-700 text-gray-400"
                }`}>
                  {j.puntos} pts
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SpeedrunLeague() {
  const [data, setData] = useState<SheetData>({ juegos: [], jugadores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJuego, setSelectedJuego] = useState<Juego | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${GID}`;
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/);
        if (!match) throw new Error("No se pudo parsear la respuesta");
        const json = JSON.parse(match[1]);
        setData(parseSheet(json));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const juegosFiltrados = data.juegos.filter((j) =>
    j.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 bg-gray-950">
        <div className="flex items-center gap-2 text-violet-400 text-sm font-mono">
          <Zap className="w-4 h-4" />
          Cargando...
        </div>
      </div>
    );

  if (error)
    return <div className="p-4 text-red-400 text-sm font-mono bg-gray-950">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" />
            Speedrun League
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">{data.juegos.length} juegos con record</p>
        </div>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2 text-sm font-bold text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 rounded-xl px-4 py-2 hover:bg-yellow-400/20 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          Leaderboard
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar juego..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors font-mono"
        />
      </div>

      {juegosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-600 font-mono text-sm">
          No se encontraron juegos
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {juegosFiltrados.map((j, i) => (
            <GameCard key={i} juego={j} onClick={() => setSelectedJuego(j)} />
          ))}
        </div>
      )}

      <GameDialog juego={selectedJuego} open={!!selectedJuego} onClose={() => setSelectedJuego(null)} />
      <LeaderboardDialog jugadores={data.jugadores} open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}