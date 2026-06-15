import { useEffect, useMemo, useState } from "react";
import Upload from "./components/Upload";
import WrappedCarousel from "./components/WrappedCarousel";
import { computeStats } from "./lib/stats";
import { clearTrips, loadTrips, saveTrips } from "./lib/storage";
import type { Trip } from "./lib/types";

export default function App() {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const cached = loadTrips();
    if (cached && cached.length > 0) setTrips(cached);
  }, []);

  const stats = useMemo(
    () => (trips && trips.length > 0 ? computeStats(trips) : null),
    [trips],
  );

  const handleTrips = (next: Trip[], nextWarnings: string[]) => {
    setTrips(next);
    setWarnings(nextWarnings);
    saveTrips(next);
  };

  const handleReset = () => {
    clearTrips();
    setTrips(null);
    setWarnings([]);
  };

  if (!stats) {
    return <Upload onTrips={handleTrips} />;
  }

  return (
    <WrappedCarousel stats={stats} warnings={warnings} onReset={handleReset} />
  );
}
