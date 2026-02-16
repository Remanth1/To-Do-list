import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";

/** Normalize to date-only (local midnight) for consistent comparison. */
function toDateOnly(d: Date): Date {
  return startOfDay(d);
}

/** True if dateString (ISO date or datetime) falls on today (local date). */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return toDateOnly(date).getTime() === toDateOnly(today).getTime();
}

/** True if dateString is after today (strictly future dates). */
export function isUpcoming(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return toDateOnly(date).getTime() > toDateOnly(today).getTime();
}

export type Period = "day" | "week" | "month" | "year";

export function getPeriodRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  switch (period) {
    case "day":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "week":
      return { start: startOfWeek(now, { weekStartsOn: 0 }), end: endOfWeek(now, { weekStartsOn: 0 }) };
    case "month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "year":
      return { start: startOfYear(now), end: endOfYear(now) };
  }
}

/** True if dateString falls within the given period (inclusive). */
export function isInPeriod(dateString: string, period: Period): boolean {
  const d = new Date(dateString);
  const { start, end } = getPeriodRange(period);
  return isWithinInterval(d, { start, end });
}
