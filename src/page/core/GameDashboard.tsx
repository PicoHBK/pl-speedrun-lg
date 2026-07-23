// GameDashboard.tsx — página de detalle de un juego (ruta /juego/:slug)
// Imagen protagonista (hero vivo) + tabla protagonista al centro + datos al costado.
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trophy, Users, Timer, Coins, Sparkles, Gamepad2,
  Loader2, Crown, Zap, TrendingUp, Swords,
} from "lucide-react";
import { useLeagueData } from "../data/LeagueDataContext";
import {
  slugify, extraerMultiplicador, nombreSinMultiplicador,
  puntosBasePosicion, puntosEnJuego, formatGap,
} from "../utils/stats";

// ─── Tile de estadística (rail derecho) ─────────────────────────────────────

function Kpi({ icon, valor, label, sub, accent = "text-brand" }: {
  icon: React.ReactNode; valor: string; label: string; sub?: string; accent?: string;
}) {
  return (
    <div className="flex flex-col gap-1 bg-card/60 border border-border rounded-2xl p-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className={accent}>{icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>
      <span className="text-2xl font-black tabular-nums text-foreground leading-none">{valor}</span>
      {sub && <span className="text-[10px] font-mono text-muted-foreground/80 truncate">{sub}</span>}
    </div>
  );
}

