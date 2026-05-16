// SearchBar.tsx
import { Search } from "lucide-react";
import { QueueWidget } from "./QueueWidget";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  ptsOptions: number[];
  ptsFilter: number | null;
  onPtsFilter: (pts: number | null) => void;
}

const TIER_COLORS: Record<number, { bg: string; activeBg: string; text: string; activeText: string; border: string; activeBorder: string }> = {
  1:  { bg: "#27272a", activeBg: "#52525b", text: "#a1a1aa",  activeText: "#f4f4f5",  border: "#52525b",  activeBorder: "#a1a1aa" },
  2:  { bg: "#052e16", activeBg: "#166534", text: "#4ade80",  activeText: "#dcfce7",  border: "#16a34a",  activeBorder: "#22c55e" },
  3:  { bg: "#083344", activeBg: "#155e75", text: "#22d3ee",  activeText: "#cffafe",  border: "#0891b2",  activeBorder: "#06b6d4" },
  4:  { bg: "#172554", activeBg: "#1e40af", text: "#60a5fa",  activeText: "#dbeafe",  border: "#2563eb",  activeBorder: "#3b82f6" },
  5:  { bg: "#1e1b4b", activeBg: "#312e81", text: "#818cf8",  activeText: "#e0e7ff",  border: "#4338ca",  activeBorder: "#6366f1" },
  6:  { bg: "#2e1065", activeBg: "#4c1d95", text: "#a78bfa",  activeText: "#ede9fe",  border: "#7c3aed",  activeBorder: "#8b5cf6" },
  7:  { bg: "#4a044e", activeBg: "#701a75", text: "#e879f9",  activeText: "#fae8ff",  border: "#a21caf",  activeBorder: "#c026d3" },
  8:  { bg: "#4c0519", activeBg: "#881337", text: "#fb7185",  activeText: "#ffe4e6",  border: "#e11d48",  activeBorder: "#f43f5e" },
  9:  { bg: "#431407", activeBg: "#9a3412", text: "#fb923c",  activeText: "#ffedd5",  border: "#ea580c",  activeBorder: "#f97316" },
  10: { bg: "#713f12", activeBg: "#a16207", text: "#fde047",  activeText: "#fefce8",  border: "#ca8a04",  activeBorder: "#eab308" },
};

export function SearchBar({ value, onChange, ptsOptions, ptsFilter, onPtsFilter }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Fila: search + chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">

        {/* Input */}
        <div className="relative sm:flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/60"
          />
          <input
            type="text"
            placeholder="Buscar juego..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono transition-all duration-200 focus:outline-none placeholder:text-blue-400/30"
            style={{
              background: "rgba(30,58,138,0.15)",
              border: "1px solid rgba(59,130,246,0.35)",
              color: "#93c5fd",
              boxShadow: "0 0 0 0 transparent",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(59,130,246,0.7)";
              e.currentTarget.style.background = "rgba(30,58,138,0.25)";
              e.currentTarget.style.boxShadow = "0 0 12px rgba(59,130,246,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(59,130,246,0.35)";
              e.currentTarget.style.background = "rgba(30,58,138,0.15)";
              e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
            }}
          />
        </div>

        {/* Chips de pts */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ptsOptions.map((pts) => {
            const active = ptsFilter === pts;
            const c = TIER_COLORS[pts] ?? TIER_COLORS[1];
            return (
              <button
                key={pts}
                onClick={() => onPtsFilter(active ? null : pts)}
                className="text-[11px] font-black font-mono rounded-lg px-2.5 py-1.5 transition-all duration-150 uppercase tracking-wider whitespace-nowrap"
                style={{
                  background: active ? c.activeBg : c.bg,
                  color: active ? c.activeText : c.text,
                  border: `1px solid ${active ? c.activeBorder : c.border}`,
                  opacity: active ? 1 : 0.75,
                  transform: active ? "scale(1.05)" : "scale(1)",
                }}
              >
                {pts} pts
              </button>
            );
          })}

          {ptsFilter !== null && (
            <button
              onClick={() => onPtsFilter(null)}
              className="text-[11px] font-mono rounded-lg px-2 py-1.5 transition-all duration-150 hover:text-blue-300"
              style={{
                background: "transparent",
                color: "rgba(148,163,184,0.5)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cola */}
      <QueueWidget />

    </div>
  );
}