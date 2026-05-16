// SpeedrunLeague.tsx
import { useEffect, useState, useMemo } from "react";
import { Zap, Trophy, Users, Gamepad2, AlertTriangle, Loader2 } from "lucide-react";
import { GameCard } from "../feature/GameCard";
import { GameDialog } from "../feature/GameDialog";
import { LeaderboardDialog } from "../feature/LeaderboardDialog";
import { LeaderboardBeta } from "../feature/LeaderboardBeta";
import { PlayersDialog } from "../feature/PlayersDialog";
import { SearchBar } from "../feature/SearchBar";
import { TabsContenido } from "../feature/TabsContenido";
import type { SheetData, Juego } from "../landing/types/types";
import { parseCSV, parseSheet3 } from "../utils/utils";

const SHEET_ID = "1mrXf73gNSpp1miUVkQ-_au6vCl1jtO7RT6JpZKh5QWU";
const GID = "2138027932";
const GID_SHEET3 = "337149263";

interface Tab {
  boton: string;
  contenido: string;
  img?: string;
  fechaFin?: string;
}

function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

export default function SpeedrunLeague() {
  const [data, setData] = useState<SheetData>({ juegos: [], jugadores: [] });
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJuego, setSelectedJuego] = useState<Juego | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLeaderboardBeta, setShowLeaderboardBeta] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [ptsFilter, setPtsFilter] = useState<number | null>(null);

  useEffect(() => {
    const t = Date.now();
    const url1 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${t}`;
    const url3 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_SHEET3}&t=${t}`;

    Promise.all([
      fetch(url1).then((r) => r.text()),
      fetch(url3).then((r) => r.text()),
    ])
      .then(([text1, text3]) => {
        setData(parseCSV(text1));
        setTabs(parseSheet3(text3));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const ptsOptions = useMemo(
    () =>
      [...new Set(data.juegos.map((j) => Math.min(10, j.runners.length + 1)))].sort(
        (a, b) => a - b
      ),
    [data.juegos]
  );

  const juegosFiltrados = useMemo(
    () =>
      data.juegos
        .filter((j) => j.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .filter((j) => ptsFilter === null || Math.min(10, j.runners.length + 1) === ptsFilter),
    [data.juegos, busqueda, ptsFilter]
  );

  // ESTADO DE CARGA
  if (loading)
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6" 
        style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
      >
        <div className="flex flex-col items-center gap-4 bg-blue-950/20 border border-blue-500/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.1)] backdrop-blur-sm animate-pulse">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-cyan-400 text-sm font-mono tracking-widest uppercase font-bold">
            Cargando Base de Datos...
          </span>
        </div>
      </div>
    );

  // ESTADO DE ERROR
  if (error)
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6" 
        style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
      >
        <div className="flex flex-col items-center gap-3 bg-red-950/40 border border-red-500/40 p-8 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.15)] max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h2 className="text-red-400 font-bold text-lg font-mono">Error de Conexión</h2>
          <p className="text-red-300/70 text-sm font-mono">{error}</p>
        </div>
      </div>
    );

  // RENDER PRINCIPAL
  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-500 text-white" 
      style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8">
        
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-blue-500/20 pb-6 relative">
          
          {/* Título y Subtítulo */}
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Gamepad2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-cyan-300 drop-shadow-sm">
                Liga de Speedruns
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-blue-400/60 tracking-widest uppercase">Producto Líder</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse"></span>
              <span className="text-cyan-400/80 tracking-widest">EN LÍNEA</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10">
            <a
              href="https://www.twitch.tv/martin_bombelli"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all duration-300"
              title="Ir a Twitch"
            >
              <TwitchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:text-purple-300" />
            </a>

            <button
              onClick={() => setShowPlayers(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-bold text-blue-300 border border-blue-500/30 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 font-mono tracking-wide"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 group-hover:text-blue-300" />
              <span className="hidden sm:inline">Jugadores</span>
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-bold text-yellow-400/90 border border-yellow-500/30 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all duration-300 font-mono tracking-wide"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:text-yellow-400" />
              <span className="hidden sm:inline">Clásica</span>
            </button>

            <button
              onClick={() => setShowLeaderboardBeta(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-black text-cyan-300 border border-cyan-400/40 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-cyan-500/15 hover:bg-cyan-400/25 hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 font-mono tracking-wide relative overflow-hidden"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-white" />
              <span className="hidden sm:inline drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">Ranking Beta</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
            </button>
          </div>
        </div>

        {/* TABS DINÁMICOS */}
        {tabs.length > 0 && (
          <div className="w-full">
            <TabsContenido tabs={tabs} />
          </div>
        )}

        {/* BUSCADOR Y FILTROS */}
        <div className="bg-[#0b1626]/50 border border-blue-500/10 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            ptsOptions={ptsOptions}
            ptsFilter={ptsFilter}
            onPtsFilter={setPtsFilter}
          />
        </div>

        {/* GRID DE JUEGOS - AJUSTADO PARA MÁXIMO 4 COLUMNAS */}
        {juegosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-blue-400/30 border border-dashed border-blue-500/20 rounded-2xl bg-blue-950/10">
            <Gamepad2 className="w-12 h-12 mb-3 opacity-20" />
            <span className="font-mono text-sm uppercase tracking-widest">No se encontraron juegos</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {juegosFiltrados.map((j) => (
              <GameCard key={j.nombre} juego={j} onClick={() => setSelectedJuego(j)} />
            ))}
          </div>
        )}

      </div>

      {/* DIÁLOGOS Y MODALES */}
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
      <LeaderboardBeta
        juegos={data.juegos}
        open={showLeaderboardBeta}
        onClose={() => setShowLeaderboardBeta(false)}
      />
      <PlayersDialog
        juegos={data.juegos}
        open={showPlayers}
        onClose={() => setShowPlayers(false)}
      />
    </div>
  );
}