// ─── Envoltura de página (fondo + animación, ancho completo) ─────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="app-shell min-h-screen p-4 sm:p-6 lg:p-8 text-foreground"
    >
      <div className="w-full flex flex-col gap-6">{children}</div>
    </motion.div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function GameDashboard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useLeagueData();
  const [imgError, setImgError] = useState(false);

  const juego = useMemo(
    () => data.juegos.find((j) => slugify(j.nombre) === slug),
    [data.juegos, slug]
  );

  const wrMap = useMemo(
    () => new Map(data.jugadores.map((j) => [j.nombre, j.puntos])),
    [data.jugadores]
  );

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <Loader2 className="w-8 h-8 text-accent2 animate-spin" />
          <span className="text-accent2 text-sm font-mono tracking-widest uppercase font-bold">Cargando...</span>
        </div>
      </PageShell>
    );
  }

  if (!juego) {
    return (
      <PageShell>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-brand transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <div className="flex flex-col items-center justify-center gap-3 py-28 text-muted-foreground border border-dashed border-border rounded-2xl bg-card/20">
          <Gamepad2 className="w-12 h-12 opacity-40" />
          <span className="font-mono text-sm uppercase tracking-widest">Juego no encontrado</span>
        </div>
      </PageShell>
    );
  }

  const n = juego.runners.length;
  const mult = extraerMultiplicador(juego.nombre);
  const nombre = nombreSinMultiplicador(juego.nombre);
  const recordSeg = juego.runners[0].segundos;
  const totalPuntos = puntosEnJuego(juego);
  const potencial = Math.round(Math.min(10, n + 1) * mult * 10) / 10;
  const hayImagen = juego.imagen && !imgError;
  const gap12 = n >= 2 ? juego.runners[1].segundos - recordSeg : null;

  const escalera = [1, 2, 3].map((pos) => ({
    pos,
    pts: Math.round(puntosBasePosicion(pos, n) * mult * 10) / 10,
  }));

  return (
    <PageShell>
      {/* Volver — fijo, siempre a mano */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 text-sm font-mono font-bold text-foreground bg-card/80 hover:bg-card border border-border hover:border-brand/40 rounded-xl px-3 py-2 backdrop-blur-md shadow-lg transition-all"
        title="Volver a la liga"
      >
        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
      </button>

      {/* ═══ HERO CINEMATOGRÁFICO — la imagen manda ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border min-h-[300px] sm:min-h-[360px] flex"
      >
        {/* Fondo: la propia carátula, difuminada y con zoom lento (vida) */}
        {hayImagen && (
          <>
            <motion.img
              src={juego.imagen}
              alt=""
              aria-hidden
              initial={{ scale: 1.12 }}
              animate={{ scale: 1.24 }}
              transition={{ duration: 18, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent pointer-events-none" />
          </>
        )}

        {/* Contenido del hero */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-8 p-6 sm:p-8 lg:p-10 w-full">
          {/* Póster nítido, grande y protagonista */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-40 sm:w-52 lg:w-60 shrink-0 rounded-2xl overflow-hidden border border-border bg-muted shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
            style={{ aspectRatio: "12/16" }}
          >
            {hayImagen ? (
              <img src={juego.imagen} alt={nombre} onError={() => setImgError(true)} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gamepad2 className="w-14 h-14 text-muted-foreground/40" strokeWidth={1} />
              </div>
            )}
          </motion.div>

          {/* Título + récord */}
          <div className="flex flex-col gap-3 min-w-0 text-center sm:text-left pb-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              {mult !== 1 && (
                <span className="inline-flex items-center gap-1 text-xs font-black font-mono uppercase tracking-wider text-gold bg-gold/15 border border-gold/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Zap className="w-3 h-3 fill-current" /> x{mult}
                </span>
              )}
              <span className={`inline-flex items-center gap-1 text-[10px] font-black font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-sm ${
                n === 1 ? "text-gold bg-gold/15 border-gold/40" : "text-accent2 bg-accent2/15 border-accent2/40"
              }`}>
                {n === 1 ? "Récord libre" : `${n} en disputa`}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] bg-clip-text text-transparent bg-gradient-to-br from-foreground via-brand to-accent2 drop-shadow-sm">
              {nombre}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base font-mono text-muted-foreground flex-wrap">
              <Crown className="w-4 h-4 text-gold shrink-0" />
              <span className="text-foreground font-bold">{juego.quien}</span>
              <span>·</span>
              <span className="text-gold font-black text-lg">{juego.record}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ CUERPO: tabla protagonista + datos al costado ═══ */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] items-start">

        {/* PRINCIPAL: clasificación */}
        <main className="min-w-0">
          <div className="bg-card/60 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 px-4 sm:px-5 pt-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  Clasificación · {n} {n === 1 ? "runner" : "runners"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider hidden sm:block">
                velocidad · gap · puntos
              </span>
            </div>

            <div className="flex flex-col divide-y divide-border/50">
              {juego.runners.map((r, i) => {
                const pos = i + 1;
                const gapWR = r.segundos - recordSeg;
                const gapPrev = i === 0 ? 0 : r.segundos - juego.runners[i - 1].segundos;
                const pts = Math.round(puntosBasePosicion(pos, n) * mult * 10) / 10;
                const speedPct = Number.isFinite(recordSeg) && r.segundos > 0 ? (recordSeg / r.segundos) * 100 : 0;
                const wr = wrMap.get(r.nombre) ?? 0;
                const puntua = pos <= 3;

                return (
                  <motion.div
                    key={r.nombre + i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.4) }}
                    className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 ${r.esRecord ? "bg-gold/5" : ""}`}
                  >
                    {/* Posición */}
                    <div className="w-8 shrink-0 flex justify-center">
                      {r.esRecord ? (
                        <Crown className="w-5 h-5 text-gold" />
                      ) : (
                        <span className={`text-base font-black font-mono ${puntua ? "text-foreground" : "text-muted-foreground/50"}`}>{pos}</span>
                      )}
                    </div>

                    {/* Nombre + barra de velocidad */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm sm:text-base font-bold truncate ${r.esRecord ? "text-gold" : "text-foreground"}`}>{r.nombre}</span>
                        {wr > 0 && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 border border-border px-1.5 rounded-full">
                            {wr} WR liga
                          </span>
                        )}
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(4, Math.min(100, speedPct))}%` }}
                          transition={{ duration: 0.6, delay: Math.min(i * 0.03, 0.4), ease: "easeOut" }}
                          className={`h-full rounded-full ${r.esRecord ? "bg-gold" : "bg-brand/70"}`}
                        />
                      </div>
                    </div>

                    {/* Gap */}
                    <div className="hidden sm:block w-20 shrink-0 text-right">
                      {i === 0 ? (
                        <span className="text-xs font-mono font-black text-gold">WR</span>
                      ) : (
                        <div className="flex flex-col leading-tight">
                          <span className="text-xs font-mono font-bold text-foreground/80">+{formatGap(gapWR)}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/60">+{formatGap(gapPrev)} ant.</span>
                        </div>
                      )}
                    </div>

                    {/* Tiempo */}
                    <div className="w-20 sm:w-24 shrink-0 text-right">
                      <span className={`text-sm font-mono font-bold ${r.esRecord ? "text-gold" : "text-muted-foreground"}`}>{r.tiempo}</span>
                    </div>

                    {/* Puntos */}
                    <div className="w-12 shrink-0 text-right">
                      <span className={`text-base font-black font-mono tabular-nums ${
                        pts > 0 ? (r.esRecord ? "text-gold" : "text-success") : "text-muted-foreground/40"
                      }`}>
                        {pts}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RAIL: datos como estadísticas (sticky en desktop) */}
        <aside className="flex flex-col gap-3 xl:sticky xl:top-6 xl:self-start">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2.5">
            <Kpi icon={<Users className="w-4 h-4" />} valor={String(n)} label="Runners" accent="text-accent2" />
            <Kpi icon={<Coins className="w-4 h-4" />} valor={String(totalPuntos)} label="Puntos en juego" sub="al podio" accent="text-success" />
            <Kpi icon={<Sparkles className="w-4 h-4" />} valor={String(potencial)} label="Potencial" sub="si ganás" accent="text-brand" />
            <Kpi icon={<Timer className="w-4 h-4" />} valor={juego.record} label="Récord" sub={juego.quien} accent="text-gold" />
          </div>

          {/* Duelo más cercano */}
          {gap12 !== null && (
            <div className="flex items-center gap-3 bg-card/60 border border-border rounded-2xl p-3.5 backdrop-blur-sm">
              <Swords className="w-5 h-5 text-destructive shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Distancia al 2º</p>
                <p className="text-lg font-black font-mono text-destructive tabular-nums">+{formatGap(gap12)}</p>
              </div>
            </div>
          )}

          {/* Escalera de puntos */}
          <div className="bg-card/60 border border-border rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-brand" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Escalera de puntos {mult !== 1 && <span className="text-gold">(×{mult})</span>}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {escalera.map(({ pos, pts }) => (
                <div
                  key={pos}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border py-3 ${
                    pos === 1 ? "border-gold/40 bg-gold/5" : pos === 2 ? "border-accent2/40 bg-accent2/5" : "border-brand/40 bg-brand/5"
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{pos}º</span>
                  <span className={`text-xl font-black font-mono tabular-nums ${
                    pos === 1 ? "text-gold" : pos === 2 ? "text-accent2" : "text-brand"
                  }`}>
                    {pts}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/70 mt-3 leading-snug">
              mín(10, ⌈{n} / posición⌉){mult !== 1 ? ` ×${mult}` : ""}. Solo el podio puntúa.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
