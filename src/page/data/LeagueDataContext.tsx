// LeagueDataContext.tsx — hace el fetch del sheet una sola vez y lo comparte
// entre la home y el dashboard de cada juego.
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import type { SheetData } from "../landing/types/types";
import { parseCSV, parseSheet3 } from "../utils/utils";

const SHEET_ID = "1mrXf73gNSpp1miUVkQ-_au6vCl1jtO7RT6JpZKh5QWU";
const GID = "2138027932";
const GID_SHEET3 = "337149263";

export interface Tab {
  boton: string;
  contenido: string;
  img?: string;
  fechaFin?: string;
}

interface LeagueDataValue {
  data: SheetData;
  tabs: Tab[];
  loading: boolean;
  error: string;
}

const LeagueDataContext = createContext<LeagueDataValue | null>(null);

export function LeagueDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SheetData>({ juegos: [], jugadores: [] });
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = Date.now();
    const url1 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}&t=${t}`;
    const url3 = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_SHEET3}&t=${t}`;

    Promise.all([
      fetch(url1).then((r) => r.text()),
      fetch(url3).then((r) => r.text()),
    ])
      .then(([text1, text3]) => {
        setData(parseCSV(text1));
        setTabs(parseSheet3(text3));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error desconocido"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <LeagueDataContext.Provider value={{ data, tabs, loading, error }}>
      {children}
    </LeagueDataContext.Provider>
  );
}

export function useLeagueData(): LeagueDataValue {
  const ctx = useContext(LeagueDataContext);
  if (!ctx) throw new Error("useLeagueData debe usarse dentro de <LeagueDataProvider>");
  return ctx;
}
