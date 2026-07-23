// SearchBar.tsx
import { Search, Flame, ArrowDownAZ, Timer, ChevronDown, Target } from "lucide-react";
import { QueueWidget } from "./QueueWidget";

export type SortMode = "relevantes" | "az" | "record";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  ptsOptions: number[];
  ptsFilter: number | null;
  onPtsFilter: (pts: number | null) => void;
  sort: SortMode;
  onSort: (s: SortMode) => void;
  robaFacil: boolean;
  onRobaFacil: (v: boolean) => void;
}

const SORTS: { id: SortMode; label: string; icon: React.ReactNode }[] = [
  { id: "relevantes", label: "Relevantes", icon: <Flame className="w-3.5 h-3.5" /> },
  { id: "az", label: "A-Z", icon: <ArrowDownAZ className="w-3.5 h-3.5" /> },
  { id: "record", label: "Récord corto", icon: <Timer className="w-3.5 h-3.5" /> },
];

export function SearchBar({ value, onChange, ptsOptions, ptsFilter, onPtsFilter, sort, onSort, robaFacil, onRobaFacil }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Fila: search + orden + filtro pts */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 w-full">

        {/* Input — busca por juego o jugador */}
        <div className="relative lg:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar juego o jugador..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono transition-all duration-200 bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand/60 focus:bg-muted/70 focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Roba Fácil — juegos con un solo runner (Sanosuke o Jack Turrismo) */}
          <button
            onClick={() => onRobaFacil(!robaFacil)}
            title="Juegos con un solo runner (Sanosuke o Jack Turrismo): récord fácil de robar"
            className={`flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xl px-3 py-2.5 border transition-all duration-150 whitespace-nowrap ${
              robaFacil
                ? "bg-gold text-brand-foreground border-gold shadow-[0_0_14px_-4px_var(--gold)]"
                : "bg-muted/40 text-muted-foreground border-border hover:text-foreground hover:border-gold/50"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roba Fácil</span>
          </button>

          {/* Orden */}
          <div className="flex items-center gap-1 bg-muted/40 border border-border rounded-xl p-1 w-fit">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => onSort(s.id)}
                title={`Ordenar por ${s.label}`}
                className={`flex items-center gap-1.5 text-[11px] font-mono font-bold rounded-lg px-2.5 py-1.5 transition-all duration-150 whitespace-nowrap ${
                  sort === s.id
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Filtro de puntos — select compacto */}
          <div className="relative">
            <select
              value={ptsFilter ?? ""}
              onChange={(e) => onPtsFilter(e.target.value === "" ? null : Number(e.target.value))}
              aria-label="Filtrar por puntos"
              className={`appearance-none cursor-pointer rounded-xl border py-2.5 pl-3 pr-8 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand/20 [color-scheme:light] dark:[color-scheme:dark] ${
                ptsFilter !== null
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-muted/40 text-muted-foreground border-border hover:text-foreground hover:border-brand/40"
              }`}
            >
              <option value="">Puntos: todos</option>
              {ptsOptions.map((pts) => (
                <option key={pts} value={pts}>
                  {pts} pts
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-70" />
          </div>
        </div>
      </div>

      {/* Cola */}
      <QueueWidget />

    </div>
  );
}
