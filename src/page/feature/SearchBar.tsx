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
  1:  { bg: "#18181b", activeBg: "#3f3f46", text: "#71717a",  activeText: "#d4d4d8", border: "#3f3f46",  activeBorder: "#71717a" },
  2:  { bg: "#052e16", activeBg: "#166534", text: "#4ade80",  activeText: "#bbf7d0", border: "#166534",  activeBorder: "#16a34a" },
  3:  { bg: "#083344", activeBg: "#155e75", text: "#22d3ee",  activeText: "#a5f3fc", border: "#155e75",  activeBorder: "#0891b2" },
  4:  { bg: "#172554", activeBg: "#1e40af", text: "#60a5fa",  activeText: "#bfdbfe", border: "#1e40af",  activeBorder: "#2563eb" },
  5:  { bg: "#1e1b4b", activeBg: "#312e81", text: "#818cf8",  activeText: "#c7d2fe", border: "#312e81",  activeBorder: "#4338ca" },
  6:  { bg: "#2e1065", activeBg: "#4c1d95", text: "#a78bfa",  activeText: "#ddd6fe", border: "#4c1d95",  activeBorder: "#7c3aed" },
  7:  { bg: "#4a044e", activeBg: "#701a75", text: "#e879f9",  activeText: "#f5d0fe", border: "#701a75",  activeBorder: "#a21caf" },
  8:  { bg: "#4c0519", activeBg: "#881337", text: "#fb7185",  activeText: "#fecdd3", border: "#881337",  activeBorder: "#e11d48" },
  9:  { bg: "#431407", activeBg: "#9a3412", text: "#fb923c",  activeText: "#fed7aa", border: "#9a3412",  activeBorder: "#ea580c" },
  10: { bg: "#7f1d1d", activeBg: "#991b1b", text: "#fde047",  activeText: "#fef9c3", border: "#991b1b",  activeBorder: "#dc2626" },
};

export function SearchBar({ value, onChange, ptsOptions, ptsFilter, onPtsFilter }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Fila: search + chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <div className="relative sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(148,163,184,0.4)" }} />
          <input
            type="text"
            placeholder="Buscar juego..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm font-mono transition-colors focus:outline-none"
            style={{
              background: "#0d1520",
              border: "1px solid rgba(51,65,85,0.6)",
              color: "#94a3b8",
            }}
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {ptsOptions.map((pts) => {
            const active = ptsFilter === pts;
            const c = TIER_COLORS[pts] ?? TIER_COLORS[1];
            return (
              <button
                key={pts}
                onClick={() => onPtsFilter(active ? null : pts)}
                className="text-[11px] font-black font-mono rounded-md px-2.5 py-1.5 transition-all duration-150 uppercase tracking-wider whitespace-nowrap"
                style={{
                  background: active ? c.activeBg : c.bg,
                  color: active ? c.activeText : c.text,
                  border: `1px solid ${active ? c.activeBorder : c.border}`,
                }}
              >
                {pts} pts
              </button>
            );
          })}
          {ptsFilter !== null && (
            <button
              onClick={() => onPtsFilter(null)}
              className="text-[11px] font-mono rounded-md px-2 py-1.5 transition-all duration-150"
              style={{
                background: "transparent",
                color: "rgba(100,116,139,0.6)",
                border: "1px solid rgba(51,65,85,0.4)",
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