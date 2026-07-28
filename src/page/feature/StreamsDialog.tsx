import { ExternalLink, Radio } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

interface Stage {
  nombre: string;
  canal: string;
  descripcion: string;
}

const STAGES: Stage[] = [
  {
    nombre: "Main Stage",
    canal: "martin_bombelli",
    descripcion: "Transmisión principal de la liga",
  },
  {
    nombre: "Side Stage",
    canal: "sanosukearg",
    descripcion: "Transmisión alternativa",
  },
];

interface StreamsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function StreamsDialog({ open, onClose }: StreamsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="panel-shell !max-w-md w-[95vw] border border-border text-foreground rounded-2xl shadow-2xl overflow-hidden p-0">
        {/* HEADER */}
        <div className="p-4 sm:p-5 pb-4 border-b border-border bg-[#a855f7]/5">
          <DialogTitle className="flex items-center gap-3 text-xl font-black tracking-wide text-foreground m-0">
            <div className="p-2 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/25">
              <TwitchIcon className="w-5 h-5 text-[#a855f7]" />
            </div>
            Transmisiones
          </DialogTitle>
        </div>

        {/* OPCIONES */}
        <div className="p-4 sm:p-5 flex flex-col gap-3">
          {STAGES.map((stage) => (
            <a
              key={stage.canal}
              href={`https://www.twitch.tv/${stage.canal}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/50 hover:bg-[#a855f7]/10 hover:border-[#a855f7]/50 transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/25 group-hover:border-[#a855f7]/50 transition-colors shrink-0">
                <Radio className="w-5 h-5 text-[#a855f7]" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-black tracking-wide text-foreground">
                  {stage.nombre}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground truncate">
                  {stage.descripcion}
                </span>
                <span className="text-[11px] font-mono text-[#a855f7]/90 truncate">
                  twitch.tv/{stage.canal}
                </span>
              </div>

              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#a855f7] transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
