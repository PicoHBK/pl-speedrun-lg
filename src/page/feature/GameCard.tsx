import { useState } from "react";
import { Gamepad2, Clock, Trophy, User } from "lucide-react";
import type { Juego } from "../landing/types/types";

interface GameCardProps {
  juego: Juego;
  onClick: () => void;
}

export function GameCard({ juego, onClick }: GameCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group relative bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 hover:border-violet-500/60 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <div className="relative w-full bg-zinc-950" style={{ aspectRatio: "3/4" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
        {juego.imagen && !imgError ? (
          <img
            src={juego.imagen}
            alt={juego.nombre}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 group-hover:border-violet-500/50 transition-colors">
              <Gamepad2
                className="w-8 h-8 text-zinc-600 group-hover:text-violet-400 transition-colors"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 z-20 flex flex-col gap-1">
          <span className="self-start flex items-center gap-1 bg-black/70 backdrop-blur-sm text-cyan-400 font-mono text-xs font-semibold px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            {juego.record}
          </span>
          <span className="self-start flex items-center gap-1 bg-black/70 backdrop-blur-sm text-zinc-300 text-xs px-2 py-0.5 rounded-full">
            <Trophy className="w-3 h-3 text-yellow-400" />
            {juego.quien}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 tracking-wide">
          {juego.nombre}
        </h3>
        {juego.runners.length > 1 && (
          <span className="mt-2 inline-flex items-center gap-1 bg-zinc-900 text-zinc-500 text-xs px-2 py-0.5 rounded-full">
            <User className="w-3 h-3" />
            {juego.runners.length} Runs
          </span>
        )}
      </div>
    </div>
  );
}