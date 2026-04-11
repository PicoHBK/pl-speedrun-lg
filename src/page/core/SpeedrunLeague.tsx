// SpeedrunLeague.tsx
import { useEffect, useState } from "react";
import { Zap, Trophy, Users } from "lucide-react";
import { GameCard } from "../feature/GameCard";
import { GameDialog } from "../feature/GameDialog";
import { LeaderboardDialog } from "../feature/LeaderboardDialog";
import { PlayersDialog } from "../feature/PlayersDialog";
import { SearchBar } from "../feature/SearchBar";
import type { SheetData, Juego } from "../landing/types/types";
import { parseCSV } from "../utils/utils";

const SHEET_ID = "1mrXf73gNSpp1miUVkQ-_au6vCl1jtO7RT6JpZKh5QWU";
const GID = "2138027932";

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

export default function SpeedrunLeague() {
  const [data, setData] = useState<SheetData>({ juegos: [], jugadores: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJuego, setSelectedJuego] = useState<Juego | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
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
      <div className="flex items-center justify-center h-48" style={{ background: "#030810" }}>
        <div className="flex items-center gap-2 text-violet-400 text-sm font-mono">
          <Zap className="w-4 h-4" />
          Cargando...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-400 text-sm font-mono" style={{ background: "#030810" }}>
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6" style={{ background: "#030810" }}>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Fila 1: título + botones */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Liga de Speedruns
            </h1>
            <p className="text-xs text-blue-400/30 font-mono mt-0.5">
              <span className="text-blue-400/50">Producto Lider</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://www.twitch.tv/martin_bombelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40 transition-colors"
              style={{ background: "rgba(168,85,247,0.05)" }}
            >
              <TwitchIcon className="w-4 h-4 text-purple-400/60" />
            </a>
            <button
              onClick={() => setShowPlayers(true)}
              className="flex items-center gap-2 text-xs font-bold text-blue-300/70 border border-blue-500/20 rounded-xl px-3 py-2 hover:bg-blue-500/10 transition-colors font-mono"
              style={{ background: "rgba(59,130,246,0.05)" }}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Jugadores</span>
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2 text-xs font-bold text-yellow-400/70 border border-yellow-400/20 rounded-xl px-3 py-2 hover:bg-yellow-400/10 transition-colors font-mono"
              style={{ background: "rgba(234,179,8,0.05)" }}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Clasificación</span>
            </button>
          </div>
        </div>

        {/* Fila 2: search */}
        <SearchBar value={busqueda} onChange={setBusqueda} />
      </div>

      {juegosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-blue-400/20 font-mono text-sm">
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
      <PlayersDialog
        juegos={data.juegos}
        open={showPlayers}
        onClose={() => setShowPlayers(false)}
      />
    </div>
  );
}