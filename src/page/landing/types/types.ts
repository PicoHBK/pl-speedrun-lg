export interface RunnerTiempo {
  nombre: string;
  tiempo: string;
  segundos: number;
  esRecord: boolean;
}

export interface Juego {
  nombre: string;
  record: string;
  quien: string;
  runners: RunnerTiempo[];
  imagen?: string;
}

export interface Jugador {
  nombre: string;
  puntos: number;
}

export interface SheetData {
  juegos: Juego[];
  jugadores: Jugador[];
}