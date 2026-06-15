import type { CountItem, Trip, WrappedStats } from "./types";
import { classifyMode, routeAggregationKey } from "./septa";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function tally(values: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const v of values) {
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

function topN(map: Map<string, number>, n: number): CountItem[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, n);
}

function formatHour(hour: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${period}`;
}

export function computeStats(trips: Trip[]): WrappedStats {
  const totalTrips = trips.length;

  const transfers = trips.filter(
    (t) => t.type.trim().toLowerCase() === "transfer",
  ).length;

  const stopMap = tally(trips.map((t) => t.stop));
  const uniqueStops = stopMap.size;
  const topStops = topN(stopMap, 5);

  // Mode breakdown
  const modeMap = new Map<string, number>();
  let railTrips = 0;
  let busTrips = 0;
  let trolleyTrips = 0;
  for (const t of trips) {
    const mode = classifyMode(t.mode);
    modeMap.set(mode, (modeMap.get(mode) ?? 0) + 1);
    if (mode === "Rail") railTrips += 1;
    else if (mode === "Bus") busTrips += 1;
    else if (mode === "Trolley") trolleyTrips += 1;
  }
  const modeBreakdown = topN(modeMap, 10);

  // Routes (named) overall, plus top bus + top rail
  const routeMap = new Map<string, number>();
  const busRouteMap = new Map<string, number>();
  const railLineMap = new Map<string, number>();
  for (const t of trips) {
    if (!t.routeCode || t.routeCode === "-") continue;
    const mode = classifyMode(t.mode);
    const name = routeAggregationKey(t.routeCode, mode);
    routeMap.set(name, (routeMap.get(name) ?? 0) + 1);
    if (mode === "Bus") busRouteMap.set(name, (busRouteMap.get(name) ?? 0) + 1);
    if (mode === "Rail")
      railLineMap.set(name, (railLineMap.get(name) ?? 0) + 1);
  }
  const topRoutes = topN(routeMap, 5);
  const topBusRoute = topN(busRouteMap, 1)[0] ?? null;
  const topRailLine = topN(railLineMap, 1)[0] ?? null;

  // Time-based
  const dowMap = new Map<string, number>();
  const monthMap = new Map<string, number>();
  const hourMap = new Map<number, number>();
  const dayKeyMap = new Map<string, number>();
  let weekdayTrips = 0;
  let weekendTrips = 0;
  let firstTrip: Date | null = null;
  let lastTrip: Date | null = null;

  for (const t of trips) {
    const d = t.date;
    const dow = d.getDay();
    dowMap.set(DAY_NAMES[dow], (dowMap.get(DAY_NAMES[dow]) ?? 0) + 1);
    if (dow === 0 || dow === 6) weekendTrips += 1;
    else weekdayTrips += 1;

    const monthLabel = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    monthMap.set(monthLabel, (monthMap.get(monthLabel) ?? 0) + 1);

    hourMap.set(d.getHours(), (hourMap.get(d.getHours()) ?? 0) + 1);

    const dayKey = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    dayKeyMap.set(dayKey, (dayKeyMap.get(dayKey) ?? 0) + 1);

    if (!firstTrip || d < firstTrip) firstTrip = d;
    if (!lastTrip || d > lastTrip) lastTrip = d;
  }

  const dayOfWeekBreakdown = DAY_NAMES.map((label) => ({
    label,
    count: dowMap.get(label) ?? 0,
  }));

  const busiestDayOfWeek = topN(dowMap, 1)[0] ?? null;
  const busiestMonth = topN(monthMap, 1)[0] ?? null;

  let peakHour = -1;
  let peakHourCount = -1;
  for (const [hour, count] of hourMap.entries()) {
    if (count > peakHourCount) {
      peakHourCount = count;
      peakHour = hour;
    }
  }
  const peakHourLabel = peakHour === -1 ? "—" : formatHour(peakHour);

  const mostActiveEntry = topN(dayKeyMap, 1)[0] ?? null;
  const mostActiveDay = mostActiveEntry
    ? { label: mostActiveEntry.label, count: mostActiveEntry.count }
    : null;

  const totalFare = trips.reduce((sum, t) => sum + t.fare, 0);

  return {
    totalTrips,
    transfers,
    uniqueStops,
    modeBreakdown,
    railTrips,
    busTrips,
    trolleyTrips,
    topStops,
    topBusRoute,
    topRailLine,
    topRoutes,
    busiestDayOfWeek,
    busiestMonth,
    peakHourLabel,
    weekdayTrips,
    weekendTrips,
    dayOfWeekBreakdown,
    mostActiveDay,
    firstTrip,
    lastTrip,
    totalFare,
  };
}
