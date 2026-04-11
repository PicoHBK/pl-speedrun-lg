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
  segundos: number;
  esRecord: boolean;
}

interface Juego {
  nombre: string;
  record: string;
  quien: string;
  runners: RunnerTiempo[];
  imagen?: string;
}

interface Jugador {
  nombre: string;
  puntos: number;
}

interface SheetData {
  juegos: Juego[];
  jugadores: Jugador[];
}

function tiempoASegundos(t: string): number {
  if (!t || t === "0:00:00") return Infinity;
  const partes = t.split(":").map(Number);
  if (partes.length === 3) return partes[0] * 3600 + partes[1] * 60 + partes[2];
  if (partes.length === 2) return partes[0] * 60 + partes[1];
  return Infinity;
}

function parseCSVLine(line: string): string[] {
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

function parseCSV(text: string): SheetData {
  const lines = text.trim().split("\n").map(parseCSVLine);

  // Fila índice 2 = fila 3: nombres de players desde col F (índice 5)
  const filaPlayers = lines[2] ?? [];
  const playerPorCol = new Map<number, string>();
  for (let c = 5; c < filaPlayers.length; c++) {
    const nombre = filaPlayers[c]?.trim();
    if (nombre) playerPorCol.set(c, nombre);
  }

  const juegos: Juego[] = [];

  // Fila índice 3 en adelante = juegos
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

function GameCard({ juego, onClick }: { juego: Juego; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-violet-500/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full bg-zinc-950" style={{ aspectRatio: "3/4" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
        {juego.imagen && !imgError ? (
          <img
            src={juego.imagen}
            alt={juego.nombre}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 group-hover:border-violet-500/50 transition-colors">
              <Gamepad2
                className="w-8 h-8 text-zinc-600 group-hover:text-violet-400 transition-colors"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-col gap-1">
          <span className="self-start flex items-center gap-1 bg-black/70 backdrop-blur-sm text-cyan-400 font-mono text-xs font-semibold px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            {juego.record}
          </span>
          <span className="self-start flex items-center gap-1 bg-black/70 backdrop-blur-sm text-zinc-300 text-xs px-2 py-0.5 rounded-full">
            <Trophy className="w-3 h-3 text-yellow-400" />
            {juego.quien}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 tracking-wide">
          {juego.nombre}
        </h3>
        {juego.runners.length > 1 && (
          <span className="mt-2 inline-flex items-center gap-1 bg-zinc-900 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
            <User className="w-3 h-3" />
            {juego.runners.length} Runs
          </span>
        )}
      </div>
    </div>
  );
}
function GameDialog({
  juego,
  open,
  onClose,
}: {
  juego: Juego | null;
  open: boolean;
  onClose: () => void;
}) {
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
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      r.esRecord
                        ? "bg-violet-900/60 text-violet-300 border border-violet-500/40"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
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

function LeaderboardDialog({
  jugadores,
  open,
  onClose,
}: {
  jugadores: Jugador[];
  open: boolean;
  onClose: () => void;
}) {
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
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    i === 0 ? "bg-yellow-400/20 text-yellow-300" :
                    i === 1 ? "bg-gray-300/10 text-gray-300" :
                    i === 2 ? "bg-amber-500/20 text-amber-400" :
                    "bg-gray-700 text-gray-400"
                  }`}
                >
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
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${Date.now()}`;
    fetch(url)
      .then((res) => res.text())
      .then((text) => setData(parseCSV(text)))
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
    return (
      <div className="p-4 text-red-400 text-sm font-mono bg-gray-950">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-400" />
            Speedrun League
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            {data.juegos.length} juegos con record
          </p>
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

      <GameDialog
        juego={selectedJuego}
        open={!!selectedJuego}
        onClose={() => setSelectedJuego(null)}
      />
      <LeaderboardDialog
        jugadores={data.jugadores}
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
}