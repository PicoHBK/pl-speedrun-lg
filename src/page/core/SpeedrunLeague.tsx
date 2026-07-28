// SpeedrunLeague.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Trophy, Users, Gamepad2, AlertTriangle, Loader2, Sun, Moon } from "lucide-react";
import { GameCard } from "../feature/GameCard";
import { LeaderboardDialog } from "../feature/LeaderboardDialog";
import { LeaderboardBeta } from "../feature/LeaderboardBeta";
import { PlayersDialog } from "../feature/PlayersDialog";
import { SearchBar, type SortMode } from "../feature/SearchBar";
import { TabsContenido } from "../feature/TabsContenido";
import { StatsStrip } from "../feature/StatsStrip";
import { Destacados } from "../feature/Destacados";
import { StreamsDialog, TwitchIcon } from "../feature/StreamsDialog";
import type { Juego } from "../landing/types/types";
import { calcularStats, slugify } from "../utils/stats";
import { useLeagueData } from "../data/LeagueDataContext";
import { useTheme } from "@/hooks/useTheme";

// "Roba Fácil": juegos con un solo runner cuyo récord pertenece a estos jugadores
const ROBA_FACIL = new Set(["sanosuke", "jack turrismo", "jack turismo"]);

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="group flex items-center justify-center p-2.5 rounded-xl border border-border bg-card/60 hover:bg-muted hover:border-brand/40 transition-all duration-300"
      title={theme === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-gold group-hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-brand group-hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}

