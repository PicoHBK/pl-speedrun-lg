// TabsContenido.tsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

interface Tab {
  boton: string;
  contenido: string;
  img?: string;
  fechaFin?: string;
}

interface TabsContenidoProps {
  tabs: Tab[];
}

export function TabsContenido({ tabs }: TabsContenidoProps) {
  const [tabActiva, setTabActiva] = useState<Tab | null>(null);

  return (
    <>
      {/* Botones */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.boton}
            onClick={() => setTabActiva(t)}
            className="group text-xs font-mono px-4 py-2 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-cyan-300"
          >
            {t.boton}
          </button>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={!!tabActiva}
        onOpenChange={(open) => !open && setTabActiva(null)}
      >
        <DialogContent
          className="w-[98vw] sm:!max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl border border-blue-500/30 shadow-[0_0_30px_rgba(30,144,255,0.15)] [&>button]:text-blue-300/60 [&>button]:hover:text-blue-200"
          style={{ background: "radial-gradient(circle at top, #0a1626 0%, #040910 100%)" }}
        >
          {/* HEADER — idéntico a LeaderboardBeta */}
          <div className="p-4 sm:p-6 pb-4 border-b border-blue-500/20 bg-blue-950/20 flex-shrink-0">
            <DialogTitle className="flex items-start gap-3 m-0">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-xl font-black tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-300 leading-tight">
                  {tabActiva?.boton}
                </span>
                {tabActiva?.fechaFin && (
                  <p className="font-mono text-xs flex items-center gap-2 text-blue-400/50">
                    <Calendar className="w-3 h-3 shrink-0" />
                    Fecha límite:
                    <span className="text-blue-300/70">{tabActiva.fechaFin}</span>
                  </p>
                )}
              </div>
            </DialogTitle>
          </div>

          {/* CUERPO */}
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className={`flex gap-6 px-6 sm:px-8 py-6 ${tabActiva?.img ? "flex-row" : ""}`}>

              {/* Imagen lateral si existe */}
              {tabActiva?.img && (
                <div className="flex-shrink-0 w-48 sm:w-56">
                  <img
                    src={tabActiva.img}
                    alt={tabActiva.boton}
                    className="w-full rounded-xl object-cover sticky top-0 border border-blue-500/20"
                    style={{ aspectRatio: "3/4" }}
                  />
                </div>
              )}

              {/* Contenido MD */}
              <div className="flex-1 min-w-0">
                <div className="font-mono leading-relaxed text-blue-200/60 text-base">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="font-black tracking-wide text-blue-100 text-2xl mb-3 mt-6 first:mt-0">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-bold tracking-wide text-blue-200 text-xl mb-3 mt-5">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-semibold text-blue-300/80 text-lg mb-2.5 mt-4">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 leading-[1.8] text-blue-200/60">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-5 mb-3 space-y-1.5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-5 mb-3 space-y-1.5">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-[1.8] text-blue-200/50">{children}</li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-blue-300 font-bold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-blue-300/40">{children}</em>
                      ),
                      code: ({ children }) => (
                        <code className="bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-sm text-blue-300 font-mono">
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-blue-500/30 pl-4 my-3 text-blue-200/40">
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr className="border-none border-t border-blue-500/10 my-5" />
                      ),
                    }}
                  >
                    {tabActiva?.contenido ?? ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER — idéntico a LeaderboardBeta */}
          <div className="p-4 sm:p-6 pt-4 border-t border-blue-500/20 bg-[#040910] flex justify-between items-center gap-2 text-xs font-mono text-blue-400/50">
            <div>
              ⚡ <span className="text-blue-300 font-bold">{tabActiva?.boton}</span>
            </div>
            <div className="text-[10px] tracking-wider opacity-60 uppercase">
              {tabActiva?.fechaFin ? `Límite: ${tabActiva.fechaFin}` : "Sin fecha límite"}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}