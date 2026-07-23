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
        <Users className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Cola
        </span>
        {queue && (
          <>
            <Circle
              className={`w-1.5 h-1.5 fill-current ${queue.status === "open" ? "text-success" : "text-destructive"}`}
            />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${queue.status === "open" ? "text-success" : "text-destructive"}`}
            >
              {queue.status === "open" ? "Abierta" : "Cerrada"}
            </span>
          </>
        )}
        {loading && <span className="text-[10px] text-muted-foreground/60">Cargando...</span>}
        {error && <span className="text-[10px] text-destructive">Error</span>}
      </div>

      {queue && queue.users.length === 0 && (
        <span className="text-[10px] text-muted-foreground/60">Vacía</span>
      )}

      {queue && queue.users.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {queue.users.map((user, i) => {

            if (i === 0) return (
              <div
                key={i}
                className="flex flex-col items-start rounded-lg px-3.5 pt-1.5 pb-1.5 bg-accent2/10 border border-accent2/35"
              >
                <span className="text-[8px] font-black uppercase tracking-[0.12em] leading-none text-accent2">
                  próximo
                </span>
                <span className="text-base font-black leading-tight text-accent2">
                  {user}
                </span>
              </div>
            );

            if (i === 1) return (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-muted/60 border border-border"
              >
                <span className="text-[8px] font-black text-muted-foreground">2</span>
                <span className="text-[11px] font-semibold text-muted-foreground">{user}</span>
              </div>
            );

            return (
              <div
                key={i}
                className="flex items-center gap-1 rounded-full px-2 py-0.5 border border-border"
              >
                <span className="text-[8px] font-bold text-muted-foreground/60">{i + 1}</span>
                <span className="text-[10px] font-medium text-muted-foreground/70">{user}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
