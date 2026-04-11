// SearchBar.tsx
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/30" />
      <input
        type="text"
        placeholder="Buscar juego..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm text-blue-100 placeholder-blue-400/20 focus:outline-none focus:border-violet-500/50 transition-colors font-mono"
        style={{ background: "#030810", borderColor: "rgba(59,130,246,0.15)" }}
      />
    </div>
  );
}