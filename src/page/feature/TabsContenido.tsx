// TabsContenido.tsx — sección de eventos/desafíos + info (reglas)
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ScrollText, Gift, Clock3, CheckCircle2 } from "lucide-react";
import { diasRestantes } from "../utils/stats";

interface Tab {
  boton: string;
  contenido: string;
  img?: string;
  fechaFin?: string;
}

interface TabsContenidoProps {
  tabs: Tab[];
}

// ─── Helpers de evento ───────────────────────────────────────────────────────

function esEvento(t: Tab): boolean {
  return Boolean(t.img || t.fechaFin);
}

function estaTerminado(t: Tab): boolean {
  if (/terminado|finalizado/i.test(t.contenido)) return true;
  if (t.fechaFin) {
    const dias = diasRestantes(t.fechaFin);
    if (dias !== null && dias < 0) return true;
  }
  return false;
}

function extraerPremio(contenido: string): string | null {
  const m = contenido.match(/premio[^\n]*/i);
  return m ? m[0].trim() : null;
}

function EstadoBadge({ tab }: { tab: Tab }) {
  if (estaTerminado(tab)) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted/70 text-muted-foreground border border-border">
        <CheckCircle2 className="w-2.5 h-2.5" />
        Finalizado
      </span>
    );
  }
  const dias = tab.fechaFin ? diasRestantes(tab.fechaFin) : null;
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
      <Clock3 className="w-2.5 h-2.5" />
      {dias !== null && dias >= 0 ? (dias === 0 ? "Último día" : `${dias} días`) : "Activo"}
    </span>
  );
}

// ─── Card de evento ──────────────────────────────────────────────────────────

function EventoCard({ tab, onOpen }: { tab: Tab; onOpen: (t: Tab) => void }) {
  const terminado = estaTerminado(tab);
  const premio = extraerPremio(tab.contenido);

  return (
    <button
      onClick={() => onOpen(tab)}
      className={`group relative flex items-stretch gap-0 text-left rounded-2xl border overflow-hidden transition-all duration-300 ${
        terminado
          ? "border-border bg-card/40 opacity-70 hover:opacity-100"
          : "border-gold/30 bg-card/60 hover:border-gold/60 hover:shadow-[0_0_24px_-10px_var(--gold)]"
      }`}
    >
      {/* Imagen */}
      {tab.img && (
        <div className="w-20 sm:w-24 shrink-0 overflow-hidden">
          <img
            src={tab.img}
            alt={tab.boton}
            loading="lazy"
            onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${terminado ? "grayscale" : ""}`}
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-col gap-1.5 p-3 sm:p-3.5 flex-1 min-w-0 justify-center">
        <div className="flex items-center gap-2 flex-wrap">
          <EstadoBadge tab={tab} />
        </div>
        <p className="text-sm font-black text-foreground leading-tight truncate">
          {tab.boton}
        </p>
        {premio && (
          <p className={`flex items-center gap-1.5 text-[11px] font-mono truncate ${terminado ? "text-muted-foreground" : "text-gold"}`}>
            <Gift className="w-3 h-3 shrink-0" />
            {premio}
          </p>
        )}
        {tab.fechaFin && (
          <p className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <Calendar className="w-3 h-3 shrink-0" />
            {tab.fechaFin}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Sección principal ───────────────────────────────────────────────────────

export function TabsContenido({ tabs }: TabsContenidoProps) {
  const [tabActiva, setTabActiva] = useState<Tab | null>(null);

  const eventos = tabs.filter(esEvento);
  const info = tabs.filter((t) => !esEvento(t));

  // Activos primero, terminados al final
  const eventosOrdenados = [...eventos].sort(
    (a, b) => Number(estaTerminado(a)) - Number(estaTerminado(b))
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Encabezado de sección + botones de info (Reglas, etc.) */}
      {(eventos.length > 0 || info.length > 0) && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {eventos.length > 0 && (
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
              Desafíos y eventos
            </span>
          )}
          <div className="flex gap-2 flex-wrap ml-auto">
            {info.map((t) => (
              <button
                key={t.boton}
                onClick={() => setTabActiva(t)}
                className="flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-lg border border-brand/25 bg-brand/10 text-brand transition-all duration-300 hover:border-brand/50 hover:bg-brand/20"
              >
                <ScrollText className="w-3.5 h-3.5" />
                {t.boton}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cards de eventos */}
      {eventosOrdenados.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {eventosOrdenados.map((t) => (
            <EventoCard key={t.boton} tab={t} onOpen={setTabActiva} />
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Dialog
        open={!!tabActiva}
        onOpenChange={(open) => !open && setTabActiva(null)}
      >
        <DialogContent className="panel-shell w-[98vw] sm:!max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl border border-border shadow-2xl [&>button]:text-muted-foreground [&>button]:hover:text-foreground">
          {/* HEADER */}
          <div className="p-4 sm:p-6 pb-4 border-b border-border bg-brand/5 flex-shrink-0">
            <DialogTitle className="flex items-start gap-3 m-0">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-black tracking-wide text-foreground leading-tight">
                    {tabActiva?.boton}
                  </span>
                  {tabActiva && esEvento(tabActiva) && <EstadoBadge tab={tabActiva} />}
                </div>
                {tabActiva?.fechaFin && (
                  <p className="font-mono text-xs flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-3 h-3 shrink-0" />
                    Fecha límite:
                    <span className="text-brand">{tabActiva.fechaFin}</span>
                  </p>
                )}
              </div>
            </DialogTitle>
          </div>

          {/* CUERPO */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex flex-col sm:flex-row gap-6 px-6 sm:px-8 py-6">
              {/* Imagen lateral si existe */}
              {tabActiva?.img && (
                <div className="flex-shrink-0 w-full sm:w-48 lg:w-56">
                  <img
                    src={tabActiva.img}
                    alt={tabActiva.boton}
                    className="w-full rounded-xl object-cover sm:sticky sm:top-0 border border-border"
                    style={{ aspectRatio: "3/4" }}
                  />
                </div>
              )}

              {/* Contenido MD */}
              <div className="flex-1 min-w-0">
                <div className="font-mono leading-relaxed text-muted-foreground text-base">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="font-black tracking-wide text-foreground text-2xl mb-3 mt-6 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-bold tracking-wide text-foreground text-xl mb-3 mt-5">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-semibold text-brand text-lg mb-2.5 mt-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-[1.8] text-muted-foreground">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-5 mb-3 space-y-1.5 list-disc marker:text-brand/50">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-5 mb-3 space-y-1.5 list-decimal marker:text-brand/50">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-[1.8] text-muted-foreground">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-foreground font-bold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-brand/80">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-brand/10 border border-brand/20 px-2 py-0.5 rounded text-sm text-brand font-mono">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-brand/30 pl-4 my-3 text-muted-foreground/80">
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr className="border-none border-t border-border my-5" />
                      ),
                    }}
                  >
                    {tabActiva?.contenido ?? ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 sm:p-6 pt-4 border-t border-border bg-card/40 flex justify-between items-center gap-2 text-xs font-mono text-muted-foreground">
            <div>
              ⚡ <span className="text-brand font-bold">{tabActiva?.boton}</span>
            </div>
            <div className="text-[10px] tracking-wider opacity-70 uppercase">
              {tabActiva?.fechaFin ? `Límite: ${tabActiva.fechaFin}` : "Sin fecha límite"}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
