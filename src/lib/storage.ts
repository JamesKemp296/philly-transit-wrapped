import type { Trip } from "./types";

const STORAGE_KEY = "septa-wrapped:trips:v1";

interface StoredTrip extends Omit<Trip, "date"> {
  date: string;
}

export function saveTrips(trips: Trip[]): void {
  try {
    const serializable: StoredTrip[] = trips.map((t) => ({
      ...t,
      date: t.date.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // localStorage may be unavailable (private mode / quota). Non-fatal.
  }
}

export function loadTrips(): Trip[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredTrip[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((t) => ({
      ...t,
      date: new Date(t.date),
    }));
  } catch {
    return null;
  }
}

export function clearTrips(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
