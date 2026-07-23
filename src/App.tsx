import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LeagueDataProvider } from "./page/data/LeagueDataContext";
import SpeedrunLeague from "./page/core/SpeedrunLeague";
import { GameDashboard } from "./page/core/GameDashboard";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SpeedrunLeague />} />
        <Route path="/juego/:slug" element={<GameDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LeagueDataProvider>
        <AnimatedRoutes />
      </LeagueDataProvider>
    </BrowserRouter>
  );
}
