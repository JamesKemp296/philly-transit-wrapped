export type RideMode = "Rail" | "Bus" | "Trolley" | "Other";

export interface Trip {
  date: Date;
  rawDate: string;
  stop: string;
  fare: number;
  mode: string;
  type: string;
  routeCode: string;
  vehicle: string;
}

export interface CountItem {
  label: string;
  count: number;
}

export interface WrappedStats {
  totalTrips: number;
  transfers: number;
  uniqueStops: number;

  modeBreakdown: CountItem[];
  railTrips: number;
  busTrips: number;
  trolleyTrips: number;

  topStops: CountItem[];
  topBusRoute: CountItem | null;
  topRailLine: CountItem | null;
  topRoutes: CountItem[];

  busiestDayOfWeek: CountItem | null;
  busiestMonth: CountItem | null;
  peakHourLabel: string;
  weekdayTrips: number;
  weekendTrips: number;
  dayOfWeekBreakdown: CountItem[];

  mostActiveDay: { label: string; count: number } | null;
  firstTrip: Date | null;
  lastTrip: Date | null;
  totalFare: number;
}

export interface ParseResult {
  trips: Trip[];
  errors: string[];
}
