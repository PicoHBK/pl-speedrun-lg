// QueueWidget.tsx
import { useEffect, useState } from "react";
import { Users, Circle } from "lucide-react";

interface QueueData {
  status: "open" | "closed";
  users: string[];
}

function useQueue(nbqUrl: string, intervalMs = 15000) {
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQueue() {
      try {
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(nbqUrl)}`;
        const res = await fetch(proxy);
        const data = await res.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, "text/html");
        const statusText = doc.body.innerText ?? doc.body.textContent ?? "";
        const status = statusText.toLowerCase().includes("status: open") ? "open" : "closed";
        const users = [...doc.querySelectorAll("li")]
          .map((li) => li.textContent?.trim() ?? "")
          .filter(Boolean);
        setQueue({ status, users });
        setError("");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
    const interval = setInterval(fetchQueue, intervalMs);
    return () => clearInterval(interval);
  }, [nbqUrl, intervalMs]);

  return { queue, loading, error };
}

const NBQ_URL = "https://nbq.gerhard.dev/15809";

export function QueueWidget() {
  const { queue, loading, error } = useQueue(NBQ_URL);

  return (
    <div className="flex flex-col gap-1.5 font-mono">

      <div className="flex items-center gap-2">
        <Users className="w-3 h-3" style={{ color: "#334155" }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#334155" }}>
          Cola
        </span>
        {queue && (
          <>
            <Circle className="w-1.5 h-1.5 fill-current" style={{ color: queue.status === "open" ? "#4ade80" : "#ef4444" }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: queue.status === "open" ? "#4ade80" : "#ef4444" }}>
              {queue.status === "open" ? "Abierta" : "Cerrada"}
            </span>
          </>
        )}
        {loading && <span className="text-[10px]" style={{ color: "#1e293b" }}>Cargando...</span>}
        {error && <span className="text-[10px]" style={{ color: "#ef4444" }}>Error</span>}
      </div>

      {queue && queue.users.length === 0 && (
        <span className="text-[10px]" style={{ color: "#1e293b" }}>Vacía</span>
      )}

      {queue && queue.users.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {queue.users.map((user, i) => {

            if (i === 0) return (
              <div
                key={i}
                className="flex flex-col items-start rounded-lg"
                style={{
                  padding: "5px 14px 6px 14px",
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.35)",
                }}
              >
                <span style={{ fontSize: "8px", fontWeight: 900, color: "#0891b2", textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: 1 }}>
                  próximo
                </span>
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#a5f3fc", lineHeight: 1.3 }}>
                  {user}
                </span>
              </div>
            );

            if (i === 1) return (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-full"
                style={{
                  padding: "4px 10px",
                  background: "rgba(30,41,59,0.6)",
                  border: "1px solid rgba(51,65,85,0.5)",
                }}
              >
                <span style={{ fontSize: "8px", fontWeight: 900, color: "#334155" }}>2</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>{user}</span>
              </div>
            );

            return (
              <div
                key={i}
                className="flex items-center gap-1 rounded-full"
                style={{
                  padding: "3px 8px",
                  background: "transparent",
                  border: "1px solid rgba(30,41,59,0.8)",
                }}
              >
                <span style={{ fontSize: "8px", fontWeight: 700, color: "#1e293b" }}>{i + 1}</span>
                <span style={{ fontSize: "10px", fontWeight: 500, color: "#334155" }}>{user}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}