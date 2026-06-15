import Papa from "papaparse";
import type { ParseResult, Trip } from "./types";
import { splitRouteVehicle } from "./septa";

const REQUIRED_COLUMNS = [
  "Entry Date",
  "Entry Stop",
  "Mode",
  "Route/Vehicle #",
];

function parseFare(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

/**
 * Parses a SEPTA Key date string such as "May 30, 2026 8:06 PM".
 * Returns null if the value cannot be understood.
 */
export function parseSeptaDate(raw: string): Date | null {
  if (!raw) return null;
  const date = new Date(raw.trim());
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function normalizeHeader(header: string): string {
  return header.trim();
}

export function parseTripsCsv(text: string): ParseResult {
  const errors: string[] = [];
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
  });

  const fields = result.meta.fields ?? [];
  const missing = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
  if (missing.length > 0) {
    errors.push(
      `Missing columns: ${missing.join(", ")}. Use a SEPTA Key trip history export.`,
    );
    return { trips: [], errors };
  }

  const trips: Trip[] = [];
  let skipped = 0;

  for (const row of result.data) {
    const rawDate = (row["Entry Date"] ?? "").trim();
    const stop = (row["Entry Stop"] ?? "").trim();
    const mode = (row["Mode"] ?? "").trim();
    const type = (row["Type"] ?? "").trim();
    const routeVehicle = (row["Route/Vehicle #"] ?? "").trim();

    if (!rawDate && !stop && !mode) continue;

    const date = parseSeptaDate(rawDate);
    if (!date) {
      skipped += 1;
      continue;
    }

    const { routeCode, vehicle } = splitRouteVehicle(routeVehicle);

    trips.push({
      date,
      rawDate,
      stop: stop || "Unknown",
      fare: parseFare(row["Fare"]),
      mode,
      type,
      routeCode,
      vehicle,
    });
  }

  if (trips.length === 0) {
    errors.push("No trips found in this file.");
  } else if (skipped > 0) {
    errors.push(`Skipped ${skipped} row(s) with bad dates.`);
  }

  return { trips, errors };
}
