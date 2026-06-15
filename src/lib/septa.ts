import type { RideMode } from "./types";

/** SEPTA METRO line families from the 2024+ branding system. */
export type MetroLineId = "B" | "L" | "T" | "G" | "D" | "M";

export interface MetroLineInfo {
  id: MetroLineId;
  letter: string;
  name: string;
  color: string;
  textColor: string;
}

export const METRO_LINES: Record<MetroLineId, MetroLineInfo> = {
  B: {
    id: "B",
    letter: "B",
    name: "Broad Street Line",
    color: "#F37021",
    textColor: "#FFFFFF",
  },
  L: {
    id: "L",
    letter: "L",
    name: "Market-Frankford Line",
    color: "#008CBA",
    textColor: "#FFFFFF",
  },
  T: {
    id: "T",
    letter: "T",
    name: "Subway-Surface Trolleys",
    color: "#78BE20",
    textColor: "#FFFFFF",
  },
  G: {
    id: "G",
    letter: "G",
    name: "Route 15 Trolley",
    color: "#FFD200",
    textColor: "#0A0A0A",
  },
  D: {
    id: "D",
    letter: "D",
    name: "Media-Sharon Hill Line",
    color: "#E11C74",
    textColor: "#FFFFFF",
  },
  M: {
    id: "M",
    letter: "M",
    name: "Norristown High Speed Line",
    color: "#4B2E83",
    textColor: "#FFFFFF",
  },
};

/**
 * Maps raw route codes (B1, L1, T2, etc.) and legacy aliases to a METRO line family.
 * B1/B2/B3/BSL all resolve to Broad Street (B).
 */
const ROUTE_TO_METRO: Record<string, MetroLineId> = {
  B1: "B",
  B2: "B",
  B3: "B",
  BSL: "B",
  BSO: "B",
  BSS: "B",
  L1: "L",
  L2: "L",
  MFL: "L",
  MFO: "L",
  MFW: "L",
  T1: "T",
  T2: "T",
  T3: "T",
  T4: "T",
  T5: "T",
  "10": "T",
  "11": "T",
  "13": "T",
  "34": "T",
  "36": "T",
  G1: "G",
  "15": "G",
  D1: "D",
  D2: "D",
  "101": "D",
  "102": "D",
  M1: "M",
  NHSL: "M",
};

/**
 * Maps the raw "Mode" column from a SEPTA Key export to a coarse ride mode.
 * SEPTA labels heavy-rail (MFL/BSL) trips as "Subway".
 */
export function classifyMode(rawMode: string): RideMode {
  const m = rawMode.trim().toLowerCase();
  if (m === "subway" || m === "rail" || m === "regional rail" || m === "metro")
    return "Rail";
  if (m === "bus") return "Bus";
  if (m === "trolley") return "Trolley";
  return "Other";
}

/**
 * Splits a "Route/Vehicle #" value (e.g. "L1/-", "T2/9016", "4/3572")
 * into its route code and vehicle number.
 */
export function splitRouteVehicle(raw: string): {
  routeCode: string;
  vehicle: string;
} {
  const value = (raw ?? "").trim();
  const slash = value.indexOf("/");
  if (slash === -1) return { routeCode: value, vehicle: "" };
  const routeCode = value.slice(0, slash).trim();
  const vehicleRaw = value.slice(slash + 1).trim();
  const vehicle = vehicleRaw === "-" ? "" : vehicleRaw;
  return { routeCode, vehicle };
}

export function metroLineForRoute(
  routeCode: string,
  mode: RideMode,
): MetroLineInfo | null {
  const code = routeCode.trim().toUpperCase();
  if (!code || code === "-") return null;

  const id = ROUTE_TO_METRO[code];
  if (id) return METRO_LINES[id];

  if (mode === "Trolley" && /^T[1-5]$/.test(code)) {
    return METRO_LINES.T;
  }

  return null;
}

export function metroLineForName(lineName: string): MetroLineInfo | null {
  for (const line of Object.values(METRO_LINES)) {
    if (line.name === lineName) return line;
  }
  return null;
}

/**
 * Key used when tallying routes so B1/B2/B3 share one Broad Street bucket.
 */
export function routeAggregationKey(routeCode: string, mode: RideMode): string {
  const metro = metroLineForRoute(routeCode, mode);
  if (metro) return metro.name;
  return routeDisplayName(routeCode, mode);
}

const RAIL_LINE_NAMES: Record<string, string> = {
  L1: "Market-Frankford Line",
  L2: "Market-Frankford Line",
  MFL: "Market-Frankford Line",
  MFO: "Market-Frankford Line",
  MFW: "Market-Frankford Line",
  B1: "Broad Street Line",
  B2: "Broad Street Line",
  B3: "Broad Street Line",
  BSL: "Broad Street Line",
  BSO: "Broad Street Line",
  BSS: "Broad Street Line",
  NHSL: "Norristown High Speed Line",
  M1: "Norristown High Speed Line",
};

/**
 * Human-friendly name for a route code, taking the ride mode into account.
 */
export function routeDisplayName(routeCode: string, mode: RideMode): string {
  const code = routeCode.trim().toUpperCase();
  if (!code || code === "-") return "Unknown";

  const metro = metroLineForRoute(routeCode, mode);
  if (metro) return metro.name;

  if (mode === "Rail") {
    if (RAIL_LINE_NAMES[code]) return RAIL_LINE_NAMES[code];
    return `Line ${code}`;
  }
  if (mode === "Trolley") {
    return `Trolley ${code.replace(/^T/, "")}`.replace("Trolley ", "Trolley Route ");
  }
  return `Route ${code}`;
}

/** Short label for compact UI — METRO letter when known, otherwise the route code. */
export function routeShortLabel(routeCode: string, mode?: RideMode): string {
  const code = routeCode.trim().toUpperCase();
  if (!code || code === "-") return "?";

  if (mode) {
    const metro = metroLineForRoute(routeCode, mode);
    if (metro) return metro.letter;
  }

  return code;
}

export const MODE_COLORS: Record<RideMode, string> = {
  Rail: METRO_LINES.L.color,
  Bus: "#E8403F",
  Trolley: METRO_LINES.T.color,
  Other: "#8A8A8A",
};

export function railLineColor(lineName: string): string {
  const metro = metroLineForName(lineName);
  if (metro) return metro.color;
  return MODE_COLORS.Rail;
}
