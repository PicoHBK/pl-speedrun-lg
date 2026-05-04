// TabsContenido.tsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
            className="text-xs font-mono px-4 py-2 rounded-lg border transition-all duration-200"
            style={{
              background: "rgba(139,92,246,0.04)",
              borderColor: "rgba(139,92,246,0.2)",
              color: "rgba(196,181,253,0.55)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.12)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.45)";
              e.currentTarget.style.color = "rgba(221,214,254,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,92,246,0.04)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
              e.currentTarget.style.color = "rgba(196,181,253,0.55)";
            }}
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
          className="w-[98vw] sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:text-violet-300/60 [&>button]:hover:text-violet-200"
          style={{
            background: "#07111f",
            border: "1px solid rgba(139,92,246,0.18)",
            borderRadius: "16px",
            boxShadow:
              "0 0 60px rgba(139,92,246,0.08), 0 24px 48px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-start px-8 pt-7 pb-5 flex-shrink-0"
            style={{ borderBottom: "1px solid rgba(139,92,246,0.1)" }}
          >
            <div>
              <DialogTitle
                className="font-mono font-bold tracking-wide"
                style={{
                  color: "#c4b5fd",
                  fontSize: "18px",
                  letterSpacing: "0.08em",
                }}
              >
                {tabActiva?.boton}
              </DialogTitle>
              {tabActiva?.fechaFin && (
                <p
                  className="font-mono mt-1.5 flex items-center gap-2"
                  style={{ fontSize: "13px", color: "rgba(96,165,250,0.45)" }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(96,165,250,0.4)" }}
                  />
                  Fecha límite: {tabActiva.fechaFin}
                </p>
              )}
            </div>
          </div>

          {/* Cuerpo */}
          <div
            className="overflow-y-auto flex-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(139,92,246,0.2) transparent",
            }}
          >
            <div
              className={`flex gap-6 px-8 py-6 ${tabActiva?.img ? "flex-row" : ""}`}
            >
              {/* Imagen lateral si existe */}
              {tabActiva?.img && (
                <div className="flex-shrink-0 w-56">
                  <img
                    src={tabActiva.img}
                    alt={tabActiva.boton}
                    className="w-full rounded-xl object-cover sticky top-0"
                    style={{
                      border: "1px solid rgba(139,92,246,0.15)",
                      aspectRatio: "3/4",
                    }}
                  />
                </div>
              )}

              {/* Contenido MD */}
              <div className="flex-1 min-w-0">
                <div
                  className="font-mono leading-relaxed"
                  style={{ fontSize: "16px", color: "rgba(186,210,255,0.65)" }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1
                          style={{
                            color: "#e2e8f0",
                            fontSize: "26px",
                            fontWeight: 700,
                            marginBottom: "14px",
                            marginTop: "24px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          style={{
                            color: "#cbd5e1",
                            fontSize: "22px",
                            fontWeight: 700,
                            marginBottom: "12px",
                            marginTop: "20px",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          style={{
                            color: "#94a3b8",
                            fontSize: "18px",
                            fontWeight: 600,
                            marginBottom: "10px",
                            marginTop: "16px",
                          }}
                        >
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p
                          style={{
                            marginBottom: "12px",
                            lineHeight: "1.8",
                            fontSize: "16px",
                          }}
                        >
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul
                          style={{ paddingLeft: "22px", marginBottom: "12px" }}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          style={{ paddingLeft: "22px", marginBottom: "12px" }}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li
                          style={{
                            marginBottom: "8px",
                            lineHeight: "1.8",
                            color: "rgba(186,210,255,0.6)",
                            fontSize: "16px",
                          }}
                        >
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: "#a78bfa", fontWeight: 600 }}>
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em style={{ color: "rgba(186,210,255,0.5)" }}>
                          {children}
                        </em>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: "rgba(139,92,246,0.1)",
                            border: "1px solid rgba(139,92,246,0.15)",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            color: "#c4b5fd",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote
                          style={{
                            borderLeft: "2px solid rgba(139,92,246,0.35)",
                            paddingLeft: "16px",
                            margin: "14px 0",
                            color: "rgba(186,210,255,0.4)",
                            fontSize: "16px",
                          }}
                        >
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr
                          style={{
                            border: "none",
                            borderTop: "1px solid rgba(139,92,246,0.1)",
                            margin: "18px 0",
                          }}
                        />
                      ),
                    }}
                  >
                    {tabActiva?.contenido ?? ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