export default function SpeedrunLeague() {
  const { data, tabs, loading, error } = useLeagueData();
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLeaderboardBeta, setShowLeaderboardBeta] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [ptsFilter, setPtsFilter] = useState<number | null>(null);
  const [sort, setSort] = useState<SortMode>("relevantes");
  const [robaFacil, setRobaFacil] = useState(false);
  const [showStreams, setShowStreams] = useState(false);

  const irAJuego = (juego: Juego) => navigate(`/juego/${slugify(juego.nombre)}`);

  const ptsOptions = useMemo(
    () =>
      [...new Set(data.juegos.map((j) => Math.min(10, j.runners.length + 1)))].sort(
        (a, b) => a - b
      ),
    [data.juegos]
  );

  const juegosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    const filtrados = data.juegos
      .filter(
        (j) =>
          q === "" ||
          j.nombre.toLowerCase().includes(q) ||
          j.runners.some((r) => r.nombre.toLowerCase().includes(q))
      )
      .filter((j) => ptsFilter === null || Math.min(10, j.runners.length + 1) === ptsFilter)
      .filter(
        (j) =>
          !robaFacil ||
          (j.runners.length === 1 && ROBA_FACIL.has(j.runners[0].nombre.toLowerCase()))
      );

    if (sort === "az") {
      return [...filtrados].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    }
    if (sort === "record") {
      return [...filtrados].sort((a, b) => a.runners[0].segundos - b.runners[0].segundos);
    }
    // "relevantes": más disputados primero; desempate por récord más corto y luego nombre
    return [...filtrados].sort(
      (a, b) =>
        b.runners.length - a.runners.length ||
        a.runners[0].segundos - b.runners[0].segundos ||
        a.nombre.localeCompare(b.nombre, "es")
    );
  }, [data.juegos, busqueda, ptsFilter, sort, robaFacil]);

  const stats = useMemo(() => calcularStats(data.juegos), [data.juegos]);

  // ESTADO DE CARGA
  if (loading)
    return (
      <div className="app-shell min-h-screen flex items-center justify-center p-6 text-foreground">
        <div className="flex flex-col items-center gap-4 bg-card/60 border border-border p-8 rounded-2xl shadow-lg backdrop-blur-sm animate-pulse">
          <Loader2 className="w-8 h-8 text-accent2 animate-spin" />
          <span className="text-accent2 text-sm font-mono tracking-widest uppercase font-bold">
            Cargando Base de Datos...
          </span>
        </div>
      </div>
    );

  // ESTADO DE ERROR
  if (error)
    return (
      <div className="app-shell min-h-screen flex items-center justify-center p-6 text-foreground">
        <div className="flex flex-col items-center gap-3 bg-destructive/10 border border-destructive/40 p-8 rounded-2xl shadow-lg max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
          <h2 className="text-destructive font-bold text-lg font-mono">Error de Conexión</h2>
          <p className="text-destructive/80 text-sm font-mono">{error}</p>
        </div>
      </div>
    );

  // RENDER PRINCIPAL
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="app-shell min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-500 text-foreground"
    >
      <div className="w-full flex flex-col gap-6 lg:gap-8">

        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-border pb-6 relative">

          {/* Título y Subtítulo */}
          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-brand/10 border border-brand/30 shadow-[0_0_20px_-6px_var(--brand)]">
                <Gamepad2 className="w-6 h-6 text-brand" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-brand to-accent2">
                Liga de Speedruns
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-muted-foreground tracking-widest uppercase">Liga Retro Competitiva</span>
              <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)] animate-pulse"></span>
              <span className="text-success/90 tracking-widest">EN VIVO</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 z-10">
            <ThemeToggle />

            <button
              onClick={() => setShowStreams(true)}
              className="group flex items-center justify-center p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-[#a855f7]/30 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 hover:border-[#a855f7]/60 transition-all duration-300"
              title="Ver transmisiones"
            >
              <TwitchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#a855f7] group-hover:text-[#c084fc]" />
            </button>

            <button
              onClick={() => setShowPlayers(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-bold text-brand border border-brand/30 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-brand/10 hover:bg-brand/20 hover:border-brand/50 transition-all duration-300 font-mono tracking-wide"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
              <span className="hidden sm:inline">Jugadores</span>
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-bold text-gold border border-gold/30 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-gold/10 hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 font-mono tracking-wide"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              <span className="hidden sm:inline">Clásica</span>
            </button>

            <button
              onClick={() => setShowLeaderboardBeta(true)}
              className="group flex items-center gap-2 text-[11px] sm:text-xs font-black text-accent2 border border-accent2/40 rounded-xl p-2.5 sm:px-4 sm:py-2.5 bg-accent2/15 hover:bg-accent2/25 hover:border-accent2/60 transition-all duration-300 font-mono tracking-wide relative overflow-hidden"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-accent2" />
              <span className="hidden sm:inline">Ranking Beta</span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
            </button>
          </div>
        </div>

        {/* EVENTOS Y REGLAS — ancho completo (anuncios) */}
        {tabs.length > 0 && (
          <div className="w-full">
            <TabsContenido tabs={tabs} />
          </div>
        )}

        {/* CUERPO: grid de juegos protagonista + rail de datos al costado */}
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1fr)_340px] items-start">

          {/* PRINCIPAL: buscador + grid */}
          <main className="flex flex-col gap-6 min-w-0">
            <div className="bg-card/50 border border-border p-4 rounded-2xl shadow-sm backdrop-blur-sm">
              <SearchBar
                value={busqueda}
                onChange={setBusqueda}
                ptsOptions={ptsOptions}
                ptsFilter={ptsFilter}
                onPtsFilter={setPtsFilter}
                sort={sort}
                onSort={setSort}
                robaFacil={robaFacil}
                onRobaFacil={setRobaFacil}
              />
            </div>

            {juegosFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
                <Gamepad2 className="w-12 h-12 mb-3 opacity-40" />
                <span className="font-mono text-sm uppercase tracking-widest">No se encontraron juegos</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {juegosFiltrados.map((j) => (
                  <GameCard key={j.nombre} juego={j} onClick={() => irAJuego(j)} />
                ))}
              </div>
            )}
          </main>

          {/* RAIL DE DATOS: métricas + destacados (sticky en desktop) */}
          <aside className="flex flex-col gap-2.5 xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto custom-scrollbar xl:pr-1">
            <StatsStrip stats={stats} />
            <Destacados
              jugadores={data.jugadores}
              stats={stats}
              onVerTabla={() => setShowLeaderboard(true)}
              onSelectJuego={irAJuego}
            />
          </aside>

        </div>

      </div>

      {/* DIÁLOGOS Y MODALES */}
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
      <StreamsDialog open={showStreams} onClose={() => setShowStreams(false)} />
    </motion.div>
  );
}
